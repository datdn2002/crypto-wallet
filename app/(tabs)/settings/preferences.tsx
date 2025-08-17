// app/(settings)/preferences.tsx
import { AppHeader } from "@/components/theme";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function PreferencesScreen() {
  const router = useRouter();
  const background = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icon");

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: background }]}>
      <AppHeader title="Ưa thích" />

      <ListItem
        label="Loại tiền tệ"
        onPress={() => { }}
        textColor={textColor}
        iconColor={iconColor}
      />
      <Separator color={iconColor} />

      <ListItem
        label="Ngôn ngữ ứng dụng"
        onPress={() => { }}
        textColor={textColor}
        iconColor={iconColor}
      />
      <Separator color={iconColor} />

      <ListItem
        label="Trình duyệt DApp"
        onPress={() => { }}
        textColor={textColor}
        iconColor={iconColor}
      />
      <Separator color={iconColor} />

      <ListItem
        label="Cài đặt Node"
        onPress={() => { }}
        textColor={textColor}
        iconColor={iconColor}
      />
    </SafeAreaView>
  );
}

function ListItem({
  label,
  onPress,
  textColor,
  iconColor,
}: {
  label: string;
  onPress: () => void;
  textColor: string;
  iconColor: string;
}) {
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color={iconColor} />
    </Pressable>
  );
}

function Separator({ color }: { color: string }) {
  return <View style={[styles.sep, { backgroundColor: color, opacity: 0.25 }]} />;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  row: {
    height: 48,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: { fontSize: 16, fontWeight: "500" },
  sep: { height: StyleSheet.hairlineWidth, marginLeft: 16 },
});
