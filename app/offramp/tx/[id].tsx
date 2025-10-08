
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";

function formatVND(n: number) {
  try { return new Intl.NumberFormat("vi-VN").format(Math.round(n)); }
  catch { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, "."); }
}
function fmtTime(d: Date) {
  const pad = (x: number) => String(x).padStart(2, "0");
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())} ${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

export default function TxDetailScreen() {
  const router = useRouter();
  const p = useLocalSearchParams<{
    id?: string;
    // từ step3/4 có thể pass thêm các field:
    token?: string; tokenName?: string; tokenNeed?: string;
    tokenPriceVND?: string; vnd?: string; feeVND?: string; receiverGets?: string;
    bank?: string; account?: string; accName?: string; finishedAt?: string;
  }>();

  // fallback demo nếu thiếu params
  const txId = p.id || "TX123456789";
  const token = (p.token || "BTC").toUpperCase();
  const tokenName = p.tokenName || (token === "ETH" ? "Ethereum" : token === "USDT" ? "Tether" : "Bitcoin");
  const amountToken = Number(p.tokenNeed ?? 0.001839);
  const priceVND = Number(p.tokenPriceVND ?? 1087500000);
  const vndValue = Number(p.vnd ?? 2000000);
  const feeVND = Number(p.feeVND ?? 10000);
  const totalRecv = Number(p.receiverGets ?? Math.max(vndValue - feeVND, 0));
  const accName = p.accName || "Nguyễn Văn A";
  const bank = p.bank || "Techcombank";
  const account = p.account || "9876543210";

  const when = useMemo(() => {
    if (!p.finishedAt) return new Date();
    const n = Number(p.finishedAt);
    return isNaN(n) ? new Date(p.finishedAt) : new Date(n);
  }, [p.finishedAt]);

  const [copied, setCopied] = useState(false);

  async function copyTx() {
    await Clipboard.setStringAsync(txId);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }

  async function shareReceipt() {
    const msg =
      `Giao dịch off-ramp thành công
Mã: ${txId}
Thời gian: ${fmtTime(when)}
Crypto: ${amountToken.toFixed(6)} ${token} (1 ${token} = ${formatVND(priceVND)} đ)
Giá trị VND: ${formatVND(vndValue)} đ
Phí: ${formatVND(feeVND)} đ
Tổng nhận: ${formatVND(totalRecv)} đ
Người nhận: ${accName} - ${bank} - ${account}`;
    await Share.share({ message: msg });
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F3F5FA" }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable hitSlop={10} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#111" />
          </Pressable>
          <Text style={styles.headerTitle}>Chi tiết giao dịch</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Card trạng thái */}
        <View style={styles.card}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={styles.statusIcon}>
              <Ionicons name="checkmark" size={18} color="#16a34a" />
            </View>
            <View style={{ marginLeft: 8 }}>
              <Text style={styles.statusTitle}>Giao dịch thành công</Text>
              <Text style={styles.statusTime}>{fmtTime(when)}</Text>
            </View>
          </View>

          <View style={styles.sep} />

          <View style={styles.rowBetween}>
            <Text style={styles.gray}>Mã giao dịch</Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Text selectable style={styles.bold}>{txId}</Text>
              <Pressable onPress={copyTx} hitSlop={8}>
                <Ionicons name="copy-outline" size={18} color="#334155" />
              </Pressable>
            </View>
          </View>

          <View style={{ height: 10 }} />

          <View style={styles.rowBetween}>
            <Text style={styles.gray}>Trạng thái</Text>
            <View style={styles.pillSuccess}><Text style={styles.pillText}>Thành công</Text></View>
          </View>

          {copied && <Text style={{ color: "#16a34a", marginTop: 8 }}>Đã sao chép mã giao dịch</Text>}
        </View>

        {/* Card thông tin giao dịch */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Thông tin giao dịch</Text>

          <View style={styles.kvRow}>
            <Text style={styles.kvLabel}>Loại crypto</Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <View style={styles.tokenIcon}>
                {token === "BTC" ? (
                  <FontAwesome5 name="bitcoin" size={16} color="#2563eb" />
                ) : token === "ETH" ? (
                  <MaterialCommunityIcons name="ethereum" size={18} color="#2563eb" />
                ) : (
                  <MaterialCommunityIcons name="currency-usd" size={18} color="#2563eb" />
                )}
              </View>
              <Text style={styles.bold}>{token}</Text>
            </View>
          </View>

          <View style={styles.kvRow}>
            <Text style={styles.kvLabel}>Số lượng crypto</Text>
            <Text style={styles.bold}>{amountToken.toFixed(6)} {token}</Text>
          </View>

          <View style={styles.kvRow}>
            <Text style={styles.kvLabel}>Tỷ giá</Text>
            <Text style={styles.bold}>1 {token} = {formatVND(priceVND)} đ</Text>
          </View>

          <View style={styles.kvRow}>
            <Text style={styles.kvLabel}>Giá trị VND</Text>
            <Text style={styles.bold}>{formatVND(vndValue)} đ</Text>
          </View>

          <View style={styles.kvRow}>
            <Text style={styles.kvLabel}>Phí giao dịch</Text>
            <Text style={[styles.bold, { color: "#f59e0b" }]}>{formatVND(feeVND)} đ</Text>
          </View>

          <View style={styles.sep} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tổng nhận</Text>
            <Text style={styles.totalValue}>{formatVND(totalRecv)} đ</Text>
          </View>
        </View>

        {/* Card thông tin người nhận */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Thông tin người nhận</Text>

          <View style={styles.kvRow}>
            <Text style={styles.kvLabel}>Tên người nhận</Text>
            <Text style={styles.bold}>{accName}</Text>
          </View>
          <View style={styles.kvRow}>
            <Text style={styles.kvLabel}>Ngân hàng</Text>
            <Text style={styles.bold}>{bank}</Text>
          </View>
          <View style={styles.kvRow}>
            <Text style={styles.kvLabel}>Số tài khoản</Text>
            <Text style={styles.bold}>{account}</Text>
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.btnRow}>
          <Pressable
            style={styles.btnGhost}
            onPress={() => shareReceipt()} // tạm: share text làm "biên lai"
          >
            <Text style={styles.btnGhostText}>Tải biên lai</Text>
          </Pressable>
          <Pressable
            style={styles.btnPrimary}
            onPress={() => shareReceipt()}
          >
            <Text style={styles.btnPrimaryText}>Chia sẻ</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingTop: 6 },
  headerTitle: { fontSize: 20, fontWeight: "800", color: "#111" },

  card: {
    marginHorizontal: 16, marginTop: 12,
    backgroundColor: "#fff", borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: "#E9EDF6",
    shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 1,
  },

  statusIcon: { width: 28, height: 28, borderRadius: 14, backgroundColor: "#E9F7EE", alignItems: "center", justifyContent: "center" },
  statusTitle: { fontWeight: "800", color: "#111" },
  statusTime: { color: "#6b7280", marginTop: 2 },

  pillSuccess: { backgroundColor: "#e9f7ee", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  pillText: { color: "#16a34a", fontWeight: "700" },

  sep: { height: 1, backgroundColor: "#EEF1F7", marginVertical: 12, borderRadius: 1 },

  rowBetween: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },

  gray: { color: "#6b7280" },
  bold: { color: "#111", fontWeight: "700" },

  cardTitle: { fontWeight: "800", color: "#111", marginBottom: 10 },

  kvRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 10 },
  kvLabel: { color: "#6b7280" },

  totalRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  totalLabel: { fontWeight: "800", color: "#111" },
  totalValue: { fontWeight: "800", color: "#16a34a" },

  tokenIcon: { width: 28, height: 28, borderRadius: 14, backgroundColor: "#E6EEFF", alignItems: "center", justifyContent: "center" },

  btnRow: { flexDirection: "row", gap: 12, marginHorizontal: 16, marginTop: 12, marginBottom: 10 },
  btnGhost: {
    flex: 1, height: 46, borderRadius: 12, borderWidth: 1, borderColor: "#DFE4F1",
    backgroundColor: "#fff", alignItems: "center", justifyContent: "center",
  },
  btnGhostText: { color: "#111", fontWeight: "700" },
  btnPrimary: { flex: 1, height: 46, borderRadius: 12, backgroundColor: "#2563eb", alignItems: "center", justifyContent: "center" },
  btnPrimaryText: { color: "#fff", fontWeight: "800" },
});
