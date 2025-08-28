import React, { ReactNode } from "react";
import { Dimensions, Modal, Pressable, StyleSheet, Text, View } from "react-native";

const { width, height } = Dimensions.get("window");

interface AppModalProps {
	visible: boolean;
	onClose: () => void;
	children: ReactNode;
	heightPercent?: number; // mặc định 0.667 = 66.7%
	showCloseButton?: boolean;
}

export function ThemedModal({
	visible,
	onClose,
	children,
	heightPercent = 0.667,
	showCloseButton = false,
}: AppModalProps) {
	return (
		<Modal visible={visible} animationType="slide" transparent>
			<Pressable style={styles.overlay} onPress={onClose}>
				<Pressable onPress={() => { }}>
					<View style={[styles.modalContainer, { height: height * heightPercent }]}>
						{showCloseButton && (
							<Pressable style={styles.closeBtn} onPress={onClose}>
								<Text style={styles.closeText}>✕</Text>
							</Pressable>
						)}
						{children}
					</View>
				</Pressable>
			</Pressable>
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
		backgroundColor: "#fff",
		borderTopLeftRadius: 16,
		borderTopRightRadius: 16,
		padding: 20,
	},
	closeBtn: {
		position: "absolute",
		top: 10,
		right: 10,
		zIndex: 1,
	},
	closeText: {
		fontSize: 20,
		padding: 8,
	},
});
