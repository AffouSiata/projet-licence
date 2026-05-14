import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OrderStatus, type Prisma } from '@prisma/client';
import { I18nService } from 'nestjs-i18n';
import { CartService, type CartWithItems } from '../cart/cart.service';
import { PrismaService } from '../prisma/prisma.service';
import { ProductsService } from '../products/products.service';
import type { CreateOrderInput, UpdateOrderStatusInput } from './dto/order.dto';

@Injectable()
export class OrdersService {
	constructor(
		private prisma: PrismaService,
		private cartService: CartService,
		private productsService: ProductsService,
		private configService: ConfigService,
		private readonly i18n: I18nService,
	) {}

	/**
	 * Créer une commande à partir du panier
	 */
	async createFromCart(
		sessionId: string,
		data: CreateOrderInput,
		lang?: string,
	) {
		// Récupérer le panier
		const cart: CartWithItems =
			await this.cartService.getOrCreateCart(sessionId);

		if (!cart.items || cart.items.length === 0) {
			throw new NotFoundException(
				this.i18n.t('errors.order.emptyCart', { lang }),
			);
		}

		// Vérifier le stock pour tous les produits
		for (const item of cart.items) {
			const hasStock = await this.productsService.checkStock(
				item.product.id,
				item.quantity,
				lang,
			);
			if (!hasStock) {
				throw new NotFoundException(
					this.i18n.t('errors.order.insufficientStock', {
						args: { productName: item.product.name },
						lang,
					}),
				);
			}
		}

		// Générer un numéro de commande unique
		const orderNumber = await this.generateOrderNumber();

		// Calculer le montant total
		const totalAmount = cart.items.reduce(
			(sum, item) => sum + Number(item.price) * item.quantity,
			0,
		);

		// Créer la commande avec les items
		const order = await this.prisma.order.create({
			data: {
				orderNumber,
				customerName: data.customerName,
				customerEmail: data.customerEmail,
				customerPhone: data.customerPhone,
				totalAmount,
				metadata: (data.metadata || {}) as Prisma.InputJsonValue,
				items: {
					create: cart.items.map((item) => ({
						productId: item.product.id,
						quantity: item.quantity,
						price: item.price,
						productName: item.product.name,
					})),
				},
			},
			include: {
				items: {
					include: {
						product: {
							select: {
								id: true,
								name: true,
								slug: true,
							},
						},
					},
				},
			},
		});

		// Décrémenter le stock pour chaque produit
		for (const item of cart.items) {
			await this.productsService.decrementStock(
				item.product.id,
				item.quantity,
				lang,
			);
		}

		// Générer l'URL WhatsApp
		const whatsappUrl = this.generateWhatsAppUrl({
			orderNumber: order.orderNumber,
			customerName: order.customerName,
			totalAmount: order.totalAmount,
			items: order.items.map((item) => ({
				productName: item.productName,
				quantity: item.quantity,
				price: item.price,
			})),
		});

		// Mettre à jour la commande avec l'URL WhatsApp
		const updatedOrder = await this.prisma.order.update({
			where: { id: order.id },
			data: { whatsappUrl },
			include: {
				items: {
					include: {
						product: {
							select: {
								id: true,
								name: true,
								slug: true,
							},
						},
					},
				},
			},
		});

		// Vider le panier
		await this.cartService.clearCart(sessionId);

		return updatedOrder;
	}

	/**
	 * Récupérer toutes les commandes (admin)
	 */
	async findAll(status?: OrderStatus) {
		const where = status ? { status, deletedAt: null } : { deletedAt: null };

		return this.prisma.order.findMany({
			where,
			include: {
				items: {
					include: {
						product: {
							select: {
								id: true,
								name: true,
								slug: true,
							},
						},
					},
				},
			},
			orderBy: { createdAt: 'desc' },
		});
	}

