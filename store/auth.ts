import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { create } from 'zustand';

type AuthState = {
    isLoggedIn: boolean;
    token: string | null;
    isRehydrated: boolean; // ⬅️ cờ này giúp kiểm soát khi render app

    login: (token: string) => Promise<void>;
    logout: () => Promise<void>;
    rehydrate: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
    isLoggedIn: false,
    token: null,
    isRehydrated: false,

    login: async (token: string) => {
        if (Platform.OS === 'web') console.warn('SecureStore is not available on web')
        else await SecureStore.setItemAsync('user_token', token);
        set({ token, isLoggedIn: true });
    },

    logout: async () => {
        if (Platform.OS === 'web') {
            console.warn('SecureStore is not available on web');
        } else await SecureStore.deleteItemAsync('user_token');
        set({ token: null, isLoggedIn: false });
    },

    rehydrate: async () => {
        console.log('rehydrate', Platform.OS)
        if (Platform.OS === 'web') {
            console.warn('SecureStore is not available on web');
            set({
                isLoggedIn: true,
                isRehydrated: true,
            });
            return;
        }

        try {
            const token = await SecureStore.getItemAsync('user_token');
            set({
                token,
                isLoggedIn: !!token,
                isRehydrated: true,
            });
        } catch (error) {
            console.error('Rehydrate error:', error);
            set({ isRehydrated: true });
        }
    },
}));
