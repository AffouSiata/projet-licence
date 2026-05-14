import { getProducts, getCategories } from '~/lib/products';
import ProductsClient from './components/products-client';

export const revalidate = 60;

interface PageProps {
	searchParams: Promise<{
		page?: string;
		category?: string;
		q?: string;
		sort?: string;
		order?: string;
		minPrice?: string;
		maxPrice?: string;
	}>;
}

export default async function ProductsPage({ searchParams }: PageProps) {
	const params = await searchParams;

	const page = params.page ? parseInt(params.page, 10) : 1;
	const limit = 12;

	// Récupérer les catégories et produits en parallèle
	const [categoriesData, productsData] = await Promise.all([
		getCategories().catch(() => ({ items: [], total: 0, page: 1, limit: 100, pageCount: 0 })),
		getProducts({
			page,
			limit,
			categoryId: params.category,
			q: params.q,
			sort: params.sort as 'price' | 'name' | 'createdAt' | undefined,
			order: params.order as 'asc' | 'desc' | undefined,
			minPrice: params.minPrice ? parseFloat(params.minPrice) : undefined,
			maxPrice: params.maxPrice ? parseFloat(params.maxPrice) : undefined,
		}).catch(() => ({ items: [], total: 0, page: 1, limit, pageCount: 0 })),
	]);

	return (
		<ProductsClient
			initialProducts={productsData}
			categories={categoriesData.items}
			initialFilters={{
				page,
				category: params.category,
				q: params.q,
				sort: params.sort,
				order: params.order,
				minPrice: params.minPrice,
				maxPrice: params.maxPrice,
			}}
		/>
	);
}
