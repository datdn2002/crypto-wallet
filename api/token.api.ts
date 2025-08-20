import axiosClient from "./axiosClient";
import { Token, TokenQueryParams } from "./interface";

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
