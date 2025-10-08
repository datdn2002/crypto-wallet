import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Dimensions, Image, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";

const { width } = Dimensions.get("window");

const chartData = Array.from({ length: 48 }, (_, i) => ({
  value: 20 + Math.sin(i / 3) * 8 + (i > 20 && i < 28 ? 10 : 0) + (i > 35 ? -5 : 0),
}));

const timeframes = ["1 giờ", "1 ngày", "1 tuần", "1 tháng", "1 năm", "Tất cả"] as const;
type TF = typeof timeframes[number];

export default function TokenDetailScreen() {
  const router = useRouter();
  const { id = "aster", symbol = "ASTER", chain = "BNB Smart Chain" } = useLocalSearchParams<{
    id?: string;
    symbol?: string;
    chain?: string;
  }>();

  const [tf, setTF] = useState<TF>("1 ngày");
  const [tab, setTab] = useState<"asset" | "history" | "intro">("asset");

  const priceText = "₫51.823,84";
  const changeText = "+₫4.123,56 (+8,64%)";

  const lineColor = "#198754"; // xanh tăng giá

  const headerSubtitle = useMemo(
    () => (
      <Text style={styles.subtitle}>
        <Text style={styles.tagLeft}>BEP20</Text>
        <Text style={styles.dot}>  |  </Text>
        <Text style={styles.tagRight}>{chain}</Text>
      </Text>
    ),
    [chain]
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => {
          if (router.canGoBack()) {
            router.back();
          } else {
            router.replace("/");
          }
        }} hitSlop={12} style={{ paddingRight: 4 }}>
          <Ionicons name="chevron-back" size={24} color="#111" />
        </Pressable>

        <View style={{ alignItems: "center" }}>
          <Text style={styles.title}>{String(symbol).toUpperCase()}</Text>
          {headerSubtitle}
        </View>

        <Pressable hitSlop={10}>
          <Ionicons name="star-outline" size={22} color="#363636" />
        </Pressable>
      </View>

      {/* Price */}
      <View style={styles.priceWrap}>
        <Text style={styles.price}>{priceText}</Text>
        <Text style={[styles.change, { color: lineColor }]}>
          <Ionicons name="arrow-up" size={14} color={lineColor} /> {changeText}
        </Text>
      </View>

      {/* Chart */}
      <View style={styles.chartWrap}>
        <LineChart
          data={chartData}
          curved
          areaChart
          hideRules
          hideYAxisText
          hideDataPoints
          spacing={width / chartData.length}
          color={lineColor}
          thickness={2}
          startFillColor="rgba(25,135,84,0.28)"
          endFillColor="rgba(25,135,84,0.05)"
          startOpacity={0.9}
          endOpacity={0.2}
          yAxisThickness={0}
          xAxisThickness={0}
          height={220}
          width={width - 32}
          initialSpacing={0}
          adjustToWidth
        />
      </View>

      {/* Timeframe selector */}
      <View style={styles.tfRow}>
        {timeframes.map((t) => {
          const active = tf === t;
          return (
            <Pressable key={t} onPress={() => setTF(t)} style={[styles.tfItem, active && styles.tfActive]}>
              <Text style={[styles.tfText, active && styles.tfTextActive]}>{t}</Text>
            </Pressable>
          );
        })}
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {[
          { key: "asset", label: "Tài sản" },
          { key: "history", label: "Lịch sử" },
          { key: "intro", label: "Giới thiệu" },
        ].map((t) => {
          const active = tab === (t.key as any);
          return (
            <Pressable
              key={t.key}
              onPress={() => setTab(t.key as any)}
              style={[styles.tabItem, active && styles.tabActive]}
            >
              <Text style={[styles.tabText, active && styles.tabTextActive]}>{t.label}</Text>
              {active && <View style={styles.tabIndicator} />}
            </Pressable>
          );
        })}
      </View>

      {/* Content - Asset */}
      {tab === "asset" && (
        <View style={styles.assetSection}>
          <Text style={styles.sectionTitle}>Số Dư Của Tôi</Text>

          <View style={styles.assetCard}>
            <View style={styles.left}>
              <View style={styles.tokenIcon}>
                {/* Token icon placeholder */}
                <MaterialCommunityIcons name="shape-circle-plus" size={24} color="#111" />
                {/* BSC badge */}
                <View style={styles.badge}>
                  <Image
                    source={{
                      uri: "https://cryptologos.cc/logos/bnb-bnb-logo.png?v=040",
                    }}
                    style={{ width: 14, height: 14, borderRadius: 7 }}
                  />
                </View>
              </View>

              <View style={{ marginLeft: 12 }}>
                <Text style={styles.assetName}>Aster</Text>
                <Text style={styles.assetSub}>0.00 ASTER</Text>
              </View>
            </View>

            <View style={styles.right}>
              <Text style={styles.assetFiat}>₫0.00</Text>
              <Text style={styles.assetDash}>-</Text>
            </View>
          </View>
        </View>
      )}

      {/* Bottom actions */}
      <View style={styles.bottomBar}>
        <Action icon={<Feather name="arrow-up-right" size={20} />} label="Gửi" />
        <Action icon={<Feather name="copy" size={20} />} label="Nhận" />
        <Action
          icon={<Ionicons name="swap-horizontal" size={20} color="#fff" />}
          label="Hoán đổi"
          primary
        />
        <Action icon={<Ionicons name="flash-outline" size={20} />} label="Mua" />
      </View>

    </SafeAreaView>
  );
}

