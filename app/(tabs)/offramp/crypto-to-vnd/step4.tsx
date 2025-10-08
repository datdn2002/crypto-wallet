import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

function fmtTime(d: Date) {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())} ${pad(
    d.getDate()
  )}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

export default function OffRampStep4() {
  const router = useRouter();
  const {
    // có thể được truyền từ Step3 (nếu backend trả về):
    txId,
    finishedAt, // epoch ms hoặc ISO (tùy bạn)
  } = useLocalSearchParams<{ txId?: string; finishedAt?: string }>();

  const id = useMemo(
    () => (txId && String(txId)) || `TX${Date.now().toString().slice(-9)}`,
    [txId]
  );

  const when = useMemo(() => {
    if (!finishedAt) return new Date();
    const n = Number(finishedAt);
    return isNaN(n) ? new Date(finishedAt) : new Date(n);
  }, [finishedAt]);

  const [copied, setCopied] = useState(false);

  async function copyId() {
    await Clipboard.setStringAsync(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }

  function openDetail() {
    // Tùy bạn: tạo màn chi tiết /offramp/tx/[id]
    router.push({ pathname: "/offramp/tx/[id]", params: { id } });
  }

  function newTx() {
    router.replace("/offramp/crypto-to-vnd"); // quay về step1
  }

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Stepper */}
        <View style={styles.stepper}>
          {[1, 2, 3, 4].map((n, i) => {
            const done = n < 4;
            return (
              <View key={n} style={styles.stepItem}>
                <View style={[styles.stepDot, done ? styles.dotOn : styles.dotStrong]}>
                  {done ? (
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  ) : (
                    <Text style={{ color: "#fff", fontWeight: "800" }}>4</Text>
                  )}
                </View>
                {i < 3 && <View style={[styles.stepLine, { backgroundColor: "#93c5fd" }]} />}
              </View>
            );
          })}
        </View>

        {/* Big result card */}
        <View style={styles.bigCard}>
          <View style={styles.bigIcon}>
            <Ionicons name="checkmark" size={30} color="#16a34a" />
          </View>

          <Text style={styles.bigTitle}>Giao dịch thành công!</Text>
          <Text style={styles.bigSub}>Tiền sẽ được chuyển vào tài khoản trong 5–10 phút</Text>

          {/* box info */}
          <View style={styles.infoBox}>
            <View style={styles.rowBetween}>
              <Text style={styles.infoLabel}>Mã giao dịch:</Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Text style={styles.infoValue} selectable>
                  {id}
                </Text>
                <Pressable onPress={copyId} hitSlop={8}>
                  <Ionicons name="copy-outline" size={18} color="#334155" />
                </Pressable>
              </View>
            </View>

            <View style={{ height: 10 }} />

            <View style={styles.rowBetween}>
              <Text style={styles.infoLabel}>Thời gian:</Text>
              <Text style={styles.infoValue}>{fmtTime(when)}</Text>
            </View>
          </View>

          {copied && <Text style={styles.copied}>Đã sao chép mã giao dịch</Text>}

          <Pressable style={styles.whiteBtn} onPress={openDetail}>
            <Text style={styles.whiteBtnText}>Xem chi tiết giao dịch</Text>
          </Pressable>

          <Pressable style={styles.primaryBtn} onPress={newTx}>
            <Text style={styles.primaryBtnText}>Tạo giao dịch mới</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F3F5FA" },

  stepper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 6,
    marginBottom: 12,
  },
  stepItem: { flexDirection: "row", alignItems: "center" },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  dotOn: { backgroundColor: "#3b82f6" },
  dotStrong: { backgroundColor: "#2563eb" },
  stepLine: { width: 26, height: 2, marginHorizontal: 8 },

  bigCard: {
    marginHorizontal: 16,
    backgroundColor: "#3b82f6",
    borderRadius: 18,
    padding: 18,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  bigIcon: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: "#E9F7EE",
    alignItems: "center", justifyContent: "center", marginTop: 6,
  },
  bigTitle: { color: "#fff", fontSize: 20, fontWeight: "800", marginTop: 12 },
  bigSub: { color: "#E8F1FF", marginTop: 4, textAlign: "center" },

  infoBox: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 16,
  },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  infoLabel: { color: "#64748b" },
  infoValue: { color: "#0f172a", fontWeight: "700" },

  copied: { color: "#E8F1FF", marginTop: 6 },

  whiteBtn: {
    width: "100%",
    height: 46,
    borderRadius: 12,
    marginTop: 14,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  whiteBtnText: { color: "#0f172a", fontWeight: "800" },

  primaryBtn: {
    width: "100%",
    height: 46,
    borderRadius: 12,
    marginTop: 10,
    backgroundColor: "#5aa2ff",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: { color: "#fff", fontWeight: "800" },
});
