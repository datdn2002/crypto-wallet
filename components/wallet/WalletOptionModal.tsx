import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { ThemedModal } from "../theme";

type Wallet = {
	id: string;
	walletName: string;
	isDefault?: boolean;
};

type Props = {
	visible: boolean;
	onClose: () => void;
	onDelete: () => void;
	onSave: (name: string, method: "icloud" | "manual") => void;
	onBackup: () => void;
	wallet: Wallet;
};

export function WalletOptionModal({ visible, onClose, onSave, wallet, onDelete, onBackup }: Props) {
	const bg = useThemeColor({}, "background");
	const text = useThemeColor({}, "text");
	const icon = useThemeColor({}, "icon");
	const tint = useThemeColor({}, "tint");

	const [name, setName] = useState(wallet?.walletName || "");

	useEffect(() => {
		setName(wallet?.walletName || "");
	}, [wallet]);

	return (
		<ThemedModal visible={visible} onClose={onClose}>
			<View style={[styles.container, { backgroundColor: bg }]}>
				{/* Header */}
				<View style={styles.header}>
					<Pressable onPress={onClose}>
						<Ionicons name="arrow-back" size={22} color={icon} />
					</Pressable>
					<Text style={[styles.title, { color: text }]}>Ví</Text>
					<View style={{ flexDirection: "row", gap: 16 }}>
						<Pressable onPress={onDelete}>
							<Ionicons name="trash-outline" size={20} color={icon} />
						</Pressable>
						<Pressable onPress={() => onSave(name, "manual")}>
							<Text style={[styles.saveText, { color: tint }]}>Lưu lại</Text>
						</Pressable>
					</View>
				</View>

				{/* Body */}
				<View style={{ paddingHorizontal: 16, marginTop: 12 }}>
					<Text style={[styles.label, { color: text }]}>Tên</Text>
					<View style={[styles.inputRow, { borderColor: "#C7C7CC" }]}>
						<TextInput
							value={name}
							onChangeText={setName}
							placeholder="Ví của tôi"
							placeholderTextColor={icon}
							style={[styles.input, { color: text }]}
						/>
						{name ? (
							<Pressable onPress={() => setName("")}>
								<Ionicons name="close-circle" size={18} color={icon} />
							</Pressable>
						) : null}
					</View>

					<Text style={[styles.sectionTitle, { color: text }]}>Bản sao lưu cụm từ bí mật</Text>

					{/* iCloud
					<Pressable style={styles.optionRow} onPress={() => onSave(name, "icloud")}>
						<View style={styles.optionLeft}>
							<Ionicons name="logo-apple" size={22} color={icon} />
							<Text style={[styles.optionText, { color: text }]}>iCloud</Text>
						</View>
						<Text style={[styles.actionText, { color: tint }]}>Sao lưu ngay</Text>
					</Pressable> */}

					{/* Manual */}
					<Pressable style={styles.optionRow} onPress={onBackup}>
						<View style={styles.optionLeft}>
							<Ionicons name="document-text-outline" size={22} color={icon} />
							<Text style={[styles.optionText, { color: text }]}>Thủ công</Text>
						</View>
						<Text style={[styles.actionText, { color: tint }]}>Sao lưu ngay</Text>
					</Pressable>

					<Text style={[styles.warning, { color: icon }]}>
						Chúng tôi thực sự khuyên bạn nên hoàn thành sao lưu để tránh mất tiền mã hóa của mình.
					</Text>
				</View>
			</View>
		</ThemedModal>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1 },
	header: {
		height: 50,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 16,
	},
	title: { fontSize: 16, fontWeight: "700" },
	saveText: { fontSize: 15, fontWeight: "600" },
	label: { fontSize: 14, fontWeight: "600", marginBottom: 6 },
	inputRow: {
		height: 44,
		borderWidth: 1,
		borderRadius: 10,
		paddingHorizontal: 12,
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 18,
	},
	input: { flex: 1, fontSize: 15, paddingRight: 8 },
	sectionTitle: { fontSize: 14, fontWeight: "600", marginBottom: 8 },
	optionRow: {
		height: 48,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 12,
	},
	optionLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
	optionText: { fontSize: 15 },
	actionText: { fontSize: 15, fontWeight: "600" },
	warning: { fontSize: 12, lineHeight: 18, marginTop: 6 },
});