	/**
	 * Récupérer une commande par ID
	 */
	async findOne(id: string, lang?: string) {
		const order = await this.prisma.order.findFirst({
			where: { id, deletedAt: null },
			include: {
				items: {
					include: {
						product: {
							select: {
								id: true,
								name: true,
								slug: true,
							},
						},
					},
				},
			},
		});

		if (!order) {
			throw new NotFoundException(
				this.i18n.t('errors.order_find.notFound', { args: { id }, lang }),
			);
		}

		return order;
	}

	/**
	 * Récupérer une commande par numéro
	 */
	async findByOrderNumber(orderNumber: string, lang?: string) {
		const order = await this.prisma.order.findFirst({
			where: { orderNumber, deletedAt: null },
			include: {
				items: {
					include: {
						product: {
							select: {
								id: true,
								name: true,
								slug: true,
							},
						},
					},
				},
			},
		});

		if (!order) {
			throw new NotFoundException(
				this.i18n.t('errors.order_find.notFoundByNumber', {
					args: { orderNumber },
					lang,
				}),
			);
		}

		return order;
	}

	/**
	 * Mettre à jour le statut d'une commande
	 */
	async updateStatus(id: string, data: UpdateOrderStatusInput) {
		await this.findOne(id);

		return this.prisma.order.update({
			where: { id },
			data: { status: data.status },
			include: {
				items: {
					include: {
						product: {
							select: {
								id: true,
								name: true,
								slug: true,
							},
						},
					},
				},
			},
		});
	}

	/**
	 * Annuler une commande (remettre le stock)
	 */
	async cancelOrder(id: string, lang?: string) {
		const order = await this.findOne(id);

		if (order.status === 'CANCELLED') {
			throw new NotFoundException(
				this.i18n.t('errors.order.alreadyCancelled', { args: { id }, lang }),
			);
		}

		if (order.status === 'COMPLETED') {
			throw new NotFoundException(
				this.i18n.t('errors.order.cannotCancelCompleted', {
					args: { id },
					lang,
				}),
			);
		}

		// Remettre le stock
		for (const item of order.items) {
			await this.productsService.incrementStock(item.productId, item.quantity);
		}

		return this.prisma.order.update({
			where: { id },
			data: { status: 'CANCELLED' },
			include: {
				items: {
					include: {
						product: {
							select: {
								id: true,
								name: true,
								slug: true,
							},
						},
					},
				},
			},
		});
	}

	/**
	 * Générer un numéro de commande unique
	 */
	private async generateOrderNumber(): Promise<string> {
		const year = new Date().getFullYear();
		const count = await this.prisma.order.count();
		const orderNum = (count + 1).toString().padStart(4, '0');
		return `ORD-${year}-${orderNum}`;
	}

	/**
	 * Générer l'URL WhatsApp pour la commande
	 */
	private generateWhatsAppUrl(order: {
		orderNumber: string;
		customerName: string;
		totalAmount: { toString: () => string };
		items: Array<{
			productName: string;
			quantity: number;
			price: { toString: () => string };
		}>;
	}): string {
		const whatsappPhone =
			this.configService.get<string>('whatsapp.phoneNumber') || '';
		const whatsappApi =
			this.configService.get<string>('whatsapp.businessApi') || 'https://wa.me';

		// Formater le numéro de téléphone (enlever les espaces, +, etc.)
		const phoneNumber = whatsappPhone.replace(/[\s+()-]/g, '');

		// Construire le message
		const message =
			`Bonjour,\n\nVoici ma commande #${order.orderNumber} :\n\n` +
			`Client : ${order.customerName}\n\n` +
			`Articles :\n` +
			order.items
				.map(
					(item) =>
						`- ${item.productName} x${item.quantity} = ${Number(item.price) * item.quantity}€`,
				)
				.join('\n') +
			`\n\nTotal : ${order.totalAmount}€\n\n` +
			`Merci de confirmer ma commande.`;

		// Encoder le message pour l'URL
		const encodedMessage = encodeURIComponent(message);

		return `${whatsappApi}/${phoneNumber}?text=${encodedMessage}`;
	}
}
