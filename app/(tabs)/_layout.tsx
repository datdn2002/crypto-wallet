import { MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { View } from "react-native";

export default function TabLayout() {
	return (
		<Tabs
			screenOptions={({ route }) => ({
				tabBarStyle: {
					backgroundColor: "#3A89FF", // Màu nền tab
					height: 58,
					borderTopWidth: 0,
				},
				tabBarLabelStyle: {
					fontSize: 12,
				},
				tabBarActiveTintColor: "#FFFFFF",
				tabBarInactiveTintColor: "#FFFFFF",
				tabBarIconStyle: { marginTop: 4 },
				tabBarIcon: ({ color, focused }) => {
					const IconMap: Record<string, React.ReactNode> = {
						index: <MaterialIcons name="home" color={color} size={24} />,
						trending: <MaterialIcons name="trending-up" color={color} size={24} />,
						'offramp/crypto-to-vnd': <MaterialIcons name="currency-exchange" size={24} color={color} />,
						settings: <MaterialIcons name="settings" color={color} size={24} />,
						'address-book': <MaterialIcons name="perm-contact-cal" size={24} color={color} />,
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
			<Tabs.Screen name="offramp/crypto-to-vnd" options={{ title: "Đổi VNĐ", headerShown: false }} />
			<Tabs.Screen name="address-book" options={{ title: "Danh bạ ví", headerShown: false }} />
			<Tabs.Screen name="settings" options={{ title: "Cài đặt", headerShown: false }} />
		</Tabs>
	);
}
