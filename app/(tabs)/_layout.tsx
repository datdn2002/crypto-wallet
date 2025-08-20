import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { View } from "react-native";
import { Home, Settings, TrendingUp } from "react-native-feather";

export default function TabLayout() {
	return (
		<Tabs
			screenOptions={({ route }) => ({
				tabBarStyle: {
					backgroundColor: "#3A89FF", // Màu nền tab
					height: 70,
					borderTopWidth: 0,
				},
				tabBarLabelStyle: {
					fontSize: 12,
					marginBottom: 6,
				},
				tabBarActiveTintColor: "#FFFFFF",
				tabBarInactiveTintColor: "#FFFFFF",
				tabBarIconStyle: { marginTop: 8 },
				tabBarIcon: ({ color, focused }) => {
					const IconMap: Record<string, React.ReactNode> = {
						index: <Home color={color} />,
						trending: <TrendingUp color={color} />,
						qr: <Ionicons name="scan-sharp" size={24} color={color} />,
						settings: <Settings color={color} />,
						"address-book": <MaterialIcons name="perm-contact-cal" size={24} color={color} />,
					};

					return (
						<View style={{ alignItems: "center" }}>
							{IconMap[route.name]}
							{focused && (
								<View
									style={{
										height: 2,
										width: "100%",
										backgroundColor: color,
										marginTop: 4,
										borderRadius: 2,
									}}
								/>
							)}
						</View>
					);
				},
			})}
		>
			<Tabs.Screen name="index" options={{ title: "Trang chủ", headerShown: false }} />
			<Tabs.Screen name="trending" options={{ title: "Thịnh hành", headerShown: false }} />
			<Tabs.Screen name="qr" options={{ title: "Quét mã QR", headerShown: false }} />
			<Tabs.Screen name="address-book" options={{ title: "Danh bạ ví", headerShown: false }} />
			<Tabs.Screen name="settings" options={{ title: "Cài đặt", headerShown: false }} />
		</Tabs>
	);
}
