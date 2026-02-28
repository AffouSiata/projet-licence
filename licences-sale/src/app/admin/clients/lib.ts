import { api } from '~/lib/api';
import type { ClientsList } from '~/validators/clients';

export const fetchClientsApi = async (params?: Record<string, string>) => {
	const query = params ? `?${new URLSearchParams(params).toString()}` : '';
	return api.get<ClientsList>(`/api/auth/users${query}`);
};
