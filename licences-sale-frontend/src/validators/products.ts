import { z } from 'zod';

// Schema pour créer/modifier un produit (formulaire)
export const productSchema = z.object({
	name: z
		.string()
		.min(2, 'Le nom doit contenir au moins 2 caractères')
		.max(200, 'Le nom ne peut pas dépasser 200 caractères'),
	description: z
		.string()
		.min(10, 'La description doit contenir au moins 10 caractères')
		.max(2000, 'La description ne peut pas dépasser 2000 caractères'),
	price: z.coerce.number().min(0, 'Le prix doit être positif'),
	discount: z.coerce
		.number()
		.min(0, 'La réduction doit être entre 0 et 100')
		.max(100, 'La réduction doit être entre 0 et 100')
		.optional(),
	stockQuantity: z.coerce
		.number()
		.int()
		.min(0, 'Le stock doit être positif')
		.optional(),
	categoryId: z.string().min(1, 'La catégorie est obligatoire'),
	tags: z.string().optional(),
	isActive: z.boolean().optional(),
	isFeatured: z.boolean().optional(),
	image: z.any().optional(),
});

export type ProductInput = z.infer<typeof productSchema>;

// Schema de réponse catégorie imbriquée
const categoryRelationSchema = z.object({
	id: z.string(),
	name: z.string(),
	slug: z.string(),
});

// Schema de réponse produit
export const productResponseSchema = z.object({
	id: z.string(),
	name: z.string(),
	slug: z.string(),
	description: z.string(),
	shortDesc: z.string().nullable().optional(),
	price: z.union([z.string(), z.number()]),
	discount: z.number(),
	image: z.string(),
	images: z.array(z.string()).optional(),
	stockQuantity: z.number(),
	isActive: z.boolean(),
	isFeatured: z.boolean(),
	tags: z.array(z.string()).optional(),
	categoryId: z.string(),
	category: categoryRelationSchema.optional(),
	deletedAt: z.string().nullable().optional(),
	createdAt: z.string(),
	updatedAt: z.string(),
});

export type Product = z.infer<typeof productResponseSchema>;

// Schema pour la liste paginée
export const productsListSchema = z.object({
	items: z.array(productResponseSchema),
	total: z.number(),
	page: z.number(),
	limit: z.number(),
	pageCount: z.number(),
});

export type ProductsList = z.infer<typeof productsListSchema>;
