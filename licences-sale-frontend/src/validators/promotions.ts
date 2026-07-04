import { z } from 'zod';

export const promotionSchema = z.object({
	code: z
		.string()
		.min(3, 'Le code doit contenir au moins 3 caractères')
		.max(30),
	description: z.string().max(200).optional(),
	type: z.enum(['PERCENTAGE', 'FIXED']),
	value: z.coerce.number().positive('La valeur doit être positive'),
	minAmount: z.coerce.number().min(0).optional(),
	maxUses: z.coerce.number().int().positive().optional(),
	isActive: z.boolean().optional(),
});

export type PromotionInput = z.infer<typeof promotionSchema>;

export interface Promotion {
	id: string;
	code: string;
	description?: string | null;
	type: 'PERCENTAGE' | 'FIXED';
	value: string | number;
	minAmount?: string | number | null;
	maxUses?: number | null;
	usedCount: number;
	startsAt?: string | null;
	endsAt?: string | null;
	isActive: boolean;
	createdAt: string;
}
