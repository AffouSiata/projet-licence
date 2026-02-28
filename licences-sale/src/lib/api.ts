import axios from 'axios';
import { getToken } from './session';

// URL de base de l'API (peut être l'API mock locale ou une API externe)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Instance axios avec configuration de base
export const apiClient = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

// Fonction helper pour créer une requête avec token
const createAuthenticatedRequest = async <T>(
	config: Parameters<typeof apiClient.request>[0],
): Promise<T> => {
	const token = await getToken();

	const requestConfig = {
		...config,
		headers: {
			...config.headers,
			...(token ? { Authorization: `Bearer ${token}` } : {}),
		},
	};

	const response = await apiClient.request<T>(requestConfig);
	return response.data;
};

// Export de l'instance pour utilisation directe
export const api = {
	get: async <T>(url: string, config = {}) =>
		createAuthenticatedRequest<T>({ ...config, method: 'GET', url }),

	post: async <T>(url: string, data?: unknown, config = {}) =>
		createAuthenticatedRequest<T>({ ...config, method: 'POST', url, data }),

	put: async <T>(url: string, data?: unknown, config = {}) =>
		createAuthenticatedRequest<T>({ ...config, method: 'PUT', url, data }),

	patch: async <T>(url: string, data?: unknown, config = {}) =>
		createAuthenticatedRequest<T>({ ...config, method: 'PATCH', url, data }),

	delete: async <T>(url: string, config = {}) =>
		createAuthenticatedRequest<T>({ ...config, method: 'DELETE', url }),
};
