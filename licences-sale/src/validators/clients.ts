import { z } from 'zod';

export const clientSchema = z.object({
	id: z.string(),
	email: z.string(),
	name: z.string(),
	role: z.string(),
	isActive: z.boolean(),
	createdAt: z.string(),
});

export type Client = z.infer<typeof clientSchema>;

export const clientsListSchema = z.object({
	items: z.array(clientSchema),
	total: z.number(),
	page: z.number(),
	limit: z.number(),
	pageCount: z.number(),
});

export type ClientsList = z.infer<typeof clientsListSchema>;
