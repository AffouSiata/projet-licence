import {
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { I18nService } from 'nestjs-i18n';
import { PrismaService } from '../prisma/prisma.service';
import { ProductsService } from '../products/products.service';
import type { AddToCartInput, UpdateCartItemInput } from './dto/cart.dto';

export interface CartWithItems {
	id: string;
	sessionId: string;
	expiresAt: Date;
	createdAt: Date;
	updatedAt: Date;
	items: Array<{
		id: string;
		cartId: string;
		productId: string;
		quantity: number;
		price: Prisma.Decimal;
		createdAt: Date;
		updatedAt: Date;
		product: {
			id: string;
			name: string;
			slug: string;
			price: Prisma.Decimal;
			image: string | null;
			stockQuantity: number;
			isActive: boolean;
		};
	}>;
}

@Injectable()
export class CartService {
	constructor(
		private prisma: PrismaService,
		private productsService: ProductsService,
		private readonly i18n: I18nService,
	) {}

	/**
	 * Créer ou récupérer un panier par sessionId
	 */
	async getOrCreateCart(sessionId: string): Promise<CartWithItems> {
		// Chercher un panier existant
		let cart = await this.prisma.cart.findUnique({
			where: { sessionId },
			include: {
				items: {
					include: {
						product: {
							select: {
								id: true,
								name: true,
								slug: true,
								price: true,
								image: true,
								stockQuantity: true,
								isActive: true,
							},
						},
					},
				},
			},
		});

		// Si pas de panier, en créer un nouveau
		if (!cart) {
			const expiresAt = new Date();
			expiresAt.setDate(expiresAt.getDate() + 7); // Expire dans 7 jours

			cart = await this.prisma.cart.create({
				data: {
					sessionId,
					expiresAt,
				},
				include: {
					items: {
						include: {
							product: {
								select: {
									id: true,
									name: true,
									slug: true,
									price: true,
									image: true,
									stockQuantity: true,
									isActive: true,
								},
							},
						},
					},
				},
			});
		}

		return this.calculateCartTotals(cart);
	}

	/**
	 * Ajouter un produit au panier
	 */
	async addToCart(sessionId: string, data: AddToCartInput, lang?: string) {
		// Vérifier que le produit existe et est actif
		const product = await this.productsService.findOne(data.productId, lang);

		if (!product.isActive) {
			throw new ConflictException(
				this.i18n.t('errors.cart.productUnavailable'),
			);
		}

		// Vérifier le stock
		if (product.stockQuantity < data.quantity) {
			throw new ConflictException(
				this.i18n.t('errors.product.stockInsufficient'),
			);
		}

		// Récupérer ou créer le panier
		const cart = await this.getOrCreateCart(sessionId);

		// Vérifier si le produit est déjà dans le panier
		const existingItem = await this.prisma.cartItem.findUnique({
			where: {
				cartId_productId: {
					cartId: cart.id,
					productId: data.productId,
				},
			},
		});

		if (existingItem) {
			// Mettre à jour la quantité
			const newQuantity = existingItem.quantity + data.quantity;

			if (product.stockQuantity < newQuantity) {
				throw new ConflictException(
					this.i18n.t('errors.cart.quantityInsufficient'),
				);
			}

			await this.prisma.cartItem.update({
				where: { id: existingItem.id },
				data: { quantity: newQuantity },
			});
		} else {
			// Ajouter le nouvel item
			await this.prisma.cartItem.create({
				data: {
					cartId: cart.id,
					productId: data.productId,
					quantity: data.quantity,
					price: product.price,
				},
			});
		}

		// Retourner le panier mis à jour
		return this.getOrCreateCart(sessionId);
	}

	/**
	 * Mettre à jour la quantité d'un item
	 */
	async updateCartItem(
		sessionId: string,
		itemId: string,
		data: UpdateCartItemInput,
		lang?: string,
	) {
		const cart = await this.getOrCreateCart(sessionId);

		const item = await this.prisma.cartItem.findFirst({
			where: {
				id: itemId,
				cartId: cart.id,
			},
			include: {
				product: true,
			},
		});

		if (!item) {
			throw new NotFoundException(this.i18n.t('errors.cart.itemNotFound'));
		}

		// Si quantité = 0, supprimer l'item
		if (data.quantity === 0) {
			await this.prisma.cartItem.delete({
				where: { id: itemId },
			});
		} else {
			// Vérifier le stock
			if (item.product.stockQuantity < data.quantity) {
				throw new ConflictException(
					this.i18n.t('errors.product.stockInsufficient', { lang }),
				);
			}

			// Mettre à jour la quantité
			await this.prisma.cartItem.update({
				where: { id: itemId },
				data: { quantity: data.quantity },
			});
		}

		return this.getOrCreateCart(sessionId);
	}

	/**
	 * Supprimer un item du panier
	 */
	// merged removeFromCart with lang support
	async removeFromCart(sessionId: string, itemId: string, lang?: string) {
		const cart = await this.getOrCreateCart(sessionId);

		const item = await this.prisma.cartItem.findFirst({
			where: {
				id: itemId,
				cartId: cart.id,
			},
		});

		if (!item) {
			throw new NotFoundException(
				this.i18n.t('errors.cart.itemNotFound', { lang }),
			);
		}

		await this.prisma.cartItem.delete({
			where: { id: itemId },
		});

		return this.getOrCreateCart(sessionId);
	}

	/**
	 * Vider le panier
	 */
	async clearCart(sessionId: string) {
		const cart = await this.getOrCreateCart(sessionId);

		await this.prisma.cartItem.deleteMany({
			where: { cartId: cart.id },
		});

		return this.getOrCreateCart(sessionId);
	}

	/**
	 * Calculer les totaux du panier
	 */
	private calculateCartTotals(cart: CartWithItems) {
		const totalItems = cart.items.reduce(
			(sum: number, item: { quantity: number; price: unknown }) =>
				sum + item.quantity,
			0,
		);

		const totalAmount = cart.items.reduce(
			(sum: number, item: { quantity: number; price: unknown }) =>
				sum + Number(item.price) * item.quantity,
			0,
		);

		return {
			...cart,
			totalItems,
			totalAmount: Number(totalAmount.toFixed(2)),
		};
	}

	/**
	 * Nettoyer les paniers expirés (à appeler via un cron job)
	 */
	async cleanExpiredCarts() {
		const result = await this.prisma.cart.deleteMany({
			where: {
				expiresAt: {
					lt: new Date(),
				},
			},
		});

		return { deleted: result.count };
	}
}
