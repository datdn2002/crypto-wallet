import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import {
    Pressable,
    StyleSheet,
    Text,
    View
} from "react-native";

interface AppHeaderProps {
    title?: string;
    rightIcon?: keyof typeof Ionicons.glyphMap;
    onRightIconPress?: () => void;
}

export function AppHeader({ title, rightIcon, onRightIconPress }: AppHeaderProps) {
    const router = useRouter();

    // màu theo theme
    const bg = useThemeColor({}, "background");
    const text = useThemeColor({}, "text");
    const border = useThemeColor({}, "border");

    const styles = useMemo(
        () =>
            StyleSheet.create({
                container: {
                    height: 56,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingHorizontal: 12,
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderBottomColor: border,
                    backgroundColor: bg,
                },
                iconWrapper: {
                    width: 36,
                    height: 36,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 18,
                },
                title: {
                    fontSize: 16,
                    fontWeight: "600",
                    color: text,
                },
            }),
        [bg, text, border]
    );

    const hitSlop = { top: 8, bottom: 8, left: 8, right: 8 };

    return (
        <View style={styles.container}>
            <Pressable
                onPress={router.back}
                style={styles.iconWrapper}
                hitSlop={hitSlop}
                android_ripple={{ color: border, radius: 22 }}
            >
                <Ionicons name="arrow-back" size={24} color={text} />
            </Pressable>

            <Text numberOfLines={1} style={styles.title}>
                {title}
            </Text>

            {rightIcon ? (
                <Pressable
                    onPress={onRightIconPress}
                    style={styles.iconWrapper}
                    hitSlop={hitSlop}
                    android_ripple={{ color: border, radius: 22 }}
                >
                    <Ionicons name={rightIcon} size={22} color={text} />
                </Pressable>
            ) : (
                <View style={styles.iconWrapper} />
            )}
        </View>
    );
}
