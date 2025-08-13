import React from "react";
import { Dimensions, Image, Modal, Pressable, StyleSheet, Text, View } from "react-native";

const { width, height } = Dimensions.get("window");

interface CreateWalletModalProps {
  visible: boolean;
  onClose: () => void;
  onCreateNew?: () => void; // Callback khi chọn "Tạo ví mới"
  onAddExisting?: () => void; // Callback khi chọn "Thêm ví hiện có"
}

export function CreateWalletModal({ visible, onClose, onAddExisting, onCreateNew }: CreateWalletModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Nút đóng */}
          <Pressable style={styles.closeBtn} onPress={onClose}>
            <Text style={{ fontSize: 20 }}>✕</Text>
          </Pressable>

          {/* Icon ví */}
          <Image
            source={require("@/assets/images/wallet-img.png")} // ảnh ví của bạn
            style={styles.icon}
            resizeMode="contain"
          />

          {/* Nút tạo ví mới */}
          <Pressable style={styles.option} onPress={onCreateNew}>
            <Text style={styles.title}>Tạo ví mới</Text>
            <Text style={styles.subTitle}>Cụm từ bí mật hoặc FaceID/vân tay</Text>
          </Pressable>

          {/* Nút thêm ví hiện có */}
          <Pressable style={styles.option} onPress={onAddExisting}>
            <Text style={styles.title}>Thêm ví hiện có</Text>
            <Text style={styles.subTitle}>Cụm từ bí mật, Icloud hoặc chỉ xem</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContainer: {
    width: width,
    height: height * 0.667, // 66.7% chiều cao
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  closeBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
  icon: {
    width: 80,
    height: 80,
    marginVertical: 20,
  },
  option: {
    width: "100%",
    padding: 16,
    backgroundColor: "#e5e5e5",
    borderRadius: 8,
    marginVertical: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  subTitle: {
    fontSize: 14,
    color: "#555",
  },
});
