'use server';

import { revalidatePath } from 'next/cache';
import { createSafeActionClient } from 'next-safe-action';
import { z } from 'zod';
import { productSchema } from '~/validators/products';
import {
	createProductApi,
	deleteProductApi,
	restoreProductApi,
	toggleProductApi,
	updateProductApi,
} from './lib';

const action = createSafeActionClient();

export const createProductAction = action
	.schema(productSchema)
	.action(async ({ parsedInput }) => {
		if (!parsedInput.image) {
			return {
				success: false,
				error: "L'image est obligatoire",
			};
		}

		try {
			const response = await createProductApi(parsedInput);
			revalidatePath('/admin/products');
			return { success: true, data: response };
		} catch (error: any) {
			console.error('Erreur création produit:', error);
			return {
				success: false,
				error: error.response?.data?.message || 'Erreur lors de la création',
			};
		}
	});

export const updateProductAction = action
	.schema(productSchema.extend({ id: z.string() }))
	.action(async ({ parsedInput }) => {
		try {
			const { id, ...data } = parsedInput;
			const response = await updateProductApi(id, data);
			revalidatePath('/admin/products');
			return { success: true, data: response };
		} catch (error: any) {
			console.error('Erreur modification produit:', error);
			return {
				success: false,
				error:
					error.response?.data?.message || 'Erreur lors de la modification',
			};
		}
	});

export const deleteProductAction = action
	.schema(z.object({ id: z.string() }))
	.action(async ({ parsedInput: { id } }) => {
		try {
			await deleteProductApi(id);
			revalidatePath('/admin/products');
			return { success: true };
		} catch (error: any) {
			console.error('Erreur suppression produit:', error);
			return {
				success: false,
				error: error.response?.data?.message || 'Erreur lors de la suppression',
			};
		}
	});

export const restoreProductAction = action
	.schema(z.object({ id: z.string() }))
	.action(async ({ parsedInput: { id } }) => {
		try {
			const response = await restoreProductApi(id);
			revalidatePath('/admin/products');
			return { success: true, data: response };
		} catch (error: any) {
			console.error('Erreur restauration produit:', error);
			return {
				success: false,
				error:
					error.response?.data?.message || 'Erreur lors de la restauration',
			};
		}
	});

export const toggleProductAction = action
	.schema(z.object({ id: z.string() }))
	.action(async ({ parsedInput: { id } }) => {
		try {
			const response = await toggleProductApi(id);
			revalidatePath('/admin/products');
			return { success: true, data: response };
		} catch (error: any) {
			console.error('Erreur toggle produit:', error);
			return {
				success: false,
				error: error.response?.data?.message || 'Erreur lors de la mise à jour',
			};
		}
	});
