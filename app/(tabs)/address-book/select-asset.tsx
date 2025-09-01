import { AppHeader } from "@/components/theme";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useWalletStore } from "@/store/wallet";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { FlatList, Image, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";

export default function SelectAssetScreen() {
  const { name } = useLocalSearchParams<{ name?: string }>();
  const router = useRouter();

  const bg = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const icon = useThemeColor({}, "icon");

  const { tokens } = useWalletStore();

  const [q, setQ] = useState("");

  const data = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return tokens;
    return tokens.filter(
      a => a.symbol.toLowerCase().includes(s) || a.name.toLowerCase().includes(s)
    );
  }, [q]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
      <AppHeader title="Chọn tài sản" />

      <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="Tìm kiếm"
          placeholderTextColor={icon}
          style={[
            styles.search,
            { color: text, borderColor: "#C7C7CC", backgroundColor: bg },
          ]}
        />
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingVertical: 8 }}
        renderItem={({ item }) => (
          <Pressable
            style={styles.assetRow}
            onPress={() =>
              router.push({
                pathname: "/(tabs)/address-book/add-address",
                params: { name, assetId: item.id, symbol: item.symbol, assetName: item.name },
              })
            }
          >
            {/* icon demo (nếu có file ảnh riêng thì thay Image uri/source) */}
            <Image source={{ uri: item.logo }} style={styles.tokenCircle} resizeMode="cover" />
            <View style={{ marginLeft: 10, flex: 1 }}>
              <Text style={[styles.assetSym, { color: text }]}>{item.symbol}</Text>
              <Text style={[styles.assetName, { color: icon }]}>{item.name}</Text>
            </View>
          </Pressable>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
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
  },
  assetRow: {
    height: 52,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  tokenCircle: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: "#D0D3D6",
  },
  assetSym: { fontSize: 15, fontWeight: "600" },
  assetName: { fontSize: 12, marginTop: 2 },
});
