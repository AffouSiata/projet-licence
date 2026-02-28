import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Put,
	Query,
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
	ApiBearerAuth,
	ApiBody,
	ApiConsumes,
	ApiOperation,
	ApiQuery,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { ValidationErrorDto } from '../auth/dto/auth-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { CategoryListResponseDto } from './dto/category-list-response.dto';
import {
	CategoryResponseDto,
	CategoryWithRelationsDto,
} from './dto/category-response.dto';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
	constructor(private categoriesService: CategoriesService) {}

	@Post()
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles('SUPER_ADMIN', 'ADMIN')
	@ApiBearerAuth('JWT-auth')
	@UseInterceptors(
		FileInterceptor('image', {
			limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
			fileFilter: (_req, file, cb) => {
				if (!file.mimetype.match(/^image\/(jpeg|png|gif|webp)$/)) {
					return cb(new Error('Seules les images sont autorisées'), false);
				}
				cb(null, true);
			},
		}),
	)
	@ApiConsumes('multipart/form-data')
	@ApiOperation({ summary: "Créer une catégorie avec upload d'image" })
	@ApiBody({
		schema: {
			type: 'object',
			required: ['name', 'image'],
			properties: {
				name: { type: 'string', description: 'Nom de la catégorie' },
				description: {
					type: 'string',
					description: 'Description de la catégorie',
				},
				image: {
					type: 'string',
					format: 'binary',
					description: 'Image de la catégorie',
				},
				parentId: {
					type: 'string',
					format: 'uuid',
					description: 'ID de la catégorie parente',
				},
				order: { type: 'number', description: "Ordre d'affichage" },
			},
		},
	})
	@ApiResponse({
		status: 201,
		description: 'Catégorie créée',
		type: CategoryWithRelationsDto,
	})
	@ApiResponse({
		status: 400,
		description: 'Validation échouée',
		type: ValidationErrorDto,
	})
	@ApiResponse({ status: 409, description: 'Catégorie existante' })
	async create(
		@Body() dto: CreateCategoryDto,
		@UploadedFile() image?: Express.Multer.File,
	) {
		return this.categoriesService.create(dto, image);
	}

	@Get()
	@ApiOperation({ summary: 'Récupérer toutes les catégories' })
	@ApiQuery({
		name: 'includeInactive',
		required: false,
		type: Boolean,
		description: 'Inclure les catégories inactives',
	})
	@ApiResponse({
		status: 200,
		description: 'Liste paginée des catégories',
		type: CategoryListResponseDto,
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
		description: 'Items per page',
	})
	@ApiQuery({
		name: 'sort',
		required: false,
		enum: ['name', 'order'],
		description: 'Champ de tri',
	})
	@ApiQuery({
		name: 'order',
		required: false,
		enum: ['asc', 'desc'],
		description: 'Ordre de tri',
	})
	async findAll(
		@Query('includeInactive') includeInactive?: string,
		@Query('page') page?: string,
		@Query('limit') limit?: string,
		@Query('sort') sort?: 'name' | 'order',
		@Query('order') order?: 'asc' | 'desc',
	) {
		const pageNum = page ? parseInt(page, 10) : undefined;
		const limitNum = limit ? parseInt(limit, 10) : undefined;

		return this.categoriesService.findAll({
			includeInactive: includeInactive === 'true',
			page: pageNum,
			limit: limitNum,
			sort,
			order,
		});
	}

	@Get(':id')
	@ApiOperation({ summary: 'Récupérer une catégorie par ID' })
	@ApiResponse({
		status: 200,
		description: 'Catégorie trouvée',
		type: CategoryWithRelationsDto,
	})
	@ApiResponse({ status: 404, description: 'Catégorie non trouvée' })
	async findOne(@Param('id') id: string) {
		return this.categoriesService.findOne(id);
	}

	@Get('slug/:slug')
	@ApiOperation({ summary: 'Récupérer une catégorie par slug' })
	@ApiResponse({
		status: 200,
		description: 'Catégorie trouvée',
		type: CategoryWithRelationsDto,
	})
	@ApiResponse({ status: 404, description: 'Catégorie non trouvée' })
	async findBySlug(@Param('slug') slug: string) {
		return this.categoriesService.findBySlug(slug);
	}

	@Put(':id')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles('SUPER_ADMIN', 'ADMIN')
	@ApiBearerAuth('JWT-auth')
	@UseInterceptors(
		FileInterceptor('image', {
			limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
			fileFilter: (_req, file, cb) => {
				if (!file.mimetype.match(/^image\/(jpeg|png|gif|webp)$/)) {
					return cb(new Error('Seules les images sont autorisées'), false);
				}
				cb(null, true);
			},
		}),
	)
	@ApiConsumes('multipart/form-data')
	@ApiOperation({ summary: "Mettre à jour une catégorie avec upload d'image" })
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				name: { type: 'string', description: 'Nom de la catégorie' },
				description: {
					type: 'string',
					description: 'Description de la catégorie',
				},
				image: {
					type: 'string',
					format: 'binary',
					description: 'Image de la catégorie',
				},
				parentId: {
					type: 'string',
					format: 'uuid',
					description: 'ID de la catégorie parente',
				},
				order: { type: 'number', description: "Ordre d'affichage" },
			},
		},
	})
	@ApiResponse({
		status: 200,
		description: 'Catégorie mise à jour',
		type: CategoryWithRelationsDto,
	})
	@ApiResponse({
		status: 400,
		description: 'Validation échouée',
		type: ValidationErrorDto,
	})
	@ApiResponse({ status: 404, description: 'Catégorie non trouvée' })
	async update(
		@Param('id') id: string,
		@Body() dto: UpdateCategoryDto,
		@UploadedFile() image?: Express.Multer.File,
	) {
		return this.categoriesService.update(id, dto, image);
	}

	@Patch(':id/toggle')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles('SUPER_ADMIN', 'ADMIN')
	@ApiBearerAuth('JWT-auth')
	@ApiOperation({ summary: 'Activer/désactiver une catégorie' })
	@ApiResponse({
		status: 200,
		description: 'État modifié',
		type: CategoryResponseDto,
	})
	@ApiResponse({ status: 404, description: 'Catégorie non trouvée' })
	async toggleActive(@Param('id') id: string) {
		return this.categoriesService.toggleActive(id);
	}

	@Delete(':id')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles('SUPER_ADMIN')
	@ApiBearerAuth('JWT-auth')
	@ApiOperation({ summary: 'Supprimer une catégorie' })
	@ApiResponse({
		status: 200,
		description: 'Catégorie supprimée',
		type: CategoryResponseDto,
	})
	@ApiResponse({ status: 404, description: 'Catégorie non trouvée' })
	async remove(@Param('id') id: string) {
		return this.categoriesService.remove(id);
	}

	@Patch(':id/restore')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles('SUPER_ADMIN')
	@ApiBearerAuth('JWT-auth')
	@ApiOperation({ summary: 'Restaurer une catégorie supprimée' })
	@ApiResponse({
		status: 200,
		description: 'Catégorie restaurée',
		type: CategoryResponseDto,
	})
	@ApiResponse({ status: 404, description: 'Catégorie non trouvée' })
	async restore(@Param('id') id: string) {
		return this.categoriesService.restore(id);
	}
}
