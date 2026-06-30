import { AlertTriangle, CheckCircle2, FolderTree, Package } from 'lucide-react';
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

	const cards = [
		{
			label: 'Total catégories',
			value: totalCategories,
			icon: FolderTree,
			tint: 'text-[#1D73B3]',
			bg: 'bg-[#1D73B3]/10',
			bar: 'bg-[#1D73B3]',
		},
		{
			label: 'Catégories actives',
			value: activeCategories,
			icon: CheckCircle2,
			tint: 'text-[#059669]',
			bg: 'bg-[#059669]/10',
			bar: 'bg-[#059669]',
		},
		{
			label: 'Total produits',
			value: totalProducts,
			icon: Package,
			tint: 'text-[#0891B2]',
			bg: 'bg-[#0891B2]/10',
			bar: 'bg-[#0891B2]',
		},
	];

	return (
		<div className="p-8 space-y-8">
			{/* Toolbar */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<p className="text-gray-500">
					Organisez et gérez vos catégories de produits.
				</p>
				<CreateCategoryButton />
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
				{cards.map((card) => {
					const Icon = card.icon;
					return (
						<div
							key={card.label}
							className="relative bg-white rounded-2xl ring-1 ring-gray-200/70 shadow-sm overflow-hidden p-6"
						>
							<span
								className={`absolute inset-x-0 top-0 h-1 ${card.bar} opacity-80`}
							/>
							<div className="flex items-start justify-between">
								<div>
									<p className="text-sm text-gray-500 mb-2">{card.label}</p>
									<p className="text-3xl font-bold text-gray-900 tracking-tight">
										{card.value}
									</p>
								</div>
								<div
									className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center`}
								>
									<Icon size={24} className={card.tint} />
								</div>
							</div>
						</div>
					);
				})}
			</div>

			{/* Categories Table */}
			{categoriesList ? (
				<CategoriesTable categories={categoriesList.items} />
			) : (
				<div className="bg-white rounded-2xl ring-1 ring-gray-200/70 shadow-sm p-12">
					<div className="text-center">
						<div className="w-16 h-16 bg-[#E63946]/10 rounded-full flex items-center justify-center mx-auto mb-4">
							<AlertTriangle size={32} className="text-[#E63946]" />
						</div>
						<p className="text-lg font-semibold text-gray-900 mb-1">
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
