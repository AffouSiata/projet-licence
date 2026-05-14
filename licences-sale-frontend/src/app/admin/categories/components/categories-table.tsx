'use client';

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
			<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16">
				<div className="text-center max-w-md mx-auto">
					<div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
						<svg
							className="w-10 h-10 text-blue-500"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={1.5}
								d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
							/>
						</svg>
					</div>
					<h3 className="text-xl font-semibold text-gray-900 mb-2">
						Aucune catégorie
					</h3>
					<p className="text-gray-500 mb-6">
						Commencez par créer votre première catégorie pour organiser vos
						produits de manière efficace.
					</p>
					<div className="flex items-center justify-center gap-2 text-sm text-gray-400">
						<svg
							className="w-4 h-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M13 7l5 5m0 0l-5 5m5-5H6"
							/>
						</svg>
						<span>Cliquez sur "Nouvelle catégorie" pour commencer</span>
					</div>
				</div>
			</div>
		);
	}

	return (
		<>
			{/* View Toggle & Search */}
			<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
					<div className="relative flex-1 max-w-md">
						<svg
							className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
							/>
						</svg>
						<input
							type="text"
							placeholder="Rechercher une catégorie..."
							className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
						/>
					</div>

					<div className="flex items-center gap-2">
						<span className="text-sm text-gray-500 mr-2">Vue :</span>
						<button
							onClick={() => setViewMode('grid')}
							className={`p-2 rounded-lg transition-all ${
								viewMode === 'grid'
									? 'bg-blue-100 text-blue-600'
									: 'bg-gray-100 text-gray-500 hover:bg-gray-200'
							}`}
						>
							<svg
								className="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
								/>
							</svg>
						</button>
						<button
							onClick={() => setViewMode('table')}
							className={`p-2 rounded-lg transition-all ${
								viewMode === 'table'
									? 'bg-blue-100 text-blue-600'
									: 'bg-gray-100 text-gray-500 hover:bg-gray-200'
							}`}
						>
							<svg
								className="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M4 6h16M4 10h16M4 14h16M4 18h16"
								/>
							</svg>
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
							className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all duration-300"
						>
							{/* Card Header with Image */}
							<div className="relative h-32 bg-gradient-to-br from-gray-100 to-gray-50 overflow-hidden">
								{category.image ? (
									<img
										src={category.image}
										alt={category.name}
										className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
									/>
								) : (
									<div className="w-full h-full flex items-center justify-center">
										<svg
											className="w-12 h-12 text-gray-300"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={1.5}
												d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
											/>
										</svg>
									</div>
								)}

								{/* Status Badge */}
								<button
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
										<svg
											className="w-4 h-4"
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
										<span>
											{category._count?.products ?? 0} produit
											{(category._count?.products ?? 0) > 1 ? 's' : ''}
										</span>
									</div>

									{/* Actions */}
									<div className="flex items-center gap-1">
										<button
											onClick={() => handleEdit(category)}
											className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
											title="Modifier"
										>
											<svg
												className="w-4 h-4"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
												/>
											</svg>
										</button>
										<button
											onClick={() => handleDelete(category.id, category.name)}
											className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
											title="Supprimer"
										>
											<svg
												className="w-4 h-4"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
												/>
											</svg>
										</button>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			) : (
				/* Table View */
				<div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr className="bg-gray-50/80">
									<th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
										Catégorie
									</th>
									<th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
										Description
									</th>
									<th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
										Produits
									</th>
									<th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
										Statut
									</th>
									<th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
										Actions
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-100">
								{categories.map((category) => (
									<tr
										key={category.id}
										className="hover:bg-gray-50/50 transition-colors"
									>
										<td className="px-6 py-4">
											<div className="flex items-center gap-3">
												<div className="w-10 h-10 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
													{category.image ? (
														<img
															src={category.image}
															alt={category.name}
															className="w-full h-full object-cover"
														/>
													) : (
														<div className="w-full h-full flex items-center justify-center">
															<svg
																className="w-5 h-5 text-gray-400"
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
													)}
												</div>
												<div>
													<p className="font-medium text-gray-900">
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
											<span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
												<svg
													className="w-3.5 h-3.5"
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
												{category._count?.products ?? 0}
											</span>
										</td>
										<td className="px-6 py-4">
											<button
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
													onClick={() => handleEdit(category)}
													className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
													title="Modifier"
												>
													<svg
														className="w-4 h-4"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
														/>
													</svg>
												</button>
												<button
													onClick={() =>
														handleDelete(category.id, category.name)
													}
													className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
													title="Supprimer"
												>
													<svg
														className="w-4 h-4"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
														/>
													</svg>
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
