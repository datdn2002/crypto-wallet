import axiosClient from "./axiosClient";
import { CreateWalletPayload } from "./interface";

export async function getAllWalletsApi(token: string) {
  return await axiosClient("wallet", {
    method: "GET",
    token,
  });
}

export async function createWalletApi(token: string, data: CreateWalletPayload) {
  return await axiosClient("wallet/register-address", {
    method: "POST",
    token,
    data: JSON.stringify(data),
  });
}