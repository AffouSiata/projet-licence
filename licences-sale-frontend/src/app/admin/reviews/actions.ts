'use server';

import axios from 'axios';
import { revalidatePath } from 'next/cache';
import { AuthenticationError } from '~/lib/api';
import { approveReviewApi, deleteReviewApi, rejectReviewApi } from './lib';

interface ActionResult {
	success: boolean;
	error?: string;
}

const revalidate = () => {
	revalidatePath('/admin/reviews');
	revalidatePath('/');
};

const toError = (error: unknown): ActionResult => {
	if (error instanceof AuthenticationError) {
		return { success: false, error: 'Session expirée, reconnectez-vous.' };
	}
	if (axios.isAxiosError(error)) {
		const data = error.response?.data as { message?: string } | undefined;
		return {
			success: false,
			error: data?.message || 'Une erreur est survenue.',
		};
	}
	return { success: false, error: 'Une erreur est survenue.' };
};

export const approveReviewAction = async (
	id: string,
): Promise<ActionResult> => {
	try {
		await approveReviewApi(id);
		revalidate();
		return { success: true };
	} catch (error) {
		return toError(error);
	}
};

export const rejectReviewAction = async (id: string): Promise<ActionResult> => {
	try {
		await rejectReviewApi(id);
		revalidate();
		return { success: true };
	} catch (error) {
		return toError(error);
	}
};

export const deleteReviewAction = async (id: string): Promise<ActionResult> => {
	try {
		await deleteReviewApi(id);
		revalidate();
		return { success: true };
	} catch (error) {
		return toError(error);
	}
};
