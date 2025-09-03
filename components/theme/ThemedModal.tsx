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
	header,
}: AppModalProps) {
	if (!visible) return null;
	if (heightPercent === 1) {
		return (
			<Modal visible={visible} animationType="slide" transparent>
				<SafeAreaView>
					<Pressable style={styles.overlay} onPress={onClose}>
						<Pressable onPress={() => { }}>
							<View>
								{header}
								<View style={[styles.modalContainer, { height: height * heightPercent }, header ? null : styles.borderTop]}>
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
		)
	}
	return (
		<Modal visible={visible} animationType="slide" transparent>
			<Pressable style={styles.overlay} onPress={onClose}>
				<Pressable onPress={() => { }}>
					<View>
						{header}
						<View style={[styles.modalContainer, { height: height * heightPercent }, header ? null : styles.borderTop]}>
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
		</Modal>
	);
}

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		justifyContent: "flex-end",
		backgroundColor: "rgba(0,0,0,0.4)",
	},
	borderTop: {
		borderTopLeftRadius: 16,
		borderTopRightRadius: 16,
	},
	modalContainer: {
		width: width,
		backgroundColor: "#fff",
		padding: 16,
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
