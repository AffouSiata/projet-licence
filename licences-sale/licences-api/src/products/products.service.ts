import {
	BadRequestException,
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { I18nService } from 'nestjs-i18n';
import slugify from 'slugify';
import { PrismaService } from '../prisma/prisma.service';
import { UploadService } from '../upload/upload.service';
import type { CreateProductInput, UpdateProductInput } from './dto/product.dto';

@Injectable()
export class ProductsService {
	constructor(
		private prisma: PrismaService,
		private readonly i18n: I18nService,
		private readonly uploadService: UploadService,
	) {}

	/**
	 * Génère un slug unique à partir du nom du produit
	 * @param name Le nom du produit
	 * @param excludeId L'ID du produit à exclure (pour les mises à jour)
	 * @returns Un slug unique
	 */
	private async generateUniqueSlug(
		name: string,
		excludeId?: string,
	): Promise<string> {
		const baseSlug = slugify(name, { lower: true, strict: true });

		// Chercher les slugs existants qui commencent par le baseSlug
		const existingSlugs = await this.prisma.product.findMany({
			where: {
				slug: {
					startsWith: baseSlug,
				},
				...(excludeId && { id: { not: excludeId } }),
			},
			select: { slug: true },
		});

		if (existingSlugs.length === 0) {
			return baseSlug;
		}

		const slugSet = new Set(existingSlugs.map((p) => p.slug));

		// Si le baseSlug n'existe pas, on le retourne
		if (!slugSet.has(baseSlug)) {
			return baseSlug;
		}

		// Sinon, on cherche le premier suffixe disponible
		let suffix = 1;
		while (slugSet.has(`${baseSlug}-${suffix}`)) {
			suffix++;
		}

		return `${baseSlug}-${suffix}`;
	}

	/**
	 * Créer un nouveau produit
	 */
	async create(
		data: CreateProductInput,
		imageFile?: Express.Multer.File,
		lang?: string,
	) {
		// Vérifier que la catégorie existe
		const category = await this.prisma.category.findUnique({
			where: { id: data.categoryId },
		});

		if (!category) {
			throw new NotFoundException(
				this.i18n.t('errors.category.notFound', {
					args: { id: data.categoryId },
					lang,
				}),
			);
		}

		// Générer un slug unique à partir du nom
		const slug = await this.generateUniqueSlug(data.name);

		if (!imageFile) {
			throw new BadRequestException("L'image du produit est obligatoire");
		}

		// Upload de l'image principale
		const uploadResult = await this.uploadService.uploadFile(imageFile);
		const imageUrl = uploadResult.url;

		// Créer le produit
		return this.prisma.product.create({
			data: {
				name: data.name,
				slug,
				description: data.description,
				price: data.price,
				discount: data.discount ?? 0,
				stockQuantity: data.stockQuantity,
				categoryId: data.categoryId,
				image: imageUrl,
				images: [imageUrl],
				tags: data.tags || [],
				isActive: data.isActive ?? true,
				isFeatured: data.isFeatured ?? false,
			},
			include: {
				category: {
					select: {
						id: true,
						name: true,
						slug: true,
						isActive: true,
					},
				},
			},
		});
	}

	/**
	 * Récupérer tous les produits
	 */
	async findAll(options?: {
		includeInactive?: boolean;
		categoryId?: string;
		page?: number;
		limit?: number;
		sort?: 'price' | 'name' | 'createdAt' | 'stockQuantity';
		order?: 'asc' | 'desc';
		q?: string; // search term
		minPrice?: number;
		maxPrice?: number;
		tags?: string[];
		minStock?: number;
		maxStock?: number;
	}) {
		const {
			includeInactive = false,
			categoryId,
			page = 1,
			limit = 20,
			sort = 'createdAt',
			order = 'desc',
			q,
			minPrice,
			maxPrice,
			tags,
			minStock,
			maxStock,
		} = options || {};

		const where: Prisma.ProductWhereInput = { deletedAt: null };

		if (!includeInactive) {
			where.isActive = true;
		}

		if (categoryId) {
			where.categoryId = categoryId;
		}

		if (q) {
			where.OR = [
				{ name: { contains: q, mode: 'insensitive' } },
				{ description: { contains: q, mode: 'insensitive' } },
				{ tags: { has: q } },
			];
		}

		if (minPrice !== undefined || maxPrice !== undefined) {
			where.price = {};
			if (minPrice !== undefined) where.price.gte = minPrice;
			if (maxPrice !== undefined) where.price.lte = maxPrice;
		}

		if (minStock !== undefined || maxStock !== undefined) {
			where.stockQuantity = {};
			if (minStock !== undefined) where.stockQuantity.gte = minStock;
			if (maxStock !== undefined) where.stockQuantity.lte = maxStock;
		}

		if (tags && tags.length > 0) {
			// require item contains any of tags
			where.tags = { hasSome: tags };
		}

		// Compute pagination
		const take = Math.min(limit || 20, 100);
		const skip = Math.max(0, (page - 1) * take);

		// Map sorting
		const orderBy: Prisma.ProductOrderByWithRelationInput = {};
		if (sort === 'price') orderBy.price = order;
		else if (sort === 'name') orderBy.name = order;
		else if (sort === 'stockQuantity') orderBy.stockQuantity = order;
		else orderBy.createdAt = order;

		const [items, total] = await Promise.all([
			this.prisma.product.findMany({
				where,
				include: {
					category: {
						select: { id: true, name: true, slug: true, isActive: true },
					},
				},
				skip,
				take,
				orderBy,
			}),
			this.prisma.product.count({ where }),
		]);

		return {
			items,
			total,
			page,
			limit: take,
			pageCount: Math.ceil(total / take),
		};
	}

	/**
	 * Récupérer un produit par ID
	 */
	async findOne(id: string, lang?: string) {
		const product = await this.prisma.product.findFirst({
			where: { id, deletedAt: null },
			include: {
				category: {
					select: {
						id: true,
						name: true,
						slug: true,
						isActive: true,
					},
				},
			},
		});

		if (!product) {
			throw new NotFoundException(
				this.i18n.t('errors.product.notFound', { args: { id }, lang }),
			);
		}

		return product;
	}

	/**
	 * Récupérer un produit par slug
	 */
	async findBySlug(slug: string, lang?: string) {
		const product = await this.prisma.product.findFirst({
			where: { slug, deletedAt: null },
			include: {
				category: {
					select: {
						id: true,
						name: true,
						slug: true,
						isActive: true,
					},
				},
			},
		});

		if (!product) {
			throw new NotFoundException(
				this.i18n.t('errors.product.slugNotFound', { args: { slug }, lang }),
			);
		}

		return product;
	}

	/**
	 * Mettre à jour un produit
	 */
	async update(
		id: string,
		data: UpdateProductInput,
		imageFile?: Express.Multer.File,
		lang?: string,
	) {
		// Vérifier que le produit existe
		const existingProduct = await this.findOne(id);

		// Si la catégorie est modifiée, vérifier qu'elle existe
		if (data.categoryId) {
			const category = await this.prisma.category.findUnique({
				where: { id: data.categoryId },
			});

			if (!category) {
				throw new NotFoundException(
					`Catégorie avec l'ID ${data.categoryId} introuvable`,
				);
			}
		}

		// Si le nom est modifié, régénérer le slug
		let slug: string | undefined;
		if (data.name) {
			slug = await this.generateUniqueSlug(data.name, id);
		}

		// Upload de la nouvelle image si fournie
		let imageUrl: string | undefined;
		if (imageFile) {
			// Supprimer l'ancienne image si elle existe
			if (existingProduct.image) {
				const oldKey = this.uploadService.extractKeyFromUrl(
					existingProduct.image,
				);
				if (oldKey) {
					await this.uploadService.deleteFile(oldKey);
				}
			}
			// Upload de la nouvelle image
			const uploadResult = await this.uploadService.uploadFile(imageFile);
			imageUrl = uploadResult.url;
		}

		// Mettre à jour le produit
		const updateData: {
			name?: string;
			slug?: string;
			description?: string;
			price?: number;
			discount?: number;
			stockQuantity?: number;
			categoryId?: string;
			image?: string;
			images?: string[];
			tags?: string[];
			isActive?: boolean;
			isFeatured?: boolean;
		} = { ...data };

		if (slug) {
			updateData.slug = slug;
		}

		if (imageUrl) {
			updateData.image = imageUrl;
			updateData.images = [imageUrl, ...(existingProduct.images || [])];
		}

		return this.prisma.product.update({
			where: { id },
			data: updateData,
			include: {
				category: {
					select: {
						id: true,
						name: true,
						slug: true,
						isActive: true,
					},
				},
			},
		});
	}

	/**
	 * Ajouter des images supplémentaires au produit
	 */
	async addImages(
		id: string,
		imageFiles: Express.Multer.File[],
		lang?: string,
	) {
		// Vérifier que le produit existe
		const product = await this.findOne(id, lang);

		// Upload des images
		const uploadResults = await this.uploadService.uploadFiles(imageFiles);
		const newImageUrls = uploadResults.map((r) => r.url);

		// Ajouter les nouvelles URLs aux images existantes
		const updatedImages = [...(product.images || []), ...newImageUrls];

		return this.prisma.product.update({
			where: { id },
			data: { images: updatedImages },
			include: {
				category: {
					select: {
						id: true,
						name: true,
						slug: true,
						isActive: true,
					},
				},
			},
		});
	}

	/**
	 * Supprimer des images du produit
	 */
	async removeImages(id: string, imageUrls: string[], lang?: string) {
		// Vérifier que le produit existe
		const product = await this.findOne(id, lang);

		// Extraire les clés des URLs et supprimer les fichiers
		const keysToDelete = imageUrls
			.map((url) => this.uploadService.extractKeyFromUrl(url))
			.filter((key): key is string => key !== null);

		if (keysToDelete.length > 0) {
			await this.uploadService.deleteFiles(keysToDelete);
		}

		// Filtrer les images à supprimer
		const updatedImages = (product.images || []).filter(
			(img) => !imageUrls.includes(img),
		);
		if (updatedImages.length === 0) {
			throw new BadRequestException(
				'Le produit doit conserver au moins une image',
			);
		}

		return this.prisma.product.update({
			where: { id },
			data: { images: updatedImages },
			include: {
				category: {
					select: {
						id: true,
						name: true,
						slug: true,
						isActive: true,
					},
				},
			},
		});
	}

	/**
	 * Activer/désactiver un produit
	 */
	async toggleActive(id: string) {
		const product = await this.findOne(id);

		return this.prisma.product.update({
			where: { id },
			data: { isActive: !product.isActive },
			include: {
				category: {
					select: {
						id: true,
						name: true,
						slug: true,
						isActive: true,
					},
				},
			},
		});
	}

	/**
	 * Supprimer un produit (soft delete)
	 */
	async remove(id: string) {
		// Vérifier que le produit existe
		await this.findOne(id);

		return this.prisma.product.update({
			where: { id },
			data: { deletedAt: new Date() },
		});
	}

	/**
	 * Restaurer un produit soft-deleted
	 */
	async restore(id: string, lang?: string) {
		// Vérifier que le produit existe (même si soft-deleted)
		const product = await this.prisma.product.findUnique({ where: { id } });
		if (!product) {
			throw new NotFoundException(
				this.i18n.t('errors.product.notFound', { args: { id }, lang }),
			);
		}

		return this.prisma.product.update({
			where: { id },
			data: { deletedAt: null },
		});
	}

	/**
	 * Vérifier la disponibilité du stock
	 */
	async checkStock(
		id: string,
		quantity: number,
		lang?: string,
	): Promise<boolean> {
		const product = await this.findOne(id, lang);
		return product.stockQuantity >= quantity;
	}

	/**
	 * Décrémenter le stock (lors d'une commande)
	 */
	async decrementStock(id: string, quantity: number, lang?: string) {
		const product = await this.findOne(id, lang);

		if (product.stockQuantity < quantity) {
			throw new ConflictException(
				this.i18n.t('errors.product.stockInsufficient', { lang }),
			);
		}

		return this.prisma.product.update({
			where: { id },
			data: { stockQuantity: { decrement: quantity } },
		});
	}

	/**
	 * Incrémenter le stock (en cas d'annulation)
	 */
	async incrementStock(id: string, quantity: number) {
		return this.prisma.product.update({
			where: { id },
			data: { stockQuantity: { increment: quantity } },
		});
	}
}
