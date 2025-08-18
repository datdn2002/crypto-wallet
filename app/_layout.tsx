import { useAppInit } from "@/hooks";
import { useColorScheme } from "@/hooks/useColorScheme";
import "@/polyfills";
import { useAuthStore } from "@/store/auth";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Redirect, Stack, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";

export default function RootLayout() {
	const colorScheme = useColorScheme();
	const isReady = useAppInit();
	const segments = useSegments();
	const [fontsLoaded] = useFonts({
		SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
	});
	const isAuthPage = segments[0] === "(auth)";
	const { isLoggedIn, isAuthenticate, rehydrate, userData } = useAuthStore();
	console.log({ userData });

	if (!isAuthenticate) {
		return (
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<ActivityIndicator size="large" />
				<TouchableOpacity
					style={{
						backgroundColor: "#007AFF",
						padding: 15,
						borderRadius: 8,
						marginTop: 10,
					}}
					onPress={() => rehydrate()}
				>
					<Text style={{ color: "#fff" }}>Xác thực lại</Text>
				</TouchableOpacity>
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
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<ActivityIndicator size="large" />
			</View>
		);
	}

	return (
		<>
			<SafeAreaView style={[styles.container, { backgroundColor: colorScheme === "dark" ? "#151718" : "#fff" }]}>
				<ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
					<Stack screenOptions={{ headerShown: false }}>
						<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
						<Stack.Screen name="(auth)" options={{ headerShown: false }} />
						<Stack.Screen name="(scan)" options={{ headerShown: false }} />
						<Stack.Screen name="+not-found" />
					</Stack>
					<StatusBar style="auto" />
				</ThemeProvider>
			</SafeAreaView>
			<Toast />
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 16,
	},
});
