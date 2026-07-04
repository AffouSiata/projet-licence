import { z } from 'zod';

// Schéma de soumission d'un avis (côté formulaire client)
export const reviewSchema = z.object({
	rating: z.coerce.number().int().min(1).max(5),
	comment: z
		.string()
		.min(10, 'Votre avis doit contenir au moins 10 caractères')
		.max(500, 'Votre avis ne peut pas dépasser 500 caractères'),
	authorRole: z.string().max(60).optional(),
	location: z.string().max(60).optional(),
	productId: z.string().uuid().optional(),
});

export type ReviewInput = z.infer<typeof reviewSchema>;

// Forme d'un avis renvoyé par l'API
export interface Review {
	id: string;
	rating: number;
	comment: string;
	authorName: string;
	authorRole?: string | null;
	location?: string | null;
	isApproved: boolean;
	productId?: string | null;
	createdAt: string;
}
