import { createWalletApi } from "@/api";
import { ethers } from "ethers";
import * as Random from 'expo-random';
import { DeviceStore } from "./device-store";

export async function createNewWallet(userId: string, access_token: string): Promise<boolean> {
  try {
    let mnemonic: string;

    try {
      // cách chuẩn nếu polyfill đã hoạt động
      const w = ethers.Wallet.createRandom();
      if (!w.mnemonic?.phrase) throw new Error('no mnemonic');
      mnemonic = w.mnemonic.phrase;
    } catch (e: any) {
      // fallback an toàn bằng expo-random
      if (e?.code === 'UNSUPPORTED_OPERATION' || e?.message?.includes('random')) {
        const entropy = Random.getRandomBytes(16); // 128-bit -> 12 từ
        mnemonic = ethers.Mnemonic.fromEntropy(entropy).phrase;
      } else {
        throw e;
      }
    }
    console.log(mnemonic)
    const wallet = ethers.Wallet.fromPhrase(mnemonic);
    const createWalletRes = await createWalletApi(access_token, { userId, address: wallet.address });

    if (createWalletRes.data?.walletId) {
      await saveWalletToStorage(createWalletRes.data.walletId, mnemonic);
      return true;
    }
    return false;
  } catch (error) {
    console.log('createNewWallet', error);
    return false;
  }
}

export async function createWalletFromMnemonic(mnemonic: string, userId: string, access_token: string, label: string): Promise<boolean> {
  try {
    const wallet = ethers.Wallet.fromPhrase(mnemonic);
    const createWalletRes = await createWalletApi(access_token, { userId, address: wallet.address, walletName: label });
    if (createWalletRes.data?.walletId) {
      await saveWalletToStorage(createWalletRes.data.walletId, mnemonic);
      return true;
    }
    return false;
  } catch (error) {
    console.log('createWalletFromMnemonic', error);
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
  const mnemonics = mnemonicsString ? JSON.parse(mnemonicsString) as Record<string, string> : {};
  const existingWallet = mnemonics[walletId];
  if (!existingWallet) {
    mnemonics[walletId] = mnemonic;
    DeviceStore.setItem("mnemonics", JSON.stringify(mnemonics));
  }
}

export async function getWalletIdsOnDevice(): Promise<string[]> {
  const mnemonicsString = await DeviceStore.getItem("mnemonics");
  const mnemonics = mnemonicsString ? JSON.parse(mnemonicsString) as Record<string, string> : {};
  return Object.keys(mnemonics);
}

export async function getWalletMnemonic(walletId: string): Promise<string | null> {
  const mnemonicsString = await DeviceStore.getItem("mnemonics");
  const mnemonics = mnemonicsString ? JSON.parse(mnemonicsString) as Record<string, string> : {};
  return mnemonics[walletId] || null;
}
