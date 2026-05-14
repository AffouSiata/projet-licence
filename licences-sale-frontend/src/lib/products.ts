import type { Product, ProductsList } from '~/validators/products';
import type { Category, CategoriesList } from '~/validators/categories';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3020/api';

// Types pour les filtres
export interface ProductFilters {
	page?: number;
	limit?: number;
	categoryId?: string;
	q?: string;
	sort?: 'price' | 'name' | 'createdAt' | 'stockQuantity';
	order?: 'asc' | 'desc';
	minPrice?: number;
	maxPrice?: number;
	tags?: string[];
	minStock?: number;
	maxStock?: number;
}

// Helper pour faire des requêtes GET (fonctionne côté client et serveur)
const fetchApi = async <T>(url: string): Promise<T> => {
	const response = await fetch(`${API_BASE_URL}${url}`, {
		headers: {
			'Content-Type': 'application/json',
		},
		cache: 'no-store',
	});

	if (!response.ok) {
		throw new Error(`API Error: ${response.status}`);
	}

	return response.json();
};

// Récupérer tous les produits avec filtres
export async function getProducts(filters: ProductFilters = {}): Promise<ProductsList> {
	const params = new URLSearchParams();

	if (filters.page) params.append('page', String(filters.page));
	if (filters.limit) params.append('limit', String(filters.limit));
	if (filters.categoryId) params.append('categoryId', filters.categoryId);
	if (filters.q) params.append('q', filters.q);
	if (filters.sort) params.append('sort', filters.sort);
	if (filters.order) params.append('order', filters.order);
	if (filters.minPrice !== undefined) params.append('minPrice', String(filters.minPrice));
	if (filters.maxPrice !== undefined) params.append('maxPrice', String(filters.maxPrice));
	if (filters.tags?.length) params.append('tags', filters.tags.join(','));
	if (filters.minStock !== undefined) params.append('minStock', String(filters.minStock));
	if (filters.maxStock !== undefined) params.append('maxStock', String(filters.maxStock));

	const queryString = params.toString();
	const url = `/products${queryString ? `?${queryString}` : ''}`;

	return fetchApi<ProductsList>(url);
}

// Récupérer un produit par slug
export async function getProductBySlug(slug: string): Promise<Product> {
	return fetchApi<Product>(`/products/slug/${slug}`);
}

// Récupérer un produit par ID
export async function getProductById(id: string): Promise<Product> {
	return fetchApi<Product>(`/products/${id}`);
}

// Récupérer toutes les catégories
export async function getCategories(): Promise<CategoriesList> {
	return fetchApi<CategoriesList>('/categories?limit=100');
}

// Récupérer une catégorie par slug
export async function getCategoryBySlug(slug: string): Promise<Category> {
	return fetchApi<Category>(`/categories/slug/${slug}`);
}

// Récupérer les produits vedettes
export async function getFeaturedProducts(limit: number = 6): Promise<ProductsList> {
	return fetchApi<ProductsList>(`/products?limit=${limit}&sort=createdAt&order=desc`);
}
