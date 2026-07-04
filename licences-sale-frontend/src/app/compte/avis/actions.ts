'use server';

import axios from 'axios';
import { revalidatePath } from 'next/cache';
import { AuthenticationError, api } from '~/lib/api';
import type { ReviewInput } from '~/validators/reviews';

interface ActionResult {
	success: boolean;
	error?: string;
}

export const createReviewAction = async (
	input: ReviewInput,
): Promise<ActionResult> => {
	try {
		await api.post('/reviews', input);
		// L'avis est en modération : on rafraîchit l'accueil (affiché une fois approuvé)
		revalidatePath('/');
		revalidatePath('/compte/avis');
		return { success: true };
	} catch (error) {
		if (error instanceof AuthenticationError) {
			return { success: false, error: 'Session expirée, reconnectez-vous.' };
		}
		if (axios.isAxiosError(error)) {
			const data = error.response?.data as { message?: string } | undefined;
			return {
				success: false,
				error: data?.message || "Erreur lors de l'envoi de votre avis.",
			};
		}
		return { success: false, error: "Erreur lors de l'envoi de votre avis." };
	}
};
