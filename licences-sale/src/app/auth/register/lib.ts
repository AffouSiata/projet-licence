import { apiClient } from '~/lib/api';

export interface RegisterResponse {
	admin: {
		id: string;
		email: string;
		name: string;
		role: 'CLIENT' | 'ADMIN' | 'SUPER_ADMIN';
		createdAt: string;
	};
	accessToken: string;
	refreshToken: string;
}

export const registerApi = async (
	email: string,
	password: string,
	name: string,
): Promise<RegisterResponse> => {
	const response = await apiClient.post<RegisterResponse>(
		'/api/auth/register',
		{
			email,
			password,
			name,
		},
	);
	return response.data;
};
