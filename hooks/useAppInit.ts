import { useAuthStore } from "@/store/auth";
import { useWalletStore } from "@/store/wallet";
import "@/utils";
import { useEffect, useRef, useState } from "react";
import { AppState, AppStateStatus } from "react-native";

export const useAppInit = () => {
	const [isReady, setReady] = useState(false);
	const rehydrate = useAuthStore((s) => s.rehydrate);
	const { fetchWallet } = useWalletStore();
	const appState = useRef(AppState.currentState);

	useEffect(() => {
		const init = async () => {
			await rehydrate();
			await fetchWallet();
			setReady(true);
		};
		init();
	}, []);

	useEffect(() => {
		const subscription = AppState.addEventListener("change", async (nextAppState: AppStateStatus) => {
			if (appState.current.match(/background/) && nextAppState === "active") {
				await rehydrate(true);
				await fetchWallet();
			}
			appState.current = nextAppState;
		});

		return () => {
			subscription.remove();
		};
	}, []);

	return isReady;
};
