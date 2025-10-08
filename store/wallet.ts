import { getAllBalanceApi, getAllWalletsApi, getSupprtedChainsApi, WalletAddress } from "@/api";
import { getAddressBooksApi } from "@/api/addressBook";
import { DeviceStore } from "@/utils";
import { create } from "zustand";

const defautTokens = [
	{
		"token_address": "0x4d224452801aced8b2f0aebe155379bb5d594381",
		"name": "ApeCoin",
		"symbol": "APE",
		"chain": "eth",
		"balance": "0",
		"formatted_balance": "0",
		"raw_balance": "0",
		"decimals": 18,
		"logo": "https://logo.moralis.io/0x1_0x4d224452801aced8b2f0aebe155379bb5d594381_d4aa92445aa54ca79803b1ad37d3814d.png",
		"thumbnail": "https://logo.moralis.io/0x1_0x4d224452801aced8b2f0aebe155379bb5d594381_d4aa92445aa54ca79803b1ad37d3814d.png",
		"possible_spam": false,
		"verified_contract": true,
		"total_supply": "0",
		"total_supply_formatted": "0",
		"percentage_relative_to_total_supply": 0,
		"security_score": 0,

	},
	{
		"token_address": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
		"name": "USD Coin",
		"symbol": "USDC",
		"chain": "eth",
		"balance": "0",
		"formatted_balance": "0",
		"raw_balance": "0",
		"decimals": 6,
		"logo": "https://logo.moralis.io/0x1_0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48_7f342f7e169e45d4948987ccb93c62a8.png",
		"thumbnail": "https://logo.moralis.io/0x1_0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48_7f342f7e169e45d4948987ccb93c62a8.png",
		"possible_spam": false,
		"verified_contract": true,
		"total_supply": "0",
		"total_supply_formatted": "0",
		"percentage_relative_to_total_supply": 0,
		"security_score": 0,
		"db_token_info": {
			"id": "6804c56f-7c3f-4e1b-b0a4-f0044066cb6a",
			"name": "USD Coin",
			"symbol": "USDC",
			"logo_url": "https://logo.moralis.io/0x1_0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48_7f342f7e169e45d4948987ccb93c62a8.png",
			"is_active": true
		}
	},
	{
		"token_address": "0xdac17f958d2ee523a2206206994597c13d831ec7",
		"name": "Tether USD",
		"symbol": "USDT",
		"chain": "eth",
		"balance": "0",
		"formatted_balance": "0",
		"raw_balance": "0",
		"decimals": 6,
		"logo": "https://logo.moralis.io/0x1_0xdac17f958d2ee523a2206206994597c13d831ec7_0b0d126af6c744c185e112a2c8dc1495.png",
		"thumbnail": "https://logo.moralis.io/0x1_0xdac17f958d2ee523a2206206994597c13d831ec7_0b0d126af6c744c185e112a2c8dc1495.png",
		"possible_spam": false,
		"verified_contract": true,
		"total_supply": "0",
		"total_supply_formatted": "0",
		"percentage_relative_to_total_supply": 0,
		"security_score": 0,
		"db_token_info": {
			"id": "76dbeb83-1f20-40b3-bdad-298291fecb33",
			"name": "Tether USD",
			"symbol": "USDT",
			"logo_url": "https://logo.moralis.io/0x1_0xdac17f958d2ee523a2206206994597c13d831ec7_0b0d126af6c744c185e112a2c8dc1495.png",
			"is_active": true
		}
	},
	{
		"token_address": "0x6b175474e89094c44da98b954eedeac495271d0f",
		"name": "Dai Stablecoin",
		"symbol": "DAI",
		"chain": "eth",
		"balance": "0",
		"formatted_balance": "0",
		"raw_balance": "0",
		"decimals": 18,
		"logo": "https://logo.moralis.io/0x1_0x6b175474e89094c44da98b954eedeac495271d0f_204eb3fa61c24996a80df7ae5ab61714.png",
		"thumbnail": "https://logo.moralis.io/0x1_0x6b175474e89094c44da98b954eedeac495271d0f_204eb3fa61c24996a80df7ae5ab61714.png",
		"possible_spam": false,
		"verified_contract": true,
		"total_supply": "0",
		"total_supply_formatted": "0",
		"percentage_relative_to_total_supply": 0,
		"security_score": 0,
		"db_token_info": {
			"id": "e90c5e88-1df5-47af-8026-01cf1d18aa68",
			"name": "Dai Stablecoin",
			"symbol": "DAI",
			"logo_url": "https://logo.moralis.io/0x1_0x6b175474e89094c44da98b954eedeac495271d0f_204eb3fa61c24996a80df7ae5ab61714.png",
			"is_active": true
		}
	},
	{
		"token_address": "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
		"name": "Wrapped BTC",
		"symbol": "WBTC",
		"chain": "eth",
		"balance": "0",
		"formatted_balance": "0",
		"raw_balance": "0",
		"decimals": 8,
		"logo": "https://logo.moralis.io/0x1_0x2260fac5e5542a773aa44fbcfedf7c193bc2c599_3d45c7efabf4bff37f5d92817940bddb.png",
		"thumbnail": "https://logo.moralis.io/0x1_0x2260fac5e5542a773aa44fbcfedf7c193bc2c599_3d45c7efabf4bff37f5d92817940bddb.png",
		"possible_spam": false,
		"verified_contract": true,
		"total_supply": "0",
		"total_supply_formatted": "0",
		"percentage_relative_to_total_supply": 0,
		"security_score": 0,
		"db_token_info": {
			"id": "8e2e5b71-b6db-43a4-a44f-7f1a949439f2",
			"name": "Wrapped BTC",
			"symbol": "WBTC",
			"logo_url": "https://logo.moralis.io/0x1_0x2260fac5e5542a773aa44fbcfedf7c193bc2c599_3d45c7efabf4bff37f5d92817940bddb.png",
			"is_active": true
		}
	},
	{
		"token_address": "0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9",
		"name": "Aave Token",
		"symbol": "AAVE",
		"chain": "eth",
		"balance": "0",
		"formatted_balance": "0",
		"raw_balance": "0",
		"decimals": 18,
		"logo": "https://logo.moralis.io/0x1_0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9_1cf1caf41de4c1ad6b0b6aa5296513c9.png",
		"thumbnail": "https://logo.moralis.io/0x1_0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9_1cf1caf41de4c1ad6b0b6aa5296513c9.png",
		"possible_spam": false,
		"verified_contract": true,
		"total_supply": "0",
		"total_supply_formatted": "0",
		"percentage_relative_to_total_supply": 0,
		"security_score": 0,
		"db_token_info": {
			"id": "79f39322-2a84-47a9-867d-61ea70259239",
			"name": "Aave Token",
			"symbol": "AAVE",
			"logo_url": "https://logo.moralis.io/0x1_0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9_1cf1caf41de4c1ad6b0b6aa5296513c9.png",
			"is_active": true
		}
	},
	{
		"token_address": "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
		"name": "Uniswap",
		"symbol": "UNI",
		"chain": "eth",
		"balance": "0",
		"formatted_balance": "0",
		"raw_balance": "0",
		"decimals": 18,
		"logo": "https://logo.moralis.io/0x1_0x1f9840a85d5af5bf1d1762f925bdaddc4201f984_e802b06cc8cfa3e0bcb6950949891b4d.png",
		"thumbnail": "https://logo.moralis.io/0x1_0x1f9840a85d5af5bf1d1762f925bdaddc4201f984_e802b06cc8cfa3e0bcb6950949891b4d.png",
		"possible_spam": false,
		"verified_contract": true,
		"total_supply": "0",
		"total_supply_formatted": "0",
		"percentage_relative_to_total_supply": 0,
		"security_score": 0,
		"db_token_info": {
			"id": "494ca452-1f60-45dc-aa82-3ce694524069",
			"name": "Uniswap",
			"symbol": "UNI",
			"logo_url": "https://logo.moralis.io/0x1_0x1f9840a85d5af5bf1d1762f925bdaddc4201f984_e802b06cc8cfa3e0bcb6950949891b4d.png",
			"is_active": true
		}
	},
	{
		"token_address": "0x514910771af9ca656af840dff83e8264ecf986ca",
		"name": "ChainLink Token",
		"symbol": "LINK",
		"chain": "eth",
		"balance": "0",
		"formatted_balance": "0",
		"raw_balance": "0",
		"decimals": 18,
		"logo": "https://logo.moralis.io/0x1_0x514910771af9ca656af840dff83e8264ecf986ca_304210048bcf9a1f86937d84f2559969.png",
		"thumbnail": "https://logo.moralis.io/0x1_0x514910771af9ca656af840dff83e8264ecf986ca_304210048bcf9a1f86937d84f2559969.png",
		"possible_spam": false,
		"verified_contract": true,
		"total_supply": "0",
		"total_supply_formatted": "0",
		"percentage_relative_to_total_supply": 0,
		"security_score": 0,
		"db_token_info": {
			"id": "d221d248-3bfd-4880-854a-e55292a47369",
			"name": "ChainLink Token",
			"symbol": "LINK",
			"logo_url": "https://logo.moralis.io/0x1_0x514910771af9ca656af840dff83e8264ecf986ca_304210048bcf9a1f86937d84f2559969.png",
			"is_active": true
		}
	},
	{
		"token_address": "0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce",
		"name": "SHIBA INU",
		"symbol": "SHIB",
		"chain": "eth",
		"balance": "0",
		"formatted_balance": "0",
		"raw_balance": "0",
		"decimals": 18,
		"logo": "https://logo.moralis.io/0x1_0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce_ffef6845a455407394138d3e914a7cc1.png",
		"thumbnail": "https://logo.moralis.io/0x1_0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce_ffef6845a455407394138d3e914a7cc1.png",
		"possible_spam": false,
		"verified_contract": true,
		"total_supply": "0",
		"total_supply_formatted": "0",
		"percentage_relative_to_total_supply": 0,
		"security_score": 0,
		"db_token_info": {
			"id": "385e03bd-b3d6-4288-953e-0c9614d367b4",
			"name": "SHIBA INU",
			"symbol": "SHIB",
			"logo_url": "https://logo.moralis.io/0x1_0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce_ffef6845a455407394138d3e914a7cc1.png",
			"is_active": true
		}
	},
	{
		"token_address": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
		"name": "Wrapped Ether",
		"symbol": "WETH",
		"chain": "eth",
		"balance": "0",
		"formatted_balance": "0",
		"raw_balance": "0",
		"decimals": 18,
		"logo": "https://logo.moralis.io/0x1_0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2_018112a9229b4bf1bf0d042beb7c2c55.png",
		"thumbnail": "https://logo.moralis.io/0x1_0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2_018112a9229b4bf1bf0d042beb7c2c55.png",
		"possible_spam": false,
		"verified_contract": true,
		"total_supply": "0",
		"total_supply_formatted": "0",
		"percentage_relative_to_total_supply": 0,
		"security_score": 0,
		"db_token_info": {
			"id": "13887fbe-acdf-4c5b-a515-e946a6c766b5",
			"name": "Wrapped Ether",
			"symbol": "WETH",
			"logo_url": "https://logo.moralis.io/0x1_0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2_018112a9229b4bf1bf0d042beb7c2c55.png",
			"is_active": true
		}
	},
	{
		"token_address": "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
		"name": "USD Coin (PoS)",
		"symbol": "USDC",
		"chain": "polygon",
		"balance": "0",
		"formatted_balance": "0",
		"raw_balance": "0",
		"decimals": 6,
		"logo": "https://logo.moralis.io/0x89_0x2791bca1f2de4661ed88a30c99a7a9449aa84174_01e513429c125d12a64c57dd8167ecb4.png",
		"thumbnail": "https://logo.moralis.io/0x89_0x2791bca1f2de4661ed88a30c99a7a9449aa84174_01e513429c125d12a64c57dd8167ecb4.png",
		"possible_spam": false,
		"verified_contract": true,
		"total_supply": "0",
		"total_supply_formatted": "0",
		"percentage_relative_to_total_supply": 0,
		"security_score": 0,
		"db_token_info": {
			"id": "4c5ae56f-3cf2-49b2-91f9-3f2105d2bd57",
			"name": "USD Coin (PoS)",
			"symbol": "USDC",
			"logo_url": "https://logo.moralis.io/0x89_0x2791bca1f2de4661ed88a30c99a7a9449aa84174_01e513429c125d12a64c57dd8167ecb4.png",
			"is_active": true
		}
	},
	{
		"token_address": "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
		"name": "Wrapped Ether",
		"symbol": "WETH",
		"chain": "polygon",
		"balance": "0",
		"formatted_balance": "0",
		"raw_balance": "0",
		"decimals": 18,
		"logo": "https://logo.moralis.io/0x89_0x7ceb23fd6bc0add59e62ac25578270cff1b9f619_0e9240048a54bba9686e7e409258bbcf.webp",
		"thumbnail": "https://logo.moralis.io/0x89_0x7ceb23fd6bc0add59e62ac25578270cff1b9f619_0e9240048a54bba9686e7e409258bbcf.webp",
		"possible_spam": false,
		"verified_contract": true,
		"total_supply": "0",
		"total_supply_formatted": "0",
		"percentage_relative_to_total_supply": 0,
		"security_score": 0,
		"db_token_info": {
			"id": "06b8e671-bb84-4dfc-be17-f5d52bea0a16",
			"name": "Wrapped Ether",
			"symbol": "WETH",
			"logo_url": "https://logo.moralis.io/0x89_0x7ceb23fd6bc0add59e62ac25578270cff1b9f619_0e9240048a54bba9686e7e409258bbcf.webp",
			"is_active": true
		}
	},
	{
		"token_address": "0xd6df932a45c0f255f85145f286ea0b292b21c90b",
		"name": "Aave (PoS)",
		"symbol": "AAVE",
		"chain": "polygon",
		"balance": "0",
		"formatted_balance": "0",
		"raw_balance": "0",
		"decimals": 18,
		"logo": "https://logo.moralis.io/0x89_0xd6df932a45c0f255f85145f286ea0b292b21c90b_08cab17d7d8bca150a80bae4e63a3670.png",
		"thumbnail": "https://logo.moralis.io/0x89_0xd6df932a45c0f255f85145f286ea0b292b21c90b_08cab17d7d8bca150a80bae4e63a3670.png",
		"possible_spam": false,
		"verified_contract": true,
		"total_supply": "0",
		"total_supply_formatted": "0",
		"percentage_relative_to_total_supply": 0,
		"security_score": 0,
		"db_token_info": {
			"id": "61ec979a-9f90-4602-9c38-9048a897611b",
			"name": "Aave (PoS)",
			"symbol": "AAVE",
			"logo_url": "https://logo.moralis.io/0x89_0xd6df932a45c0f255f85145f286ea0b292b21c90b_08cab17d7d8bca150a80bae4e63a3670.png",
			"is_active": true
		}
	},
	{
		"token_address": "0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39",
		"name": "ChainLink Token",
		"symbol": "LINK",
		"chain": "polygon",
		"balance": "0",
		"formatted_balance": "0",
		"raw_balance": "0",
		"decimals": 18,
		"logo": "https://logo.moralis.io/0x89_0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39_0aff6d81e7d350396a1d6cbb63d9b2b1.png",
		"thumbnail": "https://logo.moralis.io/0x89_0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39_0aff6d81e7d350396a1d6cbb63d9b2b1.png",
		"possible_spam": false,
		"verified_contract": true,
		"total_supply": "0",
		"total_supply_formatted": "0",
		"percentage_relative_to_total_supply": 0,
		"security_score": 0,
		"db_token_info": {
			"id": "d5ff3217-e70d-4e30-9362-41cf63733466",
			"name": "ChainLink Token",
			"symbol": "LINK",
			"logo_url": "https://logo.moralis.io/0x89_0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39_0aff6d81e7d350396a1d6cbb63d9b2b1.png",
			"is_active": true
		}
	},
	{
		"token_address": "0x0b3f868e0be5597d5db7feb59e1cadbb0fdda50a",
		"name": "SushiToken (PoS)",
		"symbol": "SUSHI",
		"chain": "polygon",
		"balance": "0",
		"formatted_balance": "0",
		"raw_balance": "0",
		"decimals": 18,
		"logo": "https://logo.moralis.io/0x89_0x0b3f868e0be5597d5db7feb59e1cadbb0fdda50a_1999830fc9157f2696f66667ba347c68.png",
		"thumbnail": "https://logo.moralis.io/0x89_0x0b3f868e0be5597d5db7feb59e1cadbb0fdda50a_1999830fc9157f2696f66667ba347c68.png",
		"possible_spam": false,
		"verified_contract": true,
		"total_supply": "0",
		"total_supply_formatted": "0",
		"percentage_relative_to_total_supply": 0,
		"security_score": 0,
		"db_token_info": {
			"id": "ebb5b811-ab1c-4207-96a3-7f75346550c1",
			"name": "SushiToken (PoS)",
			"symbol": "SUSHI",
			"logo_url": "https://logo.moralis.io/0x89_0x0b3f868e0be5597d5db7feb59e1cadbb0fdda50a_1999830fc9157f2696f66667ba347c68.png",
			"is_active": true
		}
	},
	{
		"token_address": "0x831753dd7087cac61ab5644b308642cc1c33dc13",
		"name": "Quickswap",
		"symbol": "QUICK",
		"chain": "polygon",
		"balance": "0",
		"formatted_balance": "0",
		"raw_balance": "0",
		"decimals": 18,
		"logo": "https://logo.moralis.io/0x89_0x831753dd7087cac61ab5644b308642cc1c33dc13_0e0e7f21294171d74e793e3453dd8e41.png",
		"thumbnail": "https://logo.moralis.io/0x89_0x831753dd7087cac61ab5644b308642cc1c33dc13_0e0e7f21294171d74e793e3453dd8e41.png",
		"possible_spam": false,
		"verified_contract": true,
		"total_supply": "0",
		"total_supply_formatted": "0",
		"percentage_relative_to_total_supply": 0,
		"security_score": 0,
		"db_token_info": {
			"id": "d71bfb1b-83a7-4062-8e22-23617a350148",
			"name": "Quickswap",
			"symbol": "QUICK",
			"logo_url": "https://logo.moralis.io/0x89_0x831753dd7087cac61ab5644b308642cc1c33dc13_0e0e7f21294171d74e793e3453dd8e41.png",
			"is_active": true
		}
	},
	{
		"token_address": "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
		"name": "Wrapped Matic",
		"symbol": "WMATIC",
		"chain": "polygon",
		"balance": "0",
		"formatted_balance": "0",
		"raw_balance": "0",
		"decimals": 18,
		"logo": "https://logo.moralis.io/0x89_0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270_0494ce70374d8eb10824305ea1a7971e.png",
		"thumbnail": "https://logo.moralis.io/0x89_0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270_0494ce70374d8eb10824305ea1a7971e.png",
		"possible_spam": false,
		"verified_contract": true,
		"total_supply": "0",
		"total_supply_formatted": "0",
		"percentage_relative_to_total_supply": 0,
		"security_score": 0,
		"db_token_info": {
			"id": "bac22411-db9e-4cb1-bd32-fe3e4b33183d",
			"name": "Wrapped Matic",
			"symbol": "WMATIC",
			"logo_url": "https://logo.moralis.io/0x89_0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270_0494ce70374d8eb10824305ea1a7971e.png",
			"is_active": true
		}
	},
	{
		"token_address": "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
		"name": "(PoS) Tether USD",
		"symbol": "USDT",
		"chain": "polygon",
		"balance": "0",
		"formatted_balance": "0",
		"raw_balance": "0",
		"decimals": 6,
		"logo": "https://logo.moralis.io/0x89_0xc2132d05d31c914a87c6611c10748aeb04b58e8f_00cc0321d5d11c27d1a04b4a9cad234b.png",
		"thumbnail": "https://logo.moralis.io/0x89_0xc2132d05d31c914a87c6611c10748aeb04b58e8f_00cc0321d5d11c27d1a04b4a9cad234b.png",
		"possible_spam": false,
		"verified_contract": true,
		"total_supply": "0",
		"total_supply_formatted": "0",
		"percentage_relative_to_total_supply": 0,
		"security_score": 0,
		"db_token_info": {
			"id": "4e1e92b3-55fb-4467-b96f-0a2d272e7a7d",
			"name": "(PoS) Tether USD",
			"symbol": "USDT",
			"logo_url": "https://logo.moralis.io/0x89_0xc2132d05d31c914a87c6611c10748aeb04b58e8f_00cc0321d5d11c27d1a04b4a9cad234b.png",
			"is_active": true
		}
	},
	{
		"token_address": "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063",
		"name": "(PoS) Dai Stablecoin",
		"symbol": "DAI",
		"chain": "polygon",
		"balance": "0",
		"formatted_balance": "0",
		"raw_balance": "0",
		"decimals": 18,
		"logo": "https://logo.moralis.io/0x89_0x8f3cf7ad23cd3cadbd9735aff958023239c6a063_073f3edd6de0accc6be9e3de4f2e7b56.png",
		"thumbnail": "https://logo.moralis.io/0x89_0x8f3cf7ad23cd3cadbd9735aff958023239c6a063_073f3edd6de0accc6be9e3de4f2e7b56.png",
		"possible_spam": false,
		"verified_contract": true,
		"total_supply": "0",
		"total_supply_formatted": "0",
		"percentage_relative_to_total_supply": 0,
		"security_score": 0,
		"db_token_info": {
			"id": "a31f65bc-417e-4bee-b81f-22a35d4c16da",
			"name": "(PoS) Dai Stablecoin",
			"symbol": "DAI",
			"logo_url": "https://logo.moralis.io/0x89_0x8f3cf7ad23cd3cadbd9735aff958023239c6a063_073f3edd6de0accc6be9e3de4f2e7b56.png",
			"is_active": true
		}
	},
	{
		"token_address": "0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6",
		"name": "(PoS) Wrapped BTC",
		"symbol": "WBTC",
		"chain": "polygon",
		"balance": "0",
		"formatted_balance": "0",
		"raw_balance": "0",
		"decimals": 8,
		"logo": "https://logo.moralis.io/0x89_0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6_093b6724c111304586325c9abb31f068.png",
		"thumbnail": "https://logo.moralis.io/0x89_0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6_093b6724c111304586325c9abb31f068.png",
		"possible_spam": false,
		"verified_contract": true,
		"total_supply": "0",
		"total_supply_formatted": "0",
		"percentage_relative_to_total_supply": 0,
		"security_score": 0,
		"db_token_info": {
			"id": "210190a7-bd92-4c81-8f68-9b325cc88f35",
			"name": "(PoS) Wrapped BTC",
			"symbol": "WBTC",
			"logo_url": "https://logo.moralis.io/0x89_0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6_093b6724c111304586325c9abb31f068.png",
			"is_active": true
		}
	},
	{
		"token_address": "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
		"name": "Wrapped BNB",
		"symbol": "WBNB",
		"chain": "bsc",
		"balance": "0",
		"formatted_balance": "0",
		"raw_balance": "0",
		"decimals": 18,
		"logo": "https://logo.moralis.io/0x38_0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c_015169d2e8f5ef78f93becb82ae0ed8c.png",
		"thumbnail": "https://logo.moralis.io/0x38_0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c_015169d2e8f5ef78f93becb82ae0ed8c.png",
		"possible_spam": false,
		"verified_contract": true,
		"total_supply": "0",
		"total_supply_formatted": "0",
		"percentage_relative_to_total_supply": 0,
		"security_score": 0,
		"db_token_info": {
			"id": "11b66c3b-e725-4817-bd50-16d6cc64677a",
			"name": "Wrapped BNB",
			"symbol": "WBNB",
			"logo_url": "https://logo.moralis.io/0x38_0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c_015169d2e8f5ef78f93becb82ae0ed8c.png",
			"is_active": true
		}
	},
	{
		"token_address": "0xe9e7cea3dedca5984780bafc599bd69add087d56",
		"name": "BUSD Token",
		"symbol": "BUSD",
		"chain": "bsc",
		"balance": "0",
		"formatted_balance": "0",
		"raw_balance": "0",
		"decimals": 18,
		"logo": "https://logo.moralis.io/0x38_0xe9e7cea3dedca5984780bafc599bd69add087d56_192b73c2a04c69767acf340a27b1458d.png",
		"thumbnail": "https://logo.moralis.io/0x38_0xe9e7cea3dedca5984780bafc599bd69add087d56_192b73c2a04c69767acf340a27b1458d.png",
		"possible_spam": false,
		"verified_contract": true,
		"total_supply": "0",
		"total_supply_formatted": "0",
		"percentage_relative_to_total_supply": 0,
		"security_score": 0,
		"db_token_info": {
			"id": "b6df5460-9333-4cc0-ba48-ef9a78604de1",
			"name": "BUSD Token",
			"symbol": "BUSD",
			"logo_url": "https://logo.moralis.io/0x38_0xe9e7cea3dedca5984780bafc599bd69add087d56_192b73c2a04c69767acf340a27b1458d.png",
			"is_active": true
		}
	},
	{
		"token_address": "0x55d398326f99059ff775485246999027b3197955",
		"name": "Tether USD",
		"symbol": "USDT",
		"chain": "bsc",
		"balance": "0",
		"formatted_balance": "0",
		"raw_balance": "0",
		"decimals": 18,
		"logo": "https://logo.moralis.io/0x38_0x55d398326f99059ff775485246999027b3197955_017c31aed33715dffcd9c5175133fbdb.png",
		"thumbnail": "https://logo.moralis.io/0x38_0x55d398326f99059ff775485246999027b3197955_017c31aed33715dffcd9c5175133fbdb.png",
		"possible_spam": false,
		"verified_contract": true,
		"total_supply": "0",
		"total_supply_formatted": "0",
		"percentage_relative_to_total_supply": 0,
		"security_score": 0,
		"db_token_info": {
			"id": "a0c64323-9bc2-4d8c-9f17-41bd4a4aff54",
			"name": "Tether USD",
			"symbol": "USDT",
			"logo_url": "https://logo.moralis.io/0x38_0x55d398326f99059ff775485246999027b3197955_017c31aed33715dffcd9c5175133fbdb.png",
			"is_active": true
		}
	},
	{
		"token_address": "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
		"name": "USD Coin",
		"symbol": "USDC",
		"chain": "bsc",
		"balance": "0",
		"formatted_balance": "0",
		"raw_balance": "0",
		"decimals": 18,
		"logo": "https://logo.moralis.io/0x38_0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d_0ebe47803189a184e87d3b2531873502.png",
		"thumbnail": "https://logo.moralis.io/0x38_0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d_0ebe47803189a184e87d3b2531873502.png",
		"possible_spam": false,
		"verified_contract": true,
		"total_supply": "0",
		"total_supply_formatted": "0",
		"percentage_relative_to_total_supply": 0,
		"security_score": 0,
		"db_token_info": {
			"id": "d533841a-da28-4425-b4b4-873a84ec4497",
			"name": "USD Coin",
			"symbol": "USDC",
			"logo_url": "https://logo.moralis.io/0x38_0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d_0ebe47803189a184e87d3b2531873502.png",
			"is_active": true
		}
	},
	{
		"token_address": "0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c",
		"name": "BTCB Token",
		"symbol": "BTCB",
		"chain": "bsc",
		"balance": "0",
		"formatted_balance": "0",
		"raw_balance": "0",
		"decimals": 18,
		"logo": "https://logo.moralis.io/0x38_0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c_2fb361fca18e27e8cd835f4793a9ff81.png",
		"thumbnail": "https://logo.moralis.io/0x38_0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c_2fb361fca18e27e8cd835f4793a9ff81.png",
		"possible_spam": false,
		"verified_contract": true,
		"total_supply": "0",
		"total_supply_formatted": "0",
		"percentage_relative_to_total_supply": 0,
		"security_score": 0,
		"db_token_info": {
			"id": "265ecf8b-5da3-4b24-9c72-7fef0eba2b6d",
			"name": "BTCB Token",
			"symbol": "BTCB",
			"logo_url": "https://logo.moralis.io/0x38_0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c_2fb361fca18e27e8cd835f4793a9ff81.png",
			"is_active": true
		}
	},
	{
		"token_address": "0x2170ed0880ac9a755fd29b2688956bd959f933f8",
		"name": "Ethereum Token",
		"symbol": "ETH",
		"chain": "bsc",
		"balance": "0",
		"formatted_balance": "0",
		"raw_balance": "0",
		"decimals": 18,
		"logo": "https://logo.moralis.io/0x38_0x2170ed0880ac9a755fd29b2688956bd959f933f8_15675dc7e2b7ce72591746b2f8636003.png",
		"thumbnail": "https://logo.moralis.io/0x38_0x2170ed0880ac9a755fd29b2688956bd959f933f8_15675dc7e2b7ce72591746b2f8636003.png",
		"possible_spam": false,
		"verified_contract": true,
		"total_supply": "0",
		"total_supply_formatted": "0",
		"percentage_relative_to_total_supply": 0,
		"security_score": 0,
		"db_token_info": {
			"id": "8731818f-fb04-4b22-950e-37b0cff241ad",
			"name": "Ethereum Token",
			"symbol": "ETH",
			"logo_url": "https://logo.moralis.io/0x38_0x2170ed0880ac9a755fd29b2688956bd959f933f8_15675dc7e2b7ce72591746b2f8636003.png",
			"is_active": true
		}
	},
	{
		"token_address": "0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82",
		"name": "PancakeSwap Token",
		"symbol": "Cake",
		"chain": "bsc",
		"balance": "0",
		"formatted_balance": "0",
		"raw_balance": "0",
		"decimals": 18,
		"logo": "https://logo.moralis.io/0x38_0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82_27136f1a449a1cd31522b8380ed1531e.png",
		"thumbnail": "https://logo.moralis.io/0x38_0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82_27136f1a449a1cd31522b8380ed1531e.png",
		"possible_spam": false,
		"verified_contract": true,
		"total_supply": "0",
		"total_supply_formatted": "0",
		"percentage_relative_to_total_supply": 0,
		"security_score": 0,
		"db_token_info": {
			"id": "153a01bb-f2b5-44ac-ab46-9660d34f8fb7",
			"name": "PancakeSwap Token",
			"symbol": "Cake",
			"logo_url": "https://logo.moralis.io/0x38_0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82_27136f1a449a1cd31522b8380ed1531e.png",
			"is_active": true
		}
	},
	{
		"token_address": "0x3ee2200efb3400fabb9aacf31297cbdd1d435d47",
		"name": "Cardano Token",
		"symbol": "ADA",
		"chain": "bsc",
		"balance": "0",
		"formatted_balance": "0",
		"raw_balance": "0",
		"decimals": 18,
		"logo": "https://logo.moralis.io/0x38_0x3ee2200efb3400fabb9aacf31297cbdd1d435d47_08b7c4906cf66ba8f4b012a75c2992d3.jpg",
		"thumbnail": "https://logo.moralis.io/0x38_0x3ee2200efb3400fabb9aacf31297cbdd1d435d47_08b7c4906cf66ba8f4b012a75c2992d3.jpg",
		"possible_spam": false,
		"verified_contract": true,
		"total_supply": "0",
		"total_supply_formatted": "0",
		"percentage_relative_to_total_supply": 0,
		"security_score": 0,
		"db_token_info": {
			"id": "6c36e20d-724d-4515-b937-16f90e6a3ec6",
			"name": "Cardano Token",
			"symbol": "ADA",
			"logo_url": "https://logo.moralis.io/0x38_0x3ee2200efb3400fabb9aacf31297cbdd1d435d47_08b7c4906cf66ba8f4b012a75c2992d3.jpg",
			"is_active": true
		}
	},
	{
		"token_address": "0xbf5140a22578168fd562dccf235e5d43a02ce9b1",
		"name": "Uniswap",
		"symbol": "UNI",
		"chain": "bsc",
		"balance": "0",
		"formatted_balance": "0",
		"raw_balance": "0",
		"decimals": 18,
		"logo": "https://logo.moralis.io/0x38_0xbf5140a22578168fd562dccf235e5d43a02ce9b1_43cf2dbd63aaeeb3b97d8956d4a1f2e2.png",
		"thumbnail": "https://logo.moralis.io/0x38_0xbf5140a22578168fd562dccf235e5d43a02ce9b1_43cf2dbd63aaeeb3b97d8956d4a1f2e2.png",
		"possible_spam": false,
		"verified_contract": true,
		"total_supply": "0",
		"total_supply_formatted": "0",
		"percentage_relative_to_total_supply": 0,
		"security_score": 0,
		"db_token_info": {
			"id": "7b739fac-5fa9-4598-9a47-ba318fcffb2b",
			"name": "Uniswap",
			"symbol": "UNI",
			"logo_url": "https://logo.moralis.io/0x38_0xbf5140a22578168fd562dccf235e5d43a02ce9b1_43cf2dbd63aaeeb3b97d8956d4a1f2e2.png",
			"is_active": true
		}
	},
	{
		"token_address": "0x4338665cbb7b2485a8855a139b75d5e34ab0db94",
		"name": "Litecoin Token",
		"symbol": "LTC",
		"chain": "bsc",
		"balance": "0",
		"formatted_balance": "0",
		"raw_balance": "0",
		"decimals": 18,
		"logo": "https://logo.moralis.io/0x38_0x4338665cbb7b2485a8855a139b75d5e34ab0db94_115d7b0bd177d5279bb5898deb3b18cf.jpg",
		"thumbnail": "https://logo.moralis.io/0x38_0x4338665cbb7b2485a8855a139b75d5e34ab0db94_115d7b0bd177d5279bb5898deb3b18cf.jpg",
		"possible_spam": false,
		"verified_contract": true,
		"total_supply": "0",
		"total_supply_formatted": "0",
		"percentage_relative_to_total_supply": 0,
		"security_score": 0,
		"db_token_info": {
			"id": "86890bb0-fa5c-4527-b82b-d73fa43e2dcb",
			"name": "Litecoin Token",
			"symbol": "LTC",
			"logo_url": "https://logo.moralis.io/0x38_0x4338665cbb7b2485a8855a139b75d5e34ab0db94_115d7b0bd177d5279bb5898deb3b18cf.jpg",
			"is_active": true
		}
	},
	{
		"token_address": "0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664",
		"name": "USD Coin",
		"symbol": "USDC.e",
		"chain": "avalanche",
		"balance": "0",
		"formatted_balance": "0",
		"raw_balance": "0",
		"decimals": 6,
		"logo": "https://logo.moralis.io/0xa86a_0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664_16070cac4368435748c5d46d141ae4c1.png",
		"thumbnail": "https://logo.moralis.io/0xa86a_0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664_16070cac4368435748c5d46d141ae4c1.png",
		"possible_spam": false,
		"verified_contract": true,
		"total_supply": "0",
		"total_supply_formatted": "0",
		"percentage_relative_to_total_supply": 0,
		"security_score": 0,
		"db_token_info": {
			"id": "8b600818-24bb-4fe7-b619-752661699470",
			"name": "USD Coin",
			"symbol": "USDC.e",
			"logo_url": "https://logo.moralis.io/0xa86a_0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664_16070cac4368435748c5d46d141ae4c1.png",
			"is_active": true
		}
	},
	{
		"token_address": "0xc7198437980c041c805a1edcba50c1ce5db95118",
		"name": "Tether USD",
		"symbol": "USDT.e",
		"chain": "avalanche",
		"balance": "0",
		"formatted_balance": "0",
		"raw_balance": "0",
		"decimals": 6,
		"logo": "https://logo.moralis.io/0xa86a_0xc7198437980c041c805a1edcba50c1ce5db95118_0f31b9914ab8bb15368c30eca3e250e9.png",
		"thumbnail": "https://logo.moralis.io/0xa86a_0xc7198437980c041c805a1edcba50c1ce5db95118_0f31b9914ab8bb15368c30eca3e250e9.png",
		"possible_spam": false,
		"verified_contract": true,
		"total_supply": "0",
		"total_supply_formatted": "0",
		"percentage_relative_to_total_supply": 0,
		"security_score": 0,
		"db_token_info": {
			"id": "1f742feb-bb7a-457d-9eb6-141aac1f6bee",
			"name": "Tether USD",
			"symbol": "USDT.e",
			"logo_url": "https://logo.moralis.io/0xa86a_0xc7198437980c041c805a1edcba50c1ce5db95118_0f31b9914ab8bb15368c30eca3e250e9.png",
			"is_active": true
		}
	},
	{
		"token_address": "0xd586e7f844cea2f87f50152665bcbc2c279d8d70",
		"name": "Dai Stablecoin",
		"symbol": "DAI.e",
		"chain": "avalanche",
		"balance": "0",
		"formatted_balance": "0",
		"raw_balance": "0",
		"decimals": 18,
		"logo": "https://logo.moralis.io/0xa86a_0xd586e7f844cea2f87f50152665bcbc2c279d8d70_396b4393aa4e588d9834095d53efd03a.png",
		"thumbnail": "https://logo.moralis.io/0xa86a_0xd586e7f844cea2f87f50152665bcbc2c279d8d70_396b4393aa4e588d9834095d53efd03a.png",
		"possible_spam": false,
		"verified_contract": true,
		"total_supply": "0",
		"total_supply_formatted": "0",
		"percentage_relative_to_total_supply": 0,
		"security_score": 0,
		"db_token_info": {
			"id": "8042eeb9-1dd4-4353-849f-b074710906d6",
			"name": "Dai Stablecoin",
			"symbol": "DAI.e",
			"logo_url": "https://logo.moralis.io/0xa86a_0xd586e7f844cea2f87f50152665bcbc2c279d8d70_396b4393aa4e588d9834095d53efd03a.png",
			"is_active": true
		}
	},
	{
		"token_address": "0x50b7545627a5162f82a992c33b87adc75187b218",
		"name": "Wrapped BTC",
		"symbol": "WBTC.e",
		"chain": "avalanche",
		"balance": "0",
		"formatted_balance": "0",
		"raw_balance": "0",
		"decimals": 8,
		"logo": "https://logo.moralis.io/0xa86a_0x50b7545627a5162f82a992c33b87adc75187b218_50d2caa8ac27b726c473aa29a3174f53.png",
		"thumbnail": "https://logo.moralis.io/0xa86a_0x50b7545627a5162f82a992c33b87adc75187b218_50d2caa8ac27b726c473aa29a3174f53.png",
		"possible_spam": false,
		"verified_contract": true,
		"total_supply": "0",
		"total_supply_formatted": "0",
		"percentage_relative_to_total_supply": 0,
		"security_score": 0,
		"db_token_info": {
			"id": "74148cdb-7cdf-4939-a1fd-5b2e829d6522",
			"name": "Wrapped BTC",
			"symbol": "WBTC.e",
			"logo_url": "https://logo.moralis.io/0xa86a_0x50b7545627a5162f82a992c33b87adc75187b218_50d2caa8ac27b726c473aa29a3174f53.png",
			"is_active": true
		}
	},
	{
		"token_address": "0x49d5c2bdffac6ce2bfdb6640f4f80f226bc10bab",
		"name": "Wrapped Ether",
		"symbol": "WETH.e",
		"chain": "avalanche",
		"balance": "0",
		"formatted_balance": "0",
		"raw_balance": "0",
		"decimals": 18,
		"logo": "https://logo.moralis.io/0xa86a_0x49d5c2bdffac6ce2bfdb6640f4f80f226bc10bab_047a5abd4c191e4dc35a52f5419dcf8c.webp",
		"thumbnail": "https://logo.moralis.io/0xa86a_0x49d5c2bdffac6ce2bfdb6640f4f80f226bc10bab_047a5abd4c191e4dc35a52f5419dcf8c.webp",
		"possible_spam": false,
		"verified_contract": true,
		"total_supply": "0",
		"total_supply_formatted": "0",
		"percentage_relative_to_total_supply": 0,
		"security_score": 0,
		"db_token_info": {
			"id": "cfa907f1-c3d5-4d52-88ec-4ea0d3d12701",
			"name": "Wrapped Ether",
			"symbol": "WETH.e",
			"logo_url": "https://logo.moralis.io/0xa86a_0x49d5c2bdffac6ce2bfdb6640f4f80f226bc10bab_047a5abd4c191e4dc35a52f5419dcf8c.webp",
			"is_active": true
		}
	},
	{
		"token_address": "0x63a72806098bd3d9520cc43356dd78afe5d386d9",
		"name": "Aave Token",
		"symbol": "AAVE.e",
		"chain": "avalanche",
		"balance": "0",
		"formatted_balance": "0",
		"raw_balance": "0",
		"decimals": 18,
		"logo": "https://logo.moralis.io/0xa86a_0x63a72806098bd3d9520cc43356dd78afe5d386d9_538557c6ad354cca8202eca78a4a1054.png",
		"thumbnail": "https://logo.moralis.io/0xa86a_0x63a72806098bd3d9520cc43356dd78afe5d386d9_538557c6ad354cca8202eca78a4a1054.png",
		"possible_spam": false,
		"verified_contract": true,
		"total_supply": "0",
		"total_supply_formatted": "0",
		"percentage_relative_to_total_supply": 0,
		"security_score": 0,
		"db_token_info": {
			"id": "b4f4c3d8-9e8e-4069-bc06-506a0e6509ee",
			"name": "Aave Token",
			"symbol": "AAVE.e",
			"logo_url": "https://logo.moralis.io/0xa86a_0x63a72806098bd3d9520cc43356dd78afe5d386d9_538557c6ad354cca8202eca78a4a1054.png",
			"is_active": true
		}
	},
	{
		"token_address": "0x5947bb275c521040051d82396192181b413227a3",
		"name": "Chainlink Token",
		"symbol": "LINK.e",
		"chain": "avalanche",
		"balance": "0",
		"formatted_balance": "0",
		"raw_balance": "0",
		"decimals": 18,
		"logo": "https://logo.moralis.io/0xa86a_0x5947bb275c521040051d82396192181b413227a3_1cbccce6e9c63fad449f1ccb41429769.png",
		"thumbnail": "https://logo.moralis.io/0xa86a_0x5947bb275c521040051d82396192181b413227a3_1cbccce6e9c63fad449f1ccb41429769.png",
		"possible_spam": false,
		"verified_contract": true,
		"total_supply": "0",
		"total_supply_formatted": "0",
		"percentage_relative_to_total_supply": 0,
		"security_score": 0,
		"db_token_info": {
			"id": "fffff806-ef99-4e95-aca4-87456dcde2bd",
			"name": "Chainlink Token",
			"symbol": "LINK.e",
			"logo_url": "https://logo.moralis.io/0xa86a_0x5947bb275c521040051d82396192181b413227a3_1cbccce6e9c63fad449f1ccb41429769.png",
			"is_active": true
		}
	},
	{
		"token_address": "0x37b608519f91f70f2eeb0e5ed9af4061722e4f76",
		"name": "SushiToken",
		"symbol": "SUSHI.e",
		"chain": "avalanche",
		"balance": "0",
		"formatted_balance": "0",
		"raw_balance": "0",
		"decimals": 18,
		"logo": "https://logo.moralis.io/0xa86a_0x37b608519f91f70f2eeb0e5ed9af4061722e4f76_eaa78b869b6840189d5175868e49a0cd.png",
		"thumbnail": "https://logo.moralis.io/0xa86a_0x37b608519f91f70f2eeb0e5ed9af4061722e4f76_eaa78b869b6840189d5175868e49a0cd.png",
		"possible_spam": false,
		"verified_contract": true,
		"total_supply": "0",
		"total_supply_formatted": "0",
		"percentage_relative_to_total_supply": 0,
		"security_score": 0,
		"db_token_info": {
			"id": "c63a2456-4fdf-4dbb-baa8-4a6306e685ac",
			"name": "SushiToken",
			"symbol": "SUSHI.e",
			"logo_url": "https://logo.moralis.io/0xa86a_0x37b608519f91f70f2eeb0e5ed9af4061722e4f76_eaa78b869b6840189d5175868e49a0cd.png",
			"is_active": true
		}
	},
	{
		"token_address": "0x8ebaf22b6f053dffeaf46f4dd9efa95d89ba8580",
		"name": "Uniswap",
		"symbol": "UNI.e",
		"chain": "avalanche",
		"balance": "0",
		"formatted_balance": "0",
		"raw_balance": "0",
		"decimals": 18,
		"logo": "https://logo.moralis.io/0xa86a_0x8ebaf22b6f053dffeaf46f4dd9efa95d89ba8580_8e7f65b8fdd543a3af82dbb05bd19987.png",
		"thumbnail": "https://logo.moralis.io/0xa86a_0x8ebaf22b6f053dffeaf46f4dd9efa95d89ba8580_8e7f65b8fdd543a3af82dbb05bd19987.png",
		"possible_spam": false,
		"verified_contract": true,
		"total_supply": "0",
		"total_supply_formatted": "0",
		"percentage_relative_to_total_supply": 0,
		"security_score": 0,
		"db_token_info": {
			"id": "2640799e-e0fa-43fa-a464-0aee0427e623",
			"name": "Uniswap",
			"symbol": "UNI.e",
			"logo_url": "https://logo.moralis.io/0xa86a_0x8ebaf22b6f053dffeaf46f4dd9efa95d89ba8580_8e7f65b8fdd543a3af82dbb05bd19987.png",
			"is_active": true
		}
	},
	{
		"token_address": "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7",
		"name": "Wrapped AVAX",
		"symbol": "WAVAX",
		"chain": "avalanche",
		"balance": "0",
		"formatted_balance": "0",
		"raw_balance": "0",
		"decimals": 18,
		"logo": "https://logo.moralis.io/0xa86a_0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7_001be24df56354929b5eba0059802ee0.png",
		"thumbnail": "https://logo.moralis.io/0xa86a_0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7_001be24df56354929b5eba0059802ee0.png",
		"possible_spam": false,
		"verified_contract": true,
		"total_supply": "0",
		"total_supply_formatted": "0",
		"percentage_relative_to_total_supply": 0,
		"security_score": 0,
		"db_token_info": {
			"id": "ec0189c7-6899-452c-b1e3-540e6c06e128",
			"name": "Wrapped AVAX",
			"symbol": "WAVAX",
			"logo_url": "https://logo.moralis.io/0xa86a_0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7_001be24df56354929b5eba0059802ee0.png",
			"is_active": true
		}
	},
	{
		"token_address": "0xff970a61a04b1ca14834a43f5de4533ebddb5cc8",
		"name": "USD Coin (Arb1)",
		"symbol": "USDC",
		"chain": "arbitrum",
		"balance": "0",
		"formatted_balance": "0",
		"raw_balance": "0",
		"decimals": 6,
		"logo": "https://logo.moralis.io/0xa4b1_0xff970a61a04b1ca14834a43f5de4533ebddb5cc8_0c9800fc36f9796ab11cffb8339c26a8.png",
		"thumbnail": "https://logo.moralis.io/0xa4b1_0xff970a61a04b1ca14834a43f5de4533ebddb5cc8_0c9800fc36f9796ab11cffb8339c26a8.png",
		"possible_spam": false,
		"verified_contract": true,
		"total_supply": "0",
		"total_supply_formatted": "0",
		"percentage_relative_to_total_supply": 0,
		"security_score": 0,
		"db_token_info": {
			"id": "6501a4ef-a741-47e9-bcf7-89f606ae85bd",
			"name": "USD Coin (Arb1)",
			"symbol": "USDC",
			"logo_url": "https://logo.moralis.io/0xa4b1_0xff970a61a04b1ca14834a43f5de4533ebddb5cc8_0c9800fc36f9796ab11cffb8339c26a8.png",
			"is_active": true
		}
	},
	{
		"token_address": "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9",
		"name": "Tether USD",
		"symbol": "USDT",
		"chain": "arbitrum",
		"balance": "0",
		"formatted_balance": "0",
		"raw_balance": "0",
		"decimals": 6,
		"logo": "https://logo.moralis.io/0xa4b1_0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9_00fd48dbec30ef6e8fb563f2b0b82b6a.png",
		"thumbnail": "https://logo.moralis.io/0xa4b1_0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9_00fd48dbec30ef6e8fb563f2b0b82b6a.png",
		"possible_spam": false,
		"verified_contract": true,
		"total_supply": "0",
		"total_supply_formatted": "0",
		"percentage_relative_to_total_supply": 0,
		"security_score": 0,
		"db_token_info": {
			"id": "3d6829b0-00fc-4acd-ab5c-9841d98ba397",
			"name": "Tether USD",
			"symbol": "USDT",
			"logo_url": "https://logo.moralis.io/0xa4b1_0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9_00fd48dbec30ef6e8fb563f2b0b82b6a.png",
			"is_active": true
		}
	},
	{
		"token_address": "0xda10009cbd5d07dd0cecc66161fc93d7c9000da1",
		"name": "Dai Stablecoin",
		"symbol": "DAI",
		"chain": "arbitrum",
		"balance": "0",
		"formatted_balance": "0",
		"raw_balance": "0",
		"decimals": 18,
		"logo": "https://logo.moralis.io/0xa4b1_0xda10009cbd5d07dd0cecc66161fc93d7c9000da1_247e8cebb18c62db70489edbff8cc6d8.png",
		"thumbnail": "https://logo.moralis.io/0xa4b1_0xda10009cbd5d07dd0cecc66161fc93d7c9000da1_247e8cebb18c62db70489edbff8cc6d8.png",
		"possible_spam": false,
		"verified_contract": true,
		"total_supply": "0",
		"total_supply_formatted": "0",
		"percentage_relative_to_total_supply": 0,
		"security_score": 0,
		"db_token_info": {
			"id": "0e99c8cf-6e72-495d-9647-336b1283c73d",
			"name": "Dai Stablecoin",
			"symbol": "DAI",
			"logo_url": "https://logo.moralis.io/0xa4b1_0xda10009cbd5d07dd0cecc66161fc93d7c9000da1_247e8cebb18c62db70489edbff8cc6d8.png",
			"is_active": true
		}
	},
	{
		"token_address": "0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f",
		"name": "Wrapped BTC",
		"symbol": "WBTC",
		"chain": "arbitrum",
		"balance": "0",
		"formatted_balance": "0",
		"raw_balance": "0",
		"decimals": 8,
		"logo": "https://logo.moralis.io/0xa4b1_0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f_050d6829cf108558bb5c97304f546402.png",
		"thumbnail": "https://logo.moralis.io/0xa4b1_0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f_050d6829cf108558bb5c97304f546402.png",
		"possible_spam": false,
		"verified_contract": true,
		"total_supply": "0",
		"total_supply_formatted": "0",
		"percentage_relative_to_total_supply": 0,
		"security_score": 0,
		"db_token_info": {
			"id": "c99ac532-9a1c-493d-946f-0e6821ad3167",
			"name": "Wrapped BTC",
			"symbol": "WBTC",
			"logo_url": "https://logo.moralis.io/0xa4b1_0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f_050d6829cf108558bb5c97304f546402.png",
			"is_active": true
		}
	},
	{
		"token_address": "0x912ce59144191c1204e64559fe8253a0e49e6548",
		"name": "Arbitrum",
		"symbol": "ARB",
		"chain": "arbitrum",
		"balance": "0",
		"formatted_balance": "0",
		"raw_balance": "0",
		"decimals": 18,
		"logo": "https://logo.moralis.io/0xa4b1_0x912ce59144191c1204e64559fe8253a0e49e6548_0b59571c3f3cda45aa6e983bb2d9e1c9.png",
		"thumbnail": "https://logo.moralis.io/0xa4b1_0x912ce59144191c1204e64559fe8253a0e49e6548_0b59571c3f3cda45aa6e983bb2d9e1c9.png",
		"possible_spam": false,
		"verified_contract": true,
		"total_supply": "0",
		"total_supply_formatted": "0",
		"percentage_relative_to_total_supply": 0,
		"security_score": 0,
		"db_token_info": {
			"id": "8d6e85e6-56ed-4df3-b4ca-9d6d997b9f5f",
			"name": "Arbitrum",
			"symbol": "ARB",
			"logo_url": "https://logo.moralis.io/0xa4b1_0x912ce59144191c1204e64559fe8253a0e49e6548_0b59571c3f3cda45aa6e983bb2d9e1c9.png",
			"is_active": true
		}
	},
	{
		"token_address": "0xf97f4df75117a78c1a5a0dbb814af92458539fb4",
		"name": "ChainLink Token",
		"symbol": "LINK",
		"chain": "arbitrum",
		"balance": "0",
		"formatted_balance": "0",
		"raw_balance": "0",
		"decimals": 18,
		"logo": "https://logo.moralis.io/0xa4b1_0xf97f4df75117a78c1a5a0dbb814af92458539fb4_5829e891435771e6f4ae255c4c7cfdde.png",
		"thumbnail": "https://logo.moralis.io/0xa4b1_0xf97f4df75117a78c1a5a0dbb814af92458539fb4_5829e891435771e6f4ae255c4c7cfdde.png",
		"possible_spam": false,
		"verified_contract": true,
		"total_supply": "0",
		"total_supply_formatted": "0",
		"percentage_relative_to_total_supply": 0,
		"security_score": 0,
		"db_token_info": {
			"id": "67a7f0d1-a690-41d8-8df4-0ac8e3c8554d",
			"name": "ChainLink Token",
			"symbol": "LINK",
			"logo_url": "https://logo.moralis.io/0xa4b1_0xf97f4df75117a78c1a5a0dbb814af92458539fb4_5829e891435771e6f4ae255c4c7cfdde.png",
			"is_active": true
		}
	},
	{
		"token_address": "0xba5ddd1f9d7f570dc94a51479a000e3bce967196",
		"name": "Aave Token",
		"symbol": "AAVE",
		"chain": "arbitrum",
		"balance": "0",
		"formatted_balance": "0",
		"raw_balance": "0",
		"decimals": 18,
		"logo": "https://logo.moralis.io/0xa4b1_0xba5ddd1f9d7f570dc94a51479a000e3bce967196_249a530cdf080c4258be1e46b27ee263.png",
		"thumbnail": "https://logo.moralis.io/0xa4b1_0xba5ddd1f9d7f570dc94a51479a000e3bce967196_249a530cdf080c4258be1e46b27ee263.png",
		"possible_spam": false,
		"verified_contract": true,
		"total_supply": "0",
		"total_supply_formatted": "0",
		"percentage_relative_to_total_supply": 0,
		"security_score": 0,
		"db_token_info": {
			"id": "5892267e-a054-4200-8018-a5cffc1bc125",
			"name": "Aave Token",
			"symbol": "AAVE",
			"logo_url": "https://logo.moralis.io/0xa4b1_0xba5ddd1f9d7f570dc94a51479a000e3bce967196_249a530cdf080c4258be1e46b27ee263.png",
			"is_active": true
		}
	},
	{
		"token_address": "0xfc5a1a6eb076a2c7ad06ed22c90d7e710e35ad0a",
		"name": "GMX",
		"symbol": "GMX",
		"chain": "arbitrum",
		"balance": "0",
		"formatted_balance": "0",
		"raw_balance": "0",
		"decimals": 18,
		"logo": "https://logo.moralis.io/0xa4b1_0xfc5a1a6eb076a2c7ad06ed22c90d7e710e35ad0a_52261314fe097fb5088797246d6f14b5.png",
		"thumbnail": "https://logo.moralis.io/0xa4b1_0xfc5a1a6eb076a2c7ad06ed22c90d7e710e35ad0a_52261314fe097fb5088797246d6f14b5.png",
		"possible_spam": false,
		"verified_contract": true,
		"total_supply": "0",
		"total_supply_formatted": "0",
		"percentage_relative_to_total_supply": 0,
		"security_score": 0,
		"db_token_info": {
			"id": "f1bfa419-9484-4a3c-8b7d-72224c56553a",
			"name": "GMX",
			"symbol": "GMX",
			"logo_url": "https://logo.moralis.io/0xa4b1_0xfc5a1a6eb076a2c7ad06ed22c90d7e710e35ad0a_52261314fe097fb5088797246d6f14b5.png",
			"is_active": true
		}
	},
	{
		"token_address": "0xd4d42f0b6def4ce0383636770ef773390d85c61a",
		"name": "SushiToken",
		"symbol": "SUSHI",
		"chain": "arbitrum",
		"balance": "0",
		"formatted_balance": "0",
		"raw_balance": "0",
		"decimals": 18,
		"logo": "https://logo.moralis.io/0xa4b1_0xd4d42f0b6def4ce0383636770ef773390d85c61a_180030ca4e9653449e1ee6fce15a4845.png",
		"thumbnail": "https://logo.moralis.io/0xa4b1_0xd4d42f0b6def4ce0383636770ef773390d85c61a_180030ca4e9653449e1ee6fce15a4845.png",
		"possible_spam": false,
		"verified_contract": true,
		"total_supply": "0",
		"total_supply_formatted": "0",
		"percentage_relative_to_total_supply": 0,
		"security_score": 0,
		"db_token_info": {
			"id": "9a72c0e9-52a0-4f9b-861b-bb79d25b0b13",
			"name": "SushiToken",
			"symbol": "SUSHI",
			"logo_url": "https://logo.moralis.io/0xa4b1_0xd4d42f0b6def4ce0383636770ef773390d85c61a_180030ca4e9653449e1ee6fce15a4845.png",
			"is_active": true
		}
	},
	{
		"token_address": "0x82af49447d8a07e3bd95bd0d56f35241523fbab1",
		"name": "Wrapped Ether",
		"symbol": "WETH",
		"chain": "arbitrum",
		"balance": "0",
		"formatted_balance": "0",
		"raw_balance": "0",
		"decimals": 18,
		"logo": "https://logo.moralis.io/0xa4b1_0x82af49447d8a07e3bd95bd0d56f35241523fbab1_03f6d08a9f4a4aad3a5b129ad0900dd3.png",
		"thumbnail": "https://logo.moralis.io/0xa4b1_0x82af49447d8a07e3bd95bd0d56f35241523fbab1_03f6d08a9f4a4aad3a5b129ad0900dd3.png",
		"possible_spam": false,
		"verified_contract": true,
		"total_supply": "0",
		"total_supply_formatted": "0",
		"percentage_relative_to_total_supply": 0,
		"security_score": 0,
		"db_token_info": {
			"id": "900536ec-097d-4f6c-b839-2fdb5e5052d6",
			"name": "Wrapped Ether",
			"symbol": "WETH",
			"logo_url": "https://logo.moralis.io/0xa4b1_0x82af49447d8a07e3bd95bd0d56f35241523fbab1_03f6d08a9f4a4aad3a5b129ad0900dd3.png",
			"is_active": true
		}
	},
	{
		"token_address": "0x68f180fcce6836688e9084f035309e29bf0a2095",
		"name": "Wrapped BTC",
		"symbol": "WBTC",
		"chain": "optimism",
		"balance": "0",
		"formatted_balance": "0",
		"raw_balance": "0",
		"decimals": 8,
		"logo": "https://logo.moralis.io/0xa_0x68f180fcce6836688e9084f035309e29bf0a2095_080c4ed25890ecce19965e86f08d9947.png",
		"thumbnail": "https://logo.moralis.io/0xa_0x68f180fcce6836688e9084f035309e29bf0a2095_080c4ed25890ecce19965e86f08d9947.png",
		"possible_spam": false,
		"verified_contract": true,
		"total_supply": "0",
		"total_supply_formatted": "0",
		"percentage_relative_to_total_supply": 0,
		"security_score": 0,
		"db_token_info": {
			"id": "7e5e786a-2946-43a4-b2ed-0624fd32330e",
			"name": "Wrapped BTC",
			"symbol": "WBTC",
			"logo_url": "https://logo.moralis.io/0xa_0x68f180fcce6836688e9084f035309e29bf0a2095_080c4ed25890ecce19965e86f08d9947.png",
			"is_active": true
		}
	},
	{
		"token_address": "0x4200000000000000000000000000000000000042",
		"name": "Optimism",
		"symbol": "OP",
		"chain": "optimism",
		"balance": "0",
		"formatted_balance": "0",
		"raw_balance": "0",
		"decimals": 18,
		"logo": "https://logo.moralis.io/0xa_0x4200000000000000000000000000000000000042_0cd6d323eda762fc723fbaa5e322893c.png",
		"thumbnail": "https://logo.moralis.io/0xa_0x4200000000000000000000000000000000000042_0cd6d323eda762fc723fbaa5e322893c.png",
		"possible_spam": false,
		"verified_contract": true,
		"total_supply": "0",
		"total_supply_formatted": "0",
		"percentage_relative_to_total_supply": 0,
		"security_score": 0,
		"db_token_info": {
			"id": "a61b89ad-3e17-419d-b761-507018247e8c",
			"name": "Optimism",
			"symbol": "OP",
			"logo_url": "https://logo.moralis.io/0xa_0x4200000000000000000000000000000000000042_0cd6d323eda762fc723fbaa5e322893c.png",
			"is_active": true
		}
	},
	{
		"token_address": "0x350a791bfc2c21f9ed5d10980dad2e2638ffa7f6",
		"name": "ChainLink Token",
		"symbol": "LINK",
		"chain": "optimism",
		"balance": "0",
		"formatted_balance": "0",
		"raw_balance": "0",
		"decimals": 18,
		"logo": "https://logo.moralis.io/0xa_0x350a791bfc2c21f9ed5d10980dad2e2638ffa7f6_3e42241bf9301bacbbc09e04fa664b49.png",
		"thumbnail": "https://logo.moralis.io/0xa_0x350a791bfc2c21f9ed5d10980dad2e2638ffa7f6_3e42241bf9301bacbbc09e04fa664b49.png",
		"possible_spam": false,
		"verified_contract": true,
		"total_supply": "0",
		"total_supply_formatted": "0",
		"percentage_relative_to_total_supply": 0,
		"security_score": 0,
		"db_token_info": {
			"id": "1513a525-1250-40fa-8000-1cec5dfc398f",
			"name": "ChainLink Token",
			"symbol": "LINK",
			"logo_url": "https://logo.moralis.io/0xa_0x350a791bfc2c21f9ed5d10980dad2e2638ffa7f6_3e42241bf9301bacbbc09e04fa664b49.png",
			"is_active": true
		}
	},
	{
		"token_address": "0x76fb31fb4af56892a25e32cfc43de717950c9278",
		"name": "Aave Token",
		"symbol": "AAVE",
		"chain": "optimism",
		"balance": "0",
		"formatted_balance": "0",
		"raw_balance": "0",
		"decimals": 18,
		"logo": "https://logo.moralis.io/0xa_0x76fb31fb4af56892a25e32cfc43de717950c9278_23e4c7903f18b68f06ca69693957cebe.png",
		"thumbnail": "https://logo.moralis.io/0xa_0x76fb31fb4af56892a25e32cfc43de717950c9278_23e4c7903f18b68f06ca69693957cebe.png",
		"possible_spam": false,
		"verified_contract": true,
		"total_supply": "0",
		"total_supply_formatted": "0",
		"percentage_relative_to_total_supply": 0,
		"security_score": 0,
		"db_token_info": {
			"id": "ba988ea6-8671-434c-8789-cd5cf7e6a6fd",
			"name": "Aave Token",
			"symbol": "AAVE",
			"logo_url": "https://logo.moralis.io/0xa_0x76fb31fb4af56892a25e32cfc43de717950c9278_23e4c7903f18b68f06ca69693957cebe.png",
			"is_active": true
		}
	},
	{
		"token_address": "0x8700daec35af8ff88c16bdf0418774cb3d7599b4",
		"name": "Synthetix Network Token",
		"symbol": "SNX",
		"chain": "optimism",
		"balance": "0",
		"formatted_balance": "0",
		"raw_balance": "0",
		"decimals": 18,
		"logo": "https://logo.moralis.io/0xa_0x8700daec35af8ff88c16bdf0418774cb3d7599b4_3c142d84c31f3f7cb5025557cc2970fd.png",
		"thumbnail": "https://logo.moralis.io/0xa_0x8700daec35af8ff88c16bdf0418774cb3d7599b4_3c142d84c31f3f7cb5025557cc2970fd.png",
		"possible_spam": false,
		"verified_contract": true,
		"total_supply": "0",
		"total_supply_formatted": "0",
		"percentage_relative_to_total_supply": 0,
		"security_score": 0,
		"db_token_info": {
			"id": "f2dd6cd1-aabc-4986-9d07-2459e08e859d",
			"name": "Synthetix Network Token",
			"symbol": "SNX",
			"logo_url": "https://logo.moralis.io/0xa_0x8700daec35af8ff88c16bdf0418774cb3d7599b4_3c142d84c31f3f7cb5025557cc2970fd.png",
			"is_active": true
		}
	},
	{
		"token_address": "0x9bcef72be871e61ed4fbbc7630889bee758eb81d",
		"name": "Rocket Pool ETH",
		"symbol": "rETH",
		"chain": "optimism",
		"balance": "0",
		"formatted_balance": "0",
		"raw_balance": "0",
		"decimals": 18,
		"logo": "https://logo.moralis.io/0xa_0x9bcef72be871e61ed4fbbc7630889bee758eb81d_9312adede8530dd0c784cba7ec81f47c.png",
		"thumbnail": "https://logo.moralis.io/0xa_0x9bcef72be871e61ed4fbbc7630889bee758eb81d_9312adede8530dd0c784cba7ec81f47c.png",
		"possible_spam": false,
		"verified_contract": true,
		"total_supply": "0",
		"total_supply_formatted": "0",
		"percentage_relative_to_total_supply": 0,
		"security_score": 0,
		"db_token_info": {
			"id": "1e404a56-a5c4-41dd-bb61-248fd936e961",
			"name": "Rocket Pool ETH",
			"symbol": "rETH",
			"logo_url": "https://logo.moralis.io/0xa_0x9bcef72be871e61ed4fbbc7630889bee758eb81d_9312adede8530dd0c784cba7ec81f47c.png",
			"is_active": true
		}
	},
	{
		"token_address": "0x7f5c764cbc14f9669b88837ca1490cca17c31607",
		"name": "USD Coin",
		"symbol": "USDC",
		"chain": "optimism",
		"balance": "0",
		"formatted_balance": "0",
		"raw_balance": "0",
		"decimals": 6,
		"logo": "https://logo.moralis.io/0xa_0x7f5c764cbc14f9669b88837ca1490cca17c31607_0c82b8e024042fce692dc345b0c1bdf5.png",
		"thumbnail": "https://logo.moralis.io/0xa_0x7f5c764cbc14f9669b88837ca1490cca17c31607_0c82b8e024042fce692dc345b0c1bdf5.png",
		"possible_spam": false,
		"verified_contract": true,
		"total_supply": "0",
		"total_supply_formatted": "0",
		"percentage_relative_to_total_supply": 0,
		"security_score": 0,
		"db_token_info": {
			"id": "7b677342-b75e-4f84-9bd0-10775c334878",
			"name": "USD Coin",
			"symbol": "USDC",
			"logo_url": "https://logo.moralis.io/0xa_0x7f5c764cbc14f9669b88837ca1490cca17c31607_0c82b8e024042fce692dc345b0c1bdf5.png",
			"is_active": true
		}
	},
	{
		"token_address": "0x94b008aa00579c1307b0ef2c499ad98a8ce58e58",
		"name": "Tether USD",
		"symbol": "USDT",
		"chain": "optimism",
		"balance": "0",
		"formatted_balance": "0",
		"raw_balance": "0",
		"decimals": 6,
		"logo": "https://logo.moralis.io/0xa_0x94b008aa00579c1307b0ef2c499ad98a8ce58e58_05fd5db402578a4e5a2ce06bb6f98419.png",
		"thumbnail": "https://logo.moralis.io/0xa_0x94b008aa00579c1307b0ef2c499ad98a8ce58e58_05fd5db402578a4e5a2ce06bb6f98419.png",
		"possible_spam": false,
		"verified_contract": true,
		"total_supply": "0",
		"total_supply_formatted": "0",
		"percentage_relative_to_total_supply": 0,
		"security_score": 0,
		"db_token_info": {
			"id": "8a6a5be2-b6c1-4e3d-9200-c80efb4833ab",
			"name": "Tether USD",
			"symbol": "USDT",
			"logo_url": "https://logo.moralis.io/0xa_0x94b008aa00579c1307b0ef2c499ad98a8ce58e58_05fd5db402578a4e5a2ce06bb6f98419.png",
			"is_active": true
		}
	},
	{
		"token_address": "0xda10009cbd5d07dd0cecc66161fc93d7c9000da1",
		"name": "Dai Stablecoin",
		"symbol": "DAI",
		"chain": "optimism",
		"balance": "0",
		"formatted_balance": "0",
		"raw_balance": "0",
		"decimals": 18,
		"logo": "https://logo.moralis.io/0xa_0xda10009cbd5d07dd0cecc66161fc93d7c9000da1_014150ff6ea65394c94889db667b1c4a.png",
		"thumbnail": "https://logo.moralis.io/0xa_0xda10009cbd5d07dd0cecc66161fc93d7c9000da1_014150ff6ea65394c94889db667b1c4a.png",
		"possible_spam": false,
		"verified_contract": true,
		"total_supply": "0",
		"total_supply_formatted": "0",
		"percentage_relative_to_total_supply": 0,
		"security_score": 0,
		"db_token_info": {
			"id": "0b36f5d0-b0a8-423b-bb50-4717d6600f96",
			"name": "Dai Stablecoin",
			"symbol": "DAI",
			"logo_url": "https://logo.moralis.io/0xa_0xda10009cbd5d07dd0cecc66161fc93d7c9000da1_014150ff6ea65394c94889db667b1c4a.png",
			"is_active": true
		}
	},
	{
		"token_address": "0x4200000000000000000000000000000000000006",
		"name": "Wrapped Ether",
		"symbol": "WETH",
		"chain": "optimism",
		"balance": "0",
		"formatted_balance": "0",
		"raw_balance": "0",
		"decimals": 18,
		"logo": "https://logo.moralis.io/0xa_0x4200000000000000000000000000000000000006_0258632475ca4de70a8bf28e2df4cc2c.png",
		"thumbnail": "https://logo.moralis.io/0xa_0x4200000000000000000000000000000000000006_0258632475ca4de70a8bf28e2df4cc2c.png",
		"possible_spam": false,
		"verified_contract": true,
		"total_supply": "0",
		"total_supply_formatted": "0",
		"percentage_relative_to_total_supply": 0,
		"security_score": 0,
		"db_token_info": {
			"id": "32889fb6-352a-4541-abef-f474c96c8b96",
			"name": "Wrapped Ether",
			"symbol": "WETH",
			"logo_url": "https://logo.moralis.io/0xa_0x4200000000000000000000000000000000000006_0258632475ca4de70a8bf28e2df4cc2c.png",
			"is_active": true
		}
	},
	{
		"token_address": "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
		"name": "USD Coin",
		"symbol": "USDC",
		"chain": "base",
		"balance": "0",
		"formatted_balance": "0",
		"raw_balance": "0",
		"decimals": 6,
		"logo": "https://logo.moralis.io/0x2105_0x833589fcd6edb6e08f4c7c32d4f71b54bda02913_08900d18ed100f2bad6fc53388a71159.png",
		"thumbnail": "https://logo.moralis.io/0x2105_0x833589fcd6edb6e08f4c7c32d4f71b54bda02913_08900d18ed100f2bad6fc53388a71159.png",
		"possible_spam": false,
		"verified_contract": true,
		"total_supply": "0",
		"total_supply_formatted": "0",
		"percentage_relative_to_total_supply": 0,
		"security_score": 0,
		"db_token_info": {
			"id": "6ab91def-4d60-43d5-8fb5-802dce3c0209",
			"name": "USD Coin",
			"symbol": "USDC",
			"logo_url": "https://logo.moralis.io/0x2105_0x833589fcd6edb6e08f4c7c32d4f71b54bda02913_08900d18ed100f2bad6fc53388a71159.png",
			"is_active": true
		}
	},
	{
		"token_address": "0x50c5725949a6f0c72e6c4a641f24049a917db0cb",
		"name": "Dai Stablecoin",
		"symbol": "DAI",
		"chain": "base",
		"balance": "0",
		"formatted_balance": "0",
		"raw_balance": "0",
		"decimals": 18,
		"logo": "https://logo.moralis.io/0x2105_0x50c5725949a6f0c72e6c4a641f24049a917db0cb_0823c30a1e2daa50323969ebf5aaf891.png",
		"thumbnail": "https://logo.moralis.io/0x2105_0x50c5725949a6f0c72e6c4a641f24049a917db0cb_0823c30a1e2daa50323969ebf5aaf891.png",
		"possible_spam": false,
		"verified_contract": true,
		"total_supply": "0",
		"total_supply_formatted": "0",
		"percentage_relative_to_total_supply": 0,
		"security_score": 0,
		"db_token_info": {
			"id": "91137a60-3479-4032-b4e3-4b294272e935",
			"name": "Dai Stablecoin",
			"symbol": "DAI",
			"logo_url": "https://logo.moralis.io/0x2105_0x50c5725949a6f0c72e6c4a641f24049a917db0cb_0823c30a1e2daa50323969ebf5aaf891.png",
			"is_active": true
		}
	},
	{
		"token_address": "0x2ae3f1ec7f1f5012cfeab0185bfc7aa3cf0dec22",
		"name": "Coinbase Wrapped Staked ETH",
		"symbol": "cbETH",
		"chain": "base",
		"balance": "0",
		"formatted_balance": "0",
		"raw_balance": "0",
		"decimals": 18,
		"logo": "https://logo.moralis.io/0x2105_0x2ae3f1ec7f1f5012cfeab0185bfc7aa3cf0dec22_15a3a60b335edf04cd5636fe5d82f4b7.png",
		"thumbnail": "https://logo.moralis.io/0x2105_0x2ae3f1ec7f1f5012cfeab0185bfc7aa3cf0dec22_15a3a60b335edf04cd5636fe5d82f4b7.png",
		"possible_spam": false,
		"verified_contract": true,
		"total_supply": "0",
		"total_supply_formatted": "0",
		"percentage_relative_to_total_supply": 0,
		"security_score": 0,
		"db_token_info": {
			"id": "90bbcd62-c68d-4aee-9016-5482968b25b2",
			"name": "Coinbase Wrapped Staked ETH",
			"symbol": "cbETH",
			"logo_url": "https://logo.moralis.io/0x2105_0x2ae3f1ec7f1f5012cfeab0185bfc7aa3cf0dec22_15a3a60b335edf04cd5636fe5d82f4b7.png",
			"is_active": true
		}
	},
	{
		"token_address": "0x78a087d713be963bf307b18f2ff8122ef9a63ae9",
		"name": "Baseswap Token",
		"symbol": "BSWAP",
		"chain": "base",
		"balance": "0",
		"formatted_balance": "0",
		"raw_balance": "0",
		"decimals": 18,
		"logo": "https://logo.moralis.io/0x2105_0x78a087d713be963bf307b18f2ff8122ef9a63ae9_34dd3420a3499adaffde4888b42a9713.png",
		"thumbnail": "https://logo.moralis.io/0x2105_0x78a087d713be963bf307b18f2ff8122ef9a63ae9_34dd3420a3499adaffde4888b42a9713.png",
		"possible_spam": false,
		"verified_contract": true,
		"total_supply": "0",
		"total_supply_formatted": "0",
		"percentage_relative_to_total_supply": 0,
		"security_score": 0,
		"db_token_info": {
			"id": "1eeb5da8-f9ce-482e-90f5-ca1eda386f42",
			"name": "Baseswap Token",
			"symbol": "BSWAP",
			"logo_url": "https://logo.moralis.io/0x2105_0x78a087d713be963bf307b18f2ff8122ef9a63ae9_34dd3420a3499adaffde4888b42a9713.png",
			"is_active": true
		}
	},
	{
		"token_address": "0xd9aaec86b65d86f6a7b5b1b0c42ffa531710b6ca",
		"name": "USD Base Coin",
		"symbol": "USDbC",
		"chain": "base",
		"balance": "0",
		"formatted_balance": "0",
		"raw_balance": "0",
		"decimals": 6,
		"logo": "https://logo.moralis.io/0x2105_0xd9aaec86b65d86f6a7b5b1b0c42ffa531710b6ca_095f663a58f3991437e89e704b39dac4.jpg",
		"thumbnail": "https://logo.moralis.io/0x2105_0xd9aaec86b65d86f6a7b5b1b0c42ffa531710b6ca_095f663a58f3991437e89e704b39dac4.jpg",
		"possible_spam": false,
		"verified_contract": true,
		"total_supply": "0",
		"total_supply_formatted": "0",
		"percentage_relative_to_total_supply": 0,
		"security_score": 0,
		"db_token_info": {
			"id": "bb9a05a9-09cb-4fec-9544-b5de3f1e775b",
			"name": "USD Base Coin",
			"symbol": "USDbC",
			"logo_url": "https://logo.moralis.io/0x2105_0xd9aaec86b65d86f6a7b5b1b0c42ffa531710b6ca_095f663a58f3991437e89e704b39dac4.jpg",
			"is_active": true
		}
	},
	{
		"token_address": "0x4ed4e862860bed51a9570b96d89af5e1b0efefed",
		"name": "Degen",
		"symbol": "DEGEN",
		"chain": "base",
		"balance": "0",
		"formatted_balance": "0",
		"raw_balance": "0",
		"decimals": 18,
		"logo": "https://logo.moralis.io/0x2105_0x4ed4e862860bed51a9570b96d89af5e1b0efefed_041100bd9ef402a5af0858c68e9788d9.png",
		"thumbnail": "https://logo.moralis.io/0x2105_0x4ed4e862860bed51a9570b96d89af5e1b0efefed_041100bd9ef402a5af0858c68e9788d9.png",
		"possible_spam": false,
		"verified_contract": true,
		"total_supply": "0",
		"total_supply_formatted": "0",
		"percentage_relative_to_total_supply": 0,
		"security_score": 0,
		"db_token_info": {
			"id": "6fb7b2d2-45be-4ba9-94e1-e7c248260279",
			"name": "Degen",
			"symbol": "DEGEN",
			"logo_url": "https://logo.moralis.io/0x2105_0x4ed4e862860bed51a9570b96d89af5e1b0efefed_041100bd9ef402a5af0858c68e9788d9.png",
			"is_active": true
		}
	},
	{
		"token_address": "0x236aa50979d5f3de3bd1eeb40e81137f22ab794b",
		"name": "Base tBTC v2",
		"symbol": "tBTC",
		"chain": "base",
		"balance": "0",
		"formatted_balance": "0",
		"raw_balance": "0",
		"decimals": 18,
		"logo": "https://logo.moralis.io/0x2105_0x236aa50979d5f3de3bd1eeb40e81137f22ab794b_09b894c092212a1bf061357a666cd5ec.png",
		"thumbnail": "https://logo.moralis.io/0x2105_0x236aa50979d5f3de3bd1eeb40e81137f22ab794b_09b894c092212a1bf061357a666cd5ec.png",
		"possible_spam": false,
		"verified_contract": true,
		"total_supply": "0",
		"total_supply_formatted": "0",
		"percentage_relative_to_total_supply": 0,
		"security_score": 0,
		"db_token_info": {
			"id": "acb1d314-174d-4ff4-8b7d-c96763b93802",
			"name": "Base tBTC v2",
			"symbol": "tBTC",
			"logo_url": "https://logo.moralis.io/0x2105_0x236aa50979d5f3de3bd1eeb40e81137f22ab794b_09b894c092212a1bf061357a666cd5ec.png",
			"is_active": true
		}
	},
	{
		"token_address": "0x9e1028f5f1d5ede59748ffcee5532509976840e0",
		"name": "Compound",
		"symbol": "COMP",
		"chain": "base",
		"balance": "0",
		"formatted_balance": "0",
		"raw_balance": "0",
		"decimals": 18,
		"logo": "https://logo.moralis.io/0x2105_0x9e1028f5f1d5ede59748ffcee5532509976840e0_00ece89110f61b737ce2700d76f3ccd9.png",
		"thumbnail": "https://logo.moralis.io/0x2105_0x9e1028f5f1d5ede59748ffcee5532509976840e0_00ece89110f61b737ce2700d76f3ccd9.png",
		"possible_spam": false,
		"verified_contract": true,
		"total_supply": "0",
		"total_supply_formatted": "0",
		"percentage_relative_to_total_supply": 0,
		"security_score": 0,
		"db_token_info": {
			"id": "170c4788-72f2-4e87-9b8d-d7c68d1b66c4",
			"name": "Compound",
			"symbol": "COMP",
			"logo_url": "https://logo.moralis.io/0x2105_0x9e1028f5f1d5ede59748ffcee5532509976840e0_00ece89110f61b737ce2700d76f3ccd9.png",
			"is_active": true
		}
	},
	{
		"token_address": "0x27d2decb4bfc9c76f0309b8e88dec3a601fe25a8",
		"name": "Bald",
		"symbol": "BALD",
		"chain": "base",
		"balance": "0",
		"formatted_balance": "0",
		"raw_balance": "0",
		"decimals": 18,
		"logo": "https://logo.moralis.io/0x2105_0x27d2decb4bfc9c76f0309b8e88dec3a601fe25a8_6f388d809c863fcf5d5557607b632118.jpg",
		"thumbnail": "https://logo.moralis.io/0x2105_0x27d2decb4bfc9c76f0309b8e88dec3a601fe25a8_6f388d809c863fcf5d5557607b632118.jpg",
		"possible_spam": false,
		"verified_contract": true,
		"total_supply": "0",
		"total_supply_formatted": "0",
		"percentage_relative_to_total_supply": 0,
		"security_score": 0,
		"db_token_info": {
			"id": "0cb16339-8788-438d-9e68-bbe5fa6a6a89",
			"name": "Bald",
			"symbol": "BALD",
			"logo_url": "https://logo.moralis.io/0x2105_0x27d2decb4bfc9c76f0309b8e88dec3a601fe25a8_6f388d809c863fcf5d5557607b632118.jpg",
			"is_active": true
		}
	},
	{
		"token_address": "0x4200000000000000000000000000000000000006",
		"name": "Wrapped Ether",
		"symbol": "WETH",
		"chain": "base",
		"balance": "0",
		"formatted_balance": "0",
		"raw_balance": "0",
		"decimals": 18,
		"logo": "https://logo.moralis.io/0x2105_0x4200000000000000000000000000000000000006_007bb9c4823f3b0d0638b2d598359736.png",
		"thumbnail": "https://logo.moralis.io/0x2105_0x4200000000000000000000000000000000000006_007bb9c4823f3b0d0638b2d598359736.png",
		"possible_spam": false,
		"verified_contract": true,
		"total_supply": "0",
		"total_supply_formatted": "0",
		"percentage_relative_to_total_supply": 0,
		"security_score": 0,
		"db_token_info": {
			"id": "bc383117-a9bf-4fdb-90ac-266c2d4c5402",
			"name": "Wrapped Ether",
			"symbol": "WETH",
			"logo_url": "https://logo.moralis.io/0x2105_0x4200000000000000000000000000000000000006_007bb9c4823f3b0d0638b2d598359736.png",
			"is_active": true
		}
	}
]


