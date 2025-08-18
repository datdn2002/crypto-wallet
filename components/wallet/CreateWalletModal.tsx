import React, { useState } from "react";
import { Dimensions, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { ThemedModal } from "../theme";
import { DotLoading } from "../ui";

const { width, height } = Dimensions.get("window");

interface CreateWalletModalProps {
	visible: boolean;
	onClose: () => void;
	onCreateNew: () => Promise<void>; // Callback khi chọn "Tạo ví mới"
	onAddExisting: () => void; // Callback khi chọn "Thêm ví hiện có"
}

export function CreateWalletModal({ visible, onClose, onAddExisting, onCreateNew }: CreateWalletModalProps) {
	const [loading, setLoading] = useState(false);
	return (
		<ThemedModal visible={visible} onClose={onClose} heightPercent={0.5}>
			{/* Icon ví */}
			<View style={{ justifyContent: "center", alignItems: "center" }}>
				<Image
					source={require("@/assets/images/wallet-img.png")} // ảnh ví của bạn
					style={styles.icon}
					resizeMode="contain"
				/>
			</View>

			{/* Nút tạo ví mới */}
			<Pressable
				style={styles.option}
				onPress={async () => {
					setLoading(true);
					await onCreateNew();
					setLoading(false);
				}}
			>
				<Text style={styles.title}>Tạo ví mới</Text>
				<Text style={styles.subTitle}>Cụm từ bí mật hoặc FaceID/vân tay</Text>
			</Pressable>

			{/* Nút thêm ví hiện có */}
			<Pressable style={styles.option} onPress={onAddExisting}>
				<Text style={styles.title}>Thêm ví hiện có</Text>
				<Text style={styles.subTitle}>Cụm từ bí mật, Icloud hoặc chỉ xem</Text>
			</Pressable>
			<DotLoading visible={loading} />
		</ThemedModal>
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
