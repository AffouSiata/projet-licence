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
	UploadedFiles,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
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
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { ProductListResponseDto } from './dto/product-list-response.dto';
import {
	ProductResponseDto,
	ProductWithCategoryDto,
} from './dto/product-response.dto';
import { ProductsService } from './products.service';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
	constructor(private productsService: ProductsService) {}

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
	@ApiOperation({ summary: "Créer un produit avec upload d'image" })
	@ApiBody({
		schema: {
			type: 'object',
			required: ['name', 'description', 'price', 'categoryId', 'image'],
			properties: {
				name: { type: 'string', description: 'Nom du produit' },
				description: { type: 'string', description: 'Description du produit' },
				price: { type: 'number', description: 'Prix du produit' },
				discount: {
					type: 'number',
					description: 'Pourcentage de réduction (0-100)',
				},
				stockQuantity: { type: 'number', description: 'Quantité en stock' },
				categoryId: {
					type: 'string',
					format: 'uuid',
					description: 'ID de la catégorie',
				},
				image: {
					type: 'string',
					format: 'binary',
					description: 'Image principale du produit',
				},
				tags: { type: 'string', description: 'Tags séparés par des virgules' },
				isActive: { type: 'boolean', description: 'Produit actif' },
				isFeatured: { type: 'boolean', description: 'Produit en vedette' },
			},
		},
	})
	@ApiResponse({
		status: 201,
		description: 'Produit créé',
		type: ProductWithCategoryDto,
	})
	@ApiResponse({
		status: 400,
		description: 'Validation échouée',
		type: ValidationErrorDto,
	})
	@ApiResponse({ status: 404, description: 'Catégorie introuvable' })
	@ApiResponse({ status: 409, description: 'Produit existant (slug)' })
	async create(
		@Body() dto: CreateProductDto,
		@UploadedFile() image?: Express.Multer.File,
	) {
		return this.productsService.create(dto, image);
	}

	@Get()
	@ApiOperation({ summary: 'Récupérer tous les produits' })
	@ApiQuery({
		name: 'includeInactive',
		required: false,
		type: Boolean,
		description: 'Inclure les produits inactifs',
	})
	@ApiQuery({
		name: 'categoryId',
		required: false,
		type: String,
		description: 'Filtrer par catégorie',
	})
	@ApiQuery({
		name: 'page',
		required: false,
		type: Number,
		description: 'Page (pagination, starts at 1)',
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
		enum: ['price', 'name', 'createdAt', 'stockQuantity'],
		description: 'Champ de tri',
	})
	@ApiQuery({
		name: 'order',
		required: false,
		enum: ['asc', 'desc'],
		description: 'Ordre de tri',
	})
	@ApiQuery({
		name: 'q',
		required: false,
		type: String,
		description: 'Terme de recherche (name/description/tags)',
	})
	@ApiQuery({
		name: 'minPrice',
		required: false,
		type: Number,
		description: 'Prix min',
	})
	@ApiQuery({
		name: 'maxPrice',
		required: false,
		type: Number,
		description: 'Prix max',
	})
	@ApiQuery({
		name: 'tags',
		required: false,
		type: String,
		description: 'Tags séparés par des virgules',
	})
	@ApiQuery({
		name: 'minStock',
		required: false,
		type: Number,
		description: 'Quantité minimale en stock',
	})
	@ApiQuery({
		name: 'maxStock',
		required: false,
		type: Number,
		description: 'Quantité maximale en stock',
	})
	@ApiResponse({
		status: 200,
		description: 'Liste paginée des produits',
		type: ProductListResponseDto,
	})
	async findAll(
		@Query('includeInactive') includeInactive?: string,
		@Query('categoryId') categoryId?: string,
		@Query('page') page?: string,
		@Query('limit') limit?: string,
		@Query('sort') sort?: 'price' | 'name' | 'createdAt' | 'stockQuantity',
		@Query('order') order?: 'asc' | 'desc',
		@Query('q') q?: string,
		@Query('minPrice') minPrice?: string,
		@Query('maxPrice') maxPrice?: string,
		@Query('tags') tags?: string,
		@Query('minStock') minStock?: string,
		@Query('maxStock') maxStock?: string,
	) {
		const pageNum = page ? parseInt(page, 10) : undefined;
		const limitNum = limit ? parseInt(limit, 10) : undefined;
		const minP = minPrice ? parseFloat(minPrice) : undefined;
		const maxP = maxPrice ? parseFloat(maxPrice) : undefined;
		const minS = minStock ? parseInt(minStock, 10) : undefined;
		const maxS = maxStock ? parseInt(maxStock, 10) : undefined;
		const tagsArr = tags
			? tags
					.split(',')
					.map((t) => t.trim())
					.filter(Boolean)
			: undefined;

		const result = await this.productsService.findAll({
			includeInactive: includeInactive === 'true',
			categoryId,
			page: pageNum,
			limit: limitNum,
			sort,
			order,
			q,
			minPrice: minP,
			maxPrice: maxP,
			tags: tagsArr,
			minStock: minS,
			maxStock: maxS,
		});

		return result;
	}

	@Get(':id')
	@ApiOperation({ summary: 'Récupérer un produit par ID' })
	@ApiResponse({
		status: 200,
		description: 'Produit trouvé',
		type: ProductWithCategoryDto,
	})
	@ApiResponse({ status: 404, description: 'Produit non trouvé' })
	async findOne(@Param('id') id: string) {
		return this.productsService.findOne(id);
	}

	@Get('slug/:slug')
	@ApiOperation({ summary: 'Récupérer un produit par slug' })
	@ApiResponse({
		status: 200,
		description: 'Produit trouvé',
		type: ProductWithCategoryDto,
	})
	@ApiResponse({ status: 404, description: 'Produit non trouvé' })
	async findBySlug(@Param('slug') slug: string) {
		return this.productsService.findBySlug(slug);
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
	@ApiOperation({ summary: "Mettre à jour un produit avec upload d'image" })
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				name: { type: 'string', description: 'Nom du produit' },
				description: { type: 'string', description: 'Description du produit' },
				price: { type: 'number', description: 'Prix du produit' },
				discount: {
					type: 'number',
					description: 'Pourcentage de réduction (0-100)',
				},
				stockQuantity: { type: 'number', description: 'Quantité en stock' },
				categoryId: {
					type: 'string',
					format: 'uuid',
					description: 'ID de la catégorie',
				},
				image: {
					type: 'string',
					format: 'binary',
					description: 'Image principale du produit',
				},
				tags: { type: 'string', description: 'Tags séparés par des virgules' },
				isActive: { type: 'boolean', description: 'Produit actif' },
				isFeatured: { type: 'boolean', description: 'Produit en vedette' },
			},
		},
	})
	@ApiResponse({
		status: 200,
		description: 'Produit mis à jour',
		type: ProductWithCategoryDto,
	})
	@ApiResponse({
		status: 400,
		description: 'Validation échouée',
		type: ValidationErrorDto,
	})
	@ApiResponse({ status: 404, description: 'Produit non trouvé' })
	@ApiResponse({ status: 409, description: 'Slug déjà utilisé' })
	async update(
		@Param('id') id: string,
		@Body() dto: UpdateProductDto,
		@UploadedFile() image?: Express.Multer.File,
	) {
		return this.productsService.update(id, dto, image);
	}

	@Post(':id/images')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles('SUPER_ADMIN', 'ADMIN')
	@ApiBearerAuth('JWT-auth')
	@UseInterceptors(
		FilesInterceptor('images', 10, {
			limits: { fileSize: 5 * 1024 * 1024 }, // 5MB par fichier
			fileFilter: (_req, file, cb) => {
				if (!file.mimetype.match(/^image\/(jpeg|png|gif|webp)$/)) {
					return cb(new Error('Seules les images sont autorisées'), false);
				}
				cb(null, true);
			},
		}),
	)
	@ApiConsumes('multipart/form-data')
	@ApiOperation({ summary: 'Ajouter des images supplémentaires au produit' })
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				images: {
					type: 'array',
					items: { type: 'string', format: 'binary' },
					description: 'Images supplémentaires (max 10)',
				},
			},
		},
	})
	@ApiResponse({
		status: 200,
		description: 'Images ajoutées',
		type: ProductWithCategoryDto,
	})
	@ApiResponse({ status: 404, description: 'Produit non trouvé' })
	async addImages(
		@Param('id') id: string,
		@UploadedFiles() images: Express.Multer.File[],
	) {
		return this.productsService.addImages(id, images);
	}

	@Delete(':id/images')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles('SUPER_ADMIN', 'ADMIN')
	@ApiBearerAuth('JWT-auth')
	@ApiOperation({ summary: 'Supprimer des images du produit' })
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				imageUrls: {
					type: 'array',
					items: { type: 'string' },
					description: 'URLs des images à supprimer',
				},
			},
		},
	})
	@ApiResponse({
		status: 200,
		description: 'Images supprimées',
		type: ProductWithCategoryDto,
	})
	@ApiResponse({ status: 404, description: 'Produit non trouvé' })
	async removeImages(
		@Param('id') id: string,
		@Body('imageUrls') imageUrls: string[],
	) {
		return this.productsService.removeImages(id, imageUrls);
	}

	@Patch(':id/toggle')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles('SUPER_ADMIN', 'ADMIN')
	@ApiBearerAuth('JWT-auth')
	@ApiOperation({ summary: 'Activer/désactiver un produit' })
	@ApiResponse({
		status: 200,
		description: 'État modifié',
		type: ProductWithCategoryDto,
	})
	@ApiResponse({ status: 404, description: 'Produit non trouvé' })
	async toggleActive(@Param('id') id: string) {
		return this.productsService.toggleActive(id);
	}

	@Delete(':id')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles('SUPER_ADMIN')
	@ApiBearerAuth('JWT-auth')
	@ApiOperation({ summary: 'Supprimer un produit' })
	@ApiResponse({
		status: 200,
		description: 'Produit supprimé',
		type: ProductResponseDto,
	})
	@ApiResponse({ status: 404, description: 'Produit non trouvé' })
	async remove(@Param('id') id: string) {
		return this.productsService.remove(id);
	}

	@Patch(':id/restore')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles('SUPER_ADMIN')
	@ApiBearerAuth('JWT-auth')
	@ApiOperation({ summary: 'Restaurer un produit supprimé' })
	@ApiResponse({
		status: 200,
		description: 'Produit restauré',
		type: ProductResponseDto,
	})
	@ApiResponse({ status: 404, description: 'Produit non trouvé' })
	async restore(@Param('id') id: string) {
		return this.productsService.restore(id);
	}
}
