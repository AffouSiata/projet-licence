'use server';

import axios from 'axios';
import { revalidatePath } from 'next/cache';
import { AuthenticationError, api } from '~/lib/api';

interface UpdateProfileInput {
	name: string;
	email: string;
}

interface ActionResult {
	success: boolean;
	error?: string;
}

export const updateProfileAction = async (
	input: UpdateProfileInput,
): Promise<ActionResult> => {
	try {
		await api.patch('/auth/profile', {
			name: input.name,
			email: input.email,
		});
		// Rafraîchir les vues serveur qui affichent le profil
		revalidatePath('/compte/profil');
		revalidatePath('/compte');
		return { success: true };
	} catch (error) {
		if (error instanceof AuthenticationError) {
			return { success: false, error: 'Session expirée, reconnectez-vous.' };
		}
		if (axios.isAxiosError(error)) {
			const data = error.response?.data as { message?: string } | undefined;
			return {
				success: false,
				error: data?.message || 'Erreur lors de la mise à jour du profil.',
			};
		}
		return {
			success: false,
			error: 'Erreur lors de la mise à jour du profil.',
		};
	}
};