type Wallet = {
	id: string;
	walletName: string;
	isDefault?: boolean;
	walletAddresses?: { address: string; chainId: number, chain: { name: string } }[];
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
	tokens: defautTokens as any as Token[],
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
							})
						})
					}
				}
				const getAddressRes = await getAddressBooksApi(access_token);
				set({
					wallets: wallets,
					walletCount: getWalletsRes.data?.count || 0,
					defaultWallet,
					chains: getSupprtedChainsRes?.statusCode === 200 ? getSupprtedChainsRes.data || [] : [],
					tokens: tokens.length > 0 ? tokens : defautTokens as any as Token[],
					addressBooks: getAddressRes?.statusCode === 200 ? getAddressRes.data?.rows || [] : [],
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
			if (getWalletsRes?.statusCode == 200) {
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

	fetchChains: async () => {
		const access_token = await DeviceStore.getItem("refresh_token");
		if (!access_token) return [];
		try {
			const res = await getSupprtedChainsApi(access_token);
			if (res?.statusCode === 200) {
				return res.data || [];
			}
		} catch (error) {
			console.error("Error fetching supported chains:", error);
		}
	},
	refetchAddress: async () => {
		const access_token = await DeviceStore.getItem("refresh_token");
		const getAddressRes = await getAddressBooksApi(access_token);
		set(pre => ({
			...pre,
			addressBooks: getAddressRes?.statusCode === 200 ? getAddressRes.data?.rows || [] : [],
		}));
	}
}));