function Action({ icon, label, primary }: { icon: React.ReactNode; label: string; primary?: boolean }) {
  return (
    <Pressable style={[styles.actionBtn, primary && styles.actionPrimary]}>
      <View style={[styles.actionIcon, primary && styles.actionIconPrimary]}>{icon}</View>
      <Text style={[styles.actionText, primary && styles.actionTextPrimary]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: { fontSize: 20, fontWeight: "700", color: "#111" },
  subtitle: { fontSize: 12, color: "#6b7280", marginTop: 2 },
  tagLeft: { color: "#6b7280" },
  tagRight: { color: "#6b7280" },
  dot: { color: "#9ca3af" },

  priceWrap: { alignItems: "center", marginTop: 10 },
  price: { fontSize: 32, fontWeight: "800", color: "#111" },
  change: { marginTop: 4, fontSize: 14, fontWeight: "600" },

  chartWrap: { marginTop: 8, paddingHorizontal: 16 },

  tfRow: {
    paddingHorizontal: 12,
    paddingTop: 8,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  tfItem: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 10,
    // marginHorizontal: 4,
    marginVertical: 6,
  },
  tfActive: { backgroundColor: "#F1F1F3" },
  tfText: { color: "#51545a", fontSize: 13 },
  tfTextActive: { color: "#111" },

  tabs: {
    marginTop: 4,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: "#e5e7eb",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  tabItem: { flex: 1, alignItems: "center", paddingVertical: 12 },
  tabText: { color: "#6b7280", fontSize: 15, fontWeight: "600" },
  tabTextActive: { color: "#111" },
  tabActive: {},
  tabIndicator: {
    position: "absolute",
    bottom: 0,
    height: 2,
    width: "100%",
    backgroundColor: "#2563eb", // xanh dương
  },

  assetSection: { paddingHorizontal: 16, paddingTop: 12 },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#111", marginBottom: 10 },

  assetCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F6F7FB",
    padding: 14,
    borderRadius: 14,
  },
  left: { flexDirection: "row", alignItems: "center" },
  tokenIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#EDEEF3",
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  assetName: { fontSize: 16, fontWeight: "700", color: "#111" },
  assetSub: { fontSize: 14, color: "#6b7280", marginTop: 2 },

  right: { alignItems: "flex-end" },
  assetFiat: { fontSize: 16, fontWeight: "700", color: "#111" },
  assetDash: { color: "#9ca3af", marginTop: 2 },

  bottomBar: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: "#e5e7eb",
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 18,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  actionBtn: { alignItems: "center", gap: 6, flex: 1 },
  actionIcon: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: "#f1f3f5",
    alignItems: "center",
    justifyContent: "center",
  },
  actionText: { fontSize: 14, color: "#111", fontWeight: "600" },

  actionPrimary: {},
  actionIconPrimary: { backgroundColor: "#0b5cff" },
  actionTextPrimary: { color: "#111" },
});
