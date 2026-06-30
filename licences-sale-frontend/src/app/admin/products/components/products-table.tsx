'use client';

import { Package, Pencil, RotateCcw, Trash2 } from 'lucide-react';
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
	if (stock === 0) return 'bg-red-100 text-red-700';
	if (stock <= 5) return 'bg-orange-100 text-orange-700';
	return 'bg-green-100 text-green-700';
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
			<div className="bg-white rounded-2xl ring-1 ring-gray-200/70 shadow-sm p-12">
				<div className="text-center">
					<div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[#1D73B3]/10 flex items-center justify-center">
						<Package size={28} className="text-[#1D73B3]" />
					</div>
					<p className="text-lg font-semibold text-gray-900 mb-2">
						Aucun produit
					</p>
					<p className="text-sm text-gray-500">
						Créez votre premier produit pour commencer
					</p>
				</div>
			</div>
		);
	}

	return (
		<>
			<div className="bg-white rounded-2xl ring-1 ring-gray-200/70 shadow-sm overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead>
							<tr className="border-b border-gray-100">
								<th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
									Produit
								</th>
								<th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
									Catégorie
								</th>
								<th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
									Prix
								</th>
								<th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
									Stock
								</th>
								<th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
									Statut
								</th>
								<th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
									Vedette
								</th>
								<th className="px-6 py-3 text-right text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-50">
							{products.map((product) => {
								const { original, discounted } = formatPrice(
									product.price,
									product.discount,
								);
								const isDeleted = !!product.deletedAt;

								return (
									<tr
										key={product.id}
										className={`hover:bg-[#F6F8FB] transition-colors ${isDeleted ? 'opacity-50' : ''}`}
									>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="flex items-center gap-3">
												{product.image && (
													<img
														src={product.image}
														alt={product.name}
														className="w-10 h-10 rounded-lg object-cover ring-1 ring-gray-100"
													/>
												)}
												<div>
													<p className="text-sm font-semibold text-gray-900">
														{product.name}
													</p>
													<p className="text-xs text-gray-400">
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
														<p className="text-sm font-semibold text-gray-900">
															{discounted.toFixed(2)} FCFA
														</p>
														<p className="text-xs text-gray-400 line-through">
															{original.toFixed(2)} FCFA
														</p>
														<span className="text-xs font-medium text-green-600">
															-{product.discount}%
														</span>
													</>
												) : (
													<p className="text-sm font-semibold text-gray-900">
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
												<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
													Supprimé
												</span>
											) : (
												<button
													type="button"
													onClick={() => executeToggle({ id: product.id })}
													className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
														product.isActive
															? 'bg-green-100 text-green-700 hover:bg-green-200'
															: 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
														? 'bg-amber-100 text-amber-700'
														: 'bg-gray-100 text-gray-500'
												}`}
											>
												{product.isFeatured ? 'Oui' : 'Non'}
											</span>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-right">
											<div className="flex items-center justify-end gap-1">
												{isDeleted ? (
													<button
														type="button"
														onClick={() => executeRestore({ id: product.id })}
														className="p-2 rounded-lg text-green-600 hover:bg-green-50 transition-colors"
														title="Restaurer"
													>
														<RotateCcw size={18} />
													</button>
												) : (
													<>
														<button
															type="button"
															onClick={() => handleEdit(product)}
															className="p-2 rounded-lg text-[#1D73B3] hover:bg-[#1D73B3]/10 transition-colors"
															title="Modifier"
														>
															<Pencil size={18} />
														</button>
														<button
															type="button"
															onClick={() =>
																handleDelete(product.id, product.name)
															}
															className="p-2 rounded-lg text-[#E63946] hover:bg-[#E63946]/10 transition-colors"
															title="Supprimer"
														>
															<Trash2 size={18} />
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
