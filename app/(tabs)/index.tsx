import TrendingSlider from "@/components/TrendingSlider";
import { Wallets } from "@/components/wallet";
import { Colors } from "@/constants/Colors";
import { useWalletStore } from "@/store/wallet";
import { DeviceStore } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import { Link, router, usePathname } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Image, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from "react-native";

const actionItems = [
	{ icon: "arrow-up", label: "Gửi" },
	{ icon: "arrow-down", label: "Nhận", onAction: () => router.push("/receive") },
	{ icon: "swap-horizontal", label: "Hoán đổi", onAction: () => router.push("/swap") },
];

const Tabs = [
	{ label: "Tiền mã hóa", id: "crypto" },
	{ label: "NFT", id: "nft" },
];

export default function HomePage() {
	const pathname = usePathname();
	const colorScheme = useColorScheme() ?? "light";
	const theme = Colors[colorScheme];
	const [isOpenModalWallet, setIsOpenModalWallet] = useState(false);
	const [tab, setTab] = useState(Tabs[0].id);
	const { defaultWallet, tokens } = useWalletStore();
	const [enabledTokens, setEnabledTokens] = useState<string[]>([]);

	useEffect(() => {
		const load = async () =>
			setEnabledTokens(JSON.parse(await DeviceStore.getItem("enabledTokens") || "[]"));
		load();
	}, [pathname]);

	return (
		<ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
			{/* Modal chọn ví - GIỮ NGUYÊN */}
			<Wallets visible={isOpenModalWallet} onClose={() => setIsOpenModalWallet(false)} />

			{/* Header */}
			<View style={styles.header}>
				<Pressable onPress={() => router.push("/qr")} style={styles.headerIconBtn}>
					<Ionicons name="qr-code-outline" size={20} color={theme.icon} />
				</Pressable>

				<Pressable onPress={() => setIsOpenModalWallet(true)} style={styles.walletSwitcher}>
					<Text style={[styles.walletTitle, { color: theme.text }]}>{defaultWallet?.walletName || "Ví Easy Crypto"}</Text>
					<Ionicons name="chevron-down" size={16} color={theme.icon} style={{ marginLeft: 4 }} />
				</Pressable>

				{/* GIỮ CHỨC NĂNG Link /account, chỉ đổi icon cho giống ảnh */}
				<Link href={"/account" as any} asChild>
					<Pressable style={styles.headerIconBtn}>
						<Ionicons name="search-outline" size={20} color={theme.icon} />
					</Pressable>
				</Link>
			</View>

			{/* Balance */}
			<View style={styles.balanceSection}>
				<Text style={[styles.balance, { color: theme.text }]}>0.00$</Text>
				<Text style={[styles.subBalance, { color: theme.icon }]}>0,00$ (0.00%)</Text>
			</View>

			{/* Quick actions */}
			<View style={styles.actionRow}>
				{actionItems.map((item, idx) => (
					<View key={idx} style={styles.actionCol}>
						<TouchableOpacity onPress={item.onAction}>
							<View style={[styles.actionIconBox, { borderColor: theme.icon }]}>
								<Ionicons name={item.icon as any} size={32} color="#3C78FF" />
							</View>
						</TouchableOpacity>
						<Text style={[styles.actionLabel, { color: theme.text }]}>{item.label}</Text>
					</View>
				))}
			</View>

			{/* Trending */}
			<View style={styles.sectionHeader}>
				<Text style={[styles.sectionTitle, { color: theme.text }]}>Thịnh hành</Text>
				<Ionicons name="arrow-forward-outline" size={18} color="#3C78FF" />
			</View>

			<View style={{ marginBlock: 10 }}>
				<TrendingSlider />
			</View>

			{/* Tabs */}
			<View style={styles.tabsWrap}>
				{Tabs.map((tabItem) => (
					<Pressable key={tabItem.id} onPress={() => setTab(tabItem.id)} style={styles.tabsLeft}>
						<Text style={[styles.tabTextActive, { color: tab === tabItem.id ? theme.text : theme.icon }]}>
							{tabItem.label}
						</Text>
						{tab === tabItem.id && <View style={[styles.tabIndicator, { backgroundColor: theme.text }]} />}
					</Pressable>
				))}
				<View style={{ flex: 1 }} />
				<TouchableOpacity onPress={() => router.push("/manage-token")}>
					<Ionicons name="options-outline" size={24} color={theme.icon} />
				</TouchableOpacity>
			</View>

			{/* Empty State */}
			<FlatList
				data={tokens.filter(t => enabledTokens.includes(t.symbol + ":" + t.chain))}
				keyExtractor={(item, index) => "home_token-" + index}
				renderItem={({ item }) => {
					return (
						<View style={styles.row}>
							<View style={styles.rowLeft}>
								<Image source={{ uri: item.logo }} style={styles.tokenCircle} resizeMode="cover" />
								<View style={{ marginLeft: 10 }}>
									<View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
										<Text style={[styles.symbol, { color: "#000" }]}>{item.symbol}</Text>
										{item.chain ? (
											<View style={styles.chainTag}>
												<Text style={styles.chainText}>{item.chain}</Text>
											</View>
										) : null}
									</View>
									<Text style={[styles.name, { color: "#000" }]}>{item.name}</Text>
								</View>
							</View>

							<View style={{ flexDirection: "row", gap: 12 }}>
								<Text style={styles.chainText}>{item.balance}</Text>
							</View>
						</View>
					);
				}}
				ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
				contentContainerStyle={{ paddingVertical: 8, paddingBottom: 8 }}
			/>
			<View style={styles.emptyWrap}>
				<TouchableOpacity onPress={() => router.push("/manage-token")}>
					<Text style={styles.manageLink}>Quản lý tiền mã hóa</Text>
				</TouchableOpacity>
			</View>
		</ScrollView>
	);
}

