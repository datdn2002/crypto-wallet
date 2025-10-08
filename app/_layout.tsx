import { Colors } from "@/constants/Colors";
import { useAppInit } from "@/hooks";
import { useColorScheme } from "@/hooks/useColorScheme";
import "@/polyfills";
import { useAuthStore } from "@/store/auth";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Redirect, Stack, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function RootLayout() {
	const colorScheme = useColorScheme();
	const isReady = useAppInit();
	const segments = useSegments();
	const [fontsLoaded] = useFonts({
		SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
	});
	const isAuthPage = segments[0] === "(auth)";
	const hasTabPage = segments[0] === "(tabs)";
	const { isLoggedIn, isAuthenticate, rehydrate } = useAuthStore();

	if (!isAuthenticate) {
		return (
			<View style={styles.center}>
				<ActivityIndicator size="large" />
				{isAuthenticate === false && (
					<TouchableOpacity style={styles.retryBtn} onPress={() => rehydrate()}>
						<Text style={{ color: "#fff" }}>Xác thực lại</Text>
					</TouchableOpacity>
				)}
			</View>
		);
	}

	if (!isLoggedIn && !isAuthPage) {
		return <Redirect href="/(auth)/landing" />;
	}

	if (isLoggedIn && isAuthPage) {
		return <Redirect href="/" />;
	}

	if (!fontsLoaded && !isReady) {
		return (
			<View style={styles.center}>
				<ActivityIndicator size="large" />
			</View>
		);
	}

	// màu nền nội dung + màu đáy (xanh)
	const contentBg = colorScheme === "dark" ? Colors.dark.background : Colors.light.background;
	const bottomInsetColor = hasTabPage ? "#3A89FF" : contentBg; // xanh (có thể đổi sang màu thương hiệu của bạn)

	return (
		<SafeAreaProvider>
			{/* Top inset màu trắng */}
			<SafeAreaView style={{ backgroundColor: "#FFFFFF" }} edges={["top"]} />

			{/* Nội dung chính */}
			<View style={[styles.container, { backgroundColor: contentBg }]}>
				<ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
					<Stack screenOptions={{ headerShown: false }}>
						<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
						<Stack.Screen name="(auth)" options={{ headerShown: false }} />
						<Stack.Screen name="(scan)" options={{ headerShown: false }} />
						<Stack.Screen name="swap-token" options={{ headerShown: false }} />
						<Stack.Screen name="send" options={{ headerShown: false }} />
						<Stack.Screen name="receive" options={{ headerShown: false }} />
						<Stack.Screen name="+not-found" />
					</Stack>
					{/* iOS: top trắng => nên dùng status bar tối để nhìn rõ */}
					<StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
				</ThemeProvider>
			</View>

			{/* Bottom inset màu xanh */}
			<SafeAreaView style={{ backgroundColor: bottomInsetColor }} edges={["bottom"]} />

			<Toast />
		</SafeAreaProvider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	center: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	retryBtn: {
		backgroundColor: "#007AFF",
		padding: 15,
		borderRadius: 8,
		marginTop: 10,
	},
});
