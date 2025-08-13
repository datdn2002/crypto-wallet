// components/FullscreenModal.tsx
import { Ionicons } from '@expo/vector-icons';
import React, { useRef } from 'react';
import {
	Animated,
	Dimensions,
	Modal,
	PanResponder,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';

const height = Dimensions.get('window').height - 20;

interface Props {
	visible: boolean;
	onClose: () => void;
	children?: React.ReactNode;
	label: string;
}

export const MaxModal: React.FC<Props> = ({ visible, onClose, children, label }) => {
	const panY = useRef(new Animated.Value(height)).current;

	const resetPosition = Animated.timing(panY, {
		toValue: 0,
		duration: 300,
		useNativeDriver: true,
	});

	const closeModal = Animated.timing(panY, {
		toValue: height,
		duration: 300,
		useNativeDriver: true,
	});

	const panResponder = useRef(
		PanResponder.create({
			onMoveShouldSetPanResponder: (_, gestureState) =>
				Math.abs(gestureState.dy) > 5,
			onPanResponderMove: (_, gestureState) => {
				if (gestureState.dy > 0) {
					panY.setValue(gestureState.dy);
				}
			},
			onPanResponderRelease: (_, gestureState) => {
				if (gestureState.dy > 150) {
					closeModal.start(() => onClose());
				} else {
					resetPosition.start();
				}
			},
		})
	).current;

	React.useEffect(() => {
		if (visible) {
			resetPosition.start();
		}
	}, [visible]);

	return (
		<Modal
			animationType="none"
			transparent
			visible={visible}
			onRequestClose={onClose}
		>
			<View style={styles.backdrop}>
				<TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose} />
				<Animated.View
					style={[styles.modal, { transform: [{ translateY: panY }] }]}
					{...panResponder.panHandlers}
				>
					<View style={styles.header}>
						{/* Nút đóng */}
						<TouchableOpacity onPress={onClose} hitSlop={10} style={styles.iconBtn}>
							<Ionicons name="close" size={22} color="#e6e6e6" />
						</TouchableOpacity>

						{/* Tiêu đề */}
						<Text style={styles.headerTitle}>Ví</Text>

						{/* Icon bên phải */}
						<View style={styles.rightIcons}>
							<TouchableOpacity hitSlop={10} style={styles.iconBtn}>
								<Ionicons name="settings-outline" size={20} color="#cfcfcf" />
							</TouchableOpacity>
						</View>
					</View>
					<View style={styles.content}>{children}</View>
				</Animated.View>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	backdrop: {
		flex: 1,
		backgroundColor: '#000000',
		justifyContent: 'flex-end',
	},
	overlay: {
		position: 'absolute',
		top: 20, left: 0, right: 0, bottom: 0,
	},
	modal: {
		height: height,
		backgroundColor: '#fff',
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		overflow: 'hidden',
	},
	closeText: {
		fontSize: 16,
		color: '#007AFF',
	},
	content: {
		flex: 1,
		padding: 16,
	},
	header: {
		backgroundColor: "#0f0f10",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 12,
		paddingVertical: 10,
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
	},
	headerTitle: {
		color: "#eaeaea",
		fontSize: 18,
		fontWeight: "700",
	},
	rightIcons: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	iconBtn: {
		padding: 6,
		borderRadius: 999,
	},
});
