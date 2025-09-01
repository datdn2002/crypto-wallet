import axiosClient from "./axiosClient";
import { CreateWalletPayload } from "./interface";

export async function getAllBalanceApi(token: string, walletId: string, includeAllTokens = true) {
	return await axiosClient(`wallet/balance?includeAllTokens=${includeAllTokens}&walletId=${walletId}`, {
		method: "GET",
		token,
	});
}

export async function getAllWalletsApi(token: string) {
	return await axiosClient("wallets?limit=50", {
		method: "GET",
		token,
	});
}

export async function getSupprtedChainsApi(token: string) {
	return await axiosClient("supported-chain", {
		method: "GET",
		token,
	});
}

export async function createWalletApi(token: string, data: CreateWalletPayload) {
	return await axiosClient("wallets/register-address", {
		method: "POST",
		token,
		data: JSON.stringify(data),
	});
}

export function updateWalletApi(token: string, walletId: string, data: { walletName: string }) {
	return axiosClient(`wallets/${walletId}`, {
		method: "PATCH",
		token,
		data: JSON.stringify(data),
	});
}
