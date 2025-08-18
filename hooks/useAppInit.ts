import { useAuthStore } from '@/store/auth';
import { useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';

export const useAppInit = () => {
    const [isReady, setReady] = useState(false);
    const rehydrate = useAuthStore((s) => s.rehydrate);
    const appState = useRef(AppState.currentState);

    useEffect(() => {
        const init = async () => {
            await rehydrate();
            setReady(true);
        };
        init();
    }, []);

    useEffect(() => {
        const subscription = AppState.addEventListener("change", (nextAppState: AppStateStatus) => {
            if (appState.current.match(/background/) && nextAppState === "active") {
                rehydrate(true);
            }
            appState.current = nextAppState;
        });

        return () => {
            subscription.remove();
        };
    }, []);

    return isReady;
};
