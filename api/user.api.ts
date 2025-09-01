import axiosClient from "./axiosClient";
import { CreateUserPayload, LoginPayload, SendOtpPayload, VerifyOtpPayload } from "./interface";

export async function createUser(data: CreateUserPayload) {
	return await axiosClient("user", {
		method: "POST",
		data: JSON.stringify(data),
	});
}

export async function loginApi(data: LoginPayload) {
	return await axiosClient("auth/login", {
		method: "POST",
		data: JSON.stringify(data),
	});
}

export async function getMeApi(token: string) {
	return await axiosClient("user/me", {
		method: "GET",
		token,
	});
}

export async function sendOtp(data: SendOtpPayload) {
	return await axiosClient("otp/send", {
		method: "POST",
		data: JSON.stringify(data),
	});
}

export async function verifyOtp(data: VerifyOtpPayload) {
	return await axiosClient("otp/verify", {
		method: "POST",
		data: JSON.stringify(data),
	});
}

export async function forgotPasswordApi(email: string) {
	return await axiosClient("user/forgot-password", {
		method: "POST",
		data: JSON.stringify({ email }),
	});
}