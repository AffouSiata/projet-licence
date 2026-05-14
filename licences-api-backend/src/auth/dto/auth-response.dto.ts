import { ApiProperty } from '@nestjs/swagger';

export class AdminResponseDto {
	@ApiProperty({ example: 'uuid-string' })
	id: string;

	@ApiProperty({ example: 'admin@example.com' })
	email: string;

	@ApiProperty({ example: 'John Doe' })
	name: string;

	@ApiProperty({ enum: ['SUPER_ADMIN', 'ADMIN', 'CLIENT'] })
	role: string;

	@ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
	createdAt: Date;
}

export class TokensResponseDto {
	@ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
	accessToken: string;

	@ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
	refreshToken: string;
}

export class LoginResponseDto {
	@ApiProperty({ type: AdminResponseDto })
	admin: AdminResponseDto;

	@ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
	accessToken: string;

	@ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
	refreshToken: string;
}

export class RegisterResponseDto extends LoginResponseDto {}

export class ValidationErrorDto {
	@ApiProperty({ example: 400 })
	statusCode: number;

	@ApiProperty({ example: 'Validation failed' })
	message: string;

	@ApiProperty({
		type: 'array',
		items: {
			type: 'object',
			properties: {
				code: { type: 'string', example: 'too_small' },
				path: {
					type: 'array',
					items: { type: 'string' },
					example: ['password'],
				},
				message: {
					type: 'string',
					example: 'Le mot de passe doit contenir au moins 8 caractères',
				},
			},
		},
	})
	errors: Array<{
		code: string;
		path: string[];
		message: string;
		[key: string]: unknown;
	}>;
}
