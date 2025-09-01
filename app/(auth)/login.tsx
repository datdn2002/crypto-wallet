import { useAuthStore } from "@/store/auth";
import { yupResolver } from "@hookform/resolvers/yup";
import { router } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import * as Yup from "yup";

interface LoginForm {
	email: string;
	password: string;
}

// Schema validate
const schema = Yup.object().shape({
	email: Yup.string().email("Email không hợp lệ").required("Vui lòng nhập email"),
	password: Yup.string().min(6, "Mật khẩu tối thiểu 6 ký tự").required("Vui lòng nhập mật khẩu"),
});

export default function LoginScreen() {
	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<LoginForm>({
		resolver: yupResolver(schema),
	});
	const { login } = useAuthStore();
	const [error, setError] = useState('');

	const onSubmit = async (data: LoginForm) => {
		try {
			const success = await login(data);
			if (!success) {
				setError("Email hoặc mật khẩu không đúng!")
			}
		} catch (err) {
			Alert.alert("Lỗi", "Đăng nhập thất bại");
			setError("Email hoặc mật khẩu không đúng!")
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Đăng Nhập</Text>
			{/* Email */}
			<Controller
				control={control}
				name="email"
				render={({ field: { onChange, value } }) => (
					<TextInput
						style={styles.input}
						placeholder="Email"
						value={value}
						onChangeText={(val) => {
							onChange(val);
							setError("");
						}}
						keyboardType="email-address"
						autoCapitalize="none"
					/>
				)}
			/>
			{errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

			{/* Password */}
			<Controller
				control={control}
				name="password"
				render={({ field: { onChange, value } }) => (
					<TextInput
						style={styles.input}
						placeholder="Mật khẩu"
						value={value}
						onChangeText={(val) => {
							onChange(val);
							setError("");
						}}
						secureTextEntry
					/>
				)}
			/>
			{errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

			{error && <Text style={[styles.error, { textAlign: 'center' }]}>{error}</Text>}
			<TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)} disabled={isSubmitting}>
				<Text style={styles.buttonText}>{isSubmitting ? "Đang xử lý..." : "Đăng Nhập"}</Text>
			</TouchableOpacity>

			<View style={styles.row}>
				<Pressable onPress={() => router.push("/(auth)/fotgot-password")}>
					<Text>Quên mật khẩu</Text>
				</Pressable>
			</View>

			<View style={styles.row}>
				<Text style={styles.text}>Bạn chưa có tài khoản? </Text>
				<Pressable onPress={() => router.push("/(auth)/(registration-steps)/register")}>
					<Text style={styles.link}>Đăng ký</Text>
				</Pressable>
			</View>
		</View>
	);
}

// Styles
const styles = StyleSheet.create({
	row: {
		flexDirection: "row",
		justifyContent: "center",
		marginTop: 16,
	},
	container: {
		flex: 1,
		justifyContent: "center",
		paddingHorizontal: 20,
		backgroundColor: "#fff",
		paddingBottom: "40%"
	},
	title: {
		fontSize: 26,
		fontWeight: "bold",
		marginBottom: 30,
		textAlign: "center",
	},
	input: {
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 8,
		padding: 12,
		marginBottom: 10,
	},
	button: {
		backgroundColor: "#007AFF",
		padding: 15,
		borderRadius: 8,
		marginTop: 10,
	},
	buttonText: {
		color: "#fff",
		textAlign: "center",
		fontWeight: "600",
	},
	error: {
		color: "red",
		marginBottom: 10,
		fontSize: 13,
	},
	text: {
		fontSize: 14,
		color: "#555",
	},
	link: {
		fontSize: 14,
		fontWeight: "700",
		color: "#246BFD",
	},
});
