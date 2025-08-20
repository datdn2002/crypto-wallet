import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SwapScreen() {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.title}>Swap</Text>
                <Ionicons name="settings-outline" size={24} color="black" />
            </View>

            {/* Chip Options */}
            <View style={styles.chipContainer}>
                {['Tức thì', 'Định kỳ', 'Giới hạn'].map((label, i) => (
                    <TouchableOpacity key={i} style={styles.chip}>
                        <Text style={styles.chipText}>{label}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Rate */}
            <View style={styles.rateRow}>
                <Text style={styles.rateText}>1 USDT = 0.0000655 BTC </Text>
                <Text style={styles.rateGreen}>+20%</Text>
            </View>

            {/* Box: From / To */}
            <View style={styles.boxContainer}>
                {/* From */}
                <View style={styles.box}>
                    <View style={styles.boxHeader}>
                        <Text style={styles.boxTitle}>From</Text>
                        <Text style={styles.boxBalance}>Khả dụng 2.85412 USDT</Text>
                    </View>
                    <View style={styles.boxRow}>
                        <Text style={styles.coin}>🟢 USDT {'>'}</Text>
                        <Text style={styles.amount}>0.500 - 1000</Text>
                    </View>
                </View>

                {/* Arrow Between */}
                <View style={styles.switchIconContainer}>
                    <Ionicons name="swap-vertical" size={20} color="#3C78FF" />
                </View>

                {/* To */}
                <View style={styles.box}>
                    <View style={styles.boxHeader}>
                        <Text style={styles.boxTitle}>To</Text>
                    </View>
                    <View style={styles.boxRow}>
                        <Text style={styles.coin}>🟠 BTC {'>'}</Text>
                        <Text style={styles.amount}>0.500 - 1000</Text>
                    </View>
                </View>
            </View>

            {/* Continue Button */}
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Tiếp tục</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        paddingHorizontal: 16,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
    },
    chipContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 8,
    },
    chip: {
        backgroundColor: '#eef3ff',
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 12,
    },
    chipText: {
        fontSize: 13,
        color: '#3C78FF',
    },
    rateRow: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    rateText: {
        fontSize: 13,
        color: '#000',
    },
    rateGreen: {
        fontSize: 13,
        color: 'green',
        marginLeft: 6,
    },
    boxContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 20,
    },
    box: {
        backgroundColor: '#f2f7ff',
        padding: 12,
    },
    boxHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    boxTitle: {
        fontSize: 13,
        color: '#555',
    },
    boxBalance: {
        fontSize: 12,
        color: '#3C78FF',
    },
    boxRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    coin: {
        fontSize: 16,
        fontWeight: '500',
        color: '#222',
    },
    amount: {
        fontSize: 16,
        fontWeight: '500',
        color: '#222',
    },
    switchIconContainer: {
        alignItems: 'center',
        paddingVertical: 6,
        backgroundColor: '#f2f7ff',
    },
    button: {
        backgroundColor: '#3C78FF',
        paddingVertical: 14,
        borderRadius: 20,
        alignItems: 'center',
        marginHorizontal: 20,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
});
