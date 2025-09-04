import { getAllBalanceApi, getAllWalletsApi, getSupprtedChainsApi, WalletAddress } from "@/api";
import { getAddressBooksApi } from "@/api/addressBook";
import { DeviceStore } from "@/utils";
import { create } from "zustand";

type Wallet = {
	id: string;
	walletName: string;
	isDefault?: boolean;
	walletAddresses?: { address: string; chainId: number; chain: { name: string } }[];
};

export type Token = {
	id: string;
	symbol: string;
	name: string;
	chain?: string;
	icon?: string;
	logo: string;
	balance: string;
	token_address: string;
};

type WalletState = {
	chains: any[];
	tokens: Token[];
	wallets: Wallet[];
	walletCount: number;
	defaultWallet: Wallet | null;
	addressBooks: WalletAddress[];
	fetchWallet: () => Promise<void>;
	refreshWallet: () => Promise<void>;
	getWalletIdsOnDevice: () => Promise<string[]>;
	setDefaultWallet: (walletId: string) => Promise<void>;
	refetchAddress: () => Promise<void>;
};

export const useWalletStore = create<WalletState>((set, _this) => ({
	wallets: [],
	walletCount: 0,
	defaultWallet: null,
	chains: [],
	tokens: [],
	addressBooks: [],

	fetchWallet: async () => {
		const access_token = await DeviceStore.getItem("refresh_token");
		if (!access_token) return;

		try {
			const getWalletsRes = await getAllWalletsApi(access_token);
			if (getWalletsRes.statusCode == 200) {
				const walletIdsOnDevice = await _this().getWalletIdsOnDevice();
				const wallets: Wallet[] = getWalletsRes.data?.rows?.filter((w: Wallet) => walletIdsOnDevice?.includes(w?.id));
				const defaultWalletId = await DeviceStore.getItem("default_wallet_id");
				let defaultWallet = wallets.find((w) => w.id === defaultWalletId) || null;
				if (!defaultWallet && wallets.length > 0) {
					defaultWallet = wallets[0];
					await DeviceStore.setItem("default_wallet_id", defaultWallet.id);
				}
				const getSupprtedChainsRes = await getSupprtedChainsApi(access_token);
				const tokens: Token[] = [];
				if (defaultWallet?.id) {
					const res = await getAllBalanceApi(access_token, defaultWallet?.id);
					if (res?.statusCode === 200) {
						res.data.chains.forEach((chain: any) => {
							Object.values(chain.tokens).forEach((token: any) => {
								tokens.push(token);
							});
						});
					}
				}
				const getAddressRes = await getAddressBooksApi(access_token);
				set({
					wallets: wallets,
					walletCount: getWalletsRes.data?.count || 0,
					defaultWallet,
					chains: getSupprtedChainsRes.statusCode === 200 ? getSupprtedChainsRes.data || [] : [],
					tokens: tokens,
					addressBooks: getAddressRes.statusCode === 200 ? getAddressRes.data?.rows || [] : [],
				});
			}
		} catch (error) {
			console.error("Error fetching wallets:", error);
		}
	},

	refreshWallet: async () => {
		const access_token = await DeviceStore.getItem("refresh_token");
		if (!access_token) return;

		try {
			const getWalletsRes = await getAllWalletsApi(access_token);
			if (getWalletsRes.statusCode == 200) {
				const walletIdsOnDevice = await _this().getWalletIdsOnDevice();
				const wallets: Wallet[] = getWalletsRes.data?.rows?.filter((w: Wallet) => walletIdsOnDevice?.includes(w?.id));
				const defaultWalletId = await DeviceStore.getItem("default_wallet_id");
				let defaultWallet = wallets.find((w) => w.id === defaultWalletId) || null;
				if (!defaultWallet && wallets.length > 0) {
					defaultWallet = wallets[0];
					await DeviceStore.setItem("default_wallet_id", defaultWallet.id);
				}
				set({
					wallets: wallets,
					walletCount: getWalletsRes.data?.count || 0,
					defaultWallet,
				});
			}
		} catch (error) {
			console.error("Error fetching wallets:", error);
		}
	},

	getWalletIdsOnDevice: async () => {
		const mnemonicsString = await DeviceStore.getItem("mnemonics");
		const mnemonics = mnemonicsString ? (JSON.parse(mnemonicsString) as Record<string, string>) : {};
		return Object.keys(mnemonics);
	},

	setDefaultWallet: async (walletId: string) => {
		const wallet = _this().wallets.find((w) => w.id === walletId);
		const access_token = await DeviceStore.getItem("refresh_token");
		if (!wallet || !access_token) {
			console.error("Wallet not found:", walletId);
			return;
		}
		await DeviceStore.setItem("default_wallet_id", walletId);
		const tokens: Token[] = [];
		if (wallet?.id) {
			const res = await getAllBalanceApi(access_token, wallet?.id);
			if (res?.statusCode === 200) {
				res.data.chains.forEach((chain: any) => {
					Object.values(chain.tokens).forEach((token: any) => {
						tokens.push(token);
					});
				});
			}
		}
		set((pre) => ({ ...pre, defaultWallet: wallet, tokens }));
	},

	fetchChains: async () => {
		const access_token = await DeviceStore.getItem("refresh_token");
		if (!access_token) return [];
		try {
			const res = await getSupprtedChainsApi(access_token);
			if (res.statusCode === 200) {
				return res.data || [];
			}
		} catch (error) {
			console.error("Error fetching supported chains:", error);
		}
	},
	refetchAddress: async () => {
		const access_token = await DeviceStore.getItem("refresh_token");
		const getAddressRes = await getAddressBooksApi(access_token);
		set((pre) => ({
			...pre,
			addressBooks: getAddressRes.statusCode === 200 ? getAddressRes.data?.rows || [] : [],
		}));
	},
}));
