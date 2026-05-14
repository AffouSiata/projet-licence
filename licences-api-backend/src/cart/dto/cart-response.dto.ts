import { ApiProperty } from '@nestjs/swagger';

export class CartItemProductDto {
	@ApiProperty({ example: 'product-id-123' })
	id!: string;

	@ApiProperty({ example: 'Licence Windows 11 Pro' })
	name!: string;

	@ApiProperty({ example: 'licence-windows-11-pro' })
	slug!: string;

	@ApiProperty({ example: 89.99 })
	price!: number;

	@ApiProperty({ example: 'https://example.com/image.jpg', required: false })
	image?: string;

	@ApiProperty({ example: 50 })
	stockQuantity!: number;

	@ApiProperty({ example: true })
	isActive!: boolean;
}

export class CartItemDto {
	@ApiProperty({ example: 'item-id-123' })
	id!: string;

	@ApiProperty({ example: 'cart-id-123' })
	cartId!: string;

	@ApiProperty({ example: 'product-id-123' })
	productId!: string;

	@ApiProperty({ example: 2 })
	quantity!: number;

	@ApiProperty({ example: 89.99 })
	price!: number;

	@ApiProperty({ type: CartItemProductDto })
	product!: CartItemProductDto;

	@ApiProperty({ example: '2025-11-22T21:00:00.000Z' })
	createdAt!: Date;

	@ApiProperty({ example: '2025-11-22T21:00:00.000Z' })
	updatedAt!: Date;
}

export class CartResponseDto {
	@ApiProperty({ example: 'cart-id-123' })
	id!: string;

	@ApiProperty({ example: 'session-id-xyz' })
	sessionId!: string;

	@ApiProperty({ type: [CartItemDto] })
	items!: CartItemDto[];

	@ApiProperty({ example: 3, description: "Nombre total d'articles" })
	totalItems!: number;

	@ApiProperty({ example: 179.98, description: 'Montant total' })
	totalAmount!: number;

	@ApiProperty({ example: '2025-11-23T21:00:00.000Z' })
	expiresAt!: Date;

	@ApiProperty({ example: '2025-11-22T21:00:00.000Z' })
	createdAt!: Date;

	@ApiProperty({ example: '2025-11-22T21:00:00.000Z' })
	updatedAt!: Date;
}
