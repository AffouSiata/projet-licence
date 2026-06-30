import 'server-only';
import axios from 'axios';
import { cookies } from 'next/headers';

// URL de base de l'API (peut être l'API mock locale ou une API externe)
const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3020/api';

// Instance axios avec configuration de base.
// Pas de Content-Type par défaut : il est défini par requête (cf. ci-dessous),
// car forcer 'application/json' casse les uploads FormData (axios convertirait
// le FormData en JSON et perdrait le fichier).
export const apiClient = axios.create({
	baseURL: API_BASE_URL,
});

// Fonction pour récupérer le token et le sessionId du cart (évite l'import circulaire)
const getAuthCookies = async (): Promise<{
	token?: string;
	sessionId?: string;
}> => {
	try {
		const cookieStore = await cookies();
		return {
			token: cookieStore.get('auth_token')?.value,
			sessionId: cookieStore.get('sessionId')?.value,
		};
	} catch {
		// Si on n'est pas dans un contexte serveur, retourner vide
		return {};
	}
};

// Erreur personnalisée pour les erreurs d'authentification
export class AuthenticationError extends Error {
	constructor(message = 'Non authentifié') {
		super(message);
		this.name = 'AuthenticationError';
	}
}

// Fonction helper pour créer une requête avec token + cookie de session cart
const createAuthenticatedRequest = async <T>(
	config: Parameters<typeof apiClient.request>[0],
): Promise<T> => {
	const { token, sessionId } = await getAuthCookies();

	// Pour un upload (FormData), on NE met PAS de Content-Type : axios pose
	// lui-même `multipart/form-data; boundary=...`. Sinon le fichier est perdu.
	const isFormData =
		typeof FormData !== 'undefined' && config.data instanceof FormData;

	const requestConfig = {
		...config,
		headers: {
			...(isFormData ? {} : { 'Content-Type': 'application/json' }),
			...config.headers,
			...(token ? { Authorization: `Bearer ${token}` } : {}),
			...(sessionId
				? { Cookie: `sessionId=${encodeURIComponent(sessionId)}` }
				: {}),
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
