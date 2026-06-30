import {
	Body,
	Controller,
	ForbiddenException,
	Get,
	Param,
	Patch,
	Post,
	Query,
	Session,
	UseGuards,
} from '@nestjs/common';
import {
	ApiBearerAuth,
	ApiOperation,
	ApiQuery,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';
import { I18nLang } from 'nestjs-i18n';
import { GetAdmin } from '../auth/decorators/get-admin.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { ValidationErrorDto } from '../auth/dto/auth-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/order.dto';
import { OrderResponseDto } from './dto/order-response.dto';
import { OrdersService } from './orders.service';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
	constructor(private ordersService: OrdersService) {}

	@Post()
	@UseGuards(OptionalJwtAuthGuard)
	@ApiOperation({
		summary:
			'Créer une commande à partir du panier (anonyme ou liée au user connecté si JWT présent)',
	})
	@ApiResponse({
		status: 201,
		description: 'Commande créée avec succès',
		type: OrderResponseDto,
	})
	@ApiResponse({
		status: 400,
		description: 'Validation échouée',
		type: ValidationErrorDto,
	})
	@ApiResponse({ status: 404, description: 'Panier vide ou stock insuffisant' })
	async create(
		@Session() session: { cartId?: string },
		@Body() dto: CreateOrderDto,
		@GetAdmin('id') userId: string | undefined,
		@I18nLang() lang?: string,
	) {
		const sessionId = session.cartId || `session_${Date.now()}`;
		session.cartId = sessionId;
		return this.ordersService.createFromCart(sessionId, dto, lang, userId);
	}

	@Get('me')
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth('JWT-auth')
	@ApiOperation({
		summary: "Récupérer les commandes de l'utilisateur connecté",
	})
	@ApiResponse({
		status: 200,
		description: "Liste des commandes de l'utilisateur",
		type: [OrderResponseDto],
	})
	@ApiResponse({ status: 401, description: 'Non authentifié' })
	async findMine(@GetAdmin('id') userId: string) {
		return this.ordersService.findByUser(userId);
	}

	@Get()
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles('SUPER_ADMIN', 'ADMIN')
	@ApiBearerAuth('JWT-auth')
	@ApiOperation({ summary: 'Récupérer toutes les commandes (admin)' })
	@ApiQuery({
		name: 'status',
		required: false,
		enum: ['PENDING', 'CONFIRMED', 'PROCESSING', 'COMPLETED', 'CANCELLED'],
		description: 'Filtrer par statut',
	})
	@ApiResponse({
		status: 200,
		description: 'Liste des commandes',
		type: [OrderResponseDto],
	})
	async findAll(@Query('status') status?: OrderStatus) {
		return this.ordersService.findAll(status);
	}

	@Get(':id')
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth('JWT-auth')
	@ApiOperation({
		summary: 'Récupérer une commande par ID (propriétaire ou admin)',
	})
	@ApiResponse({
		status: 200,
		description: 'Commande trouvée',
		type: OrderResponseDto,
	})
	@ApiResponse({ status: 401, description: 'Non authentifié' })
	@ApiResponse({ status: 403, description: 'Accès interdit' })
	@ApiResponse({ status: 404, description: 'Commande non trouvée' })
	async findOne(
		@Param('id') id: string,
		@GetAdmin() user: { id: string; role: string },
	) {
		const order = await this.ordersService.findOne(id);
		this.assertCanView(order, user);
		return order;
	}

	@Get('number/:orderNumber')
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth('JWT-auth')
	@ApiOperation({
		summary: 'Récupérer une commande par numéro (propriétaire ou admin)',
	})
	@ApiResponse({
		status: 200,
		description: 'Commande trouvée',
		type: OrderResponseDto,
	})
	@ApiResponse({ status: 401, description: 'Non authentifié' })
	@ApiResponse({ status: 403, description: 'Accès interdit' })
	@ApiResponse({ status: 404, description: 'Commande non trouvée' })
	async findByOrderNumber(
		@Param('orderNumber') orderNumber: string,
		@GetAdmin() user: { id: string; role: string },
	) {
		const order = await this.ordersService.findByOrderNumber(orderNumber);
		this.assertCanView(order, user);
		return order;
	}

	/**
	 * Autorise la consultation d'une commande uniquement à son propriétaire
	 * (commande liée à son compte) ou à un administrateur. Les commandes invité
	 * (userId null) ne sont consultables que par un admin — le client invité
	 * récupère sa commande via la réponse du POST /orders.
	 */
	private assertCanView(
		order: { userId: string | null },
		user: { id: string; role: string },
	) {
		const isAdmin = user.role === 'ADMIN' || user.role === 'SUPER_ADMIN';
		const isOwner = order.userId != null && order.userId === user.id;
		if (!isAdmin && !isOwner) {
			throw new ForbiddenException();
		}
	}

	@Patch(':id/status')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles('SUPER_ADMIN', 'ADMIN')
	@ApiBearerAuth('JWT-auth')
	@ApiOperation({ summary: "Mettre à jour le statut d'une commande" })
	@ApiResponse({
		status: 200,
		description: 'Statut mis à jour',
		type: OrderResponseDto,
	})
	@ApiResponse({
		status: 400,
		description: 'Validation échouée',
		type: ValidationErrorDto,
	})
	@ApiResponse({ status: 404, description: 'Commande non trouvée' })
	async updateStatus(
		@Param('id') id: string,
		@Body() dto: UpdateOrderStatusDto,
	) {
		return this.ordersService.updateStatus(id, dto);
	}

	@Patch(':id/cancel')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles('SUPER_ADMIN', 'ADMIN')
	@ApiBearerAuth('JWT-auth')
	@ApiOperation({ summary: 'Annuler une commande (remettre le stock)' })
	@ApiResponse({
		status: 200,
		description: 'Commande annulée',
		type: OrderResponseDto,
	})
	@ApiResponse({ status: 404, description: 'Commande non trouvée' })
	async cancelOrder(@Param('id') id: string) {
		return this.ordersService.cancelOrder(id);
	}
}
