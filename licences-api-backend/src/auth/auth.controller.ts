import {
	Body,
	Controller,
	ForbiddenException,
	Get,
	Headers,
	Post,
	Query,
	UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
	ApiBearerAuth,
	ApiOperation,
	ApiQuery,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { GetAdmin } from './decorators/get-admin.decorator';
import { Roles } from './decorators/roles.decorator';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import {
	AdminResponseDto,
	LoginResponseDto,
	RegisterResponseDto,
	TokensResponseDto,
	ValidationErrorDto,
} from './dto/auth-response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
	constructor(
		private authService: AuthService,
		private jwtService: JwtService,
	) {}

	@Post('register')
	@ApiOperation({
		summary:
			"Inscription publique (par défaut: 'CLIENT'). Seul 'SUPER_ADMIN' peut créer des comptes 'ADMIN' ou 'SUPER_ADMIN'",
	})
	@ApiResponse({
		status: 201,
		description: 'Compte créé',
		type: RegisterResponseDto,
	})
	@ApiResponse({
		status: 400,
		description: 'Données invalides',
		type: ValidationErrorDto,
	})
	@ApiResponse({ status: 401, description: 'Email déjà utilisé' })
	@ApiResponse({
		status: 403,
		description: 'Forbidden - Only SUPER_ADMIN can create ADMIN/SUPER_ADMIN',
	})
	async register(
		@Body() dto: RegisterDto,
		@Headers('authorization') authHeader?: string,
	) {
		// If no role is provided, default to CLIENT for public registrations
		if (!dto.role) {
			dto.role = 'CLIENT';
		}

		// If role requires privilege, ensure the caller is authenticated and is SUPER_ADMIN
		if (dto.role === 'ADMIN' || dto.role === 'SUPER_ADMIN') {
			if (!authHeader) {
				throw new ForbiddenException(
					'Insufficient privileges to create an ADMIN account',
				);
			}

			const token = authHeader.replace(/^Bearer\s+/, '');
			try {
				const payload = this.jwtService.verify(token);
				if (!payload || payload.role !== 'SUPER_ADMIN') {
					throw new ForbiddenException(
						'Only SUPER_ADMIN can create ADMIN or SUPER_ADMIN accounts',
					);
				}
			} catch {
				throw new ForbiddenException(
					'Invalid or missing token for privileged registration',
				);
			}
		}

		return this.authService.register(dto);
	}

	@Post('login')
	@ApiOperation({ summary: 'Se connecter' })
	@ApiResponse({
		status: 200,
		description: 'Connexion réussie',
		type: LoginResponseDto,
	})
	@ApiResponse({ status: 401, description: 'Identifiants invalides' })
	@ApiResponse({
		status: 400,
		description: 'Validation échouée',
		type: ValidationErrorDto,
	})
	async login(@Body() dto: LoginDto) {
		return this.authService.login(dto);
	}

	@Get('me')
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth('JWT-auth')
	@ApiOperation({ summary: "Obtenir les informations de l'admin connecté" })
	@ApiResponse({
		status: 200,
		description: 'Informations récupérées',
		type: AdminResponseDto,
	})
	@ApiResponse({ status: 401, description: 'Non authentifié' })
	async getMe(@GetAdmin() admin: AdminResponseDto) {
		return admin;
	}

	@Post('refresh')
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth('JWT-auth')
	@ApiOperation({ summary: "Rafraîchir le token d'accès" })
	@ApiResponse({
		status: 200,
		description: 'Token rafraîchi',
		type: TokensResponseDto,
	})
	@ApiResponse({ status: 401, description: 'Non authentifié' })
	async refresh(@GetAdmin('id') adminId: string) {
		return this.authService.refreshToken(adminId);
	}

	@Get('dashboard-stats')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles('SUPER_ADMIN', 'ADMIN')
	@ApiBearerAuth('JWT-auth')
	@ApiOperation({ summary: 'Obtenir les statistiques du dashboard' })
	@ApiResponse({
		status: 200,
		description: 'Statistiques récupérées',
	})
	@ApiResponse({ status: 401, description: 'Non authentifié' })
	async getDashboardStats() {
		return this.authService.getDashboardStats();
	}

	@Get('users')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles('SUPER_ADMIN', 'ADMIN')
	@ApiBearerAuth('JWT-auth')
	@ApiOperation({ summary: 'Récupérer la liste des utilisateurs' })
	@ApiQuery({
		name: 'role',
		required: false,
		type: String,
		description: 'Filtrer par rôle',
	})
	@ApiQuery({
		name: 'q',
		required: false,
		type: String,
		description: 'Recherche par nom ou email',
	})
	@ApiQuery({
		name: 'page',
		required: false,
		type: Number,
		description: 'Page (pagination)',
	})
	@ApiQuery({
		name: 'limit',
		required: false,
		type: Number,
		description: 'Items par page',
	})
	@ApiResponse({
		status: 200,
		description: 'Liste des utilisateurs',
	})
	@ApiResponse({ status: 401, description: 'Non authentifié' })
	async findAllUsers(
		@Query('role') role?: string,
		@Query('q') q?: string,
		@Query('page') page?: string,
		@Query('limit') limit?: string,
	) {
		return this.authService.findAllUsers({
			role,
			q,
			page: page ? parseInt(page, 10) : undefined,
			limit: limit ? parseInt(limit, 10) : undefined,
		});
	}
}
