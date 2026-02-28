import { ApiProperty } from '@nestjs/swagger';
import { ProductWithCategoryDto } from './product-response.dto';

export class ProductListResponseDto {
	@ApiProperty({ type: [ProductWithCategoryDto] })
	items!: ProductWithCategoryDto[];

	@ApiProperty({ example: 100 })
	total!: number;

	@ApiProperty({ example: 1 })
	page!: number;

	@ApiProperty({ example: 20 })
	limit!: number;

	@ApiProperty({ example: 5 })
	pageCount!: number;
}
