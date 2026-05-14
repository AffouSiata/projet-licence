import { z } from 'zod';

export const orderStatusEnum = z.enum([
	'PENDING',
	'CONFIRMED',
	'PROCESSING',
	'COMPLETED',
	'CANCELLED',
]);

export type OrderStatus = z.infer<typeof orderStatusEnum>;

// Schema item de commande
export const orderItemSchema = z.object({
	id: z.string(),
	productName: z.string(),
	quantity: z.number(),
	price: z.union([z.string(), z.number()]),
	productId: z.string(),
	product: z
		.object({
			id: z.string(),
			name: z.string(),
			image: z.string().optional(),
		})
		.optional(),
});

export type OrderItem = z.infer<typeof orderItemSchema>;

// Schema réponse commande
export const orderResponseSchema = z.object({
	id: z.string(),
	orderNumber: z.string(),
	customerName: z.string(),
	customerEmail: z.string().nullable().optional(),
	customerPhone: z.string(),
	totalAmount: z.union([z.string(), z.number()]),
	status: orderStatusEnum,
	whatsappUrl: z.string().nullable().optional(),
	items: z.array(orderItemSchema).optional(),
	metadata: z.any().optional(),
	deletedAt: z.string().nullable().optional(),
	createdAt: z.string(),
	updatedAt: z.string(),
});

export type Order = z.infer<typeof orderResponseSchema>;
