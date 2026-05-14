'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import axios from 'axios';

const COOKIE_NAME = 'auth_token';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 8; // 8 jours en secondes
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3020/api';

interface User {
	id: string;
	email: string;
	name: string;
	role: 'CLIENT' | 'ADMIN' | 'SUPER_ADMIN';
	createdAt: string;
}

export const setSessionToken = async (token: string) => {
	const cookieStore = await cookies();
	cookieStore.set(COOKIE_NAME, token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax',
		maxAge: COOKIE_MAX_AGE,
		path: '/',
	});
};

export const getToken = async (): Promise<string | undefined> => {
	const cookieStore = await cookies();
	return cookieStore.get(COOKIE_NAME)?.value;
};

export const clearSession = async () => {
	const cookieStore = await cookies();
	cookieStore.delete(COOKIE_NAME);
};

export const getSession = async (): Promise<User | null> => {
	const token = await getToken();

	if (!token) {
		return null;
	}

	try {
		const response = await axios.get<User>(`${API_BASE_URL}/auth/me`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch {
		// Token invalide - on ne peut pas supprimer le cookie ici (Server Component)
		// La redirection vers login permettra à l'utilisateur de se reconnecter
		return null;
	}
};

export const requireSession = async (): Promise<User> => {
	const user = await getSession();

	if (!user) {
		redirect('/auth/login');
	}

	return user;
};

export const requireAdmin = async (): Promise<User> => {
	const user = await getSession();

	if (!user) {
		redirect('/auth/login');
	}

	if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
		redirect('/');
	}

	return user;
};
