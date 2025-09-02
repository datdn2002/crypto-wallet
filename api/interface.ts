export interface CreateUserPayload {
	email: string;
	password: string;
	user_name?: string;
	phone_number?: string;
}

export interface LoginPayload {
	email: string;
	password: string;
	user_name?: string;
	phone_number?: string;
}

export interface CreateWalletPayload {
	walletName: string;
	walletAddresses: { address: string; chainId: number }[];
}

export interface TokenQueryParams {
	chain?: string;
	includeMarketData?: boolean;
	isActive?: boolean;
	chartLimit?: number;
	timeframes?: Timeframe;
}

export interface Token {
	id: string;
	chain: string;
	contract_address: string;
	name: string;
	symbol: string;
	decimals: number;
	logo_url: string;
	is_active: boolean;
	market_data?: TokenWithMarketData;
	created_at: string; // ISO datetime
	updated_at: string; // ISO datetime
}

export interface ChartCandle {
	timestamp: string;
	open: number;
	high: number;
	low: number;
	close: number;
	volume: number;
}

export type Timeframe = "1m" | "15m" | "1h" | "3h" | "24h";

export interface TokenWithMarketData {
	symbol: string;
	contract_address: string;
	chain: string;
	current_price: number;
	price_change_percentage_24h: number;
	volume_24h: number;
	charts: {
		[key in Timeframe]: ChartCandle[];
	};
	chain_logo: string;
	market_cap: number;
	circulating_supply: number | null;
	total_supply: number;
}

export interface WalletAddress {
	id: string;
	address: string;
	alias: number;
	note: string;
}

export interface CreateAddressPayload {
	address: string;
	alias: number;
	note: string;
}

export interface SwapTokenQueryParams {
	chainId: string;
	fromTokenAddress: string;
	toTokenAddress: string;
	amount: string;
}

export interface SwapTxQueryParams {
	chainId: string;
	fromTokenAddress: string;
	toTokenAddress: string;
	amount: string;
	userAddress: string;
	slippage: number;
}

export interface SendOtpPayload {
	type: "email" | "phone";
	purpose: "verification" | "password_reset" | "login" | "transaction";
	email?: string;
	phoneNumber?: string;
}

export interface VerifyOtpPayload {
	type: "email" | "phone";
	purpose: "verification" | "password_reset" | "login" | "transaction";
	email?: string;
	phoneNumber?: string;
	code: string;
}

export interface SendTokenPayload {
	from_address: string;
	to_address: string;
	chain: string;
	token_address: string;
	amount: number;
}