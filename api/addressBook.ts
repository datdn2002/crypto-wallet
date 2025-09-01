import axiosClient from "./axiosClient";
import { CreateAddressPayload } from "./interface";

export async function getAddressBooksApi(token: string) {
	return await axiosClient("address-book", {
		method: "GET",
		token,
	});
}

export async function createAddressBookApi(token: string, data: CreateAddressPayload) {
	return await axiosClient("address-book", {
		method: "POST",
		token,
		data: JSON.stringify(data),
	});
}

export async function deleteAddressBookApi(token: string, id: string) {
	return await axiosClient("address-book/" + id, {
		method: "DELETE",
		token,
	});
}

