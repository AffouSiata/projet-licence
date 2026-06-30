'use server';

import axios from 'axios';
import { redirect } from 'next/navigation';
import { createSafeActionClient } from 'next-safe-action';
import { loginApi } from '~/app/auth/login/lib';
import { registerApi } from '~/app/auth/register/lib';
import { clearSession, getToken, setSessionToken } from '~/lib/session';
import { loginSchema, registerSchema } from '~/validators/auth';

const action = createSafeActionClient();

// Récupère le message d'erreur renvoyé par l'API (corps { message })
const apiMessage = (error: unknown): string | undefined => {
	if (axios.isAxiosError(error)) {
		const data = error.response?.data as { message?: string } | undefined;
		return data?.message || error.message;
	}
	return undefined;
};

export const loginAction = action
	.schema(loginSchema)
	.action(async ({ parsedInput: { email, password } }) => {
		try {
			const response = await loginApi(email, password);

			// Stocker le token dans un cookie httpOnly
			await setSessionToken(response.accessToken);

			return {
				success: true,
				user: response.admin,
			};
		} catch (error) {
			if (axios.isAxiosError(error)) {
				if (error.response?.status === 401) {
					return {
						success: false,
						error: 'Email ou mot de passe incorrect',
					};
				}

				if (error.code === 'ECONNREFUSED') {
					return {
						success: false,
						error:
							"Impossible de se connecter à l'API. Vérifiez que l'API backend est lancée sur le port 3020.",
					};
				}
			}

			return {
				success: false,
				error:
					apiMessage(error) || 'Une erreur est survenue lors de la connexion',
			};
		}
	});

export const logoutAction = async () => {
	const token = await getToken();

	if (!token) {
		redirect('/auth/login');
	}

	await clearSession();
	redirect('/auth/login');
};

export const registerAction = action
	.schema(registerSchema)
	.action(async ({ parsedInput: { email, password, name } }) => {
		try {
			const response = await registerApi(email, password, name);

			// Stocker le token dans un cookie httpOnly
			await setSessionToken(response.accessToken);

			return {
				success: true,
				admin: response.admin,
			};
		} catch (error) {
			if (axios.isAxiosError(error)) {
				if (error.response?.status === 401) {
					return {
						success: false,
						error: 'Email déjà utilisé',
					};
				}

				if (error.response?.status === 400) {
					return {
						success: false,
						error: apiMessage(error) || 'Données invalides',
					};
				}
			}

			return {
				success: false,
				error:
					apiMessage(error) || "Une erreur est survenue lors de l'inscription",
			};
		}
	});
