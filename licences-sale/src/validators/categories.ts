import { z } from 'zod';

// Schema pour créer/modifier une catégorie
export const categorySchema = z.object({
	name: z
		.string()
		.min(2, 'Le nom doit contenir au moins 2 caractères')
		.max(100, 'Le nom ne peut pas dépasser 100 caractères'),
	description: z
		.string()
		.max(500, 'La description ne peut pas dépasser 500 caractères')
		.optional(),
	parentId: z.string().optional(),
	order: z.number().optional(),
	image: z.any().optional(),
});

export type CategoryInput = z.infer<typeof categorySchema>;

const categoryBaseSchema = z.object({
	id: z.string(),
	name: z.string(),
	slug: z.string(),
	description: z.string().optional(),
	icon: z.string().optional(),
	image: z.string().optional(),
	isActive: z.boolean(),
	order: z.number(),
	parentId: z.string().optional().nullable(),
	createdAt: z.string(),
	updatedAt: z.string(),
});

// Schema pour une catégorie de l'API
export const categoryResponseSchema = categoryBaseSchema;

export const categoryWithRelationsSchema = categoryBaseSchema.extend({
	parent: categoryBaseSchema.nullable().optional(),
	children: z.array(categoryBaseSchema).optional(),
	_count: z
		.object({
			products: z.number(),
		})
		.optional(),
});

export type Category = z.infer<typeof categoryWithRelationsSchema>;

// Schema pour la liste paginée
export const categoriesListSchema = z.object({
	items: z.array(categoryWithRelationsSchema),
	total: z.number(),
	page: z.number(),
	limit: z.number(),
	pageCount: z.number(),
});

export type CategoriesList = z.infer<typeof categoriesListSchema>;
