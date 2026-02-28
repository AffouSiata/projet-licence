import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

// Schema de validation pour la création d'un produit
export const CreateProductSchema = z.object({
	name: z
		.string()
		.min(2, 'Le nom doit contenir au moins 2 caractères')
		.max(100, 'Le nom ne peut pas dépasser 100 caractères'),
	description: z
		.string()
		.min(10, 'La description doit contenir au moins 10 caractères'),
	price: z.coerce
		.number()
		.positive('Le prix doit être positif')
		.max(999999.99, 'Le prix est trop élevé'),
	discount: z.coerce
		.number()
		.int('Le discount doit être un nombre entier')
		.min(0, 'Le discount ne peut pas être négatif')
		.max(100, 'Le discount ne peut pas dépasser 100%')
		.default(0),
	stockQuantity: z.coerce
		.number()
		.int('Le stock doit être un nombre entier')
		.min(0, 'Le stock ne peut pas être négatif')
		.default(0),
	categoryId: z.string().uuid('ID de catégorie invalide'),
	// tags arrive comme string séparé par virgules depuis form-data
	tags: z
		.string()
		.optional()
		.transform((val) =>
			val
				? val
						.split(',')
						.map((t) => t.trim())
						.filter(Boolean)
				: [],
		),
	isActive: z.coerce.boolean().optional().default(true),
	isFeatured: z.coerce.boolean().optional().default(false),
});

// Schema de validation pour la mise à jour d'un produit
export const UpdateProductSchema = CreateProductSchema.partial();

// Types TypeScript inférés
export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;

// DTOs pour NestJS avec validation Zod
export class CreateProductDto
	extends createZodDto(CreateProductSchema)
	implements CreateProductInput
{
	name!: string;
	description!: string;
	price!: number;
	discount!: number;
	stockQuantity!: number;
	categoryId!: string;
	tags!: string[];
	isActive!: boolean;
	isFeatured!: boolean;
}

export class UpdateProductDto
	extends createZodDto(UpdateProductSchema)
	implements UpdateProductInput
{
	name?: string;
	description?: string;
	price?: number;
	discount?: number;
	stockQuantity?: number;
	categoryId?: string;
	tags?: string[];
	isActive?: boolean;
	isFeatured?: boolean;
}