const cardShadow = {
	shadowColor: "#000",
	shadowOffset: { width: 0, height: 2 },
	shadowOpacity: 0.08,
	shadowRadius: 6,
	elevation: 2,
};

const styles = StyleSheet.create({
	container: { flex: 1 },

	/* Header */
	header: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 16,
		paddingTop: 8,
		paddingBottom: 4,
	},
	headerIconBtn: {
		width: 28,
		height: 28,
		alignItems: "center",
		justifyContent: "center",
	},
	walletSwitcher: {
		flexDirection: "row",
		alignItems: "center",
		flex: 1,
		justifyContent: "center",
	},
	walletTitle: { fontSize: 16, fontWeight: "600" },

	/* Balance */
	balanceSection: { alignItems: "center", paddingVertical: 6 },
	balance: { fontSize: 28, fontWeight: "700" },
	subBalance: { fontSize: 12, marginTop: 2 },

	/* Quick actions */
	actionRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingHorizontal: "20%",
		marginTop: 16,
		marginBottom: 10,
	},
	actionCol: { alignItems: "center", width: "25%" },
	actionIconBox: {
		width: 56,
		height: 56,
		borderRadius: 12,
		backgroundColor: "#e8ecf7ff",
		alignItems: "center",
		justifyContent: "center",
		...cardShadow,
	},
	actionLabel: { fontSize: 14, marginTop: 6 },

	/* Section header */
	sectionHeader: {
		paddingHorizontal: 16,
		marginTop: 8,
		marginBottom: 8,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	sectionTitle: { fontSize: 16, fontWeight: "600" },

	/* Trending tokens */
	tokenRow: {
		flexDirection: "row",
		paddingHorizontal: 16,
		gap: 12,
		marginBottom: 10,
	},
	tokenCard: {
		flex: 1,
		backgroundColor: "#fff",
		borderRadius: 12,
		padding: 12,
		flexDirection: "row",
		justifyContent: "space-between",
		...cardShadow,
	},
	tokenLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
	tokenLogoWrap: {
		width: 28,
		height: 28,
		borderRadius: 14,
		overflow: "hidden",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#EFF3FF",
	},
	tokenLogo: { width: 20, height: 20, resizeMode: "contain" },
	tokenName: { fontSize: 13, fontWeight: "600" },
	tokenSub: { fontSize: 11 },
	tokenRight: { alignItems: "flex-end", justifyContent: "center" },
	tokenPrice: { fontSize: 13, fontWeight: "600" },
	tokenChange: { fontSize: 11, color: "#12B76A", marginTop: 2 },

	/* Tabs */
	tabsWrap: {
		flexDirection: "row",
		alignItems: "flex-end",
		paddingHorizontal: 16,
		marginTop: 10,
		marginBottom: 6,
		gap: 16,
	},
	tabsLeft: { alignItems: "center" },
	tabTextActive: { fontSize: 14, fontWeight: "600" },
	tabIndicator: {
		width: 36,
		height: 2,
		backgroundColor: "#111",
		borderRadius: 2,
		marginTop: 6,
		alignSelf: "center",
	},
	tabText: { fontSize: 14, marginLeft: 16 },

	/* Empty state */
	emptyWrap: { alignItems: "center", paddingHorizontal: 16, paddingBottom: 24 },
	emptyTitle: { fontSize: 13, marginBottom: 12 },
	primaryBtn: {
		backgroundColor: "#3C78FF",
		paddingVertical: 12,
		paddingHorizontal: 24,
		borderRadius: 10,
		width: "86%",
		alignItems: "center",
		...cardShadow,
	},
	primaryBtnText: { color: "#fff", fontWeight: "700" },
	secondaryBtn: {
		backgroundColor: "#E9ECEF",
		paddingVertical: 12,
		paddingHorizontal: 24,
		borderRadius: 10,
		width: "86%",
		alignItems: "center",
		marginTop: 10,
	},
	secondaryBtnText: { color: "#111", fontWeight: "600" },
	manageLink: { color: "#3C78FF", fontSize: 13, marginTop: 12 },

	/* Misc */
	iconColor: { color: "#999" },
	row: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 16,
	},
	rowLeft: { flexDirection: "row", alignItems: "center" },
	tokenCircle: {
		width: 32,
		height: 32,
		borderRadius: 16,
		backgroundColor: "#D0D3D6",
	},
	symbol: { fontSize: 15, fontWeight: "600" },
	name: { fontSize: 13 },
	chainTag: {
		backgroundColor: "#E5E5EA",
		borderRadius: 6,
		paddingHorizontal: 6,
		paddingVertical: 1,
	},
	chainText: { fontSize: 11, color: "#333" },
	iconBtn: {
		width: 40,
		height: 40,
		borderRadius: 20,
		alignItems: "center",
		justifyContent: "center",
	},
});
