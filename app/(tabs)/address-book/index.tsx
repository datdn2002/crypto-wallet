// app/(wallet)/address-book.tsx
import { AppHeader } from "@/components/theme"; // ✅ import đúng
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function AddressBookScreen() {
  const router = useRouter();

  const bg = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const icon = useThemeColor({}, "icon");
  const tint = useThemeColor({}, "tint");

  const goAdd = () => router.push("/settings/address-book/add");

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
      <AppHeader title="Sổ địa chỉ" rightIcon="add" onRightIconPress={goAdd} />

      <View style={styles.emptyWrap}>
        <View style={styles.iconStack}>
          <Ionicons name="book-outline" size={90} color={tint} />
          <Ionicons
            name="person-circle-outline"
            size={46}
            color={tint}
            style={styles.personIcon}
          />
        </View>

        <Text style={[styles.caption, { color: icon }]}>
          Danh bạ của bạn và địa chỉ ví của họ sẽ xuất hiện tại đây
        </Text>

        <Pressable style={[styles.cta, { backgroundColor: tint }]} onPress={goAdd}>
          <Text style={[styles.ctaText, { color: bg }]}>Thêm địa chỉ ví</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  emptyWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  iconStack: {
    width: 140,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  personIcon: { position: "absolute", bottom: 6, right: 22 },
  caption: {
    textAlign: "center",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
    marginBottom: 18,
  },
  cta: {
    height: 44,
    paddingHorizontal: 20,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 220,
  },
  ctaText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
