// components/wallet/ImportWalletModal.tsx
import { useThemeColor } from "@/hooks/useThemeColor";
import { deferOneFrame } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { ThemedModal } from "../theme";
import { DotLoading } from "../ui";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (params: { label: string; mnemonic: string }) => void;
  title?: string; // ví dụ: "Nhập Bitcoin"
};

export function ImportWalletModal({
  visible,
  onClose,
  onSubmit,
  title = "Nhập Bitcoin",
}: Props) {
  const bg = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const icon = useThemeColor({}, "icon");
  const tint = useThemeColor({}, "tint");
  const [label, setLabel] = useState("");
  const [mnemonic, setMnemonic] = useState("");
  const [loading, setLoading] = useState(false);
  const creatingRef = useRef(false);
  useEffect(() => {
    if (loading) {
      setTimeout(() => {
        setLoading(false);
      }, 5000);
    }
  }, [loading]);

  const handlePress = async () => {
    if (creatingRef.current) return; // chống double-tap
    creatingRef.current = true;
    setLoading(true);
    // InteractionManager.runAfterInteractions(async () => {
    try {
      await deferOneFrame();
      await onSubmit({ label: label.trim(), mnemonic: mnemonic.trim() });
    } catch (e) {
      console.error("Error creating wallet:", e);
    } finally {
      creatingRef.current = false;
      setLoading(false);
    }
    // });
  };

  // Validate cơ bản: 12–24 từ, cách nhau bởi dấu cách
  const valid = useMemo(() => {
    const words = mnemonic
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    return words.length >= 12 && words.length <= 24 && label.trim();
  }, [mnemonic, label]);

  return (
    <ThemedModal visible={visible} onClose={onClose}>
      <View style={[styles.container, { backgroundColor: bg }]}>
        <View style={styles.headerRow}>
          <Text style={[styles.headerTitle, { color: text }]}>{title}</Text>
        </View>

        {/* Tên của ví */}
        <Text style={[styles.label, { color: text }]}>Tên của ví</Text>
        <View style={[styles.inputRow, { borderColor: "#C7C7CC" }]}>
          <TextInput
            value={label}
            onChangeText={setLabel}
            placeholder="Ví của tôi"
            placeholderTextColor={icon}
            style={[styles.input, { color: text }]}
          />
          {label ? (
            <Pressable onPress={() => setLabel("")} hitSlop={8}>
              <Ionicons name="close-circle" size={18} color={icon} />
            </Pressable>
          ) : null}
        </View>

        {/* Cụm từ bí mật */}
        <Text style={[styles.label, { color: text, marginTop: 14 }]}>Cụm từ bí mật</Text>
        <View style={[styles.mnemonicBox, { borderColor: "#C7C7CC" }]}>
          <TextInput
            value={mnemonic}
            onChangeText={setMnemonic}
            placeholder="Thường là 12 từ được phân tách bằng dấu cách"
            placeholderTextColor={icon}
            style={[styles.mnemonicInput, { color: text }]}
            multiline
            textAlignVertical="top"
            autoCorrect={false}
            autoCapitalize="none"
          />
        </View>
        <Text style={[styles.helper, { color: icon }]}>
          Thường là 12 từ được phân tách bằng dấu cách
        </Text>

        <Pressable
          disabled={!valid}
          onPress={handlePress}
          style={[
            styles.primaryBtn,
            { backgroundColor: valid ? tint : "#A6A6AA" },
          ]}
        >
          <Text style={styles.primaryText}>Khôi phục ví</Text>
        </Pressable>
      </View>
      <DotLoading visible={loading} />
    </ThemedModal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  headerTitle: { fontSize: 18, fontWeight: "700" },
  label: { fontSize: 14, fontWeight: "600", marginTop: 8, marginBottom: 6 },
  inputRow: {
    height: 44,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  input: { flex: 1, fontSize: 15, paddingRight: 8 },
  mnemonicBox: {
    borderWidth: 1,
    borderRadius: 10,
    height: 150,
    padding: 12,
  },
  mnemonicInput: { flex: 1, fontSize: 15, lineHeight: 22 },
  helper: { fontSize: 12, marginTop: 6 },
  primaryBtn: {
    height: 46,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  primaryText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
