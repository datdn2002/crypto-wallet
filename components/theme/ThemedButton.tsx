import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';

type Variant = 'primary' | 'secondary';

interface ThemedButtonProps {
    label: string;
    onPress: () => void;
    variant?: Variant;
    fullWidth?: boolean;
    disabled?: boolean;
    style?: ViewStyle;
}

export function ThemedButton({
    label,
    onPress,
    variant = 'primary',
    fullWidth = true,
    disabled = false,
    style,
}: ThemedButtonProps) {
    const variantStyle =
        variant === 'primary'
            ? { backgroundColor: '#3C78FF', textColor: '#FFFFFF' }
            : { backgroundColor: '#E3ECFF', textColor: '#3C78FF' };

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={onPress}
            style={[
                styles.button,
                { backgroundColor: variantStyle.backgroundColor },
                fullWidth && { alignSelf: 'stretch' },
                disabled && styles.disabled,
                style,
            ]}
            disabled={disabled}
        >
            <Text style={[styles.label, { color: variantStyle.textColor }]}>
                {label}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
    },
    disabled: {
        opacity: 0.5,
    },
});
