import { getTokens, Token } from "@/api";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useAuthStore } from "@/store/auth";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View
} from "react-native";

/* ============================ Slider Component ============================ */
export default function TrendingSlider() {
  const { access_token } = useAuthStore();
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!access_token) return;
    try {
      setLoading(true);
      const res = await getTokens({
        token: access_token,
        params: { includeMarketData: true, timeframes: "1h" },
      });
      if (res?.statusCode === 200) {
        const data = res.data;

        // Merge tất cả token từ các chain
        const merged: Token[] = [];
        const seen = new Set<string>();
        Object.keys(data).forEach((chain) => {
          for (const t of data[chain].tokens as Token[]) {
            const key = t.id || t.symbol + ":" + ((t.market_data as any)?.chain_id ?? "");
            if (!seen.has(key)) {
              seen.add(key);
              merged.push(t);
            }
          }
        });
        setTokens(merged);
      }
    } finally {
      setLoading(false);
    }
  }, [access_token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const top10 = useMemo(() => {
    let arr = [...tokens];
    arr.sort((a, b) => (b.market_data?.price_change_percentage_24h ?? 0) - (a.market_data?.price_change_percentage_24h ?? 0));
    return arr.slice(0, 10);
  }, [tokens]);

  const { styles } = useStyles();

  if (loading) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <FlatList
      data={top10}
      keyExtractor={(_, idx) => "top10-" + idx}
      renderItem={({ item }) => <TokenCard item={item} />}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 12, gap: 12 }}
    />
  );
}

/* ============================ Token Card ============================ */
function TokenCard({ item }: { item: Token }) {
  const { styles } = useStyles();
  const md = item.market_data;
  const price = md?.current_price ?? 0;
  const change24 = Number(md?.price_change_percentage_24h ?? 0);
  const volume = md?.volume_24h ?? 0;

  const isUp = change24 >= 0;

  return (
    <View style={styles.card}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        <Image source={{ uri: item.logo_url }} style={styles.logo} />
        <View>
          <Text style={styles.symbol}>{item.symbol}</Text>
          <Text style={styles.volume}>{formatVolume(volume)}</Text>
        </View>
      </View>
      <View style={{ alignItems: "flex-end" }}>
        <Text style={styles.price}>{formatUSD(price)}</Text>
        <Text style={[styles.percent, isUp ? styles.up : styles.down]}>
          {isUp ? "+" : ""}
          {formatPercent(change24)}
        </Text>
      </View>
    </View>
  );
}

/* ============================ Styles ============================ */
function useStyles() {
  const bg = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");

  const styles = StyleSheet.create({
    loadingWrap: { height: 80, alignItems: "center", justifyContent: "center" },
    card: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 12,
      backgroundColor: "#E5EDFF",
      minWidth: 160,
      gap: 16,
    },
    logo: { width: 28, height: 28, borderRadius: 14, backgroundColor: "#fff" },
    symbol: { fontSize: 14, fontWeight: "600", color: text },
    volume: { fontSize: 12, color: "#6B7280" },
    price: { fontSize: 14, fontWeight: "700", color: text },
    percent: { fontSize: 13, fontWeight: "600" },
    up: { color: "#059669" },
    down: { color: "#DC2626" },
  });
  return { styles };
}

/* ============================ Utils ============================ */
function formatUSD(n: number) {
  if (!isFinite(n)) return "-";
  return `${n.toLocaleString(undefined, { maximumFractionDigits: 4 })}$`;
}
function formatPercent(n: number) {
  return `${Math.abs(n).toLocaleString(undefined, { maximumFractionDigits: 2 })}%`;
}
function formatVolume(n: number) {
  if (!isFinite(n)) return "-";
  const billion = n / 1_000_000_000;
  if (billion >= 1) return `${billion.toLocaleString(undefined, { maximumFractionDigits: 2 })}B`;
  const million = n / 1_000_000;
  return `${million.toLocaleString(undefined, { maximumFractionDigits: 2 })}M`;
}
