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
			api.get<ProductsList>('/products?includeInactive=true&limit=100'),
			api.get<CategoriesList>('/categories?limit=100'),
		]);
	} catch (error) {
		console.error('Erreur chargement produits:', error);
	}

	const categories =
		categoriesList?.items.map((c) => ({ id: c.id, name: c.name })) ?? [];

	return (
		<div className="p-8">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
				<div>
					<p className="text-gray-500">
						Gérez votre catalogue de licences
						{productsList ? (
							<span className="ml-2 inline-flex items-center rounded-full bg-[#1D73B3]/10 px-2.5 py-0.5 text-xs font-semibold text-[#1D73B3] align-middle">
								{productsList.total} produit
								{productsList.total > 1 ? 's' : ''}
							</span>
						) : null}
					</p>
				</div>
				<CreateProductButton categories={categories} />
			</div>

			{productsList ? (
				<ProductsTable products={productsList.items} categories={categories} />
			) : (
				<div className="bg-white rounded-2xl ring-1 ring-gray-200/70 shadow-sm p-12">
					<div className="text-center text-gray-500">
						<p>Erreur lors du chargement des produits</p>
					</div>
				</div>
			)}
		</div>
	);
};

export default ProductsPage;
