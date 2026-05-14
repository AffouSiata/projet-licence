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
import type { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';

@Injectable()
export class CategoriesService {
	constructor(
		private prisma: PrismaService,
		private readonly i18n: I18nService,
		private readonly uploadService: UploadService,
	) {}

	/**
	 * Génère un slug unique à partir du nom de la catégorie
	 * @param name Le nom de la catégorie
	 * @param excludeId L'ID de la catégorie à exclure (pour les mises à jour)
	 * @returns Un slug unique
	 */
	private async generateUniqueSlug(
		name: string,
		excludeId?: string,
	): Promise<string> {
		const baseSlug = slugify(name, { lower: true, strict: true });

		// Chercher les slugs existants qui commencent par le baseSlug
		const existingSlugs = await this.prisma.category.findMany({
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

		const slugSet = new Set(existingSlugs.map((c) => c.slug));

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

	async create(dto: CreateCategoryDto, imageFile?: Express.Multer.File) {
		const slug = await this.generateUniqueSlug(dto.name);

		// Vérifier que le parent existe si spécifié
		if (dto.parentId) {
			const parent = await this.prisma.category.findUnique({
				where: { id: dto.parentId },
			});
			if (!parent) {
				throw new NotFoundException(
					this.i18n.t('errors.category.parentNotFound'),
				);
			}
		}

		// Upload de l'image (obligatoire)
		let imageUrl: string | undefined;
		if (imageFile) {
			const uploadResult = await this.uploadService.uploadFile(imageFile);
			imageUrl = uploadResult.url;
		}
		if (!imageUrl) {
			throw new BadRequestException("L'image de la catégorie est obligatoire");
		}

		return this.prisma.category.create({
			data: {
				name: dto.name,
				slug,
				description: dto.description,
				image: imageUrl,
				parentId: dto.parentId,
				order: dto.order || 0,
			},
			include: {
				parent: {
					select: { id: true, name: true, slug: true },
				},
			},
		});
	}

	async findAll(options?: {
		includeInactive?: boolean;
		page?: number;
		limit?: number;
		sort?: 'name' | 'order';
		order?: 'asc' | 'desc';
	}) {
		const {
			includeInactive = false,
			page = 1,
			limit = 20,
			sort = 'order',
			order = 'asc',
		} = options || {};

		const where: Prisma.CategoryWhereInput = { deletedAt: null };
		if (!includeInactive) where.isActive = true;

		const take = Math.min(limit, 100);
		const skip = Math.max(0, (page - 1) * take);

		const orderBy: Prisma.CategoryOrderByWithRelationInput = {};
		if (sort === 'name') orderBy.name = order;
		else orderBy.order = order;

		const [items, total] = await Promise.all([
			this.prisma.category.findMany({
				where,
				include: {
					parent: {
						select: { id: true, name: true, slug: true },
					},
					children: {
						select: { id: true, name: true, slug: true, isActive: true },
					},
					_count: { select: { products: true } },
				},
				orderBy,
				skip,
				take,
			}),
			this.prisma.category.count({ where }),
		]);

		return {
			items,
			total,
			page,
			limit: take,
			pageCount: Math.ceil(total / take),
		};
	}

	async findOne(id: string) {
		const category = await this.prisma.category.findFirst({
			where: { id, deletedAt: null },
			include: {
				parent: {
					select: { id: true, name: true, slug: true },
				},
				children: {
					select: { id: true, name: true, slug: true, isActive: true },
				},
				products: {
					select: {
						id: true,
						name: true,
						slug: true,
						price: true,
						isActive: true,
					},
					where: { isActive: true },
				},
			},
		});

		if (!category) {
			// Use i18n to provide localized message
			throw new NotFoundException(
				this.i18n.t('errors.category.notFound', { args: { id } }),
			);
		}

		return category;
	}

	async findBySlug(slug: string) {
		const category = await this.prisma.category.findFirst({
			where: { slug, deletedAt: null },
			include: {
				parent: {
					select: { id: true, name: true, slug: true },
				},
				children: {
					select: { id: true, name: true, slug: true, isActive: true },
					where: { isActive: true },
				},
				products: {
					select: {
						id: true,
						name: true,
						slug: true,
						price: true,
						isActive: true,
					},
					where: { isActive: true },
				},
			},
		});

		if (!category) {
			throw new NotFoundException(
				this.i18n.t('errors.category.notFound', { args: { slug } }),
			);
		}

		return category;
	}

	async update(
		id: string,
		dto: UpdateCategoryDto,
		imageFile?: Express.Multer.File,
	) {
		const existingCategory = await this.findOne(id); // Vérifie l'existence

		let slug: string | undefined;
		if (dto.name && dto.name !== existingCategory.name) {
			// Générer un nouveau slug unique si le nom change
			slug = await this.generateUniqueSlug(dto.name, id);
		}

		// Vérifier que le nouveau parent existe si spécifié
		if (dto.parentId) {
			const parent = await this.prisma.category.findUnique({
				where: { id: dto.parentId },
			});
			if (!parent) {
				throw new NotFoundException(
					this.i18n.t('errors.category.parentNotFound'),
				);
			}

			// Empêcher une catégorie d'être son propre parent
			if (dto.parentId === id) {
				throw new ConflictException(
					this.i18n.t('errors.category_update.selfParent'),
				);
			}
		}

		// Upload de la nouvelle image si fournie
		let imageUrl: string | undefined;
		if (imageFile) {
			// Supprimer l'ancienne image si elle existe
			if (existingCategory.image) {
				const oldKey = this.uploadService.extractKeyFromUrl(
					existingCategory.image,
				);
				if (oldKey) {
					await this.uploadService.deleteFile(oldKey);
				}
			}
			// Upload de la nouvelle image
			const uploadResult = await this.uploadService.uploadFile(imageFile);
			imageUrl = uploadResult.url;
		}

		return this.prisma.category.update({
			where: { id },
			data: {
				name: dto.name,
				slug,
				description: dto.description,
				image: imageUrl,
				parentId: dto.parentId,
				order: dto.order,
			},
			include: {
				parent: {
					select: { id: true, name: true, slug: true },
				},
			},
		});
	}

	async toggleActive(id: string) {
		const category = await this.findOne(id);

		return this.prisma.category.update({
			where: { id },
			data: { isActive: !category.isActive },
		});
	}

	async remove(id: string) {
		await this.findOne(id); // Vérifie l'existence

		// Soft delete de la catégorie
		await this.prisma.category.update({
			where: { id },
			data: { deletedAt: new Date() },
		});

		return { message: 'Catégorie supprimée avec succès' };
	}

	/**
	 * Restaurer une catégorie supprimée
	 */
	async restore(id: string) {
		// Permettre la restauration même si soft-deleted
		const category = await this.prisma.category.findUnique({ where: { id } });
		if (!category) {
			throw new NotFoundException(`Catégorie avec l'ID ${id} introuvable`);
		}

		return this.prisma.category.update({
			where: { id },
			data: { deletedAt: null },
		});
	}
}
