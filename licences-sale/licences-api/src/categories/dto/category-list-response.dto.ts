import { ApiProperty } from '@nestjs/swagger';
import { CategoryWithRelationsDto } from './category-response.dto';

export class CategoryListResponseDto {
	@ApiProperty({ type: [CategoryWithRelationsDto] })
	items!: CategoryWithRelationsDto[];

	@ApiProperty({ example: 10 })
	total!: number;

	@ApiProperty({ example: 1 })
	page!: number;

	@ApiProperty({ example: 20 })
	limit!: number;

	@ApiProperty({ example: 1 })
	pageCount!: number;
}
