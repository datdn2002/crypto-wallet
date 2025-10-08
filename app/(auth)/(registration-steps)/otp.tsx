// app/otp.tsx  (đổi path/route theo expo-router của bạn)
import { verifyOtp } from "@/api";
import { AppHeader } from "@/components/theme";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function OTPScreen() {
	const { purpose, email } = useLocalSearchParams<{ purpose?: string, email: string }>();
	const [otp, setOtp] = useState("");
	const [seconds, setSeconds] = useState(120);
	const [isError, setError] = useState(false);
	const inputRef = useRef<TextInput>(null);

	// đếm ngược 120s
	useEffect(() => {
		if (seconds <= 0) return;
		const id = setInterval(() => setSeconds((s) => s - 1), 1000);
		return () => clearInterval(id);
	}, [seconds]);

	const boxes = useMemo(() => {
		const arr = new Array(6).fill("");
		return arr.map((_, i) => otp[i] ?? "");
	}, [otp]);

	const isComplete = otp.length === 6;

	const handleChange = (t: string) => {
		setError(false);
		// chỉ cho số, tối đa 6 ký tự
		const clean = t.replace(/[^\d]/g, "").slice(0, 6);
		setOtp(clean);
	};

	const handleResend = () => {
		if (seconds > 0) return;
		// TODO: call API resend
		setSeconds(120);
	};

	const handleSubmit = async () => {
		if (!isComplete || !email) return;
		// TODO: verify OTP (otp)
		const res = await verifyOtp({
			email: email,
			code: otp,
			type: 'email',
			purpose: (purpose as any) ?? "verification",
		})

		if (res?.statusCode === 200) {
			router.push({ pathname: "/(auth)/(registration-steps)/create-password", params: { email } });
		} else {
			setError(true);
		}
	};

	return (
		<KeyboardAvoidingScreen>
			<View style={styles.container}>
				<AppHeader />

				{/* Logo + Brand */}
				<View style={styles.brandWrap}>
					<View style={styles.logo}>
						<View style={styles.logoShield} />
						<Text style={styles.logoLock}>🔒</Text>
					</View>
					<Text style={styles.brand}>Crypto Wallet</Text>
				</View>

				<Text style={styles.title}>Xác thực OTP</Text>
				<Text style={styles.subtitle}>
					Vui lòng nhập mã số chúng tôi đã gửi cho bạn qua email {email}. Mã xác thực có giá trị trong{" "}
					{seconds > 0 ? seconds : 0}s.
				</Text>

				{/* OTP Boxes */}
				<Pressable style={styles.otpRow} onPress={() => inputRef.current?.focus()} accessibilityRole="button">
					{boxes.map((ch, idx) => (
						<View
							key={idx}
							style={[styles.otpBox, isComplete ? styles.otpBoxOk : null, isError ? styles.otpBoxError : null]}
						>
							<Text style={styles.otpChar}>{ch}</Text>
						</View>
					))}
				</Pressable>

				{/* Hidden input thật sự */}
				<TextInput
					ref={inputRef}
					value={otp}
					onChangeText={handleChange}
					keyboardType="number-pad"
					textContentType="oneTimeCode"
					maxLength={6}
					style={styles.hiddenInput}
					autoFocus
				/>

				{/* Button */}
				<Pressable
					onPress={handleSubmit}
					disabled={!isComplete}
					style={({ pressed }) => [
						styles.button,
						!isComplete && styles.buttonDisabled,
						pressed && isComplete ? { opacity: 0.9 } : null,
					]}
				>
					<Text style={styles.buttonText}>Tiếp tục</Text>
				</Pressable>

				{/* Resend */}
				<Text style={styles.resendWrap}>
					Chưa nhận được mã?{" "}
					<Text
						onPress={handleResend}
						style={[styles.resendLink, seconds > 0 && styles.resendDisabled]}
						suppressHighlighting
					>
						Gửi lại
					</Text>
				</Text>
			</View>
		</KeyboardAvoidingScreen>
	);
}

function KeyboardAvoidingScreen({ children }: { children: React.ReactNode }) {
	return (
		<KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
			{children}
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 12,
		paddingHorizontal: 20,
		backgroundColor: "#fff",
	},
	topBar: {
		height: 32,
		justifyContent: "center",
	},
	back: { fontSize: 18, color: "#222" },

	brandWrap: { alignItems: "center", marginTop: 8, marginBottom: 8 },
	logo: {
		width: 64,
		height: 64,
		borderRadius: 12,
		backgroundColor: "#246BFD10",
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 8,
	},
	logoShield: {
		position: "absolute",
		width: 36,
		height: 36,
		borderRadius: 8,
		backgroundColor: "#246BFD",
		opacity: 0.9,
	},
	logoLock: { fontSize: 18, color: "#fff" },
	brand: { fontSize: 22, fontWeight: "700", color: "#111" },

	title: { fontSize: 22, fontWeight: "800", color: "#111", marginTop: 12, textAlign: "center" },
	subtitle: {
		fontSize: 14,
		color: "#515151",
		textAlign: "center",
		marginTop: 8,
		lineHeight: 20,
	},

	otpRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 24,
		paddingHorizontal: 6,
	},
	otpBox: {
		width: 44,
		height: 44,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: "#E1E1E1",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#fff",
	},
	otpBoxOk: {
		borderColor: "#246BFD",
	},
	otpBoxError: {
		borderColor: "red",
	},
	otpChar: { fontSize: 18, fontWeight: "700", color: "#111" },

	hiddenInput: {
		// ẩn khỏi layout nhưng vẫn focus được
		position: "absolute",
		opacity: 0,
		height: 1,
		width: 1,
	},

	button: {
		marginTop: 24,
		height: 44,
		borderRadius: 8,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#246BFD",
	},
	buttonDisabled: {
		backgroundColor: "#AEC9FF",
	},
	buttonText: {
		color: "#fff",
		fontWeight: "700",
		fontSize: 16,
	},

	resendWrap: {
		textAlign: "center",
		marginTop: 10,
		color: "#6b7280",
		fontSize: 13,
	},
	resendLink: {
		color: "#246BFD",
		fontWeight: "700",
	},
	resendDisabled: {
		color: "#9aaee6",
	},
});
