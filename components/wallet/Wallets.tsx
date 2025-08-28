import { updateWalletApi } from "@/api";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useAuthStore } from "@/store/auth";
import { authenticateBiometric } from "@/store/biometric-auth";
import { useWalletStore } from "@/store/wallet";
import { createNewWallet, createWalletFromMnemonic, deleteWalletById, getWalletMnemonic } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import { MaxModal } from "../theme";
import { CreateWalletModal } from "./CreateWalletModal";
import { ImportWalletModal } from "./ImportWalletModal";
import { ManualBackupModal } from "./ManualBackupModal";
import { SeedSafetyModal } from "./SeedSafetyModal";
import { WalletOptionModal } from "./WalletOptionModal";

type Wallet = {
	id: string;
	walletName: string;
	isDefault?: boolean;
};

type Props = {
	visible: boolean;
	onClose: () => void;
};

export function Wallets({ visible, onClose }: Props) {
	const { wallets, walletCount, refreshWallet, setDefaultWallet, defaultWallet } = useWalletStore();
	const [refetch, setRefetch] = useState(0);
	const [loading, setLoading] = useState(true);
	const { access_token, userData } = useAuthStore();
	const [showCreateWalletModal, setShowCreateWalletModal] = useState(false);
	const [safetyOpen, setSafetyOpen] = useState(false);
	const [importOpen, setImportOpen] = useState(false);
	const [backupOpen, setBackupOpen] = useState(false);
	const [optionOpen, setOptionOpen] = useState(false);
	const [selectedWalletIndex, setSelectedWalletIdex] = useState<number | null>(null);
	const [mnemonic, setMnemonic] = useState("");
	const text = useThemeColor({}, "text");
	const icon = useThemeColor({}, "icon");
	const tint = useThemeColor({}, "tint");
	useEffect(() => {
		const fetchData = async () => {
			if (!visible) return;
			setLoading(true);
			await refreshWallet();
			setLoading(false);
		};
		fetchData();
	}, [refetch, visible]);

	const handleAddWallet = async () => {
		if (!access_token || !userData) return;
		const newWallet = await createNewWallet(userData.id, access_token, "Ví " + (walletCount + 1));
		if (newWallet) {
			setRefetch((prev) => prev + 1);
			setShowCreateWalletModal(false);
		} else {
			console.error("Failed to create wallet");
		}
	};

	const handleImportWallet = async (payload: { label: string; mnemonic: string }) => {
		// TODO: validate mnemonic theo BIP39 và khôi phục ví
		if (!payload.mnemonic || !payload.label || !access_token || !userData) {
			console.error("Invalid mnemonic or label");
			return;
		}
		const res = await createWalletFromMnemonic(payload.mnemonic, userData.id, access_token, payload.label);
		if (res) {
			Toast.show({
				type: "success",
				text1: "Thành công 🎉",
				text2: "Ví đã được khôi phục!",
			});
			setRefetch((prev) => prev + 1);
		} else {
			Toast.show({
				type: "error",
				text1: "Lỗi",
				text2: "Không thể khôi phục ví từ cụm từ bí mật",
			});
		}
		setImportOpen(false);
	};

	const handleManualBackup = async (walletId: string, index: number) => {
		setSelectedWalletIdex(index);
		setBackupOpen(true);
		setMnemonic((await getWalletMnemonic(walletId)) ?? "");
	};

	if (!visible) return null;

	return (
		<MaxModal visible={visible} onClose={onClose} label="Ví">
			<Text style={styles.sectionTitle}>Ví đa tiền mã hóa</Text>
			{loading ? (
				<View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
					<ActivityIndicator />
				</View>
			) : (
				<FlatList
					data={wallets}
					keyExtractor={(w) => w.id}
					contentContainerStyle={{ paddingBottom: 120 }}
					ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
					renderItem={({ item, index }) => (
						<Pressable
							style={[styles.card, { backgroundColor: "#f0f2f6ff" }]}
							onPress={async () => {
								await setDefaultWallet(item.id);
								onClose();
							}}
						>
							<View style={{ flexDirection: "row", gap: 12, flex: 1 }}>
								{/* Avatar + badge */}
								<View style={{ width: 36 }}>
									<View style={styles.avatar}>
										{defaultWallet?.id === item.id ? (
											<View style={styles.badge}>
												<Text style={styles.badgeTick}>✓</Text>
											</View>
										) : null}
									</View>
									<Ionicons
										name="shield-checkmark"
										size={20}
										color={icon}
										style={{ position: "absolute", top: 6, left: 6 }}
									></Ionicons>
								</View>

								<View style={{ flex: 1 }}>
									<Text style={[styles.cardTitle, { color: text }]}>
										{item.walletName || "Ví " + (index ? index + 1 : "")}
									</Text>
									<Text style={styles.cardSub}>Ví đa tiền mã hóa</Text>
									<View style={{ marginTop: 8 }}>
										<TouchableOpacity onPress={() => handleManualBackup(item.id, index)}>
											<Text style={styles.link}>Sao lưu thủ công</Text>
										</TouchableOpacity>
										{/* <TouchableOpacity>
                      <Text style={[styles.link, { marginTop: 6 }]}>Sao lưu vào iCloud</Text>
                    </TouchableOpacity> */}
									</View>
								</View>
							</View>

							<TouchableOpacity
								hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
								onPress={() => {
									setSelectedWalletIdex(index);
									setOptionOpen(true);
								}}
							>
								<Text style={[styles.kebab, { color: text }]}>⋮</Text>
							</TouchableOpacity>
						</Pressable>
					)}
					ListEmptyComponent={
						<View style={styles.emptyWrap}>
							<Ionicons name="laptop-outline" size={96} color={tint} />
							<Text style={[styles.title, { color: text, marginTop: 16 }]}>Chưa có ví nào. Hãy tạo thêm ví.</Text>
							<Text style={[styles.caption, { color: icon }]}>Ví của bạn sẽ xuất hiện tại đây</Text>
						</View>
					}
				/>
			)}

			{/* Nút Thêm ví */}
			<View style={styles.addWrap}>
				<TouchableOpacity style={styles.addBtn} onPress={() => setShowCreateWalletModal(true)}>
					<Text style={styles.addText}>Thêm ví</Text>
				</TouchableOpacity>
			</View>
			<CreateWalletModal
				visible={showCreateWalletModal}
				onClose={() => setShowCreateWalletModal(false)}
				onCreateNew={handleAddWallet}
				onAddExisting={() => {
					setSafetyOpen(true);
					setShowCreateWalletModal(false);
				}}
			/>
			<SeedSafetyModal
				visible={safetyOpen}
				onClose={() => setSafetyOpen(false)}
				onContinue={() => {
					setSafetyOpen(false);
					setImportOpen(true);
				}}
			/>
			<ImportWalletModal
				visible={importOpen}
				onClose={() => setImportOpen(false)}
				onSubmit={handleImportWallet}
				title="Nhập Bitcoin"
			/>
			<ManualBackupModal
				visible={backupOpen}
				onClose={() => setBackupOpen(false)}
				onFinish={({ seed }) => {
					setRefetch((prev) => prev + 1);
					setBackupOpen(false);
					Toast.show({
						type: "success",
						text1: "Thành công 🎉",
						text2: "Bạn đã sao lưu ví " + wallets[selectedWalletIndex || 0].walletName + " thành công!",
					});
				}}
				wordCount={12} // hoặc 24
				title="Wallet"
				mnemonic={mnemonic}
			/>
			<WalletOptionModal
				visible={optionOpen}
				onClose={() => setOptionOpen(false)}
				onSave={async (name, method) => {
					const selectedWallet = wallets[selectedWalletIndex ?? 0];
					if (selectedWallet && name !== selectedWallet.walletName && access_token) {
						await updateWalletApi(access_token, selectedWallet.id, { walletName: name });
						setRefetch((prev) => prev + 1);
					}
					setOptionOpen(false);
				}}
				wallet={wallets[selectedWalletIndex ?? 0]}
				onDelete={async () => {
					const ok = await authenticateBiometric();
					if (selectedWalletIndex !== null && ok) {
						const walletId = wallets[selectedWalletIndex].id;
						await deleteWalletById(walletId);
						setRefetch((prev) => prev + 1);
						setOptionOpen(false);
					}
				}}
				onBackup={() => {
					if (selectedWalletIndex !== null) {
						const walletId = wallets[selectedWalletIndex].id;
						handleManualBackup(walletId, selectedWalletIndex);
						setOptionOpen(false);
					}
				}}
			/>
			<Toast position="bottom" />
		</MaxModal>
	);
}

