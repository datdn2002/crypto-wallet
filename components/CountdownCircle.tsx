import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

interface Props {
	size?: number;
	time?: number;
	onComplete?: () => Promise<void>;
	disabled?: boolean;
}

export function CountdownCircle({ size = 16, time = 15, onComplete = async () => {}, disabled = false }: Props) {
	const strokeWidth = 3;
	const radius = (size - strokeWidth) / 2;
	const circumference = 2 * Math.PI * radius;

	const progress = useRef(new Animated.Value(0)).current;

	const start = async () => {
		progress.setValue(0);
		Animated.timing(progress, {
			toValue: 1,
			duration: time * 1000,
			easing: Easing.linear,
			useNativeDriver: true,
		}).start(async ({ finished }) => {
			if (finished && onComplete) {
				await onComplete();
				start(); // lặp lại sau khi xong
			}
		});
	};

	useEffect(() => {
		if (!disabled) start();
	}, [disabled, time]);

	const strokeDashoffset = progress.interpolate({
		inputRange: [0, 1],
		outputRange: [0, circumference],
	});

	return (
		<View style={styles.container}>
			<Svg width={size} height={size}>
				{/* vòng nền xám */}
				<Circle stroke="#e5e7eb" fill="none" cx={size / 2} cy={size / 2} r={radius} strokeWidth={strokeWidth} />
				{/* vòng tiến trình */}
				<AnimatedCircle
					stroke="#4CAF50"
					fill="none"
					cx={size / 2}
					cy={size / 2}
					r={radius}
					strokeWidth={strokeWidth}
					strokeDasharray={circumference}
					strokeDashoffset={strokeDashoffset}
					strokeLinecap="round"
				/>
			</Svg>
		</View>
	);
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const styles = StyleSheet.create({
	container: {
		justifyContent: "center",
		alignItems: "center",
	},
});
