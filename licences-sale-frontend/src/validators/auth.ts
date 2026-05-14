import { z } from 'zod';

// Schema pour le formulaire de login
export const loginSchema = z.object({
	email: z
		.string()
		.min(1, "L'email est requis")
		.email('Email invalide')
		.toLowerCase()
		.trim(),
	password: z
		.string()
		.min(1, 'Le mot de passe est requis')
		.min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

export type LoginInput = z.infer<typeof loginSchema>;

// Schema pour le formulaire d'inscription (correspond exactement à l'API backend)
export const registerSchema = z.object({
	email: z
		.string()
		.min(1, "L'email est requis")
		.email('Email invalide')
		.toLowerCase()
		.trim(),
	password: z
		.string()
		.min(8, 'Le mot de passe doit contenir au moins 8 caractères')
		.regex(
			/(?=.*[a-z])/,
			'Le mot de passe doit contenir au moins une minuscule',
		)
		.regex(
			/(?=.*[A-Z])/,
			'Le mot de passe doit contenir au moins une majuscule',
		)
		.regex(/(?=.*\d)/, 'Le mot de passe doit contenir au moins un chiffre'),
	name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
});

export type RegisterInput = z.infer<typeof registerSchema>;

// Schema pour la réponse admin de l'API
export const adminSchema = z.object({
	id: z.string(),
	email: z.string().email(),
	name: z.string(),
	role: z.enum(['CLIENT', 'ADMIN', 'SUPER_ADMIN']),
	createdAt: z.string(),
});

export type Admin = z.infer<typeof adminSchema>;

// Schema pour la réponse de login
export const loginResponseSchema = z.object({
	accessToken: z.string(),
	refreshToken: z.string(),
	admin: adminSchema,
});

export type LoginResponse = z.infer<typeof loginResponseSchema>;
