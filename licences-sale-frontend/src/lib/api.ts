import 'server-only';
import axios from 'axios';
import { cookies } from 'next/headers';

// URL de base de l'API (peut être l'API mock locale ou une API externe)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3020/api';

// Instance axios avec configuration de base
export const apiClient = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

// Fonction pour récupérer le token directement (évite l'import circulaire)
const getTokenDirect = async (): Promise<string | undefined> => {
	try {
		const cookieStore = await cookies();
		return cookieStore.get('auth_token')?.value;
	} catch {
		// Si on n'est pas dans un contexte serveur, retourner undefined
		return undefined;
	}
};

// Erreur personnalisée pour les erreurs d'authentification
export class AuthenticationError extends Error {
	constructor(message = 'Non authentifié') {
		super(message);
		this.name = 'AuthenticationError';
	}
}

// Fonction helper pour créer une requête avec token
const createAuthenticatedRequest = async <T>(
	config: Parameters<typeof apiClient.request>[0],
): Promise<T> => {
	const token = await getTokenDirect();

	const requestConfig = {
		...config,
		headers: {
			...config.headers,
			...(token ? { Authorization: `Bearer ${token}` } : {}),
		},
	};

	try {
		const response = await apiClient.request<T>(requestConfig);
		return response.data;
	} catch (error) {
		// Convertir les erreurs 401 en AuthenticationError (silencieuse)
		if (axios.isAxiosError(error) && error.response?.status === 401) {
			throw new AuthenticationError();
		}
		throw error;
	}
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
