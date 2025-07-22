// TrendingTokensScreen.tsx
import { Colors } from '@/constants/Colors';
import { ScrollView, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';

export default function TrendingTokensScreen() {
    const theme = useColorScheme() ?? 'light';
    const color = Colors[theme];

    const renderRow = (key) => (
        <View style={styles.row} key={key}>
            <View style={styles.colLeft}>
                <Text style={[styles.symbol, { color: color.text }]}>BTCUSDT</Text>
                <Text style={styles.volume}>19,40B USDT</Text>
            </View>

            <Text style={[styles.price, { color: color.text }]}>109.430,8</Text>

            <View style={styles.colRight}>
                <Text style={styles.percent}>+1,5%</Text>
            </View>
        </View>
    );

    return (
        <ScrollView style={[styles.container, { backgroundColor: color.background }]}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.dropdown}><Text style={styles.dropdownText}>Choose Timeframe ▼</Text></TouchableOpacity>
                <TouchableOpacity style={styles.dropdown}><Text style={styles.dropdownText}>Choose Network ▼</Text></TouchableOpacity>
            </View>

            <View style={styles.tabRow}>
                <Text style={[styles.tab, styles.activeTab]}>Danh sách yêu thích</Text>
                <Text style={styles.tab}>Thị trường</Text>
                <Text style={styles.tab}>Dữ liệu</Text>
            </View>

            <View style={styles.categoryRow}>
                <Text style={styles.catText}>Tất cả</Text>
                <Text style={styles.catText}>Tài sản</Text>
                <Text style={styles.catText}>Earn</Text>
                <Text style={styles.catText}>Giao ngay</Text>
            </View>

            <View style={styles.tableHeader}>
                <Text style={styles.headerText}>Tên/Volume</Text>
                <Text style={styles.headerText}>Giá gần nhất</Text>
                <Text style={styles.headerText}>24h</Text>
            </View>

            {Array.from({ length: 10 }).map((_, i) => renderRow(i))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    dropdown: {
        backgroundColor: '#E2E8F0',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    dropdownText: {
        fontSize: 13,
        color: '#1E293B',
    },
    tabRow: {
        flexDirection: 'row',
        marginBottom: 8,
        gap: 12,
    },
    tab: {
        fontSize: 14,
        color: '#64748B',
    },
    activeTab: {
        fontWeight: 'bold',
        textDecorationLine: 'underline',
        color: '#1D4ED8',
    },
    categoryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    catText: {
        fontSize: 12,
        color: '#475569',
    },
    tableHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    headerText: {
        fontSize: 12,
        color: '#3B82F6',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    colLeft: {
        flex: 1,
    },
    symbol: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    volume: {
        fontSize: 12,
        color: '#94A3B8',
    },
    price: {
        flex: 1,
        textAlign: 'center',
        fontSize: 14,
    },
    colRight: {
        flex: 1,
        alignItems: 'flex-end',
    },
    percent: {
        backgroundColor: '#E2E8F0',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        color: '#1E293B',
        fontWeight: '500',
    },
});
