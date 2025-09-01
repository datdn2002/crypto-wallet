import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import React, { useRef, useState } from "react";
import { Image, Platform, Pressable, Share, StyleSheet, Text, TextInput, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import Toast from "react-native-toast-message";
import { ThemedModal } from "./theme";

export function AddressQR({ value, name, logo }: { value: string; name?: string; logo?: string }) {
  const svgRef = useRef<QRCode | null>(null);
  const bg = useThemeColor({}, "background");
  const fg = useThemeColor({}, "text");

  return (
    <View style={{ padding: 16, alignItems: "center", backgroundColor: bg }}>
      <QRCode
        value={value}
        size={220}
        color={fg}
        backgroundColor="transparent"
        getRef={(c) => (svgRef.current = c)}
      />
    </View>
  );
}

export function AddressQRModal({ value, visible, onClose, name, logo }: { value: string, visible: boolean; onClose: () => void, name?: string; logo?: string }) {
  const [amount, setAmount] = useState<string>("");
  const [amountDraft, setAmountDraft] = useState<string>("");
  const [modalVisible, setModalVisible] = useState(false);
  const copyAddress = async () => {
    await Clipboard.setStringAsync(value);
    Toast.show({ type: "success", text1: "Đã sao chép địa chỉ" });
  };

  const shareValue = async () => {
    try {
      await Share.share({ message: value });
    } catch { }
  };

  const shortAddr = (a: string) => (a.length > 12 ? `${a.slice(0, 6)}…${a.slice(-4)}` : a);

  if (!value) return null;

  return (
    <>
      <ThemedModal visible={visible} onClose={onClose} showCloseButton>
        {/* <AppHeader title="Mã QR nhận" /> */}
        <View style={styles.container}>
          {/* Header đơn giản */}
          <View style={styles.header}>
            <View style={styles.logoCircle}>
              {/* Thay bằng ảnh chain của bạn nếu muốn */}
              <Text style={styles.logoText}>₿</Text>
              <Image
                style={{ width: 24, height: 24, position: "absolute", borderRadius: 12 }}
                source={{ uri: logo }}
              />
            </View>
            <Text style={styles.title}>{name}</Text>
          </View>

          {/* QR */}
          <View style={styles.qrWrap}>
            <QRCode
              value={amount ? `${value}?amount=${amount}` : value}
              size={220}
              backgroundColor="white"
              color="black"
              ecl="Q"
              quietZone={16}
              logo={{ uri: logo }}
              logoSize={36}
              logoBackgroundColor="transparent"
            />
            <Text style={styles.linkCaption}>Link QR</Text>
            <Text style={styles.addrText}>{shortAddr(value)}</Text>
          </View>

          {/* Hàng hành động */}
          <View style={styles.actionsRow}>
            <Action icon="copy-outline" label="Sao chép" onPress={copyAddress} />
            <Action icon="cash-outline" label="Đặt số tiền" onPress={() => { setModalVisible(true); setAmountDraft(amount) }} />
            <Action icon="share-social-outline" label="Chia sẻ" onPress={shareValue} />
          </View>
        </View>
        <ThemedModal visible={modalVisible} onClose={() => setModalVisible(false)} heightPercent={0.65}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Đặt số tiền</Text>
            <TextInput
              value={amountDraft}
              onChangeText={setAmountDraft}
              keyboardType={Platform.select({ ios: "decimal-pad", android: "numeric" })}
              placeholder="Nhập số tiền (ví dụ: 1.25)"
              style={styles.input}
              placeholderTextColor="#888"
            />
            <View style={styles.modalBtns}>
              <Pressable style={[styles.mbtn, styles.mbtnGhost]} onPress={() => setModalVisible(false)}>
                <Text style={styles.mbtnGhostText}>Huỷ</Text>
              </Pressable>
              <Pressable style={styles.mbtn} onPress={() => { setModalVisible(false); setAmount(amountDraft); }}>
                <Text style={styles.mbtnText}>Áp dụng</Text>
              </Pressable>
            </View>
            <Text style={styles.hintSmall}>
              * Nếu dùng chuẩn EIP-681, chuyển đổi số tiền sang wei trước khi build URL.
            </Text>
          </View>
          <Toast position="bottom" />
        </ThemedModal>
      </ThemedModal>
    </>
  );
}

function Action({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={styles.action}
      onPress={onPress}
      android_ripple={{ color: "rgba(0,0,0,0.08)", borderless: false }}
    >
      <View style={styles.actionCircle}>
        <Ionicons name={icon} size={22} color="#111" />
      </View>
      <Text style={styles.actionLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 20, paddingTop: 24 },
  header: { alignItems: "center", marginBottom: 8 },
  logoCircle: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: "#F3C948",
    alignItems: "center", justifyContent: "center",
  },
  logoText: { color: "#111", fontWeight: "700" },
  title: { marginTop: 8, fontSize: 18, fontWeight: "700", color: "#111" },

  qrWrap: { alignItems: "center", marginTop: 10, paddingVertical: 12 },
  linkCaption: { marginTop: 10, fontSize: 13, color: "#777" },
  addrText: { marginTop: 4, fontSize: 14, color: "#111", fontWeight: "600" },

  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-start",
    marginTop: 24,
    paddingHorizontal: 8,
  },
  action: { alignItems: "center", gap: 6 },
  actionCircle: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: "#eee", alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderColor: "rgba(0,0,0,0.08)",
  },
  actionLabel: { fontSize: 13, color: "#111" },

  // Modal
  modalBackdrop: {
    flex: 1, backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center", justifyContent: "flex-end",
  },
  modalCard: {
    width: "100%", height: "40%",
    backgroundColor: "#fff", borderTopLeftRadius: 16, borderTopRightRadius: 16,
    padding: 16, gap: 12,
  },
  modalTitle: { fontSize: 16, fontWeight: "700", color: "#111" },
  input: {
    borderWidth: 1, borderColor: "#E5E5EA", borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10,
    fontSize: 16, color: "#111",
  },
  modalBtns: { flexDirection: "row", justifyContent: "flex-end", gap: 10, marginTop: 6 },
  mbtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, backgroundColor: "#111" },
  mbtnText: { color: "#fff", fontWeight: "700" },
  mbtnGhost: { backgroundColor: "transparent", borderWidth: 1, borderColor: "#E5E5EA" },
  mbtnGhostText: { color: "#111", fontWeight: "600" },
  hintSmall: { fontSize: 12, color: "#666", marginTop: 4 },
});
