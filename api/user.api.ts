import axiosClient from "./axiosClient";
import { CreateUserPayload, LoginPayload } from "./interface";

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

export async function sendOtp(email: string, userId: string) {
	return await axiosClient("otp/send", {
		method: "POST",
		data: JSON.stringify({ email, type: "email", purpose: "verification", userId }),
	});
}
