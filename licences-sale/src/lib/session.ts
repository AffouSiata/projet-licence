'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getMeApi } from '../app/auth/login/lib';

const COOKIE_NAME = 'auth_token';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 8; // 8 jours en secondes

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

export const getSession = async () => {
	const token = await getToken();

	if (!token) {
		redirect('/auth/login');
	}

	try {
		const user = await getMeApi();
		return user;
	} catch (error) {
		redirect('/auth/login');
	}
};

export const requireAdmin = async () => {
	const user = await getSession();

	if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
		redirect('/');
	}

	return user;
};
