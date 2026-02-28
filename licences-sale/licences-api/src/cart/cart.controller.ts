import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Session,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { I18nLang } from 'nestjs-i18n';
import { ValidationErrorDto } from '../auth/dto/auth-response.dto';
import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartItemDto } from './dto/cart.dto';
import { CartResponseDto } from './dto/cart-response.dto';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
	constructor(private cartService: CartService) {}

	@Get()
	@ApiOperation({ summary: 'Récupérer le panier de la session' })
	@ApiResponse({
		status: 200,
		description: 'Panier récupéré',
		type: CartResponseDto,
	})
	async getCart(@Session() session: { cartId?: string }) {
		const sessionId = (session.cartId as string) || this.generateSessionId();
		session.cartId = sessionId;
		return this.cartService.getOrCreateCart(sessionId);
	}

	@Post('items')
	@ApiOperation({ summary: 'Ajouter un produit au panier' })
	@ApiResponse({
		status: 201,
		description: 'Produit ajouté au panier',
		type: CartResponseDto,
	})
	@ApiResponse({
		status: 400,
		description: 'Validation échouée',
		type: ValidationErrorDto,
	})
	@ApiResponse({ status: 404, description: 'Produit non trouvé' })
	@ApiResponse({ status: 409, description: 'Stock insuffisant' })
	async addToCart(
		@Session() session: { cartId?: string },
		@Body() dto: AddToCartDto,
		@I18nLang() lang?: string,
	) {
		const sessionId = (session.cartId as string) || this.generateSessionId();
		session.cartId = sessionId;
		return this.cartService.addToCart(sessionId, dto, lang);
	}

	@Patch('items/:itemId')
	@ApiOperation({ summary: "Mettre à jour la quantité d'un item" })
	@ApiResponse({
		status: 200,
		description: 'Quantité mise à jour',
		type: CartResponseDto,
	})
	@ApiResponse({
		status: 400,
		description: 'Validation échouée',
		type: ValidationErrorDto,
	})
	@ApiResponse({ status: 404, description: 'Item non trouvé' })
	@ApiResponse({ status: 409, description: 'Stock insuffisant' })
	async updateCartItem(
		@Session() session: { cartId?: string },
		@Param('itemId') itemId: string,
		@Body() dto: UpdateCartItemDto,
		@I18nLang() lang?: string,
	) {
		const sessionId = (session.cartId as string) || this.generateSessionId();
		session.cartId = sessionId;
		return this.cartService.updateCartItem(sessionId, itemId, dto, lang);
	}

	@Delete('items/:itemId')
	@ApiOperation({ summary: 'Supprimer un item du panier' })
	@ApiResponse({
		status: 200,
		description: 'Item supprimé',
		type: CartResponseDto,
	})
	@ApiResponse({ status: 404, description: 'Item non trouvé' })
	async removeFromCart(
		@Session() session: { cartId?: string },
		@Param('itemId') itemId: string,
		@I18nLang() lang?: string,
	) {
		const sessionId = (session.cartId as string) || this.generateSessionId();
		session.cartId = sessionId;
		return this.cartService.removeFromCart(sessionId, itemId, lang);
	}

	@Delete()
	@ApiOperation({ summary: 'Vider le panier' })
	@ApiResponse({
		status: 200,
		description: 'Panier vidé',
		type: CartResponseDto,
	})
	async clearCart(@Session() session: { cartId?: string }) {
		const sessionId = (session.cartId as string) || this.generateSessionId();
		session.cartId = sessionId;
		return this.cartService.clearCart(sessionId);
	}

	private generateSessionId(): string {
		return `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
	}
}
