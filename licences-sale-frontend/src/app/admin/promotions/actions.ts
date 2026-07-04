'use server';

import { createSafeActionClient } from 'next-safe-action';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { promotionSchema } from '~/validators/promotions';
import {
	createPromotionApi,
	deletePromotionApi,
	togglePromotionApi,
	updatePromotionApi,
} from './lib';

const action = createSafeActionClient();

const revalidate = () => revalidatePath('/admin/promotions');

// biome-ignore lint/suspicious/noExplicitAny: erreur axios non typée
const errorMessage = (error: any, fallback: string) =>
	error?.response?.data?.message || fallback;

export const createPromotionAction = action
	.schema(promotionSchema)
	.action(async ({ parsedInput }) => {
		try {
			await createPromotionApi(parsedInput);
			revalidate();
			return { success: true };
		} catch (error) {
			return {
				success: false,
				error: errorMessage(error, 'Erreur lors de la création'),
			};
		}
	});

export const updatePromotionAction = action
	.schema(promotionSchema.extend({ id: z.string() }))
	.action(async ({ parsedInput }) => {
		try {
			const { id, ...data } = parsedInput;
			await updatePromotionApi(id, data);
			revalidate();
			return { success: true };
		} catch (error) {
			return {
				success: false,
				error: errorMessage(error, 'Erreur lors de la modification'),
			};
		}
	});

export const togglePromotionAction = action
	.schema(z.object({ id: z.string() }))
	.action(async ({ parsedInput: { id } }) => {
		try {
			await togglePromotionApi(id);
			revalidate();
			return { success: true };
		} catch (error) {
			return { success: false, error: errorMessage(error, 'Erreur') };
		}
	});

export const deletePromotionAction = action
	.schema(z.object({ id: z.string() }))
	.action(async ({ parsedInput: { id } }) => {
		try {
			await deletePromotionApi(id);
			revalidate();
			return { success: true };
		} catch (error) {
			return { success: false, error: errorMessage(error, 'Erreur') };
		}
	});
