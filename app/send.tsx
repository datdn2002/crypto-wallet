import { sendTokens } from "@/api";
import { AddressPicker } from "@/components/AddressPicker";
import { ScanQr } from "@/components/ScanQr";
import { AppHeader, ThemedModal } from "@/components/theme";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useAuthStore } from "@/store/auth";
import { Token, useWalletStore } from "@/store/wallet";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

export default function SendScreen() {
  const { access_token } = useAuthStore();
  const background = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const icon = useThemeColor({}, "icon");
  const tint = useThemeColor({}, "tint");
  const [query, setQuery] = useState("");
  const [sendToken, setSendToken] = useState<Token | null>(null);
  const { tokens, defaultWallet } = useWalletStore();
  const [addr, setAddr] = useState("");
  const [amount, setAmount] = useState("");
  const [openScan, setOpenScan] = useState(false);
  const [showAddressPicker, setShowAddressPicker] = useState(false);

  const data = useMemo(() => {
    const filterTokens = tokens.filter(token => parseFloat(token.balance) > 0)
    const q = query.trim().toLowerCase();
    if (!q) return filterTokens;
    return filterTokens.filter(
      (t) =>
        t.symbol.toLowerCase().includes(q) ||
        t.name.toLowerCase().includes(q) ||
        (t.chain && t.chain.toLowerCase().includes(q))
    );
  }, [query, tokens]);

  const isValid = useMemo(() => {
    return Boolean(addr.trim() && amount.trim());
  }, [addr, amount]);

  const onScan = (data: string) => {
    setAddr(data.split(":")[0]);
    setOpenScan(false);
  };

  const onPaste = async () => {
    Clipboard.getStringAsync().then(text => {
      setAddr(text);
    });
  };

  const handleSend = async () => {
    if (!access_token || !sendToken?.token_address) return;
    const res = await sendTokens(access_token, {
      amount: parseInt(amount),
      chain: sendToken.chain || 'eth',
      from_address: defaultWallet?.walletAddresses?.find(item => item.chain.name === sendToken.chain)?.address || "",
      to_address: addr,
      token_address: sendToken?.token_address,
    })
  }

  if (openScan) {
    return <ScanQr onEndScan={onScan} />
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: background }]}>
      <AppHeader title="Gửi" />

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
          return (
            <TouchableOpacity style={styles.row} onPress={() => {
              setAddr("")
              setAmount("")
              setSendToken(item)
            }}>
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
                <Text>{item.balance}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        contentContainerStyle={{ paddingVertical: 8, paddingBottom: 32 }}
      />
      <ThemedModal
        visible={sendToken !== null}
        onClose={() => setSendToken(null)}
        heightPercent={1}
        header={<AppHeader title={"Gửi " + sendToken?.symbol} onBack={() => setSendToken(null)} />}
      >
        <View style={{ gap: 12 }}>
          <View style={{ gap: 4 }}>
            <Text style={{ fontSize: 14 }}>Địa chỉ hoặc tên miền</Text>
            <View style={[styles.inputWrap, { borderColor: "#C7C7CC", backgroundColor: background }]}>
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
              <Pressable onPress={() => { setShowAddressPicker(true) }} style={[styles.inlineBtn, { marginLeft: 6 }]}>
                <MaterialIcons name="perm-contact-cal" size={18} color={tint} />
              </Pressable>
              <Pressable onPress={() => setOpenScan(true)} style={[styles.inlineBtn, { marginLeft: 6 }]}>
                <Ionicons name="qr-code-outline" size={18} color={tint} />
              </Pressable>
            </View>
          </View>
          <View style={{ gap: 4 }}>
            <Text style={{ fontSize: 14 }}>Số tiền</Text>
            <View style={[styles.inputWrap, { borderColor: "#C7C7CC", backgroundColor: background }]}>
              <TextInput
                value={amount}
                onChangeText={(value) => {
                  if (!Number.isNaN(parseInt(value))) setAmount(parseInt(value) + "")
                  else setAmount("")
                }}
                placeholder="Nhập số tiền"
                placeholderTextColor={icon}
                style={[styles.input, { color: text }]}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType={Platform.select({ ios: "decimal-pad", android: "numeric" })}
              />
            </View>
          </View>

          <TouchableOpacity style={[styles.button, !isValid && { backgroundColor: "#ccc" }]} onPress={handleSend} disabled={!isValid}>
            <Text style={{ color: "#fff", fontSize: 16 }}>Tiếp tục</Text>
          </TouchableOpacity>
        </View>
        <AddressPicker
          onPick={(address) => {
            setAddr(address.address)
            setShowAddressPicker(false);
          }}
          visible={showAddressPicker}
          onClose={() => setShowAddressPicker(false)}
        />
      </ThemedModal>
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
    paddingHorizontal: 4,
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
  button: {
    backgroundColor: "#4CAF50",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 32
  },
});
