import { AppHeader } from "@/components/theme";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";

export default function AddressBookAddScreen() {
  const router = useRouter();
  const bg = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const icon = useThemeColor({}, "icon");
  const tint = useThemeColor({}, "tint");

  const [name, setName] = useState("");

  const valid = useMemo(() => name.trim().length > 0, [name]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
      <AppHeader
        title="Địa chỉ ví"
        rightIcon={valid ? "checkmark" : undefined}
        onRightIconPress={() => {
          if (valid) router.back();
        }}
      />

      <View style={{ paddingHorizontal: 16, paddingTop: 10 }}>
        <Text style={[styles.label, { color: text }]}>Tên</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Nhập tên ví"
          placeholderTextColor={icon}
          style={[
            styles.input,
            { color: text, borderColor: "#C7C7CC", backgroundColor: bg },
          ]}
        />

        <Pressable
          onPress={() => router.push({ pathname: "/(tabs)/settings/address-book/select-asset", params: { name } })}
          style={styles.addRow}
        >
          <Ionicons name="add-circle-outline" size={22} color={tint} />
          <View style={{ marginLeft: 10 }}>
            <Text style={[styles.addTitle, { color: text }]}>Thêm địa chỉ</Text>
            <Text style={[styles.addSub, { color: icon }]}>
              Chọn một tài sản và thêm địa chỉ tương ứng
            </Text>
          </View>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 6 },
  input: {
    height: 44,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  addRow: { flexDirection: "row", alignItems: "center", paddingVertical: 8 },
  addTitle: { fontSize: 16, fontWeight: "600" },
  addSub: { fontSize: 13, marginTop: 2 },
});
