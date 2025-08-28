import { deferOneFrame } from "@/utils";
import React, { useEffect, useRef, useState } from "react";
import { Dimensions, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { ThemedModal } from "../theme";
import { DotLoading } from "../ui";

const { width, height } = Dimensions.get("window");

interface CreateWalletModalProps {
	visible: boolean;
	onClose: () => void;
	onCreateNew: () => Promise<void>;
	onAddExisting: () => void;
}

export function CreateWalletModal({ visible, onClose, onAddExisting, onCreateNew }: CreateWalletModalProps) {
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
		if (creatingRef.current) return;
		creatingRef.current = true;
		setLoading(true);

		try {
			await deferOneFrame(); // 👈 nhường 1 frame cho spinner
			await onCreateNew(); // ⛏️ việc nặng chạy ở đây
		} catch (e) {
			console.error("Error creating wallet:", e);
		} finally {
			creatingRef.current = false;
			setLoading(false);
		}
	};

	return (
		<ThemedModal visible={visible} onClose={onClose} heightPercent={0.5}>
			{/* Icon ví */}
			<View style={{ justifyContent: "center", alignItems: "center" }}>
				<Image source={require("@/assets/images/wallet-img.png")} style={styles.icon} resizeMode="contain" />
			</View>

			{/* Nút tạo ví mới */}
			<Pressable style={styles.option} onPress={handlePress}>
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
