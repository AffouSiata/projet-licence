import { api } from '~/lib/api';
import type { CategoriesList } from '~/validators/categories';
import { CategoriesTable } from './components/categories-table';
import { CreateCategoryButton } from './components/create-category-button';

const CategoriesPage = async () => {
	let categoriesList: CategoriesList | null = null;

	try {
		categoriesList = await api.get<CategoriesList>('/categories?limit=100');
		console.log('Catégories chargées:', categoriesList);
	} catch (error) {
		console.error('Erreur chargement catégories:', error);
	}

	const totalCategories = categoriesList?.total ?? 0;
	const activeCategories =
		categoriesList?.items.filter((c) => c.isActive).length ?? 0;
	const totalProducts =
		categoriesList?.items.reduce(
			(acc, c) => acc + (c._count?.products ?? 0),
			0,
		) ?? 0;

	return (
		<div className="p-8 space-y-8">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Catégories</h1>
					<p className="text-gray-500 mt-1">
						Organisez et gérez vos catégories de produits
					</p>
				</div>
				<CreateCategoryButton />
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
				<div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-5 border border-blue-100">
					<div className="flex items-center gap-4">
						<div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
							<svg
								className="w-6 h-6 text-white"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
								/>
							</svg>
						</div>
						<div>
							<p className="text-sm font-medium text-blue-600">
								Total catégories
							</p>
							<p className="text-2xl font-bold text-gray-900">
								{totalCategories}
							</p>
						</div>
					</div>
				</div>

				<div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl p-5 border border-emerald-100">
					<div className="flex items-center gap-4">
						<div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
							<svg
								className="w-6 h-6 text-white"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						</div>
						<div>
							<p className="text-sm font-medium text-emerald-600">
								Catégories actives
							</p>
							<p className="text-2xl font-bold text-gray-900">
								{activeCategories}
							</p>
						</div>
					</div>
				</div>

				<div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl p-5 border border-purple-100">
					<div className="flex items-center gap-4">
						<div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
							<svg
								className="w-6 h-6 text-white"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
								/>
							</svg>
						</div>
						<div>
							<p className="text-sm font-medium text-purple-600">
								Total produits
							</p>
							<p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
						</div>
					</div>
				</div>
			</div>

			{/* Categories Table */}
			{categoriesList ? (
				<CategoriesTable categories={categoriesList.items} />
			) : (
				<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12">
					<div className="text-center">
						<div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<svg
								className="w-8 h-8 text-red-500"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
								/>
							</svg>
						</div>
						<p className="text-lg font-medium text-gray-900 mb-1">
							Erreur de chargement
						</p>
						<p className="text-gray-500">
							Impossible de charger les catégories. Veuillez réessayer.
						</p>
					</div>
				</div>
			)}
		</div>
	);
};

export default CategoriesPage;
