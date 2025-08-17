import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    View,
} from 'react-native';

export default function EarnScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <Ionicons name="arrow-back" size={22} color={theme.text} />
                <Text style={[styles.title, { color: theme.text }]}>Earn</Text>
                <View style={{ width: 22 }} />
            </View>

            {/* Tabs */}
            <View style={styles.tabs}>
                <Text style={[styles.tab, styles.activeTab, { color: theme.tint }]}>Earn Station</Text>
                <Text style={[styles.tab, { color: theme.text }]}>Thu nhập của tôi</Text>
            </View>

            {/* Banner */}
            <TouchableOpacity style={[styles.bannerBox, { backgroundColor: theme.background }]}>
                <Image
                    source={require('@/assets/images/icon.png')}
                    style={styles.bannerIcon}
                />
                <Text style={[styles.bannerText, { color: theme.text }]}>Kiếm thêm thu nhập thụ động từ việc để coin của bạn tự động sinh lời</Text>
                <Ionicons name="chevron-forward" size={18} color={theme.icon} />
            </TouchableOpacity>

            {/* Stablecoin Earn */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Stablecoin Earn</Text>
                <Text style={[styles.sectionDesc, { color: theme.text }]}>Earn stablecoin with flexibility and low risk</Text>

                <View style={styles.estimateRow}>
                    <Text style={[styles.estimateLabel, { color: theme.text }]}>Tổng giá trị ước tính</Text>
                    <Ionicons name="eye" size={16} color={theme.icon} />
                </View>

                <Text style={[styles.estimateValue, { color: theme.text }]}>100,0 <Text style={styles.usdt}>USDT</Text></Text>
                <Text style={styles.pnlText}>
                    PNL ngày gần nhất <Text style={styles.pnlProfit}>+0,01256 USDT</Text>
                </Text>

                <TouchableOpacity style={[styles.autoButton, { backgroundColor: theme.background }]}>
                    <Text style={[styles.autoButtonText, { color: theme.text }]}>Tự động đăng ký</Text>
                    <Ionicons name="reload" size={14} color={theme.icon} />
                </TouchableOpacity>
            </View>

            {/* Token List Header */}
            <View style={styles.tokenHeader}>
                <Text style={[styles.tokenHeaderText, { color: theme.text }]}>Loại tiền mã hóa</Text>
                <View style={{ flexDirection: 'row', gap: 12 }}>
                    <Ionicons name="search" size={18} color={theme.icon} />
                    <Ionicons name="settings-outline" size={18} color={theme.icon} />
                </View>
            </View>

            {/* Token List */}
            <ScrollView contentContainerStyle={styles.tokenList}>
                {Array.from({ length: 7 }).map((_, index) => (
                    <View key={index} style={styles.tokenItem}>
                        <Image
                            source={{ uri: 'https://cryptologos.cc/logos/tether-usdt-logo.png' }}
                            style={styles.tokenLogo}
                        />
                        <View style={styles.tokenInfo}>
                            <Text style={[styles.tokenName, { color: theme.text }]}>NAME</Text>
                            <Text style={{ color: theme.text, fontSize: 12 }}>Ethereum</Text>
                        </View>
                        <Text style={styles.aprText}>4,5% APR</Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
    },
    tabs: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: '#ddd',
    },
    tab: {
        fontSize: 14,
    },
    activeTab: {
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
    bannerBox: {
        margin: 16,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        gap: 12,
    },
    bannerIcon: {
        width: 32,
        height: 32,
    },
    bannerText: {
        flex: 1,
        fontSize: 13,
    },
    section: {
        paddingHorizontal: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    sectionDesc: {
        fontSize: 13,
        marginBottom: 12,
    },
    estimateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    estimateLabel: {
        fontSize: 13,
    },
    estimateValue: {
        fontSize: 26,
        fontWeight: 'bold',
    },
    usdt: {
        fontSize: 16,
    },
    pnlText: {
        fontSize: 12,
        color: '#666',
        marginBottom: 8,
    },
    pnlProfit: {
        color: '#22C55E',
        fontWeight: '600',
    },
    autoButton: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        gap: 6,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    autoButtonText: {
        fontSize: 13,
    },
    tokenHeader: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    tokenHeaderText: {
        fontWeight: 'bold',
    },
    tokenList: {
        paddingHorizontal: 16,
        paddingBottom: 100,
    },
    tokenItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    tokenLogo: {
        width: 32,
        height: 32,
        marginRight: 12,
    },
    tokenInfo: {
        flex: 1,
    },
    tokenName: {
        fontWeight: '600',
    },
    aprText: {
        color: '#22C55E',
        fontWeight: '500',
    },
    bottomTab: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        paddingVertical: 10,
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderTopWidth: 1,
        borderColor: '#ccc',
    },
    tabItem: {
        fontSize: 13,
    },
});
