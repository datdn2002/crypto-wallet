import { AppHeader } from "@/components/theme";
import { useThemeColor } from "@/hooks/useThemeColor";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View
} from "react-native";

type Token = {
  id: string;
  symbol: string;
  name: string;
  chain?: string;
  icon?: string; // có thể là URL hoặc local asset
};

const TOKENS: Token[] = [
  { id: "btc", symbol: "BTC", name: "Bitcoin" },
  { id: "eth-aurora", symbol: "ETH", name: "Aurora", chain: "Aurora" },
  { id: "ae", symbol: "AE", name: "Aeternity" },
  { id: "bld", symbol: "BLD", name: "Agoric" },
  { id: "aion", symbol: "AION", name: "Aion" },
  { id: "akt", symbol: "AKT", name: "Akash" },
  { id: "algo", symbol: "ALGO", name: "Algorand" },
  { id: "apt", symbol: "APT", name: "Aptos" },
  { id: "eth-arbitrum", symbol: "ETH", name: "Arbitrum", chain: "Arbitrum" },
  { id: "avax", symbol: "AVAX", name: "Avalanche C-Chain", chain: "Avalanche C-Chain" },
  { id: "axl", symbol: "AXL", name: "Axelar" },
  { id: "eth-base", symbol: "ETH", name: "Base", chain: "Base" },
];

export default function ManageTokensScreen() {
  const background = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const icon = useThemeColor({}, "icon");
  const tint = useThemeColor({}, "tint");

  const [query, setQuery] = useState("");
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    btc: true,
    "eth-aurora": true,
  });

  const data = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return TOKENS;
    return TOKENS.filter(
      (t) =>
        t.symbol.toLowerCase().includes(q) ||
        t.name.toLowerCase().includes(q) ||
        (t.chain && t.chain.toLowerCase().includes(q))
    );
  }, [query]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: background }]}>
      <AppHeader title="Quản lý tiền mã hóa" />

      {/* search */}
      <View style={{ paddingHorizontal: 16, marginVertical: 8 }}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Tìm kiếm"
          placeholderTextColor={icon}
          style={[
            styles.search,
            { borderColor: "#C7C7CC", color: text, backgroundColor: background },
          ]}
        />
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const active = !!enabled[item.id];
          return (
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                {/* icon demo: nếu có file icon riêng thì thay bằng <Image /> */}
                <View style={styles.tokenCircle} />
                <View style={{ marginLeft: 10 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                    <Text style={[styles.symbol, { color: text }]}>{item.symbol}</Text>
                    {item.chain ? (
                      <View style={styles.chainTag}>
                        <Text style={styles.chainText}>{item.chain}</Text>
                      </View>
                    ) : null}
                  </View>
                  <Text style={[styles.name, { color: icon }]}>{item.name}</Text>
                </View>
              </View>

              <Switch
                value={active}
                onValueChange={(v) => setEnabled((s) => ({ ...s, [item.id]: v }))}
                trackColor={{ false: "#767577", true: tint }}
                thumbColor="#fff"
              />
            </View>
          );
        }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        contentContainerStyle={{ paddingVertical: 8, paddingBottom: 32 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  search: {
    height: 40,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 15,
  },
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
});
