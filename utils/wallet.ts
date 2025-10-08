import { createWalletApi } from "@/api";
import { ethers } from "ethers";
import * as Crypto from "expo-crypto";
import { DeviceStore } from "./device-store";

type CreateWalletApiBody = {
	walletName: string;
	walletAddresses: { address: string; chainId: number }[];
};

export async function createNewWallet(
	access_token: string,
	walletName = "My Wallet",
): Promise<boolean> {
	try {
		let mnemonic: string;
		try {
			const w = ethers.Wallet.createRandom();
			if (!w.mnemonic?.phrase) throw new Error("no mnemonic");
			mnemonic = w.mnemonic.phrase;
		} catch (e: any) {
			if (e?.code === "UNSUPPORTED_OPERATION" || e?.message?.includes("random")) {
				const entropy = Crypto.getRandomBytes(16); // 128-bit -> 12 từ
				mnemonic = ethers.Mnemonic.fromEntropy(entropy).phrase;
			} else {
				throw e;
			}
		}
		return await createWalletFromMnemonic(mnemonic, access_token, walletName);
	} catch (error) {
		console.log("createNewWallet error:", error);
		return false;
	}
}

export async function createWalletFromMnemonic(
	mnemonic: string,
	access_token: string,
	walletName: string,
): Promise<boolean> {
	try {
		const wallet = ethers.Wallet.fromPhrase(mnemonic);
		const walletAddresses = DEFAULT_CHAINS.map((c) => {
			return { address: wallet.address, chainId: CHAIN_ID_MAP[c] };
		});
		const payload: CreateWalletApiBody = { walletName, walletAddresses };

		const res = await createWalletApi(access_token, payload);
		if (res?.data?.id) {
			saveWalletToStorage(res.data.id, mnemonic);
			return true;
		}
		return false;
	} catch (error) {
		console.log("createWalletFromMnemonic", error);
		return false;
	}
}

// Load lại ví từ storage
export async function loadWallet() {
	const mnemonic = await DeviceStore.getItem("mnemonic");
	if (!mnemonic) return null;
	return ethers.Wallet.fromPhrase(mnemonic);
}

async function saveWalletToStorage(walletId: string, mnemonic: string) {
	const mnemonicsString = await DeviceStore.getItem("mnemonics");
	const mnemonics = mnemonicsString ? (JSON.parse(mnemonicsString) as Record<string, string>) : {};
	const existingWallet = mnemonics[walletId];
	if (!existingWallet) {
		mnemonics[walletId] = mnemonic;
		DeviceStore.setItem("mnemonics", JSON.stringify(mnemonics));
	}
}

export async function getWalletMnemonic(walletId: string): Promise<string | null> {
	const mnemonicsString = await DeviceStore.getItem("mnemonics");
	const mnemonics = mnemonicsString ? (JSON.parse(mnemonicsString) as Record<string, string>) : {};
	return mnemonics[walletId] || null;
}

export async function deleteWalletById(walletId: string): Promise<void> {
	const mnemonicsString = await DeviceStore.getItem("mnemonics");
	const mnemonics = mnemonicsString ? (JSON.parse(mnemonicsString) as Record<string, string>) : {};
	if (mnemonics[walletId]) {
		delete mnemonics[walletId];
		await DeviceStore.setItem("mnemonics", JSON.stringify(mnemonics));
	}
}

export type ChainKey =
	| "eth"
	| "bsc"
	| "polygon"
	| "optimism"
	| "arbitrum"
	| "base"
	| "harmony"
	| "fantom"
	| "cronos"
	| "avalanche"
	| "celo";

export const DEFAULT_CHAINS: ChainKey[] = [
	"eth",
	"bsc",
	"polygon",
	"optimism",
	"arbitrum",
	"base",
	"harmony",
	"fantom",
	"cronos",
	"avalanche",
	"celo",
];

export const CHAIN_ID_MAP: Record<ChainKey, number> = {
	eth: 1,
	bsc: 56,
	polygon: 137,
	optimism: 10,
	arbitrum: 42161,
	base: 8453,
	harmony: 1666600000,
	fantom: 250,
	cronos: 25,
	avalanche: 43114,
	celo: 42220,
};