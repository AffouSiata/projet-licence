'use server';

import { revalidatePath } from 'next/cache';
import { createSafeActionClient } from 'next-safe-action';
import { z } from 'zod';
import { orderStatusEnum } from '~/validators/orders';
import { cancelOrderApi, updateOrderStatusApi } from './lib';

const action = createSafeActionClient();

export const updateOrderStatusAction = action
	.schema(z.object({ id: z.string(), status: orderStatusEnum }))
	.action(async ({ parsedInput: { id, status } }) => {
		try {
			const response = await updateOrderStatusApi(id, status);
			revalidatePath('/admin/orders');
			revalidatePath('/admin');
			return { success: true, data: response };
		} catch (error: any) {
			console.error('Erreur mise à jour statut:', error);
			return {
				success: false,
				error:
					error.response?.data?.message ||
					'Erreur lors de la mise à jour du statut',
			};
		}
	});

export const cancelOrderAction = action
	.schema(z.object({ id: z.string() }))
	.action(async ({ parsedInput: { id } }) => {
		try {
			const response = await cancelOrderApi(id);
			revalidatePath('/admin/orders');
			revalidatePath('/admin');
			return { success: true, data: response };
		} catch (error: any) {
			console.error('Erreur annulation commande:', error);
			return {
				success: false,
				error:
					error.response?.data?.message ||
					"Erreur lors de l'annulation de la commande",
			};
		}
	});
