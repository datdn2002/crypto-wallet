// app/(profile)/username.tsx
import { AppHeader, ThemedModal } from "@/components/theme"; // ✅ như bạn yêu cầu
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function UsernameScreen() {
  const bg = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const icon = useThemeColor({}, "icon");
  const tint = useThemeColor({}, "tint");

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  // hợp lệ: 1–36 ký tự, A–Z a–z 0–9 hoặc '-', không bắt đầu/kết thúc bằng '-'
  const isValid = useMemo(() => {
    if (!value) return false;
    if (value.length > 36) return false;
    const re = /^(?!-)[A-Za-z0-9-]{1,36}(?<!-)$/;
    return re.test(value);
  }, [value]);

  const onSubmit = () => {
    if (!isValid) return;
    // TODO: call API tạo username
    setOpen(false);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
      {/* Màn TRÁI giữ nguyên cấu trúc: AppHeader + empty state */}
      <AppHeader title="Tên người dùng" />

      <View style={styles.emptyWrap}>
        <Ionicons name="laptop-outline" size={96} color={tint} />
        <Text style={[styles.title, { color: text, marginTop: 16 }]}>
          Chưa tạo tên người dùng nào
        </Text>
        <Text style={[styles.caption, { color: icon }]}>
          Tên người dùng của bạn sẽ xuất hiện tại đây
        </Text>

        <Pressable style={[styles.cta, { backgroundColor: tint }]} onPress={() => setOpen(true)}>
          <Text style={styles.ctaText}>Đăng ký tên người dùng</Text>
        </Pressable>
      </View>

      {/* Màn PHẢI chuyển thành modal */}
      <ThemedModal visible={open} onClose={() => setOpen(false)}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={[styles.modalBody, { backgroundColor: bg }]}
        >
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: text }]}>Đăng ký tên người dùng</Text>
          </View>

          <View style={styles.fieldBlock}>
            <Text style={[styles.label, { color: text }]}>Tên người dùng của bạn</Text>
            <TextInput
              value={value}
              onChangeText={setValue}
              placeholder="Nhập tên người dùng của bạn"
              placeholderTextColor={icon}
              style={[
                styles.input,
                {
                  borderColor: isValid || value.length === 0 ? "#C7C7CC" : "#FF3B30",
                  color: text,
                },
              ]}
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={36}
            />
          </View>

          <View style={[styles.rules, { borderColor: "#E5E5EA", backgroundColor: bg }]}>
            <Text style={[styles.rule, { color: icon }]}>• Tối đa 36 ký tự</Text>
            <Text style={[styles.rule, { color: icon }]}>• Ký tự được chấp nhận A–Z & 0–9</Text>
            <Text style={[styles.rule, { color: icon }]}>
              • Không được bắt đầu hoặc kết thúc bằng dấu gạch ngang
            </Text>
          </View>

          <Pressable
            onPress={onSubmit}
            disabled={!isValid}
            style={[
              styles.primaryBtn,
              { backgroundColor: isValid ? tint : "#A6A6AA" },
            ]}
          >
            <Text style={styles.primaryBtnText}>Xác nhận</Text>
          </Pressable>
        </KeyboardAvoidingView>
      </ThemedModal>
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
  title: { fontSize: 16, fontWeight: "600" },
  caption: { fontSize: 14, textAlign: "center", marginTop: 6, marginBottom: 18, lineHeight: 20 },
  cta: {
    height: 44,
    paddingHorizontal: 20,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 220,
  },
  ctaText: { color: "#fff", fontSize: 16, fontWeight: "600" },

  // modal content
  modalBody: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  modalTitle: { fontSize: 18, fontWeight: "700" },
  fieldBlock: { marginTop: 8 },
  label: { fontSize: 14, marginBottom: 6, fontWeight: "600" },
  input: {
    height: 44,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 15,
  },
  rules: {
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
  },
  rule: { fontSize: 13, lineHeight: 18 },
  primaryBtn: {
    height: 44,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
  },
  primaryBtnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
