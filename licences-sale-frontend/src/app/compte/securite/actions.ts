'use server';

import axios from 'axios';
import { AuthenticationError, api } from '~/lib/api';

interface ChangePasswordInput {
	currentPassword: string;
	newPassword: string;
}

interface ActionResult {
	success: boolean;
	error?: string;
}

export const changePasswordAction = async (
	input: ChangePasswordInput,
): Promise<ActionResult> => {
	try {
		await api.patch('/auth/password', {
			currentPassword: input.currentPassword,
			newPassword: input.newPassword,
		});
		return { success: true };
	} catch (error) {
		// Vrai 401 = session expirée (le mauvais mot de passe actuel renvoie un 400)
		if (error instanceof AuthenticationError) {
			return { success: false, error: 'Session expirée, reconnectez-vous.' };
		}
		if (axios.isAxiosError(error)) {
			const data = error.response?.data as { message?: string } | undefined;
			return {
				success: false,
				error: data?.message || 'Erreur lors du changement de mot de passe.',
			};
		}
		return {
			success: false,
			error: 'Erreur lors du changement de mot de passe.',
		};
	}
};
