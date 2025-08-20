import { createUser, CreateUserPayload, getMeApi, loginApi, LoginPayload, sendOtp } from "@/api";
import { DeviceStore } from "@/utils";
import { create } from "zustand";
import { authenticateBiometric } from "./biometric-auth";

type AuthState = {
	isLoggedIn: boolean;
	access_token: string | null;
	refresh_token: string | null;
	isRehydrated: boolean;
	isAuthenticate: boolean;
	registrationData?: { email?: string; password?: string; error?: string };
	userData?: {
		id: string;
		email: string;
		user_name: string;
		phone_number: string;
		kyc_status: string;
		kyc_level: string;
		created_at: string;
		updated_at: string;
		last_login_at: string;
	};

	login: (data: LoginPayload) => Promise<boolean>;
	logout: () => Promise<void>;
	rehydrate: (refresh?: boolean) => Promise<void>;
	verifyEmail: (email: string) => Promise<void>;
	register: (data: CreateUserPayload) => Promise<boolean>;
};

export const useAuthStore = create<AuthState>((set, _this) => ({
	isLoggedIn: false,
	access_token: null,
	refresh_token: null,
	isRehydrated: false,
	isAuthenticate: false,

	login: async (data: LoginPayload) => {
		const res = (await loginApi(data)) as any;
		if (res?.data?.access_token) {
			const access_token = res.data.access_token ?? "";
			const refresh_token = res.data.refresh_token ?? "";
			await DeviceStore.setItem("access_token", access_token);
			await DeviceStore.setItem("refresh_token", refresh_token);
			set({ access_token, isLoggedIn: true, refresh_token, userData: res.data?.user });
			return true;
		}
		return false;
	},

	logout: async () => {
		await DeviceStore.deleteItem("access_token");
		await DeviceStore.deleteItem("refresh_token");
		set({ access_token: null, isLoggedIn: false, refresh_token: null });
	},

	rehydrate: async (refresh = false) => {
		const access_token = await DeviceStore.getItem("access_token");
		const refresh_token = await DeviceStore.getItem("refresh_token");
		let ok = refresh ? false : _this().isAuthenticate;
		if (!ok) ok = await authenticateBiometric();
		if (!ok) {
			set({ isLoggedIn: false, isAuthenticate: false, isRehydrated: true });
			return;
		}
		if (access_token) {
			const getUserDataRes = await getMeApi(access_token);
			if (getUserDataRes.data?.id) {
				set({
					isLoggedIn: true,
					isRehydrated: true,
					isAuthenticate: ok,
					access_token,
					refresh_token,
					userData: getUserDataRes.data,
				});
				return;
			}
		}
		if (refresh_token && ok) {
			const getUserDataRes = await getMeApi(refresh_token);
			console.log(getUserDataRes);
			if (getUserDataRes.data?.id) {
				set({
					isLoggedIn: true,
					isRehydrated: true,
					isAuthenticate: ok,
					access_token: refresh_token,
					refresh_token,
					userData: getUserDataRes.data,
				});
				return;
			}
		}
		set({ isLoggedIn: false, isAuthenticate: ok, isRehydrated: true });
		return;
	},

	verifyEmail: async (email: string) => {
		console.log("verifyEmail", email);
		const { userData } = _this();
		const userId = userData?.id || "";
		await sendOtp(email, userId);
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
