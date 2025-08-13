import { createUser, CreateUserPayload, loginApi, LoginPayload } from "@/api";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { create } from "zustand";
import { authenticateBiometric } from "./biometric-auth";

type AuthState = {
	isLoggedIn: boolean;
	token: string | null;
	isRehydrated: boolean;
	isAuthenticate: boolean;
	registrationData?: { email?: string; password?: string; error?: string };

	login: (data: LoginPayload) => Promise<void>;
	logout: () => Promise<void>;
	rehydrate: () => Promise<void>;
	verifyEmail: (email: string) => Promise<void>;
	register: (data: CreateUserPayload) => Promise<boolean>;
};

export const useAuthStore = create<AuthState>((set) => ({
	isLoggedIn: false,
	token: null,
	isRehydrated: false,
	isAuthenticate: false,

	login: async (data: LoginPayload) => {
		const res = (await loginApi(data)) as any;
		console.log(res);
		if (res.success) {
			const token = res.token ?? "";
			if (Platform.OS === "web") {
				localStorage.setItem("user_token", token);
			} else await SecureStore.setItemAsync("user_token", token);
			set({ token, isLoggedIn: true });
		}
	},

	logout: async () => {
		if (Platform.OS === "web") {
			console.warn("SecureStore is not available on web");
		} else await SecureStore.deleteItemAsync("user_token");
		set({ token: null, isLoggedIn: false });
	},

	rehydrate: async () => {
		if (Platform.OS === "web") {
			const token = localStorage.getItem("user_token");
			set({
				isLoggedIn: !!token,
				isRehydrated: true,
				isAuthenticate: true,
			});
			return;
		}

		try {
			const token = await SecureStore.getItemAsync("user_token");
			const ok = await authenticateBiometric();
			set({
				token,
				isLoggedIn: !!token,
				isRehydrated: true,
				isAuthenticate: !!ok,
			});
		} catch (error) {
			console.error("Rehydrate error:", error);
			set({ isRehydrated: true });
		}
	},

	verifyEmail: async (email: string) => {
		set((pre) => ({ ...pre, registrationData: { email } }));
	},

	register: async (data: CreateUserPayload) => {
		const res = await createUser(data);
		if (res?.data?.id) return true;
		else {
			set((pre) => ({ ...pre, registrationData: { ...pre.registrationData, error: (res as any).message } }));
			return false;
		}
	},
}));
