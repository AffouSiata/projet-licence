import { api } from '~/lib/api';
import type { CategoriesList } from '~/validators/categories';
import type { ProductsList } from '~/validators/products';
import { CreateProductButton } from './components/create-product-button';
import { ProductsTable } from './components/products-table';

const ProductsPage = async () => {
	let productsList: ProductsList | null = null;
	let categoriesList: CategoriesList | null = null;

	try {
		[productsList, categoriesList] = await Promise.all([
			api.get<ProductsList>('/api/products?includeInactive=true&limit=100'),
			api.get<CategoriesList>('/api/categories?limit=100'),
		]);
	} catch (error) {
		console.error('Erreur chargement produits:', error);
	}

	const categories =
		categoriesList?.items.map((c) => ({ id: c.id, name: c.name })) ?? [];

	return (
		<div className="p-8">
			<div className="flex items-center justify-between mb-8">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Produits</h1>
					<p className="text-gray-600 mt-2">
						Gérez votre catalogue de licences
					</p>
				</div>
				<CreateProductButton categories={categories} />
			</div>

			{productsList ? (
				<>
					<div className="mb-4 text-sm text-gray-600">
						{productsList.total} produit
						{productsList.total > 1 ? 's' : ''} au total
					</div>
					<ProductsTable
						products={productsList.items}
						categories={categories}
					/>
				</>
			) : (
				<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12">
					<div className="text-center text-gray-500">
						<p>Erreur lors du chargement des produits</p>
					</div>
				</div>
			)}
		</div>
	);
};

export default ProductsPage;
