import axiosClient from "./axiosClient";
import { CreateWalletPayload } from "./interface";

export async function getAllWalletsApi(token: string) {
	return await axiosClient("wallet?limit=50", {
		method: "GET",
		token,
	});
}

export async function createWalletApi(token: string, data: CreateWalletPayload) {
	return await axiosClient("wallet/register-address", {
		method: "POST",
		token,
		data: JSON.stringify(data),
	});
}

export function updateWalletApi(token: string, walletId: string, data: { walletName: string }) {
	return axiosClient(`wallet/${walletId}`, {
		method: "PATCH",
		token,
		data: JSON.stringify(data),
	});
}
