// components/wallet/SeedSafetyModal.tsx
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ThemedModal } from "../theme";

type Props = {
  visible: boolean;
  onClose: () => void;
  onContinue: () => void;
};

export function SeedSafetyModal({ visible, onClose, onContinue }: Props) {
  const bg = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const icon = useThemeColor({}, "icon");
  const tint = useThemeColor({}, "tint");

  return (
    <ThemedModal visible={visible} onClose={onClose}>
      <View style={[styles.container, { backgroundColor: bg }]}>
        <View style={styles.headerRow}>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.hero}>
          <Ionicons name="shield-checkmark-outline" size={64} color={text} />
          <Text style={[styles.title, { color: text, marginTop: 12 }]}>
            Hãy kiểm tra xem cụm từ bí mật{"\n"}của bạn có an toàn không
          </Text>
        </View>

        <ChecklistLine
          text="Chỉ có bạn mới biết cụm từ bí mật này"
          color={icon}
        />
        <ChecklistLine
          text="Cụm từ bí mật này KHÔNG phải do bất kỳ ai cung cấp cho bạn"
          color={icon}
        />
        <ChecklistLine
          text="Nếu có người nhìn thấy cụm từ bí mật đó, họ có thể sẽ lấy cắp tiền của bạn"
          color={icon}
        />

        <Pressable style={[styles.primaryBtn, { backgroundColor: tint }]} onPress={onContinue}>
          <Text style={styles.primaryText}>Tiếp tục</Text>
        </Pressable>
      </View>
    </ThemedModal>
  );
}

function ChecklistLine({ text, color }: { text: string; color: string }) {
  return (
    <View style={styles.line}>
      <View style={styles.badge}>
        <Ionicons name="checkmark-circle" size={18} color={color} />
      </View>
      <Text style={[styles.lineText, { color }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  hero: { alignItems: "center", marginTop: 8, marginBottom: 12 },
  title: { fontSize: 18, fontWeight: "700", textAlign: "center", lineHeight: 24 },
  line: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginTop: 10,
    backgroundColor: "rgba(142,142,147,0.12)", // mờ cho cả light/dark
  },
  badge: { width: 24, alignItems: "center", marginRight: 8 },
  lineText: { fontSize: 14, lineHeight: 20, flex: 1 },
  primaryBtn: {
    height: 46,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  primaryText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
