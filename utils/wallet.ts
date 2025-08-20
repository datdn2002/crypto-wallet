import { createWalletApi } from "@/api";
import { ethers, HDNodeWallet } from "ethers";
import * as Random from 'expo-random';
import { DeviceStore } from "./device-store";

export type ChainKey =
  | 'eth' | 'bsc' | 'polygon' | 'optimism' | 'arbitrum' | 'base'
  | 'harmony' | 'fantom' | 'cronos' | 'avalanche' | 'celo';

export const DEFAULT_CHAINS: ChainKey[] = [
  'eth', 'bsc', 'polygon', 'optimism', 'arbitrum', 'base',
  'harmony', 'fantom', 'cronos', 'avalanche', 'celo',
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

// ✅ TẠO VÍ NGAY TẠI PATH, KHÔNG GỌI derivePath("m/...")
const EVM_BASE_PATH = "m/44'/60'/0'/0";
function deriveEvmWalletFromPhrase(phrase: string, index = 0) {
  const normalized = phrase.trim().replace(/\s+/g, ' ').toLowerCase();
  ethers.Mnemonic.fromPhrase(normalized); // validate
  const path = `${EVM_BASE_PATH}/${index}`;
  const wallet = HDNodeWallet.fromPhrase(normalized, undefined, path);
  return { wallet, path };
}

function deriveEvmAddressForChain(mnemonic: string, chain: ChainKey) {
  const normalized = mnemonic.trim().replace(/\s+/g, ' ').toLowerCase();
  const index = CHAIN_ID_MAP[chain] ?? 0;
  const path = `${EVM_BASE_PATH}/${index}`;
  const w = ethers.HDNodeWallet.fromPhrase(normalized, undefined, path);
  return { address: w.address, path };
}

type CreateWalletApiBody = {
  walletName: string;
  walletAddresses: { address: string; chainId: number }[];
};

export async function createNewWallet(
  _userId: string,                      // không cần nữa (BE lấy từ token)
  access_token: string,
  walletName = 'My Wallet',
  chains: ChainKey[] = DEFAULT_CHAINS,
  accountIndex = 0,
): Promise<boolean> {
  try {
    // 1) Sinh mnemonic (giữ fallback expo-random)
    let mnemonic: string;
    try {
      const w = ethers.Wallet.createRandom();
      if (!w.mnemonic?.phrase) throw new Error('no mnemonic');
      mnemonic = w.mnemonic.phrase;
    } catch (e: any) {
      if (e?.code === 'UNSUPPORTED_OPERATION' || e?.message?.includes('random')) {
        const entropy = Random.getRandomBytes(16); // 128-bit -> 12 từ
        mnemonic = ethers.Mnemonic.fromEntropy(entropy).phrase;
      } else {
        throw e;
      }
    }

    // 2) Derive ví EVM ĐÚNG CÁCH (không derivePath "m/..." sau đó nữa)
    const { wallet, path } = deriveEvmWalletFromPhrase(mnemonic, accountIndex);
    const address = wallet.address; // 0x..., dùng chung trên mọi EVM chain

    // 3) Build payload cho API mới
    const walletAddresses = chains.map((c) => {
      const { address } = deriveEvmAddressForChain(mnemonic, c);
      return { address, chainId: CHAIN_ID_MAP[c] };
    });
    const payload: CreateWalletApiBody = { walletName, walletAddresses };

    // 4) Gọi API
    const resp = await createWalletApi(access_token, payload);

    // 5) Lưu local khi thành công
    if (resp?.code === 201 && resp?.data?.id) {
      saveWalletToStorage(resp.data.id, mnemonic);
      return true;
    }

    console.log('createNewWallet: unexpected response', resp);
    return false;
  } catch (error) {
    console.log('createNewWallet (multi-chain, api v2) error:', error);
    return false;
  }
}



export async function createWalletFromMnemonic(mnemonic: string, userId: string, access_token: string, label: string): Promise<boolean> {
  try {
    const wallet = ethers.Wallet.fromPhrase(mnemonic);
    const createWalletRes: any = {};
    // await createWalletApi(access_token, { userId, address: wallet.address, walletName: label });
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
