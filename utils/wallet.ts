import { createWalletApi } from "@/api";
import { ethers } from "ethers";
import { DeviceStore } from "./device-store";

// Tạo ví mới
export async function createNewWallet(userId: string, access_token: string): Promise<boolean> {
  // 1. Tạo mnemonic phrase
  const mnemonic = ethers.Wallet.createRandom().mnemonic?.phrase;
  if (!mnemonic) throw new Error("Không tạo được mnemonic");

  // 2. Tạo ví từ mnemonic
  const wallet = ethers.Wallet.fromPhrase(mnemonic);

  const createWalletRes = await createWalletApi(access_token, { userId, address: wallet.address });
  if (createWalletRes.data?.walletId) {
    await saveWalletToStorage(createWalletRes.data.walletId, mnemonic);
  } else {
    return false;
  }

  return true;
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
