import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

// Schema pour ajouter un produit au panier
export const AddToCartSchema = z.object({
	productId: z.string().uuid('ID de produit invalide'),
	quantity: z
		.number()
		.int('La quantité doit être un nombre entier')
		.positive('La quantité doit être positive')
		.max(100, 'Quantité maximale dépassée'),
});

// Schema pour mettre à jour la quantité d'un item
export const UpdateCartItemSchema = z.object({
	quantity: z
		.number()
		.int('La quantité doit être un nombre entier')
		.min(0, 'La quantité ne peut pas être négative')
		.max(100, 'Quantité maximale dépassée'),
});

// Types TypeScript inférés
export type AddToCartInput = z.infer<typeof AddToCartSchema>;
export type UpdateCartItemInput = z.infer<typeof UpdateCartItemSchema>;

// DTOs pour NestJS avec validation Zod
export class AddToCartDto
	extends createZodDto(AddToCartSchema)
	implements AddToCartInput
{
	productId!: string;
	quantity!: number;
}

export class UpdateCartItemDto
	extends createZodDto(UpdateCartItemSchema)
	implements UpdateCartItemInput
{
	quantity!: number;
}
