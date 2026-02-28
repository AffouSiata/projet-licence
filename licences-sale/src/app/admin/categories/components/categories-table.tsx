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
			<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12">
				<div className="text-center">
					<svg
						className="w-16 h-16 mx-auto mb-4 text-gray-400"
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
					<p className="text-lg font-medium text-gray-900 mb-2">
						Aucune catégorie
					</p>
					<p className="text-sm text-gray-600">
						Créez votre première catégorie pour commencer
					</p>
				</div>
			</div>
		);
	}

	return (
		<>
			<div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-gray-50 border-b border-gray-200">
							<tr>
								<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Catégorie
								</th>
								<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Description
								</th>
								<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Produits
								</th>
								<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Statut
								</th>
								<th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-200">
							{categories.map((category) => (
								<tr
									key={category.id}
									className="hover:bg-gray-50 transition-colors"
								>
									<td className="px-6 py-4 whitespace-nowrap">
										<div>
											<p className="font-medium text-gray-900">
												{category.name}
											</p>
											<p className="text-xs text-gray-500">
												{new Date(category.createdAt).toLocaleDateString('fr-FR')}
											</p>
										</div>
									</td>
									<td className="px-6 py-4">
										<p className="text-sm text-gray-600 max-w-xs truncate">
											{category.description || '—'}
										</p>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
											{category._count?.products ?? 0} produit
											{(category._count?.products ?? 0) > 1 ? 's' : ''}
										</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<button
											onClick={() => handleToggle(category.id)}
											className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
												category.isActive
													? 'bg-green-100 text-green-800'
													: 'bg-gray-100 text-gray-800'
											}`}
										>
											{category.isActive ? 'Actif' : 'Inactif'}
										</button>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
										<div className="flex items-center justify-end gap-2">
											<button
												onClick={() => handleEdit(category)}
												className="text-blue-600 hover:text-blue-900 transition-colors"
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
														d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
													/>
												</svg>
											</button>
											<button
												onClick={() => handleDelete(category.id, category.name)}
												className="text-red-600 hover:text-red-900 transition-colors"
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

			<CategoryFormModal
				isOpen={isModalOpen}
				onClose={handleCloseModal}
				category={selectedCategory}
			/>
		</>
	);
};
