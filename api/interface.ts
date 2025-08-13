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
