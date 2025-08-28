import { getAllWalletsApi } from "@/api";
import { DeviceStore } from "@/utils";
import { create } from "zustand";

type Wallet = {
	id: string;
	walletName: string;
	isDefault?: boolean;
	walletAddresses?: { address: string; chainId: number, chain: { name: string } }[];
};

type WalletState = {
	wallets: Wallet[];
	walletCount: number;
	defaultWallet: Wallet | null;
	fetchWallet: () => Promise<void>;
	refreshWallet: () => Promise<void>;
	getWalletIdsOnDevice: () => Promise<string[]>;
	setDefaultWallet: (walletId: string) => Promise<void>;
};

export const useWalletStore = create<WalletState>((set, _this) => ({
	wallets: [],
	walletCount: 0,
	defaultWallet: null,

	fetchWallet: async () => {
		const access_token = await DeviceStore.getItem("refresh_token");
		if (!access_token) return;

		try {
			const getWalletsRes = await getAllWalletsApi(access_token);
			if (getWalletsRes.code == 200) {
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

	refreshWallet: async () => {
		const access_token = await DeviceStore.getItem("refresh_token");
		if (!access_token) return;

		try {
			const getWalletsRes = await getAllWalletsApi(access_token);
			if (getWalletsRes.code == 200) {
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
		if (!wallet) {
			console.error("Wallet not found:", walletId);
			return;
		}
		await DeviceStore.setItem("default_wallet_id", walletId);
		set((pre) => ({ ...pre, defaultWallet: wallet }));
	},
}));
