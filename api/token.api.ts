import axiosClient from "./axiosClient";
import { SendTokenPayload, SwapTokenQueryParams, SwapTxQueryParams, Token, TokenQueryParams } from "./interface";

export async function getTokens({
	token,
	params,
}: {
	token: string;
	params: TokenQueryParams;
}): Promise<{ statusCode: number; data: Record<string, { chain: any; tokens: Token[] }> }> {
	return await axiosClient("supported-token", {
		method: "GET",
		token,
		params,
	});
}

export async function getSwapInfoApi({
	token,
	params,
}: {
	token: string;
	params: SwapTokenQueryParams;
}) {
	return await axiosClient("swap/quote", {
		method: "GET",
		token,
		params,
	});
}

export async function swapTxApi({
	token,
	params,
}: {
	token: string;
	params: SwapTxQueryParams;
}) {
	return await axiosClient("swap/tx", {
		method: "GET",
		token,
		params,
	});
}

export async function sendTokens(token: string, data: SendTokenPayload) {
	return await axiosClient("transaction/send", {
		method: "POST",
		token,
		data: JSON.stringify(data),
	});
}
