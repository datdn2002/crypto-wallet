import { AppHeader } from "@/components/theme";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";

export default function AddAddressScreen() {
  const router = useRouter();
  const { name, assetId, symbol, assetName } = useLocalSearchParams<{
    name?: string;
    assetId?: string;
    symbol?: string;
    assetName?: string;
  }>();

  const bg = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const icon = useThemeColor({}, "icon");
  const tint = useThemeColor({}, "tint");

  const [addr, setAddr] = useState("");

  const valid = useMemo(() => addr.trim().length > 0, [addr]); // TODO: validate theo chain

  const onPaste = async () => {
    const { Clipboard } = await import("react-native"); // hoặc expo-clipboard
  };

  const onScan = () => {
    // TODO: mở camera scanner (expo-barcode-scanner)
  };

  const onDone = () => {
    if (!valid) return;
    // TODO: submit -> lưu contact {name, assetId, address: addr}
    router.dismissAll(); // hoặc router.back() nhiều lần tuỳ flow
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
      <AppHeader title="Thêm địa chỉ" />

      <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
        <Text style={[styles.label, { color: text }]}>Địa chỉ hoặc tên miền</Text>

        <View style={[styles.inputWrap, { borderColor: "#C7C7CC", backgroundColor: bg }]}>
          <TextInput
            value={addr}
            onChangeText={setAddr}
            placeholder="Địa chỉ"
            placeholderTextColor={icon}
            style={[styles.input, { color: text }]}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Pressable onPress={onPaste} style={styles.inlineBtn}>
            <Text style={[styles.inlineText, { color: tint }]}>Dán</Text>
          </Pressable>
          <Pressable onPress={onScan} style={[styles.inlineBtn, { marginLeft: 6 }]}>
            <Ionicons name="qr-code-outline" size={18} color={tint} />
          </Pressable>
        </View>

        <Pressable
          onPress={onDone}
          disabled={!valid}
          style={[styles.primaryBtn, { backgroundColor: valid ? tint : "#A6A6AA" }]}
        >
          <Text style={[styles.primaryText, { color: text }]}>Hoàn tất</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 6 },
  inputWrap: {
    height: 44,
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 12,
    paddingRight: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  input: { flex: 1, fontSize: 15 },
  inlineBtn: {
    height: 28,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  inlineText: { fontSize: 13, fontWeight: "600" },
  primaryBtn: {
    height: 44,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  primaryText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
