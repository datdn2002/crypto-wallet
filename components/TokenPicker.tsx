import { Token, useWalletStore } from "@/store/wallet";
import React, { useCallback, useMemo, useState } from "react";
import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { ThemedModal2 } from "./theme/ThemedModal2";

type Props = {
	visible: boolean;
	onClose: () => void;
	onPick: (token: Token) => void;
	excludedTokens?: string[];
};

export function TokenPicker({ visible, onClose, onPick, excludedTokens = [] }: Props) {
	const { tokens = [] } = useWalletStore();
	const [query, setQuery] = useState("");

	const data = useMemo(() => {
		const list = tokens.filter((t) => !excludedTokens.includes(t.chain + t.symbol));
		const q = query.trim().toLowerCase();
		if (!q) return list;
		return list.filter(
			(t) =>
				t.symbol?.toLowerCase().includes(q) || t.name?.toLowerCase().includes(q) || t.chain?.toLowerCase().includes(q)
		);
	}, [query, tokens, excludedTokens]);

	const renderItem = useCallback(
		({ item }: { item: Token }) => (
			<TouchableOpacity style={styles.row} onPress={() => onPick(item)}>
				<View style={styles.rowLeft}>
					<Image source={{ uri: item.logo }} style={styles.tokenCircle} resizeMode="cover" />
					<View style={{ marginLeft: 10, flexShrink: 1 }}>
						<View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
							<Text style={[styles.symbol, { color: "#000" }]}>{item.symbol}</Text>
							{!!item.chain && (
								<View style={styles.chainTag}>
									<Text style={styles.chainText}>{item.chain}</Text>
								</View>
							)}
						</View>
						<Text style={[styles.name, { color: "#000" }]} numberOfLines={1}>
							{item.name}
						</Text>
					</View>
				</View>
				<Text style={styles.chainText}>{item.balance}</Text>
			</TouchableOpacity>
		),
		[onPick]
	);

	if (!visible) return null;

	return (
		<ThemedModal2 visible={visible} onClose={onClose} heightPercent={0.85}>
			<FlatList
				data={data}
				keyExtractor={(item) => "picker_token-" + item.symbol + ":" + item.chain}
				renderItem={renderItem}
				ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
				contentContainerStyle={{ paddingBottom: 16 }}
				keyboardShouldPersistTaps="handled"
				showsVerticalScrollIndicator={false}
				initialNumToRender={20}
				windowSize={10}
				removeClippedSubviews
				ListHeaderComponent={
					<View style={{ paddingHorizontal: 16, paddingVertical: 16, backgroundColor: "#fff" }}>
						<TextInput
							value={query}
							onChangeText={setQuery}
							placeholder="Tìm kiếm"
							placeholderTextColor="#9aa3af"
							inputMode="search"
							style={styles.search}
						/>
					</View>
				}
				stickyHeaderIndices={[0]} // giữ ô search dính trên cùng
			/>
		</ThemedModal2>
	);
}

const styles = StyleSheet.create({
	search: {
		height: 40,
		borderWidth: 1,
		borderRadius: 10,
		paddingHorizontal: 12,
		fontSize: 15,
		borderColor: "#C7C7CC",
		backgroundColor: "#fff",
		color: "#111827",
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 16,
	},
	rowLeft: { flexDirection: "row", alignItems: "center", flexShrink: 1 },
	tokenCircle: {
		width: 32,
		height: 32,
		borderRadius: 16,
		backgroundColor: "#D0D3D6",
	},
	symbol: { fontSize: 15, fontWeight: "600" },
	name: { fontSize: 13, maxWidth: 220 },
	chainTag: {
		backgroundColor: "#E5E5EA",
		borderRadius: 6,
		paddingHorizontal: 6,
		paddingVertical: 1,
	},
	chainText: { fontSize: 11, color: "#333" },
});
