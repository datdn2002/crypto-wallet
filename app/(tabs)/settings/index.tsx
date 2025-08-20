import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useAuthStore } from "@/store/auth";
import { Entypo, Feather, FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ReactElement } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from "react-native";

export default function AccountScreen() {
	const theme = useColorScheme() ?? "light";
	const color = Colors[theme];
	const logout = useAuthStore((s) => s.logout);
	const background = useThemeColor({}, "background");
	const textColor = useThemeColor({}, "text");
	const iconColor = useThemeColor({}, "icon");

	const settings: { icon: ReactElement; label: string; href: any }[] = [
		{
			icon: <Ionicons name="warning-outline" color={textColor} size={20} />,
			label: "Cảnh báo giá",
			href: "/settings/price-alert",
		},
		// { icon: <FontAwesome5 name="id-card" color={textColor} size={20} />, label: 'Sổ địa chỉ', href: '/settings/address-book' },
		{
			icon: <FontAwesome name="user" color={textColor} size={20} />,
			label: "Tên người dùng",
			href: "/settings/username",
		},
		{ icon: <Feather name="maximize" color={textColor} size={20} />, label: "Quét mã QR", href: "/qr" },
		{
			icon: <MaterialIcons name="hub" color={textColor} size={20} />,
			label: "Kết nối DApp",
			href: "/settings/connect-dapp",
		},
		{
			icon: <FontAwesome name="star-o" color={textColor} size={20} />,
			label: "Ưa thích",
			href: "/settings/preferences",
		},
		{
			icon: <Ionicons name="shield-checkmark-outline" color={textColor} size={20} />,
			label: "Bảo mật",
			href: "/settings/security",
		},
		{
			icon: <Ionicons name="notifications-outline" color={textColor} size={20} />,
			label: "Thông báo",
			href: "/settings/notification",
		},
		{
			icon: <Feather name="help-circle" color={textColor} size={20} />,
			label: "Trung tâm trợ giúp",
			href: "/settings/support",
		},
		{ icon: <Feather name="headphones" color={textColor} size={20} />, label: "Hỗ trợ", href: "/settings/help" },
		{ icon: <Entypo name="book" color={textColor} size={20} />, label: "Giới thiệu", href: "/settings/intro" },
	];

	return (
		<ScrollView style={[styles.container, { backgroundColor: color.background }]}>
			<Text style={[styles.title, { color: color.text }]}>Cài đặt</Text>
			{settings.map((item, index) => (
				<Pressable
					key={index}
					style={({ pressed }) => [styles.row, { backgroundColor: pressed ? "#eee" : "transparent" }]}
					onPress={() => router.push(item.href)}
				>
					<View style={styles.icon}>{item.icon}</View>
					<Text style={[styles.label, { color: color.text }]}>{item.label}</Text>
					<Ionicons name="chevron-forward" size={18} color={color.icon} />
				</Pressable>
			))}
			<TouchableOpacity style={[styles.button]} onPress={logout}>
				<View style={styles.content}>
					<Ionicons name="log-out-outline" size={20} color="#EF4444" style={styles.icon} />
					<Text style={[styles.text, { color: "#EF4444" }]}>Đăng xuất</Text>
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
		fontWeight: "600",
		alignSelf: "center",
		marginBottom: 20,
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 14,
		borderBottomWidth: 0.5,
		borderBottomColor: "#ccc",
	},
	icon: {
		width: 30,
		alignItems: "center",
	},
	label: {
		flex: 1,
		fontSize: 16,
		marginLeft: 10,
	},
	button: {
		paddingVertical: 12,
		paddingHorizontal: 16,
		backgroundColor: "#FEE2E2", // nền đỏ nhạt
		borderRadius: 8,
		marginTop: 16,
		alignSelf: "center",
	},
	content: {
		flexDirection: "row",
		alignItems: "center",
	},
	iconLogout: {
		marginRight: 8,
	},
	text: {
		fontWeight: "bold",
		fontSize: 14,
	},
});
