'use client';

import { useAction } from 'next-safe-action/hooks';
import { useState } from 'react';
import { toast } from 'sonner';
import type { Product } from '~/validators/products';
import {
	deleteProductAction,
	restoreProductAction,
	toggleProductAction,
} from '../actions';
import { ProductFormModal } from './product-form-modal';

interface CategoryOption {
	id: string;
	name: string;
}

interface ProductsTableProps {
	products: Product[];
	categories: CategoryOption[];
}

const formatPrice = (price: string | number, discount: number) => {
	const numPrice = typeof price === 'string' ? Number.parseFloat(price) : price;
	const discounted = discount > 0 ? numPrice * (1 - discount / 100) : numPrice;
	return { original: numPrice, discounted };
};

const getStockColor = (stock: number) => {
	if (stock === 0) return 'bg-red-100 text-red-800';
	if (stock <= 5) return 'bg-orange-100 text-orange-800';
	return 'bg-green-100 text-green-800';
};

export const ProductsTable = ({ products, categories }: ProductsTableProps) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();

	const { execute: executeDelete } = useAction(deleteProductAction, {
		onSuccess: ({ data }) => {
			if (data?.success) {
				toast.success('Produit supprimé');
			} else if (data?.error) {
				toast.error(data.error);
			}
		},
	});

	const { execute: executeRestore } = useAction(restoreProductAction, {
		onSuccess: ({ data }) => {
			if (data?.success) {
				toast.success('Produit restauré');
			} else if (data?.error) {
				toast.error(data.error);
			}
		},
	});

	const { execute: executeToggle } = useAction(toggleProductAction, {
		onSuccess: ({ data }) => {
			if (data?.success) {
				toast.success('Statut modifié');
			} else if (data?.error) {
				toast.error(data.error);
			}
		},
	});

	const handleEdit = (product: Product) => {
		setSelectedProduct(product);
		setIsModalOpen(true);
	};

	const handleDelete = (id: string, name: string) => {
		if (confirm(`Voulez-vous vraiment supprimer le produit "${name}" ?`)) {
			executeDelete({ id });
		}
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setSelectedProduct(undefined);
	};

	if (products.length === 0) {
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
							d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
						/>
					</svg>
					<p className="text-lg font-medium text-gray-900 mb-2">
						Aucun produit
					</p>
					<p className="text-sm text-gray-600">
						Créez votre premier produit pour commencer
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
									Produit
								</th>
								<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Catégorie
								</th>
								<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Prix
								</th>
								<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Stock
								</th>
								<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Statut
								</th>
								<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Vedette
								</th>
								<th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-200">
							{products.map((product) => {
								const { original, discounted } = formatPrice(
									product.price,
									product.discount,
								);
								const isDeleted = !!product.deletedAt;

								return (
									<tr
										key={product.id}
										className={`hover:bg-gray-50 transition-colors ${isDeleted ? 'opacity-50' : ''}`}
									>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="flex items-center gap-3">
												{product.image && (
													<img
														src={product.image}
														alt={product.name}
														className="w-10 h-10 rounded-lg object-cover"
													/>
												)}
												<div>
													<p className="font-medium text-gray-900">
														{product.name}
													</p>
													<p className="text-xs text-gray-500">
														{new Date(product.createdAt).toLocaleDateString(
															'fr-FR',
														)}
													</p>
												</div>
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<span className="text-sm text-gray-600">
												{product.category?.name || '—'}
											</span>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<div>
												{product.discount > 0 ? (
													<>
														<p className="text-sm font-medium text-gray-900">
															{discounted.toFixed(2)} FCFA
														</p>
														<p className="text-xs text-gray-500 line-through">
															{original.toFixed(2)} FCFA
														</p>
														<span className="text-xs text-green-600">
															-{product.discount}%
														</span>
													</>
												) : (
													<p className="text-sm font-medium text-gray-900">
														{original.toFixed(2)} FCFA
													</p>
												)}
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<span
												className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStockColor(product.stockQuantity)}`}
											>
												{product.stockQuantity}
											</span>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											{isDeleted ? (
												<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
													Supprimé
												</span>
											) : (
												<button
													onClick={() => executeToggle({ id: product.id })}
													className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
														product.isActive
															? 'bg-green-100 text-green-800'
															: 'bg-gray-100 text-gray-800'
													}`}
												>
													{product.isActive ? 'Actif' : 'Inactif'}
												</button>
											)}
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<span
												className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
													product.isFeatured
														? 'bg-yellow-100 text-yellow-800'
														: 'bg-gray-100 text-gray-600'
												}`}
											>
												{product.isFeatured ? 'Oui' : 'Non'}
											</span>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
											<div className="flex items-center justify-end gap-2">
												{isDeleted ? (
													<button
														onClick={() => executeRestore({ id: product.id })}
														className="text-green-600 hover:text-green-900 transition-colors"
														title="Restaurer"
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
																d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
															/>
														</svg>
													</button>
												) : (
													<>
														<button
															onClick={() => handleEdit(product)}
															className="text-blue-600 hover:text-blue-900 transition-colors"
															title="Modifier"
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
															onClick={() =>
																handleDelete(product.id, product.name)
															}
															className="text-red-600 hover:text-red-900 transition-colors"
															title="Supprimer"
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
													</>
												)}
											</div>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</div>

			<ProductFormModal
				isOpen={isModalOpen}
				onClose={handleCloseModal}
				product={selectedProduct}
				categories={categories}
			/>
		</>
	);
};
