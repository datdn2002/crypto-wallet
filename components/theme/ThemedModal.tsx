import React, { ReactNode } from "react";
import { Dimensions, Modal, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";

const { width, height } = Dimensions.get("window");

interface AppModalProps {
	visible: boolean;
	onClose: () => void;
	children: ReactNode;
	heightPercent?: number; // mặc định 0.667 = 66.7%
	showCloseButton?: boolean;
	header?: ReactNode;
}

export function ThemedModal({
	visible,
	onClose,
	children,
	heightPercent = 0.667,
	showCloseButton = false,
	header
}: AppModalProps) {
	if (!visible) return null;
	return (
		<Modal visible={visible} animationType="slide" transparent>
			<SafeAreaView>
				<Pressable style={styles.overlay} onPress={onClose}>
					<Pressable onPress={() => { }}>
						<View style={[styles.modalContainer, { height: height * heightPercent }]}>
							{header}
							<View style={{ padding: 20 }}>
								{showCloseButton && (
									<Pressable style={styles.closeBtn} onPress={onClose}>
										<Text style={styles.closeText}>✕</Text>
									</Pressable>
								)}
								{children}
							</View>
						</View>
					</Pressable>
				</Pressable>
			</SafeAreaView>
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