const BG = "#0f0f10";
const CARD = "#1a1a1b";
const TEXT = "#eaeaea";
const MUTED = "#a0a0a0";
const GREEN = "#27c268";

const styles = StyleSheet.create({
	header: {
		backgroundColor: BG,
		paddingHorizontal: 16,
		paddingTop: 6,
		paddingBottom: 10,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
	},
	headerTitle: { color: TEXT, fontSize: 18, fontWeight: "700" },
	iconText: { color: "#cfcfcf", fontSize: 16 },

	sectionTitle: {
		color: MUTED,
		fontSize: 13,
		paddingHorizontal: 16,
		marginBottom: 10,
	},

	card: {
		backgroundColor: CARD,
		marginHorizontal: 16,
		borderRadius: 16,
		padding: 14,
		flexDirection: "row",
		alignItems: "flex-start",
		justifyContent: "space-between",
		shadowColor: "#000",
		shadowOpacity: 0.25,
		shadowRadius: 8,
		shadowOffset: { width: 0, height: 4 },
		elevation: 2,
		marginTop: 12,
	},
	avatar: {
		width: 32,
		height: 32,
		borderRadius: "50%",
		backgroundColor: "#d1d6e0ff",
		textAlign: "center",
		justifyContent: "center",
		alignItems: "center",
	},
	badge: {
		position: "absolute",
		right: -6,
		bottom: -4,
		backgroundColor: "#7CFC9B",
		width: 18,
		height: 18,
		borderRadius: 9,
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 1,
		borderColor: CARD,
		fontSize: 10,
	},
	badgeTick: { color: "#0a0a0a", fontSize: 12, fontWeight: "900" },

	cardTitle: { color: TEXT, fontSize: 16, fontWeight: "700" },
	cardSub: { color: MUTED, fontSize: 12, marginTop: 2 },
	link: { color: GREEN, fontSize: 14, fontWeight: "600" },
	kebab: { color: "#bdbdbd", fontSize: 18, paddingLeft: 8 },

	addWrap: {
		position: "absolute",
		left: 16,
		right: 16,
		bottom: 32,
	},
	addBtn: {
		backgroundColor: "#123f2b",
		borderRadius: 999,
		paddingVertical: 16,
		alignItems: "center",
		justifyContent: "center",
	},
	addText: { color: "#b7f7c9", fontWeight: "700", fontSize: 16 },
	emptyWrap: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 24,
	},
	title: { fontSize: 16, fontWeight: "600" },
	caption: { fontSize: 14, textAlign: "center", marginTop: 6, marginBottom: 18, lineHeight: 20 },
	cta: {
		height: 44,
		paddingHorizontal: 20,
		borderRadius: 24,
		alignItems: "center",
		justifyContent: "center",
		minWidth: 220,
	},
});
