import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

// Schema pour créer une commande
export const CreateOrderSchema = z.object({
	customerName: z
		.string()
		.min(2, 'Le nom doit contenir au moins 2 caractères')
		.max(100, 'Le nom est trop long'),
	customerEmail: z.string().email('Email invalide').optional(),
	customerPhone: z
		.string()
		.regex(/^(\+|00)?[0-9]{8,15}$/, 'Numéro de téléphone invalide'),
	metadata: z.record(z.string(), z.unknown()).optional(),
});

// Schema pour mettre à jour le statut d'une commande
export const UpdateOrderStatusSchema = z.object({
	status: z.enum([
		'PENDING',
		'CONFIRMED',
		'PROCESSING',
		'COMPLETED',
		'CANCELLED',
	]),
});

// Types TypeScript inférés
export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof UpdateOrderStatusSchema>;

// DTOs pour NestJS avec validation Zod
export class CreateOrderDto
	extends createZodDto(CreateOrderSchema)
	implements CreateOrderInput
{
	customerName!: string;
	customerEmail?: string;
	customerPhone!: string;
	metadata?: Record<string, unknown>;
}

export class UpdateOrderStatusDto
	extends createZodDto(UpdateOrderStatusSchema)
	implements UpdateOrderStatusInput
{
	status!: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
}
