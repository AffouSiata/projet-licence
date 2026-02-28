import { api, apiClient } from '~/lib/api';

export interface User {
	id: string;
	email: string;
	name: string;
	role: 'CLIENT' | 'ADMIN' | 'SUPER_ADMIN';
	createdAt: string;
}

export interface LoginResponse {
	accessToken: string;
	refreshToken: string;
	admin: User;
}

export const loginApi = async (
	email: string,
	password: string,
): Promise<LoginResponse> => {
	const response = await apiClient.post<LoginResponse>('/api/auth/login', {
		email,
		password,
	});
	return response.data;
};

export const getMeApi = async (): Promise<User> => {
	return api.get<User>('/api/auth/me');
};

export const refreshTokenApi = async (): Promise<{
	accessToken: string;
	refreshToken: string;
}> => {
	return api.post('/api/auth/refresh');
};
