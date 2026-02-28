'use server';

import { createSafeActionClient } from 'next-safe-action';
import { revalidatePath } from 'next/cache';
import { categorySchema } from '~/validators/categories';
import { z } from 'zod';
import {
	createCategoryApi,
	deleteCategoryApi,
	toggleCategoryApi,
	updateCategoryApi,
} from './lib';

const action = createSafeActionClient();

// Action pour créer une catégorie
export const createCategoryAction = action
	.schema(categorySchema)
	.action(async ({ parsedInput }) => {
		if (!parsedInput.image) {
			return {
				success: false,
				error: "L'image est obligatoire",
			};
		}

		try {
			const response = await createCategoryApi(parsedInput);
			revalidatePath('/admin/categories');
			return { success: true, data: response };
		} catch (error: any) {
			console.error('Erreur création catégorie:', error);
			return {
				success: false,
				error: error.response?.data?.message || 'Erreur lors de la création',
			};
		}
	});

// Action pour modifier une catégorie
export const updateCategoryAction = action
	.schema(categorySchema.extend({ id: z.string() }))
	.action(async ({ parsedInput }) => {
		try {
			const { id, ...data } = parsedInput;
			const response = await updateCategoryApi(id, data);
			revalidatePath('/admin/categories');
			return { success: true, data: response };
		} catch (error: any) {
			console.error('Erreur modification catégorie:', error);
			return {
				success: false,
				error:
					error.response?.data?.message || 'Erreur lors de la modification',
			};
		}
	});

// Action pour supprimer une catégorie
export const deleteCategoryAction = action
	.schema(z.object({ id: z.string() }))
	.action(async ({ parsedInput: { id } }) => {
		try {
			await deleteCategoryApi(id);
			revalidatePath('/admin/categories');
			return { success: true };
		} catch (error: any) {
			console.error('Erreur suppression catégorie:', error);
			return {
				success: false,
				error: error.response?.data?.message || 'Erreur lors de la suppression',
			};
		}
	});

// Action pour activer/désactiver une catégorie
export const toggleCategoryAction = action
	.schema(z.object({ id: z.string() }))
	.action(async ({ parsedInput: { id } }) => {
		try {
			const response = await toggleCategoryApi(id);
			revalidatePath('/admin/categories');
			return { success: true, data: response };
		} catch (error: any) {
			console.error('Erreur toggle catégorie:', error);
			return {
				success: false,
				error: error.response?.data?.message || 'Erreur lors de la mise à jour',
			};
		}
	});
