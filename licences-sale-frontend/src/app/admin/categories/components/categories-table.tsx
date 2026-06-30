'use client';

import {
	ArrowRight,
	FolderTree,
	LayoutGrid,
	List,
	Package,
	Pencil,
	Search,
	Trash2,
} from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { useState } from 'react';
import { toast } from 'sonner';
import type { Category } from '~/validators/categories';
import { deleteCategoryAction, toggleCategoryAction } from '../actions';
import { CategoryFormModal } from './category-form-modal';

interface CategoriesTableProps {
	categories: Category[];
}

export const CategoriesTable = ({ categories }: CategoriesTableProps) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState<
		Category | undefined
	>();
	const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

	const { execute: executeDelete } = useAction(deleteCategoryAction, {
		onSuccess: ({ data }) => {
			if (data?.success) {
				toast.success('Catégorie supprimée');
			} else if (data?.error) {
				toast.error(data.error);
			}
		},
	});

	const { execute: executeToggle } = useAction(toggleCategoryAction, {
		onSuccess: ({ data }) => {
			if (data?.success) {
				toast.success('Statut modifié');
			} else if (data?.error) {
				toast.error(data.error);
			}
		},
	});

	const handleEdit = (category: Category) => {
		setSelectedCategory(category);
		setIsModalOpen(true);
	};

	const handleDelete = (id: string, name: string) => {
		if (confirm(`Voulez-vous vraiment supprimer la catégorie "${name}" ?`)) {
			executeDelete({ id });
		}
	};

	const handleToggle = (id: string) => {
		executeToggle({ id });
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setSelectedCategory(undefined);
	};

	if (categories.length === 0) {
		return (
			<div className="bg-white rounded-2xl ring-1 ring-gray-200/70 shadow-sm p-16">
				<div className="text-center max-w-md mx-auto">
					<div className="w-20 h-20 bg-[#1D73B3]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
						<FolderTree size={40} className="text-[#1D73B3]" />
					</div>
					<h3 className="text-xl font-semibold text-gray-900 mb-2">
						Aucune catégorie
					</h3>
					<p className="text-gray-500 mb-6">
						Commencez par créer votre première catégorie pour organiser vos
						produits de manière efficace.
					</p>
					<div className="flex items-center justify-center gap-2 text-sm text-gray-400">
						<ArrowRight size={16} />
						<span>Cliquez sur "Créer une catégorie" pour commencer</span>
					</div>
				</div>
			</div>
		);
	}

	return (
		<>
			{/* View Toggle & Search */}
			<div className="bg-white rounded-2xl ring-1 ring-gray-200/70 shadow-sm p-4">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
					<div className="relative flex-1 max-w-md">
						<Search
							size={18}
							className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
						/>
						<input
							type="text"
							placeholder="Rechercher une catégorie..."
							className="w-full pl-10 pr-4 py-2.5 bg-[#F6F8FB] border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1D73B3] focus:bg-white transition-all"
						/>
					</div>

					<div className="flex items-center gap-2">
						<span className="text-sm text-gray-500 mr-1">Vue :</span>
						<button
							type="button"
							onClick={() => setViewMode('grid')}
							className={`p-2 rounded-lg transition-all ${
								viewMode === 'grid'
									? 'bg-[#1D73B3]/10 text-[#1D73B3]'
									: 'bg-gray-100 text-gray-500 hover:bg-gray-200'
							}`}
							title="Vue grille"
						>
							<LayoutGrid size={20} />
						</button>
						<button
							type="button"
							onClick={() => setViewMode('table')}
							className={`p-2 rounded-lg transition-all ${
								viewMode === 'table'
									? 'bg-[#1D73B3]/10 text-[#1D73B3]'
									: 'bg-gray-100 text-gray-500 hover:bg-gray-200'
							}`}
							title="Vue tableau"
						>
							<List size={20} />
						</button>
					</div>
				</div>
			</div>

			{/* Grid View */}
			{viewMode === 'grid' ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
					{categories.map((category) => (
						<div
							key={category.id}
							className="group bg-white rounded-2xl ring-1 ring-gray-200/70 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300"
						>
							{/* Card Header with Image */}
							<div className="relative h-32 bg-[#F6F8FB] overflow-hidden">
								{category.image ? (
									<img
										src={category.image}
										alt={category.name}
										className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
									/>
								) : (
									<div className="w-full h-full flex items-center justify-center">
										<FolderTree size={48} className="text-gray-300" />
									</div>
								)}

								{/* Status Badge */}
								<button
									type="button"
									onClick={() => handleToggle(category.id)}
									className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-sm transition-all hover:scale-105 ${
										category.isActive
											? 'bg-emerald-500/90 text-white'
											: 'bg-gray-500/90 text-white'
									}`}
								>
									{category.isActive ? 'Actif' : 'Inactif'}
								</button>
							</div>

							{/* Card Body */}
							<div className="p-4">
								<h3 className="font-semibold text-gray-900 mb-1 truncate">
									{category.name}
								</h3>
								<p className="text-sm text-gray-500 line-clamp-2 h-10 mb-3">
									{category.description || 'Aucune description'}
								</p>

								{/* Stats Row */}
								<div className="flex items-center justify-between pt-3 border-t border-gray-100">
									<div className="flex items-center gap-1.5 text-sm text-gray-500">
										<Package size={16} />
										<span>
											{category._count?.products ?? 0} produit
											{(category._count?.products ?? 0) > 1 ? 's' : ''}
										</span>
									</div>

									{/* Actions */}
									<div className="flex items-center gap-1">
										<button
											type="button"
											onClick={() => handleEdit(category)}
											className="p-2 text-gray-400 hover:text-[#1D73B3] hover:bg-[#1D73B3]/10 rounded-lg transition-all"
											title="Modifier"
										>
											<Pencil size={16} />
										</button>
										<button
											type="button"
											onClick={() => handleDelete(category.id, category.name)}
											className="p-2 text-gray-400 hover:text-[#E63946] hover:bg-[#E63946]/10 rounded-lg transition-all"
											title="Supprimer"
										>
											<Trash2 size={16} />
										</button>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			) : (
				/* Table View */
				<div className="bg-white rounded-2xl ring-1 ring-gray-200/70 shadow-sm overflow-hidden">
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr className="border-b border-gray-100">
									<th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
										Catégorie
									</th>
									<th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
										Description
									</th>
									<th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
										Produits
									</th>
									<th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
										Statut
									</th>
									<th className="px-6 py-3 text-right text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
										Actions
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-50">
								{categories.map((category) => (
									<tr
										key={category.id}
										className="hover:bg-[#F6F8FB] transition-colors"
									>
										<td className="px-6 py-4">
											<div className="flex items-center gap-3">
												<div className="w-10 h-10 bg-[#F6F8FB] rounded-xl overflow-hidden flex-shrink-0">
													{category.image ? (
														<img
															src={category.image}
															alt={category.name}
															className="w-full h-full object-cover"
														/>
													) : (
														<div className="w-full h-full flex items-center justify-center">
															<FolderTree size={20} className="text-gray-400" />
														</div>
													)}
												</div>
												<div>
													<p className="text-sm font-semibold text-gray-900">
														{category.name}
													</p>
													<p className="text-xs text-gray-400">
														{new Date(category.createdAt).toLocaleDateString(
															'fr-FR',
															{
																day: 'numeric',
																month: 'short',
																year: 'numeric',
															},
														)}
													</p>
												</div>
											</div>
										</td>
										<td className="px-6 py-4">
											<p className="text-sm text-gray-600 max-w-xs truncate">
												{category.description || '—'}
											</p>
										</td>
										<td className="px-6 py-4">
											<span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[#1D73B3]/10 text-[#1D73B3]">
												<Package size={14} />
												{category._count?.products ?? 0}
											</span>
										</td>
										<td className="px-6 py-4">
											<button
												type="button"
												onClick={() => handleToggle(category.id)}
												className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
													category.isActive
														? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
														: 'bg-gray-100 text-gray-600 hover:bg-gray-200'
												}`}
											>
												<span
													className={`w-1.5 h-1.5 rounded-full ${category.isActive ? 'bg-emerald-500' : 'bg-gray-400'}`}
												/>
												{category.isActive ? 'Actif' : 'Inactif'}
											</button>
										</td>
										<td className="px-6 py-4">
											<div className="flex items-center justify-end gap-1">
												<button
													type="button"
													onClick={() => handleEdit(category)}
													className="p-2 text-gray-400 hover:text-[#1D73B3] hover:bg-[#1D73B3]/10 rounded-lg transition-all"
													title="Modifier"
												>
													<Pencil size={16} />
												</button>
												<button
													type="button"
													onClick={() =>
														handleDelete(category.id, category.name)
													}
													className="p-2 text-gray-400 hover:text-[#E63946] hover:bg-[#E63946]/10 rounded-lg transition-all"
													title="Supprimer"
												>
													<Trash2 size={16} />
												</button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			)}

			<CategoryFormModal
				isOpen={isModalOpen}
				onClose={handleCloseModal}
				category={selectedCategory}
			/>
		</>
	);
};
