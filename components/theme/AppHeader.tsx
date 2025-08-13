import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface AppHeaderProps {
    title?: string;
    rightIcon?: keyof typeof Ionicons.glyphMap;
    onRightIconPress?: () => void;
}

export function AppHeader({ title, rightIcon, onRightIconPress }: AppHeaderProps) {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Pressable onPress={router.back} style={styles.iconWrapper}>
                <Ionicons name="arrow-back" size={24} color="black" />
            </Pressable>

            <Text style={styles.title}>{title}</Text>

            {rightIcon ? (
                <Pressable onPress={onRightIconPress} style={styles.iconWrapper}>
                    <Ionicons name={rightIcon} size={22} color="black" />
                </Pressable>
            ) : (
                <View style={styles.iconWrapper} />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        backgroundColor: '#fff',
    },
    iconWrapper: {
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
    },
});
