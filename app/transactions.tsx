// app/(wallet)/transactions.tsx
import { AppHeader } from "@/components/theme";
import { useThemeColor } from "@/hooks/useThemeColor"; // đường dẫn theo dự án của bạn
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useState } from "react";
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type TxItem = {
  id: string;
  hash: string;
  amount: string; // ví dụ "-0.12 ETH"
  time: string;   // ví dụ "Hôm qua, 13:20"
  status: "success" | "pending" | "failed";
};

export default function TransactionsScreen() {
  // lấy màu theo theme của bạn
  const bg = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const icon = useThemeColor({}, "icon"); // xám nhẹ
  // dùng icon làm "muted"
  const muted = icon;

  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState<TxItem[]>([]); // TODO: map từ Moralis

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // TODO: fetch list giao dịch thật
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
      <AppHeader title="Lịch sử giao dịch" />

      {data.length === 0 ? (
        <View style={styles.emptyWrap}>
          <View style={styles.iconStack}>
            <Ionicons name="document-text-outline" size={88} color={muted} />
            <Ionicons name="search" size={40} color={muted} style={styles.searchIcon} />
          </View>
          <Text style={[styles.emptyText, { color: muted }]}>
            Giao dịch sẽ xuất hiện ở đây
          </Text>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={text} />
          }
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          renderItem={({ item }) => (
            <TxRow item={item} text={text} muted={muted} bg={bg} />
          )}
        />
      )}
    </SafeAreaView>
  );
}

function TxRow({
  item,
  text,
  muted,
  bg,
}: {
  item: TxItem;
  text: string;
  muted: string;
  bg: string;
}) {
  // nền card tuỳ theo theme (nhẹ hơn background 1 chút)
  const cardBg =
    bg === "#fff" ? "#FFFFFF" : "rgba(255,255,255,0.06)";
  const border =
    bg === "#fff" ? "#E5E5EA" : "rgba(255,255,255,0.08)";

  const statusIcon: keyof typeof Ionicons.glyphMap =
    item.status === "success"
      ? "arrow-down"
      : item.status === "failed"
        ? "close-circle"
        : "time-outline";

  const statusColor =
    item.status === "failed" ? "#FF3B30" : text;

  return (
    <View style={[styles.row, { backgroundColor: cardBg, borderColor: border }]}>
      <View style={styles.rowLeft}>
        <Ionicons name={statusIcon} size={22} color={statusColor} />
        <View style={{ marginLeft: 12 }}>
          <Text style={[styles.amount, { color: text }]}>{item.amount}</Text>
          <Text style={[styles.sub, { color: muted }]} numberOfLines={1}>
            {item.hash}
          </Text>
        </View>
      </View>
      <Text style={[styles.sub, { color: muted }]}>{item.time}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  emptyWrap: { flex: 1, alignItems: "center", justifyContent: "center" },
  iconStack: { width: 120, height: 120, alignItems: "center", justifyContent: "center" },
  searchIcon: { position: "absolute", right: 20, bottom: 20 },
  emptyText: { marginTop: 12, fontSize: 15, lineHeight: 20 },
  row: {
    padding: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowLeft: { flexDirection: "row", alignItems: "center", flex: 1, marginRight: 12 },
  amount: { fontSize: 16, fontWeight: "600" },
  sub: { fontSize: 13 },
});
