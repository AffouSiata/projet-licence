import { ApiProperty } from '@nestjs/swagger';

export class ProductResponseDto {
	@ApiProperty({ example: 'abc123-def456-ghi789' })
	id!: string;

	@ApiProperty({ example: 'Licence Windows 11 Pro' })
	name!: string;

	@ApiProperty({
		example: 'licence-windows-11-pro',
		description: 'URL-friendly slug',
	})
	slug!: string;

	@ApiProperty({
		example:
			'Licence authentique Windows 11 Professionnel - Activation permanente',
	})
	description!: string;

	@ApiProperty({
		example: 'Licence Windows 11 Pro avec activation permanente',
		required: false,
	})
	shortDesc?: string;

	@ApiProperty({ example: 89.99 })
	price!: number;

	@ApiProperty({ example: 129.99, required: false })
	comparePrice?: number;

	@ApiProperty({ example: 50, description: 'Quantité en stock' })
	stockQuantity!: number;

	@ApiProperty({ example: 'cat-id-123' })
	categoryId!: string;

	@ApiProperty({
		example: 'https://example.com/images/windows11.jpg',
	})
	image!: string;

	@ApiProperty({
		example: ['https://example.com/img1.jpg', 'https://example.com/img2.jpg'],
		type: [String],
	})
	images!: string[];

	@ApiProperty({
		example: ['windows', 'os', 'microsoft'],
		type: [String],
	})
	tags!: string[];

	@ApiProperty({ example: true })
	isActive!: boolean;

	@ApiProperty({ example: false })
	isFeatured!: boolean;

	@ApiProperty({
		example: 'Licence Windows 11 Pro - Activation permanente',
		required: false,
	})
	metaTitle?: string;

	@ApiProperty({
		example: 'Achetez votre licence Windows 11 Pro authentique...',
		required: false,
	})
	metaDesc?: string;

	@ApiProperty({ example: '2025-11-22T21:00:00.000Z' })
	createdAt!: Date;

	@ApiProperty({ example: '2025-11-22T21:00:00.000Z' })
	updatedAt!: Date;
}

export class CategoryInProductDto {
	@ApiProperty({ example: 'cat-id-123' })
	id!: string;

	@ApiProperty({ example: "Systèmes d'exploitation" })
	name!: string;

	@ApiProperty({ example: 'systemes-exploitation' })
	slug!: string;

	@ApiProperty({ example: true })
	isActive!: boolean;
}

export class ProductWithCategoryDto extends ProductResponseDto {
	@ApiProperty({ type: CategoryInProductDto })
	category!: CategoryInProductDto;
}
