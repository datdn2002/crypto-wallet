import { createAddressBookApi } from "@/api/addressBook";
import { ScanQr } from "@/components/ScanQr";
import { AppHeader } from "@/components/theme";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useAuthStore } from "@/store/auth";
import { useWalletStore } from "@/store/wallet";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";
import Toast from "react-native-toast-message";

export default function AddAddressScreen() {
  const router = useRouter();
  const { name, assetId, symbol, assetName } = useLocalSearchParams<{
    name?: string;
    assetId?: string;
    symbol?: string;
    assetName?: string;
  }>();
  const { access_token } = useAuthStore();
  const { refetchAddress } = useWalletStore();
  const bg = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const icon = useThemeColor({}, "icon");
  const tint = useThemeColor({}, "tint");

  const [addr, setAddr] = useState("");
  const [openScan, setOpenScan] = useState(false);

  const valid = useMemo(() => addr.trim().length > 0, [addr]); // TODO: validate theo chain

  const onPaste = async () => {
    Clipboard.getStringAsync().then(text => {
      setAddr(text);
    });
  };

  const onScan = (data: string) => {
    setAddr(data.split(":")[0]);
    setOpenScan(false);
  };

  const onDone = async () => {
    if (!valid || !access_token) return;
    const createAddressRes = await createAddressBookApi(access_token, {
      address: addr.trim(),
      alias: 0,
      note: name || "",
    })

    if (createAddressRes?.statusCode === 201) {
      Toast.show({ text1: "Thêm thành công", type: "success" })
      refetchAddress();
      router.dismissAll();
    } else {
      Toast.show({ text1: "Lỗi", type: "error" })
    }
  };

  if (openScan) {
    return <ScanQr onEndScan={onScan} />
  }

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
          <Pressable onPress={() => setOpenScan(true)} style={[styles.inlineBtn, { marginLeft: 6 }]}>
            <Ionicons name="qr-code-outline" size={18} color={tint} />
          </Pressable>
        </View>

        <Pressable
          onPress={onDone}
          disabled={!valid}
          style={[styles.primaryBtn, { backgroundColor: valid ? tint : "#A6A6AA" }]}
        >
          <Text style={[styles.primaryText]}>Hoàn tất</Text>
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
