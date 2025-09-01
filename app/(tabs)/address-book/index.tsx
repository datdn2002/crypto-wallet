// app/(wallet)/address-book.tsx
import { deleteAddressBookApi } from "@/api/addressBook";
import { ConfirmModal } from "@/components/ConfirmModal";
import { AppHeader } from "@/components/theme"; // ✅ import đúng
import { useThemeColor } from "@/hooks/useThemeColor";
import { useAuthStore } from "@/store/auth";
import { useWalletStore } from "@/store/wallet";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { FlatList, Pressable, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";

export default function AddressBookScreen() {
  const router = useRouter();
  const { addressBooks } = useWalletStore();
  const { access_token } = useAuthStore();
  const [deteleAddressIndex, setDeleteAddressIndex] = useState<number | null>(null);

  const bg = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const icon = useThemeColor({}, "icon");
  const tint = useThemeColor({}, "tint");

  const goAdd = () => router.push("/(tabs)/address-book/add");

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
      <AppHeader title="Sổ địa chỉ" rightIcon="add" onRightIconPress={goAdd} />
      {
        addressBooks.length > 0 ? <FlatList
          data={addressBooks}
          keyExtractor={(item) => "address-" + item.note + item.address}
          renderItem={({ item, index }) => {
            return (
              <View style={{ backgroundColor: tint + "20", borderRadius: 8, margin: 12, padding: 12, gap: 4, justifyContent: "space-between", flexDirection: "row", alignItems: "center" }}>
                <View>
                  <Text style={{ fontSize: 16, fontWeight: "500", color: text }}>{item.note || "No name"}</Text>
                  <Text style={{ fontSize: 14, color: icon, marginTop: 2 }}>{item.address}</Text>
                </View>
                <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", gap: 6 }} onPress={() => setDeleteAddressIndex(index)}>
                  <Ionicons name="trash-outline" size={20} color={tint} />
                </TouchableOpacity>
              </View>
            );
          }}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          contentContainerStyle={{ paddingVertical: 8, paddingBottom: 32 }}
        /> :
          <View style={styles.emptyWrap}>
            <View style={styles.iconStack}>
              <MaterialIcons name="perm-contact-cal" size={93} color={tint} />
            </View>

            <Text style={[styles.caption, { color: icon }]}>
              Danh bạ của bạn và địa chỉ ví của họ sẽ xuất hiện tại đây
            </Text>

            <Pressable style={[styles.cta, { backgroundColor: tint }]} onPress={goAdd}>
              <Text style={[styles.ctaText, { color: bg }]}>Thêm địa chỉ ví</Text>
            </Pressable>
          </View>
      }

      <ConfirmModal
        message="Xóa xong không thể khôi phục. Bạn có chắc chắn xóa không?"
        onCancel={() => setDeleteAddressIndex(null)}
        show={deteleAddressIndex !== null}
        onConfirm={async () => {
          try {
            Toast.show({ text1: "Đang xóa...", type: "info" })
            if (deteleAddressIndex === null || !access_token) {
              Toast.show({ text1: "Lỗi không xác định! Vui lòng thử lại.", type: "info" })
              return;
            }
            const id = addressBooks[deteleAddressIndex]?.id;
            if (!id) {
              Toast.show({ text1: "Lỗi không xác định! Vui lòng thử lại.", type: "info" })
              return;
            }
            setDeleteAddressIndex(null);
            const res = await deleteAddressBookApi(access_token, id)
            addressBooks.splice(deteleAddressIndex, 1);
            useWalletStore.setState({ addressBooks: [...addressBooks] });
            Toast.show({ text1: "Xóa thành công", type: "success" })
          } catch (error) {
            Toast.show({ text1: "Xóa thất bại", type: "error" })
          }
        }}
      />
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
