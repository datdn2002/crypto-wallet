import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface Props {
  size?: number,
  time?: number,
  onComplete?: () => Promise<void>,
  disabled?: boolean,
}
export function CountdownCircle({ size = 16, time = 15, onComplete = async () => { }, disabled = false }: Props) {
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const progress = useSharedValue(0);

  const start = async () => {
    progress.value = 0;
    progress.value = withTiming(
      1,
      {
        duration: time * 1000,
        easing: Easing.linear,
      },
      (finished) => {
        if (finished && onComplete) {
          onComplete().then(() => {
            runOnJS(start)();
          });
        }
      }
    );
  }
  useEffect(() => {
    if (!disabled) start();
  }, [progress, time, onComplete, disabled]);


  // Ban đầu full (offset = 0), sau 60s offset = circumference (mất dần)
  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: progress.value * circumference,
  }));

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        {/* vòng nền xám */}
        <Circle
          stroke="#e5e7eb"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        {/* vòng animated giảm dần */}
        <AnimatedCircle
          stroke="#4CAF50"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
});
