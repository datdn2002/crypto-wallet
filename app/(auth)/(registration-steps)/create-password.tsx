// app/create-password.tsx  (đổi path theo dự án của bạn)
import { AppHeader } from "@/components/theme";
import { useAuthStore } from "@/store/auth";
import { router, useLocalSearchParams } from "expo-router";
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

export default function CreatePasswordScreen() {
	const { purpose, email } = useLocalSearchParams<{ purpose?: string, email: string }>();
	const [password, setPassword] = useState("");
	const [repassword, setRepassword] = useState("");
	const { register } = useAuthStore();

	const valid = useMemo(() => {
		const hasLen = password.length >= 8;
		const hasNum = /\d/.test(password);
		const hasUpper = /[A-Z]/.test(password);
		const hasSpecial = /[^A-Za-z0-9]/.test(password);
		const match = password.length > 0 && password === repassword;
		return { hasLen, hasNum, hasUpper, hasSpecial, match };
	}, [password, repassword]);

	const canSubmit = valid.hasLen && valid.hasNum && valid.hasUpper && valid.hasSpecial && valid.match;

	const handleSubmit = async () => {
		if (!canSubmit) return;
		const success = await register({
			email: email,
			password: password,
			user_name: email,
			phone_number: "0986172791",
		});
		if (success) {
			router.push("/(auth)/login");
		} else {
			router.push("/(auth)/(registration-steps)/register");
		}
	};

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
			<KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
				<AppHeader />
				<View style={styles.container}>
					<Text style={styles.title}>Tạo mật khẩu</Text>

					{/* Ô nhập mật khẩu */}
					<View style={styles.inputWrap}>
						<Text style={styles.leftIcon}>🔒</Text>
						<TextInput
							value={password}
							onChangeText={setPassword}
							placeholder="Mật khẩu"
							secureTextEntry
							style={styles.input}
							placeholderTextColor="#ccc"
						/>
					</View>

					{/* Ô nhập lại */}
					<View style={[styles.inputWrap, { marginTop: 12 }]}>
						<Text style={styles.leftIcon}>🔒</Text>
						<TextInput
							value={repassword}
							onChangeText={setRepassword}
							placeholder="Nhập lại mật khẩu"
							secureTextEntry
							style={styles.input}
							placeholderTextColor="#ccc"
						/>
					</View>

					{/* Lưu ý */}
					<View style={styles.noteWrap}>
						<View style={{ flexDirection: "row", alignItems: "center", marginBottom: 6 }}>
							<Text style={styles.noteIcon}>ⓘ</Text>
							<Text style={styles.noteTitle}>Lưu ý</Text>
						</View>
						<Text style={styles.noteItem}>• Mật khẩu có độ dài ít nhất 8 ký tự.</Text>
						<Text style={styles.noteItem}>• Chứa ít nhất 1 ký tự số, 1 ký tự chữ hoa và 1 ký tự đặc biệt.</Text>
					</View>

					{/* Hiển thị lỗi nhỏ (tuỳ thích) */}
					<View style={{ marginTop: 6 }}>
						{!valid.hasLen && password.length > 0 && <Text style={styles.err}>Mật khẩu tối thiểu 8 ký tự.</Text>}
						{password.length > 0 && !valid.hasNum && <Text style={styles.err}>Thiếu số.</Text>}
						{password.length > 0 && !valid.hasUpper && <Text style={styles.err}>Thiếu chữ hoa.</Text>}
						{password.length > 0 && !valid.hasSpecial && <Text style={styles.err}>Thiếu ký tự đặc biệt.</Text>}
						{repassword.length > 0 && !valid.match && <Text style={styles.err}>Mật khẩu không khớp.</Text>}
					</View>

					{/* Nút tiếp tục */}
					<Pressable
						onPress={handleSubmit}
						disabled={!canSubmit}
						style={({ pressed }) => [
							styles.button,
							!canSubmit && styles.buttonDisabled,
							pressed && canSubmit ? { opacity: 0.9 } : null,
						]}
					>
						<Text style={styles.buttonText}>Tiếp tục</Text>
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
	},
	back: {
		marginTop: 4,
		fontSize: 18,
		color: "#111",
	},
	title: {
		marginTop: 18,
		fontSize: 28,
		fontWeight: "800",
		color: "#111",
	},
	inputWrap: {
		marginTop: 18,
		height: 48,
		borderRadius: 8,
		backgroundColor: "#a3bff633",
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 12,
	},
	leftIcon: {
		fontSize: 16,
		marginRight: 8,
		color: "#fff",
	},
	input: {
		flex: 1,
		color: "#333",
		fontSize: 15,
		fontWeight: "600",
		height: "100%",
	},
	noteWrap: {
		marginTop: 18,
	},
	noteIcon: { fontSize: 13, color: "#6b7280", marginRight: 6 },
	noteTitle: { fontSize: 14, color: "#6b7280", fontWeight: "700" },
	noteItem: {
		color: "#6b7280",
		fontSize: 13,
		marginTop: 2,
		lineHeight: 18,
	},
	err: { color: "#ef4444", fontSize: 12, marginTop: 2 },
	button: {
		marginTop: 18,
		height: 46,
		borderRadius: 8,
		backgroundColor: BLUE,
		alignItems: "center",
		justifyContent: "center",
	},
	buttonDisabled: {
		backgroundColor: "#AEC9FF",
	},
	buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
