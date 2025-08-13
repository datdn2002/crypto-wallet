import { Colors } from '@/constants/Colors';
import { useAuthStore } from '@/store/auth';
import { Entypo, Feather, FontAwesome, FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';

const settings = [
    { icon: <Ionicons name="warning-outline" size={20} />, label: 'Cảnh báo giá' },
    { icon: <FontAwesome5 name="id-card" size={20} />, label: 'Sổ địa chỉ' },
    { icon: <FontAwesome name="user" size={20} />, label: 'Tên người dùng' },
    { icon: <Feather name="maximize" size={20} />, label: 'Quét mã QR' },
    { icon: <MaterialIcons name="hub" size={20} />, label: 'Kết nối DApp', href: '/account/connect-dapp' },
    { icon: <FontAwesome name="star-o" size={20} />, label: 'Ưa thích' },
    { icon: <Ionicons name="shield-checkmark-outline" size={20} />, label: 'Bảo mật' },
    { icon: <Ionicons name="notifications-outline" size={20} />, label: 'Thông báo' },
    { icon: <Feather name="help-circle" size={20} />, label: 'Trung tâm trợ giúp' },
    { icon: <Feather name="headphones" size={20} />, label: 'Hỗ trợ' },
    { icon: <Entypo name="book" size={20} />, label: 'Giới thiệu' },
];

export default function AccountScreen() {
    const theme = useColorScheme() ?? 'light';
    const color = Colors[theme];
    const logout = useAuthStore(s => s.logout);

    return (
        <ScrollView style={[styles.container, { backgroundColor: color.background }]}>
            <Text style={[styles.title, { color: color.text }]}>Cài đặt</Text>
            {settings.map((item, index) => (
                <Pressable
                    key={index}
                    style={({ pressed }) => [
                        styles.row,
                        { backgroundColor: pressed ? '#eee' : 'transparent' }
                    ]}
                    onPress={() => router.push('/account/connect-dapp')}
                >
                    <View style={styles.icon}>{item.icon}</View>
                    <Text style={[styles.label, { color: color.text }]}>{item.label}</Text>
                    <Ionicons name="chevron-forward" size={18} color={color.icon} />
                </Pressable>
            ))}
            <TouchableOpacity style={[styles.button]} onPress={logout}>
                <View style={styles.content}>
                    <Ionicons name="log-out-outline" size={20} color="#EF4444" style={styles.icon} />
                    <Text style={[styles.text, { color: '#EF4444' }]}>Đăng xuất</Text>
                </View>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 60,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        alignSelf: 'center',
        marginBottom: 20,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: 0.5,
        borderBottomColor: '#ccc',
    },
    icon: {
        width: 30,
        alignItems: 'center',
    },
    label: {
        flex: 1,
        fontSize: 16,
        marginLeft: 10,
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#FEE2E2', // nền đỏ nhạt
        borderRadius: 8,
        marginTop: 16,
        alignSelf: 'center',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconLogout: {
        marginRight: 8,
    },
    text: {
        fontWeight: 'bold',
        fontSize: 14,
    },
});
