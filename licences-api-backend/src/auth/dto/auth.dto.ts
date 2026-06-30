import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

// Schémas Zod pour l'authentification
export const RegisterSchema = z.object({
	email: z.string().email('Email invalide'),
	password: z
		.string()
		.min(8, 'Le mot de passe doit contenir au moins 8 caractères')
		.regex(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
			'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre',
		),
	name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
	role: z.enum(['SUPER_ADMIN', 'ADMIN', 'CLIENT']).optional(),
});

export const LoginSchema = z.object({
	email: z.string().email('Email invalide'),
	password: z.string().min(1, 'Le mot de passe est requis'),
});

// Mise à jour du profil (nom et/ou email)
export const UpdateProfileSchema = z.object({
	name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
	email: z.string().email('Email invalide'),
});

// Changement de mot de passe
export const ChangePasswordSchema = z.object({
	currentPassword: z.string().min(1, 'Le mot de passe actuel est requis'),
	newPassword: z
		.string()
		.min(8, 'Le mot de passe doit contenir au moins 8 caractères')
		.regex(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
			'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre',
		),
});

// Types inférés
type RegisterInput = z.infer<typeof RegisterSchema>;
type LoginInput = z.infer<typeof LoginSchema>;
type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;
type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;

// DTOs générés à partir des schémas Zod
export class RegisterDto
	extends createZodDto(RegisterSchema)
	implements RegisterInput
{
	email!: string;
	password!: string;
	name!: string;
	role?: 'SUPER_ADMIN' | 'ADMIN' | 'CLIENT';
}

export class LoginDto extends createZodDto(LoginSchema) implements LoginInput {
	email!: string;
	password!: string;
}

export class UpdateProfileDto
	extends createZodDto(UpdateProfileSchema)
	implements UpdateProfileInput
{
	name!: string;
	email!: string;
}

export class ChangePasswordDto
	extends createZodDto(ChangePasswordSchema)
	implements ChangePasswordInput
{
	currentPassword!: string;
	newPassword!: string;
}
