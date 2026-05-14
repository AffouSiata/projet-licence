import { ApiProperty } from '@nestjs/swagger';

export class OrderItemProductDto {
	@ApiProperty({ example: 'product-id-123' })
	id!: string;

	@ApiProperty({ example: 'Licence Windows 11 Pro' })
	name!: string;

	@ApiProperty({ example: 'licence-windows-11-pro' })
	slug!: string;
}

export class OrderItemDto {
	@ApiProperty({ example: 'item-id-123' })
	id!: string;

	@ApiProperty({ example: 'order-id-123' })
	orderId!: string;

	@ApiProperty({ example: 'product-id-123' })
	productId!: string;

	@ApiProperty({ example: 2 })
	quantity!: number;

	@ApiProperty({ example: 89.99 })
	price!: number;

	@ApiProperty({ example: 'Licence Windows 11 Pro' })
	productName!: string;

	@ApiProperty({ type: OrderItemProductDto })
	product!: OrderItemProductDto;

	@ApiProperty({ example: '2025-11-22T21:00:00.000Z' })
	createdAt!: Date;
}

export class OrderResponseDto {
	@ApiProperty({ example: 'order-id-123' })
	id!: string;

	@ApiProperty({ example: 'ORD-2025-001' })
	orderNumber!: string;

	@ApiProperty({ example: 'Jean Dupont' })
	customerName!: string;

	@ApiProperty({ example: 'jean@example.com', required: false })
	customerEmail?: string;

	@ApiProperty({ example: '+33612345678' })
	customerPhone!: string;

	@ApiProperty({ example: 179.98 })
	totalAmount!: number;

	@ApiProperty({
		example: 'PENDING',
		enum: ['PENDING', 'CONFIRMED', 'PROCESSING', 'COMPLETED', 'CANCELLED'],
	})
	status!: string;

	@ApiProperty({
		example:
			'https://wa.me/33612345678?text=Bonjour%2C%20voici%20ma%20commande...',
		required: false,
	})
	whatsappUrl?: string;

	@ApiProperty({ type: [OrderItemDto] })
	items!: OrderItemDto[];

	@ApiProperty({ required: false })
	metadata?: Record<string, unknown>;

	@ApiProperty({ example: '2025-11-22T21:00:00.000Z' })
	createdAt!: Date;

	@ApiProperty({ example: '2025-11-22T21:00:00.000Z' })
	updatedAt!: Date;
}
