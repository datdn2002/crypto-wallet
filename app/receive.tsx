import { AddressQRModal } from "@/components/AddressQr";
import { AppHeader } from "@/components/theme";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useWalletStore } from "@/store/wallet";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import Toast from "react-native-toast-message";

export default function ReceiveScreen() {
  const background = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const icon = useThemeColor({}, "icon");
  const [query, setQuery] = useState("");
  const [code, setCode] = useState<{ value: string, name?: string; logo?: string }>({ value: "" });
  const { tokens, defaultWallet } = useWalletStore();
  const address = defaultWallet?.walletAddresses?.[0]?.address || "demo-address";

  const data = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tokens;
    return tokens.filter(
      (t) =>
        t.symbol.toLowerCase().includes(q) ||
        t.name.toLowerCase().includes(q) ||
        (t.chain && t.chain.toLowerCase().includes(q))
    );
  }, [query, tokens]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: background }]}>
      <AppHeader title="Nhận" />

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
        keyExtractor={(item, index) => "receive_" + item.id + index}
        renderItem={({ item }) => {
          return (
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                {/* icon demo: nếu có file icon riêng thì thay bằng <Image /> */}
                <Image source={{ uri: item.logo }} style={styles.tokenCircle} resizeMode="cover" />
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

              <View style={{ flexDirection: "row", gap: 12 }}>
                <TouchableOpacity
                  onPress={() => setCode({ value: address, name: item.name, logo: item.logo })}
                  style={[styles.iconBtn, { backgroundColor: background === "#151718" ? "rgba(235,235,245,0.12)" : "#F2F2F7" }]}
                >
                  <Ionicons name="qr-code-outline" size={20} color={icon} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={async () => {
                    await Clipboard.setStringAsync(address);
                    Toast.show({ type: "success", text1: "Đã sao chép", position: "bottom" });
                  }}
                  style={[styles.iconBtn, { backgroundColor: background === "#151718" ? "rgba(235,235,245,0.12)" : "#F2F2F7" }]}
                >
                  <Ionicons name="copy-outline" size={20} color={icon} />
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        contentContainerStyle={{ paddingVertical: 8, paddingBottom: 32 }}
      />

      <AddressQRModal visible={!!code} {...code} onClose={() => setCode({ value: "" })} />
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
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
