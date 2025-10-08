import React, { ReactNode } from "react";
import { Dimensions, KeyboardAvoidingView, Modal, Platform, Pressable, SafeAreaView, StyleSheet, View } from "react-native";

const { height } = Dimensions.get("window");

interface AppModalProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  heightPercent?: number; // 0..1
  showCloseButton?: boolean;
  header?: ReactNode;
}

export function ThemedModal2({
  visible,
  onClose,
  children,
  heightPercent = 0.9,
  showCloseButton = false,
  header,
}: AppModalProps) {
  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      {/* Overlay */}
      <Pressable style={styles.overlay} onPress={onClose} />

      {/* Bottom Sheet */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={[styles.sheet, { height: height * heightPercent }]}
      >
        <SafeAreaView style={styles.safe}>
          {header}
          {/* Không ScrollView ở đây — để children (FlatList) tự cuộn */}
          <View style={styles.content}>
            {children}
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0, right: 0,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  safe: { flex: 1 },
  content: { flex: 1 },
});
