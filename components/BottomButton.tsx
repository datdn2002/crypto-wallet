import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import Animated, {
  useAnimatedKeyboard,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface BottomButtonProps {
  label: string;
  onPress: () => void;
}

export function BottomButton({ label, onPress }: BottomButtonProps) {
  const insets = useSafeAreaInsets();
  const keyboard = useAnimatedKeyboard();

  // Animate nút chạy lên khi mở bàn phím
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: withTiming(-keyboard.height.value, { duration: 180 }) },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        styles.container,
        animatedStyle,
        { paddingBottom: (insets.bottom || 12) },
      ]}
    >
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.label}>{label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "fixed",
    left: 0,
    right: 0,
    bottom: 8,
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  button: {
    backgroundColor: "#4CAF50",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  label: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
