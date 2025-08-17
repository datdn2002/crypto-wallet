// app/(settings)/security.tsx
import { AppHeader } from "@/components/theme";
import { useThemeColor } from "@/hooks/useThemeColor";
import React, { useState } from "react";
import { Pressable, SafeAreaView, StyleSheet, Switch, Text, View } from "react-native";

export default function SecurityScreen() {
  const background = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icon");

  const [passcode, setPasscode] = useState(true);
  const [autoLock, setAutoLock] = useState(true);
  const [lockMethod, setLockMethod] = useState(true);
  const [txSign, setTxSign] = useState(true);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: background }]}>
      <AppHeader title="Bảo mật" />

      <SettingRow
        label="Mật mã"
        value={passcode}
        onValueChange={setPasscode}
        textColor={textColor}
      />

      <SettingRow
        label="Tự động khóa"
        sub="Ngay lập tức"
        value={autoLock}
        onValueChange={setAutoLock}
        textColor={textColor}
        iconColor={iconColor}
      />

      <SettingRow
        label="Phương thức khóa"
        sub="Mật khẩu/Face ID"
        value={lockMethod}
        onValueChange={setLockMethod}
        textColor={textColor}
        iconColor={iconColor}
      />

      <SettingRow
        label="Ký giao dịch"
        value={txSign}
        onValueChange={setTxSign}
        textColor={textColor}
      />
    </SafeAreaView>
  );
}

function SettingRow({
  label,
  sub,
  value,
  onValueChange,
  textColor,
  iconColor,
}: {
  label: string;
  sub?: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
  textColor: string;
  iconColor?: string;
}) {
  return (
    <Pressable style={styles.row} onPress={() => onValueChange(!value)}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.label, { color: textColor }]}>{label}</Text>
        {sub ? <Text style={[styles.sub, { color: iconColor }]}>{sub}</Text> : null}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        thumbColor={value ? "#fff" : "#f4f3f4"}
        trackColor={{ false: "#767577", true: "#34C759" }}
      />
    </Pressable>
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
  sub: { fontSize: 13, marginTop: 2 },
});
