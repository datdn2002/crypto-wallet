import { FontAwesome5, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";

type TokenRow = {
  symbol: "BTC" | "ETH" | "USDT";
  name: string;
  priceVND: number;      // giá 1 token quy VND
  change24h: number;     // %
  balance: number;       // số dư người dùng
  decimals: number;
};

const TOKENS: TokenRow[] = [
  { symbol: "BTC", name: "Bitcoin", priceVND: 1087500000, change24h: +2.4, balance: 0.00234, decimals: 8 },
  { symbol: "ETH", name: "Ethereum", priceVND: 67000000, change24h: -1.2, balance: 0.156, decimals: 18 },
  { symbol: "USDT", name: "Tether", priceVND: 25000, change24h: +0.1, balance: 150.5, decimals: 6 },
];

function formatVND(n: number) {
  try {
    return new Intl.NumberFormat("vi-VN").format(Math.round(n));
  } catch {
    // fallback
    return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
}

function cleanMoneyInput(s: string) {
  return s.replace(/[^\d]/g, "");
}

export default function OffRampStep2() {
  const router = useRouter();
  // nhận params từ step 1 (không dùng nhiều ở đây nhưng giữ lại để pass tiếp)
  const p = useLocalSearchParams();

  const [moneyVND, setMoneyVND] = useState<string>(""); // text hiển thị (có . ngăn cách)
  const [selected, setSelected] = useState<TokenRow | null>(null);

  const moneyNumber = useMemo(() => Number(cleanMoneyInput(moneyVND) || 0), [moneyVND]);

  // số token cần để chi trả (theo token đang chọn)
  const needAmount = useMemo(() => {
    if (!selected || moneyNumber <= 0) return 0;
    return moneyNumber / selected.priceVND; // chưa cộng phí/spread
  }, [selected, moneyNumber]);

  const canContinue = useMemo(() => {
    if (!selected || moneyNumber <= 0) return false;
    return needAmount > 0 && needAmount <= (selected?.balance ?? 0);
  }, [selected, moneyNumber, needAmount]);

  function onChangeMoney(text: string) {
    const num = cleanMoneyInput(text);
    // thêm dấu chấm ngàn
    const pretty = formatVND(Number(num));
    setMoneyVND(num === "" ? "" : pretty);
  }

  function goNext() {
    if (!selected) return;
    router.push({
      pathname: "/offramp/crypto-to-vnd/step3",
      params: {
        ...p,                                      // giữ dữ liệu step1
        vnd: String(moneyNumber),
        token: selected.symbol,
        tokenName: selected.name,
        tokenPriceVND: String(selected.priceVND),
        tokenNeed: String(needAmount),
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
          <Text style={styles.title}>Chọn crypto & số lượng</Text>
          <View style={{ width: 24 }} />
        </View>
        <Text style={styles.sub}>Chọn loại crypto và nhập số lượng</Text>

        <View style={styles.stepper}>
          {[1, 2, 3, 4].map((n, i) => {
            const active = n < 3;
            return (
              <View key={n} style={styles.stepItem}>
                <View style={[styles.stepDot, active ? styles.dotOn : styles.dotOff]}>
                  {n < 2 ? (
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  ) : (
                    <Text style={[styles.dotText, n == 2 && { color: '#fff' }]}>{n}</Text>
                  )}
                </View>
                {i < 3 && <View style={[styles.stepLine, n < 2 && { backgroundColor: "#3b82f6" }]} />}
              </View>
            );
          })}
        </View>

        {/* Card */}
        <View style={styles.card}>
          {/* Input VND */}
          <View style={styles.input}>
            <Ionicons name="card-outline" size={18} color="#64748b" style={{ marginRight: 8 }} />
            <TextInput
              value={moneyVND}
              onChangeText={onChangeMoney}
              keyboardType="number-pad"
              placeholder="Số tiền VND cần chuyển"
              style={[styles.ti, { flex: 1 }]}
            />
          </View>

          <Text style={[styles.section, { marginTop: 16 }]}>Chọn crypto để thanh toán:</Text>

          {/* List token */}
          {TOKENS.map((t) => {
            const active = selected?.symbol === t.symbol;
            const changeUp = t.change24h >= 0;
            const need = moneyNumber > 0 ? moneyNumber / t.priceVND : 0;
            const notEnough = need > t.balance && moneyNumber > 0;

            return (
              <Pressable
                key={t.symbol}
                onPress={() => setSelected(t)}
                style={[styles.tokenRow, active && styles.tokenActive]}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                  <View style={styles.tokenIcon}>
                    {t.symbol === "BTC" ? (
                      <FontAwesome5 name="bitcoin" size={18} color="#2563eb" />
                    ) : t.symbol === "ETH" ? (
                      <MaterialCommunityIcons name="ethereum" size={20} color="#2563eb" />
                    ) : (
                      <MaterialCommunityIcons name="currency-usd" size={20} color="#2563eb" />
                    )}
                  </View>

                  <View>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                      <Text style={styles.tokenSym}>{t.symbol}</Text>
                      <View style={[styles.badge, { backgroundColor: changeUp ? "#e9f9ef" : "#fdecec" }]}>
                        <Text style={[styles.badgeText, { color: changeUp ? "#16a34a" : "#ef4444" }]}>
                          {changeUp ? "+" : ""}{t.change24h.toFixed(1)}%
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.tokenName}>{t.name}</Text>
                    <Text style={styles.balance}>Có: {t.balance.toFixed(6)} {t.symbol}</Text>
                  </View>
                </View>

                <View style={{ alignItems: "flex-end" }}>
                  <Text style={styles.price}>{formatVND(t.priceVND)} đ</Text>
                  {moneyNumber > 0 && (
                    <Text style={[styles.needText, notEnough && { color: "#ef4444" }]}>
                      Cần: {need.toFixed(6)} {t.symbol}
                    </Text>
                  )}
                </View>
              </Pressable>
            );
          })}

          {/* Footer buttons */}
          <View style={styles.btnRow}>
            <Pressable style={styles.btnGhost} onPress={() => router.back()}>
              <Text style={styles.btnGhostText}>Quay lại</Text>
            </Pressable>
            <Pressable
              style={[styles.btnPrimary, !canContinue && { opacity: 0.5 }]}
              onPress={goNext}
              disabled={!canContinue}
            >
              <Text style={styles.btnPrimaryText}>Tiếp tục</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F3F5FA" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingTop: 6 },
  title: { fontSize: 20, fontWeight: "800", color: "#111" },
  sub: { paddingHorizontal: 16, color: "#6b7280", marginTop: 4, textAlign: "center" },

  stepper: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginVertical: 10 },
  stepItem: { flexDirection: "row", alignItems: "center" },
  stepDot: { width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  dotOn: { backgroundColor: "#3b82f6" },
  dotOff: { backgroundColor: "#E7ECF7" },
  dotText: { fontWeight: "700" },
  stepLine: { width: 26, height: 2, backgroundColor: "#E7ECF7", marginHorizontal: 8 },

  card: {
    marginHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },

  input: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 14 : 10,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  ti: { fontSize: 16, color: "#111827", paddingVertical: 0 },

  section: { fontWeight: "700", color: "#111" },

  tokenRow: {
    marginTop: 12,
    padding: 12,
    borderRadius: 14,
    backgroundColor: "#F7F8FC",
    borderWidth: 1,
    borderColor: "#EEF0F6",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tokenActive: { borderColor: "#3b82f6" },

  tokenIcon: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: "#E6EEFF",
    alignItems: "center", justifyContent: "center",
  },
  tokenSym: { fontSize: 16, fontWeight: "800", color: "#111" },
  tokenName: { color: "#6b7280", marginTop: 2 },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  badgeText: { fontSize: 12, fontWeight: "700" },
  balance: { fontSize: 12, color: "#6b7280", marginTop: 4 },

  price: { fontWeight: "700", color: "#111" },
  needText: { marginTop: 4, color: "#6b7280" },

  btnRow: { flexDirection: "row", gap: 12, marginTop: 16 },
  btnGhost: {
    flex: 1, height: 46, borderRadius: 12, borderWidth: 1, borderColor: "#DFE4F1",
    alignItems: "center", justifyContent: "center", backgroundColor: "#fff",
  },
  btnGhostText: { color: "#111", fontWeight: "700" },

  btnPrimary: {
    flex: 1, height: 46, borderRadius: 12, alignItems: "center", justifyContent: "center",
    backgroundColor: "#2563eb",
  },
  btnPrimaryText: { color: "#fff", fontWeight: "800" },
});
