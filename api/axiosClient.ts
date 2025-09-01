import axios, { AxiosResponse } from "axios";

declare module "axios" {
	export interface AxiosRequestConfig {
		token?: string; // thêm field tùy biến
	}
	export interface AxiosResponse {
		code: number;
		statusCode: number;
	}
}

// Tạo instance axios
const axiosClient = axios.create({
	baseURL: process.env.EXPO_PUBLIC_API_URL,
	timeout: 10000,
	headers: {
		"Content-Type": "application/json",
	},
});

// Interceptor request
axiosClient.interceptors.request.use(
	async (config) => {
		// gắn token vào header
		const { token } = config as any;
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

// Interceptor response
axiosClient.interceptors.response.use(
	(response) => {
		return response.data;
	},
	async (err) => {
		console.log(err);
		const response: AxiosResponse = err?.response;
		// const status = response?.status;
		// if (status == 404 || status == 401 || status == 400) {
		return response?.data || response;
		// }

		// if (!isCancel(err)) {
		//     return Promise.reject(response?.data || err);
		// }
		// return err
	}
);

export default axiosClient;
