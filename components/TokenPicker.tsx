import { Token, useWalletStore } from "@/store/wallet";
import { useMemo, useState } from "react";
import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { ThemedModal } from "./theme";

type Props = {
  visible: boolean;
  onClose: () => void;
  onPick: (token: Token) => void;
  excludedTokens?: string[]
};

export function TokenPicker({ visible, onClose, onPick, excludedTokens = [] }: Props) {
  const { tokens } = useWalletStore();
  const [query, setQuery] = useState("");
  const data = useMemo(() => {
    const filterTokens = tokens.filter(token => !excludedTokens.includes(token.chain + token.symbol))
    const q = query.trim().toLowerCase();
    if (!q) return filterTokens;
    return filterTokens.filter(
      (t) =>
        t.symbol.toLowerCase().includes(q) ||
        t.name.toLowerCase().includes(q) ||
        (t.chain && t.chain.toLowerCase().includes(q))
    );
  }, [query, tokens, excludedTokens]);
  if (!visible) return null;
  return (
    <ThemedModal visible={visible} onClose={onClose} >
      <View style={{ paddingHorizontal: 16, marginVertical: 8 }}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Tìm kiếm"
          style={[
            styles.search,
            // { borderColor: "#C7C7CC", color: text, backgroundColor: background },
          ]}
        />
      </View>
      <FlatList
        data={data}
        keyExtractor={(item) => "picker_token-" + item.symbol + ":" + item.chain}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity style={styles.row} onPress={() => onPick(item)}>
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
            </TouchableOpacity>
          );
        }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        contentContainerStyle={{ paddingVertical: 8, paddingBottom: 8 }}
      />
    </ThemedModal>
  )
}

const styles = StyleSheet.create({
  search: {
    height: 40,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 15,
  },
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