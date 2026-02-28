import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { I18nService } from 'nestjs-i18n';
import { PrismaService } from '../prisma/prisma.service';
import type { LoginDto, RegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private jwtService: JwtService,
		private configService: ConfigService,
		private readonly i18n: I18nService,
	) {}

	async register(dto: RegisterDto) {
		// Vérifier si l'email existe déjà
		const existingAdmin = await this.prisma.admin.findUnique({
			where: { email: dto.email },
		});

		if (existingAdmin) {
			throw new UnauthorizedException(this.i18n.t('errors.auth.emailExists'));
		}

		// Hasher le mot de passe
		const hashedPassword = await bcrypt.hash(dto.password, 10);

		// Créer l'admin
		const admin = await this.prisma.admin.create({
			data: {
				email: dto.email,
				password: hashedPassword,
				name: dto.name,
				role: dto.role || 'CLIENT',
			},
			select: {
				id: true,
				email: true,
				name: true,
				role: true,
				createdAt: true,
			},
		});

		// Générer les tokens
		const tokens = await this.generateTokens(admin.id, admin.email, admin.role);

		return {
			admin,
			...tokens,
		};
	}

	async login(dto: LoginDto) {
		// Trouver l'admin
		const admin = await this.prisma.admin.findUnique({
			where: { email: dto.email },
		});

		if (!admin) {
			throw new UnauthorizedException(
				this.i18n.t('errors.auth.badCredentials'),
			);
		}

		// Vérifier le mot de passe
		const passwordMatch = await bcrypt.compare(dto.password, admin.password);

		if (!passwordMatch) {
			throw new UnauthorizedException(
				this.i18n.t('errors.auth.badCredentials'),
			);
		}

		// Générer les tokens
		const tokens = await this.generateTokens(admin.id, admin.email, admin.role);

		return {
			admin: {
				id: admin.id,
				email: admin.email,
				name: admin.name,
				role: admin.role,
			},
			...tokens,
		};
	}

	async refreshToken(adminId: string) {
		const admin = await this.prisma.admin.findUnique({
			where: { id: adminId },
		});

		if (!admin) {
			throw new UnauthorizedException(this.i18n.t('errors.auth.adminNotFound'));
		}

		return this.generateTokens(admin.id, admin.email, admin.role);
	}

	private async generateTokens(adminId: string, email: string, role: string) {
		const payload = { sub: adminId, email, role };

		const [accessToken, refreshToken] = await Promise.all([
			this.jwtService.signAsync(payload, {
				secret: this.configService.get('jwt.secret'),
				expiresIn: this.configService.get('jwt.expiresIn'),
			}),
			this.jwtService.signAsync(payload, {
				secret: this.configService.get('jwt.refreshSecret'),
				expiresIn: this.configService.get('jwt.refreshExpiresIn'),
			}),
		]);

		return {
			accessToken,
			refreshToken,
		};
	}

	async validateAdmin(adminId: string) {
		return this.prisma.admin.findUnique({
			where: { id: adminId },
			select: {
				id: true,
				email: true,
				name: true,
				role: true,
			},
		});
	}

	async getDashboardStats() {
		const [
			totalClients,
			totalProducts,
			totalOrders,
			revenueResult,
			recentOrders,
		] = await Promise.all([
			this.prisma.admin.count({ where: { role: 'CLIENT' } }),
			this.prisma.product.count({ where: { deletedAt: null } }),
			this.prisma.order.count({ where: { deletedAt: null } }),
			this.prisma.order.aggregate({
				_sum: { totalAmount: true },
				where: {
					deletedAt: null,
					status: { not: 'CANCELLED' },
				},
			}),
			this.prisma.order.findMany({
				take: 10,
				orderBy: { createdAt: 'desc' },
				where: { deletedAt: null },
				include: {
					items: true,
				},
			}),
		]);

		return {
			totalClients,
			totalProducts,
			totalOrders,
			totalRevenue: revenueResult._sum.totalAmount ?? 0,
			recentOrders,
		};
	}

	async findAllUsers(options: {
		role?: string;
		q?: string;
		page?: number;
		limit?: number;
	}) {
		const page = options.page || 1;
		const limit = options.limit || 20;
		const skip = (page - 1) * limit;

		const where: any = {};

		if (options.role) {
			where.role = options.role;
		}

		if (options.q) {
			where.OR = [
				{ name: { contains: options.q, mode: 'insensitive' } },
				{ email: { contains: options.q, mode: 'insensitive' } },
			];
		}

		const [items, total] = await Promise.all([
			this.prisma.admin.findMany({
				where,
				skip,
				take: limit,
				orderBy: { createdAt: 'desc' },
				select: {
					id: true,
					email: true,
					name: true,
					role: true,
					isActive: true,
					createdAt: true,
				},
			}),
			this.prisma.admin.count({ where }),
		]);

		return {
			items,
			total,
			page,
			limit,
			pageCount: Math.ceil(total / limit),
		};
	}
}
