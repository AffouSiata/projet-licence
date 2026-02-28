import {
	Body,
	Controller,
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
import { Roles } from '../auth/decorators/roles.decorator';
import { ValidationErrorDto } from '../auth/dto/auth-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/order.dto';
import { OrderResponseDto } from './dto/order-response.dto';
import { OrdersService } from './orders.service';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
	constructor(private ordersService: OrdersService) {}

	@Post()
	@ApiOperation({ summary: 'Créer une commande à partir du panier' })
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
		@I18nLang() lang?: string,
	) {
		const sessionId = session.cartId || `session_${Date.now()}`;
		session.cartId = sessionId;
		return this.ordersService.createFromCart(sessionId, dto, lang);
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
	@ApiOperation({ summary: 'Récupérer une commande par ID' })
	@ApiResponse({
		status: 200,
		description: 'Commande trouvée',
		type: OrderResponseDto,
	})
	@ApiResponse({ status: 404, description: 'Commande non trouvée' })
	async findOne(@Param('id') id: string) {
		return this.ordersService.findOne(id);
	}

	@Get('number/:orderNumber')
	@ApiOperation({ summary: 'Récupérer une commande par numéro' })
	@ApiResponse({
		status: 200,
		description: 'Commande trouvée',
		type: OrderResponseDto,
	})
	@ApiResponse({ status: 404, description: 'Commande non trouvée' })
	async findByOrderNumber(@Param('orderNumber') orderNumber: string) {
		return this.ordersService.findByOrderNumber(orderNumber);
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
