import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AuthLandingScreen() {

    const goRegister = () => router.push('/(auth)/register')

    const goLogin = () => router.push('/(auth)/login')

    const goSupport = () => { }

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.container}>
                {/* Title */}
                <View style={styles.topSpace} />
                <Text style={styles.title}>Crypto Wallet</Text>

                {/* Buttons */}
                <View style={styles.btnGroup}>
                    <TouchableOpacity activeOpacity={0.9} style={styles.btnSecondary} onPress={goRegister}>
                        <Text style={styles.btnSecondaryText}>Đăng ký</Text>
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={0.9} style={styles.btnPrimary} onPress={goLogin}>
                        <Text style={styles.btnPrimaryText}>Đăng nhập</Text>
                    </TouchableOpacity>
                </View>

                {/* Footer Support */}
                <TouchableOpacity style={styles.support} onPress={goSupport} activeOpacity={0.8}>
                    <Ionicons name="headset-outline" size={18} color="#111827" style={{ marginRight: 6 }} />
                    <Text style={styles.supportText}>Hỗ trợ</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#FFFFFF' },
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    topSpace: { height: 60 }, // để giống khoảng cách trên hình
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#111827',
        textAlign: 'center',
        marginTop: 16,
    },
    btnGroup: {
        width: '100%',
        marginTop: 120,
        gap: 12,
    },
    btnSecondary: {
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E3ECFF', // xanh nhạt giống hình
    },
    btnSecondaryText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#3C78FF',
    },
    btnPrimary: {
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#3C78FF',
    },
    btnPrimaryText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    support: {
        position: 'absolute',
        bottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    supportText: {
        fontSize: 13,
        color: '#111827',
        fontWeight: '500',
    },
});
