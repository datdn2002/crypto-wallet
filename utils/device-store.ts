import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export const DeviceStore = {
  getItem: async (key: string): Promise<string> => {
    if (Platform.OS === "web") {
      return localStorage.getItem(key) ?? "";
    } else {
      return await SecureStore.getItemAsync(key) ?? "";
    }
  },
  setItem: async (key: string, value: string) => {
    if (Platform.OS === "web") {
      localStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  },
  deleteItem: async (key: string) => {
    if (Platform.OS === "web") {
      localStorage.setItem(key, '');
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  }
}