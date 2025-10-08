import { forgotPasswordApi } from "@/api";
import { AppHeader } from "@/components/theme";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
	KeyboardAvoidingView,
	Platform,
	Pressable,
	SafeAreaView,
	StyleSheet,
	Text,
	TextInput,
	View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function ForgotPasswordScreen() {
	const router = useRouter();
	const [email, setEmail] = useState("");

	const isValidEmail = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()), [email]);

	const handleSendOtp = async () => {
		if (!isValidEmail) return;
		Toast.show({ text1: "Đang xử lí...", type: "info" })
		const res = await forgotPasswordApi(email.trim());
		if (res?.statusCode === 200) {
			Toast.show({ text2: "Chúng tôi đã gửi link đặt lại mật khẩu tới email của bạn", text1: "Vui lòng kiểm tra email", type: "success" })
		}
		router.replace({ pathname: "/(auth)/login" });
	};

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
			<KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
				<AppHeader />
				<View style={styles.container}>
					{/* Brand */}
					<Text style={styles.brand}>Crypto Wallet</Text>
					<Text style={styles.question}>Bạn quên mật khẩu?</Text>
					<Text style={styles.subtitle}>Vui lòng nhập thông tin dưới đây để lấy lại mật khẩu.</Text>

					{/* Email input */}
					<TextInput
						value={email}
						onChangeText={setEmail}
						placeholder="email@domain.com"
						keyboardType="email-address"
						autoCapitalize="none"
						style={styles.input}
						placeholderTextColor="#9CA3AF"
					/>

					{/* Send OTP */}
					<Pressable
						onPress={handleSendOtp}
						disabled={!isValidEmail}
						style={({ pressed }) => [
							styles.button,
							!isValidEmail && styles.buttonDisabled,
							pressed && isValidEmail ? { opacity: 0.9 } : null,
						]}
					>
						<Text style={styles.buttonText}>Gửi mã OTP</Text>
					</Pressable>
				</View>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

const BLUE = "#246BFD";

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		paddingHorizontal: 20,
		paddingTop: 24,
		justifyContent: "center",
		marginBottom: "40%",
	},
	brand: {
		textAlign: "center",
		fontSize: 28,
		fontWeight: "800",
		color: "#111",
		marginTop: 12,
	},
	question: {
		marginTop: 8,
		textAlign: "center",
		fontSize: 16,
		fontWeight: "700",
		color: "#111",
	},
	subtitle: {
		marginTop: 6,
		textAlign: "center",
		color: "#6B7280",
		fontSize: 13,
	},
	input: {
		height: 44,
		marginTop: 16,
		borderWidth: 1,
		borderColor: "#E5E7EB",
		borderRadius: 8,
		paddingHorizontal: 12,
		fontSize: 15,
		color: "#111",
		backgroundColor: "#fff",
	},
	button: {
		marginTop: 12,
		height: 44,
		borderRadius: 8,
		backgroundColor: BLUE,
		alignItems: "center",
		justifyContent: "center",
	},
	buttonDisabled: {
		backgroundColor: "#AEC9FF",
	},
	buttonText: {
		color: "#fff",
		fontWeight: "700",
		fontSize: 15,
	},
});
