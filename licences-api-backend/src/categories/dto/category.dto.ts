import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

// Schémas Zod pour les catégories
export const CreateCategorySchema = z.object({
	name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
	description: z.string().optional(),
	parentId: z.string().uuid('Parent ID invalide').optional(),
	order: z.coerce.number().int().min(0).optional(),
});

export const UpdateCategorySchema = CreateCategorySchema.partial();

// Types inférés
type CreateCategoryInput = z.infer<typeof CreateCategorySchema>;
type UpdateCategoryInput = z.infer<typeof UpdateCategorySchema>;

// DTOs
export class CreateCategoryDto
	extends createZodDto(CreateCategorySchema)
	implements CreateCategoryInput
{
	name!: string;
	description?: string;
	parentId?: string;
	order?: number;
}

export class UpdateCategoryDto
	extends createZodDto(UpdateCategorySchema)
	implements UpdateCategoryInput
{
	name?: string;
	description?: string;
	parentId?: string;
	order?: number;
}
