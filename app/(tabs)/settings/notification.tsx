// app/(settings)/notification.tsx
import { AppHeader } from "@/components/theme";
import { useThemeColor } from "@/hooks/useThemeColor";
import React, { useState } from "react";
import { Pressable, SafeAreaView, StyleSheet, Switch, Text } from "react-native";

export default function NotificationScreen() {
  const background = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");

  const [enabled, setEnabled] = useState(false);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: background }]}>
      <AppHeader title="Thông báo" />

      <Pressable style={styles.row} onPress={() => setEnabled(!enabled)}>
        <Text style={[styles.label, { color: textColor }]}>Cho phép thông báo đẩy</Text>
        <Switch
          value={enabled}
          onValueChange={setEnabled}
          thumbColor={enabled ? "#fff" : "#f4f3f4"}
          trackColor={{ false: "#767577", true: "#34C759" }}
        />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  label: { fontSize: 16, fontWeight: "500" },
});
