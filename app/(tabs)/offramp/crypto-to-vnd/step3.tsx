import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

function formatVND(n: number) {
  try {
    return new Intl.NumberFormat("vi-VN").format(Math.round(n));
  } catch {
    return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
}

export default function OffRampStep3() {
  const router = useRouter();
  const {
    // từ step1:
    bank, account, accName, alias,
    // từ step2:
    vnd, token, tokenName, tokenPriceVND, tokenNeed,
  } = useLocalSearchParams<{
    bank?: string;
    account?: string;
    accName?: string;
    alias?: string;
    vnd?: string;
    token?: string;
    tokenName?: string;
    tokenPriceVND?: string;
    tokenNeed?: string;
  }>();

  const vndNumber = Number(vnd ?? 0);
  const priceNumber = Number(tokenPriceVND ?? 0);
  const needNumber = Number(tokenNeed ?? 0);

  // Phí demo (có thể thay bằng API)
  const feeVND = 10000;
  const receiverGets = Math.max(vndNumber - feeVND, 0);

  const [note, setNote] = useState("");

  const rows = useMemo(() => ([
    { label: "Số lượng crypto:", value: `${needNumber.toFixed(6)} ${token}` },
    { label: "Giá trị VND:", value: `${formatVND(vndNumber)} đ` },
    { label: "Phí giao dịch:", value: `${formatVND(feeVND)} đ`, color: "#f59e0b" },
  ]), [needNumber, token, vndNumber]);

  function onConfirm() {
    // chuyển sang step4, truyền toàn bộ dữ liệu
    router.push({
      pathname: "/offramp/crypto-to-vnd/step4",
      params: {
        bank, account, accName, alias,
        vnd: String(vndNumber),
        token, tokenName,
        tokenPriceVND: String(priceNumber),
        tokenNeed: String(needNumber),
        feeVND: String(feeVND),
        receiverGets: String(receiverGets),
        note,
      },
    });
  }

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Header + stepper */}
        <View style={styles.header}>
          <Pressable hitSlop={10} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#111" />
          </Pressable>
          <Text style={styles.title}>Xác nhận giao dịch</Text>
          <View style={{ width: 24 }} />
        </View>
        <Text style={styles.sub}>Kiểm tra thông tin trước khi chuyển</Text>

        <View style={styles.stepper}>
          {[1, 2, 3, 4].map((n, i) => {
            const active = n <= 3;
            return (
              <View key={n} style={styles.stepItem}>
                <View style={[styles.stepDot, active ? styles.dotOn : styles.dotOff]}>
                  {n < 3 ? (
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  ) : (
                    <Text style={styles.dotText}>{n}</Text>
                  )}
                </View>
                {i < 3 && <View style={[styles.stepLine, n < 3 && { backgroundColor: "#3b82f6" }]} />}
              </View>
            );
          })}
        </View>

        {/* Card chính */}
        <View style={styles.card}>
          {/* Từ/Đến */}
          <View style={styles.rowBetween}>
            <View style={{ flex: 1 }}>
              <Text style={styles.gray}>Từ:</Text>
              <Text style={styles.bold}>Ví crypto của bạn</Text>
            </View>
            <View style={{ width: 12 }} />
            <View style={{ flex: 1, alignItems: "flex-end" }}>
              <Text style={styles.gray}>Đến:</Text>
              <Text style={styles.bold} numberOfLines={1}>
                {accName || "Người nhận"}
              </Text>
              <Text style={styles.graySmall} numberOfLines={1}>
                {(bank || "").toUpperCase()} - {account || "•••••••••"}
              </Text>
            </View>
          </View>

          <View style={styles.sep} />

          {/* Dòng số liệu */}
          {rows.map((r, idx) => (
            <View key={idx} style={styles.kvRow}>
              <Text style={styles.kvLabel}>{r.label}</Text>
              <Text style={[styles.kvValue, r.color && { color: r.color }]}>{r.value}</Text>
            </View>
          ))}

          <View style={[styles.sep, { marginTop: 8 }]} />

          <View style={styles.receiveRow}>
            <Text style={styles.receiveLabel}>Người nhận sẽ nhận:</Text>
            <Text style={styles.receiveValue}>{formatVND(receiverGets)} đ</Text>
          </View>
        </View>

        {/* Thông tin tỷ giá */}
        <View style={styles.infoCard}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="information-circle-outline" size={18} color="#334155" />
            <Text style={styles.infoTitle}>  Thông tin tỷ giá</Text>
          </View>
          <Text style={styles.infoLine}>
            Tỷ giá hiện tại: 1 {token} = {formatVND(priceNumber)} đ
          </Text>
          <Text style={styles.infoMuted}>Tỷ giá có thể thay đổi trong vòng 30 giây</Text>
        </View>

        {/* Ghi chú */}
        <View style={styles.input}>
          <Ionicons name="pencil-outline" size={18} color="#64748b" style={{ marginRight: 8 }} />
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder="Ghi chú (tùy chọn)"
            style={{ flex: 1, paddingVertical: 0, color: "#111827" }}
          />
        </View>

        {/* Buttons */}
        <View style={styles.btnRow}>
          <Pressable style={styles.btnGhost} onPress={() => router.back()}>
            <Text style={styles.btnGhostText}>Quay lại</Text>
          </Pressable>
          <Pressable style={styles.btnPrimary} onPress={onConfirm}>
            <Ionicons name="shield-checkmark-outline" size={18} color="#fff" />
            <Text style={styles.btnPrimaryText}>  Xác nhận</Text>
          </Pressable>
        </View>

        {/* Footer note */}
        <View style={styles.note}>
          <Ionicons name="information-circle-outline" size={16} color="#64748b" />
          <Text style={styles.noteText}>  Giao dịch được bảo mật với công nghệ blockchain</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F3F5FA" },

  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingTop: 6 },
  title: { fontSize: 20, fontWeight: "800", color: "#111" },
  sub: { color: "#6b7280", paddingHorizontal: 16, marginTop: 4 },

  stepper: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginVertical: 10 },
  stepItem: { flexDirection: "row", alignItems: "center" },
  stepDot: { width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  dotOn: { backgroundColor: "#3b82f6" },
  dotOff: { backgroundColor: "#E7ECF7" },
  dotText: { color: "#fff", fontWeight: "800" },
  stepLine: { width: 26, height: 2, backgroundColor: "#E7ECF7", marginHorizontal: 8 },

  card: {
    marginHorizontal: 16, backgroundColor: "#fff", borderRadius: 16, padding: 16,
    shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 1,
  },
  rowBetween: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" },
  gray: { color: "#6b7280" },
  graySmall: { color: "#6b7280", fontSize: 12 },
  bold: { fontWeight: "800", color: "#111" },
  sep: { height: 1, backgroundColor: "#EAECEF", marginVertical: 12, borderRadius: 1 },

  kvRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 6 },
  kvLabel: { color: "#6b7280" },
  kvValue: { fontWeight: "700", color: "#111" },

  receiveRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  receiveLabel: { fontWeight: "800", color: "#111" },
  receiveValue: { fontWeight: "800", color: "#16a34a" },

  infoCard: {
    marginHorizontal: 16, marginTop: 12, backgroundColor: "#F7FAFF",
    borderRadius: 14, padding: 14, borderWidth: 1, borderColor: "#E3EDFF",
  },
  infoTitle: { fontWeight: "800", color: "#111" },
  infoLine: { marginTop: 6, color: "#111" },
  infoMuted: { marginTop: 2, color: "#6b7280", fontSize: 12 },

  input: {
    marginHorizontal: 16, marginTop: 12,
    borderRadius: 12, paddingHorizontal: 12, paddingVertical: 12,
    backgroundColor: "#fff", borderWidth: 1, borderColor: "#E5E7EB",
    flexDirection: "row", alignItems: "center",
  },

  btnRow: { flexDirection: "row", gap: 12, marginTop: 16, marginHorizontal: 16 },
  btnGhost: {
    flex: 1, height: 46, borderRadius: 12, borderWidth: 1, borderColor: "#DFE4F1",
    alignItems: "center", justifyContent: "center", backgroundColor: "#fff",
  },
  btnGhostText: { color: "#111", fontWeight: "700" },
  btnPrimary: {
    flex: 1, height: 46, borderRadius: 12, backgroundColor: "#f59e0b",
    alignItems: "center", justifyContent: "center", flexDirection: "row",
  },
  btnPrimaryText: { color: "#fff", fontWeight: "800" },

  note: { marginTop: 16, paddingHorizontal: 16, flexDirection: "row", alignItems: "center" },
  noteText: { color: "#6b7280" },
});
