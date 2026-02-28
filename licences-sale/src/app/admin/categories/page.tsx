import { api } from '~/lib/api';
import type { CategoriesList } from '~/validators/categories';
import { CategoriesTable } from './components/categories-table';
import { CreateCategoryButton } from './components/create-category-button';

const CategoriesPage = async () => {
	let categoriesList: CategoriesList | null = null;

	try {
		categoriesList = await api.get<CategoriesList>('/api/categories?limit=100');
		console.log('Catégories chargées:', categoriesList);
	} catch (error) {
		console.error('Erreur chargement catégories:', error);
	}

	return (
		<div className="p-8">
			<div className="flex items-center justify-between mb-8">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Catégories</h1>
					<p className="text-gray-600 mt-2">
						Organisez vos produits par catégories
					</p>
				</div>
				<CreateCategoryButton />
			</div>

			{categoriesList ? (
				<>
					<div className="mb-4 text-sm text-gray-600">
						{categoriesList.total} catégorie
						{categoriesList.total > 1 ? 's' : ''} au total
					</div>
					<CategoriesTable categories={categoriesList.items} />
				</>
			) : (
				<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12">
					<div className="text-center text-gray-500">
						<p>Erreur lors du chargement des catégories</p>
					</div>
				</div>
			)}
		</div>
	);
};

export default CategoriesPage;
