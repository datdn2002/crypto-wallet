// app/wallets.page.tsx (hoặc bất kỳ nơi nào bạn gọi)
import React from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MaxModal } from "../theme";

type Wallet = {
  id: string;
  name: string;
  isDefault?: boolean;
};

type Props = {
  visible: boolean;
  onClose: () => void;
};

const walletsMock: Wallet[] = [
  { id: "1", name: "Ví chính", isDefault: true },
  { id: "2", name: "Ví chính 1" },
];

export function Wallets({ visible, onClose }: Props) {
  return (
    <MaxModal visible={visible} onClose={onClose} label="Ví">

      <Text style={styles.sectionTitle}>Ví đa tiền mã hóa</Text>

      <FlatList
        data={walletsMock}
        keyExtractor={(w) => w.id}
        contentContainerStyle={{ paddingBottom: 120 }}
        ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flexDirection: "row", gap: 12, flex: 1 }}>
              {/* Avatar + badge */}
              <View style={{ width: 36 }}>
                <View style={styles.avatar} />
                {item.isDefault ? <View style={styles.badge}><Text style={styles.badgeTick}>✓</Text></View> : null}
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardSub}>Ví đa tiền mã hóa</Text>
                <View style={{ marginTop: 8 }}>
                  <TouchableOpacity onPress={() => { /* TODO: backup thủ công */ }}>
                    <Text style={styles.link}>Sao lưu thủ công</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => { /* TODO: backup iCloud */ }}>
                    <Text style={[styles.link, { marginTop: 6 }]}>Sao lưu vào iCloud</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <TouchableOpacity onPress={() => { /* TODO: open menu */ }} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={styles.kebab}>⋮</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Nút Thêm ví */}
      <View style={styles.addWrap}>
        <TouchableOpacity style={styles.addBtn} onPress={() => { /* TODO: thêm ví */ }}>
          <Text style={styles.addText}>Thêm ví</Text>
        </TouchableOpacity>
      </View>
    </MaxModal>
  );
}

const BG = "#0f0f10";
const CARD = "#1a1a1b";
const TEXT = "#eaeaea";
const MUTED = "#a0a0a0";
const GREEN = "#27c268";

const styles = StyleSheet.create({
  header: {
    backgroundColor: BG,
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  headerTitle: { color: TEXT, fontSize: 18, fontWeight: "700" },
  iconText: { color: "#cfcfcf", fontSize: 16 },

  sectionTitle: {
    color: MUTED,
    fontSize: 13,
    paddingHorizontal: 16,
    marginBottom: 10,
  },

  card: {
    backgroundColor: CARD,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#2c6ef2",
    borderWidth: 2,
    borderColor: "#101112",
  },
  badge: {
    position: "absolute",
    right: -4,
    bottom: -4,
    backgroundColor: "#7CFC9B",
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: CARD,
  },
  badgeTick: { color: "#0a0a0a", fontSize: 12, fontWeight: "900" },

  cardTitle: { color: TEXT, fontSize: 16, fontWeight: "700" },
  cardSub: { color: MUTED, fontSize: 12, marginTop: 2 },
  link: { color: GREEN, fontSize: 14, fontWeight: "600" },
  kebab: { color: "#bdbdbd", fontSize: 18, paddingLeft: 8 },

  addWrap: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 16,
  },
  addBtn: {
    backgroundColor: "#123f2b",
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  addText: { color: "#b7f7c9", fontWeight: "700", fontSize: 16 },
});
