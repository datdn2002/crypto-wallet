// app/(settings)/price-alert.tsx
import { AppHeader } from "@/components/theme";
import { useThemeColor } from "@/hooks/useThemeColor";
import React, { useState } from "react";
import { SafeAreaView, StyleSheet, Switch, Text, View } from "react-native";

export default function PriceAlertScreen() {
  const background = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icon");

  const [enabled, setEnabled] = useState(false);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: background }]}>
      <AppHeader title="Cảnh báo giá" />

      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: textColor }]}>Cảnh báo giá</Text>
          <Text style={[styles.desc, { color: iconColor }]}>
            Nhận thông báo khi những coin bạn yêu thích có thay đổi về giá
          </Text>
        </View>

        <Switch
          value={enabled}
          onValueChange={setEnabled}
          thumbColor={enabled ? "#fff" : "#f4f3f4"}
          trackColor={{ false: "#767577", true: "#34C759" }} // xanh iOS
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  desc: {
    fontSize: 13,
    marginTop: 4,
  },
});
