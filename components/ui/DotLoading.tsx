// components/DotLoadingOverlay.tsx
import React, { useEffect, useRef } from "react";
import { Animated, Modal, StyleSheet, View } from "react-native";

interface Props {
	visible: boolean;
}

export const DotLoading = ({ visible = true }: Props) => {
	const dot1 = useRef(new Animated.Value(0)).current;
	const dot2 = useRef(new Animated.Value(0)).current;
	const dot3 = useRef(new Animated.Value(0)).current;

	const animate = (anim: Animated.Value, delay: number) => {
		return Animated.loop(
			Animated.sequence([
				Animated.timing(anim, {
					toValue: 1,
					duration: 300,
					useNativeDriver: true,
					delay,
				}),
				Animated.timing(anim, {
					toValue: 0,
					duration: 300,
					useNativeDriver: true,
				}),
			])
		);
	};

	useEffect(() => {
		animate(dot1, 0).start();
		animate(dot2, 150).start();
		animate(dot3, 300).start();
	}, []);

	return (
		<Modal transparent visible={visible} animationType="fade">
			<View style={styles.backdrop}>
				<View style={styles.row}>
					<Animated.Text style={[styles.dot, { opacity: dot1 }]}>.</Animated.Text>
					<Animated.Text style={[styles.dot, { opacity: dot2 }]}>.</Animated.Text>
					<Animated.Text style={[styles.dot, { opacity: dot3 }]}>.</Animated.Text>
				</View>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	backdrop: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.3)", // nền mờ, giống overlay
		justifyContent: "center",
		alignItems: "center",
	},
	row: { flexDirection: "row" },
	dot: {
		fontSize: 40,
		color: "#fff",
		marginHorizontal: 2,
		fontWeight: "bold",
	},
});
