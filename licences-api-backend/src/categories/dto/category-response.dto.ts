import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CategoryResponseDto {
	@ApiProperty({ example: 'uuid-string' })
	id: string;

	@ApiProperty({ example: 'Jeux PC' })
	name: string;

	@ApiProperty({ example: 'jeux-pc' })
	slug: string;

	@ApiPropertyOptional({ example: 'Description de la catégorie' })
	description?: string;

	@ApiProperty({ example: 'https://example.com/image.jpg' })
	image: string;

	@ApiProperty({ example: true })
	isActive: boolean;

	@ApiProperty({ example: 0 })
	order: number;

	@ApiPropertyOptional({ example: 'uuid-parent-id' })
	parentId?: string;

	@ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
	createdAt: Date;

	@ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
	updatedAt: Date;
}

export class CategoryWithRelationsDto extends CategoryResponseDto {
	@ApiPropertyOptional({ type: () => CategoryResponseDto })
	parent?: CategoryResponseDto;

	@ApiPropertyOptional({ type: () => [CategoryResponseDto] })
	children?: CategoryResponseDto[];

	@ApiPropertyOptional({
		type: 'object',
		properties: {
			products: { type: 'number', example: 10 },
		},
	})
	_count?: { products: number };
}
