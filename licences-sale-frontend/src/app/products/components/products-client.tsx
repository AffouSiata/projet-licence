'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Product, ProductsList } from '~/validators/products';
import type { Category } from '~/validators/categories';
import { useCart } from '~/components/cart-provider';
import { toast } from 'sonner';

interface ProductsClientProps {
	initialProducts: ProductsList;
	categories: Category[];
	initialFilters: {
		page?: number;
		category?: string;
		q?: string;
		sort?: string;
		order?: string;
		minPrice?: string;
		maxPrice?: string;
	};
}

export default function ProductsClient({
	initialProducts,
	categories,
	initialFilters,
}: ProductsClientProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [isPending, startTransition] = useTransition();
	const { addItem } = useCart();

	const [searchQuery, setSearchQuery] = useState(initialFilters.q || '');
	const [priceRange, setPriceRange] = useState({
		min: initialFilters.minPrice || '',
		max: initialFilters.maxPrice || '',
	});

	const formatPrice = (price: number | string) => {
		const numPrice = typeof price === 'string' ? parseFloat(price) : price;
		return `${Math.round(numPrice * 655.957).toLocaleString('fr-FR')} FCFA`;
	};

	const updateFilters = (updates: Record<string, string | undefined>) => {
		const params = new URLSearchParams(searchParams.toString());

		Object.entries(updates).forEach(([key, value]) => {
			if (value) {
				params.set(key, value);
			} else {
				params.delete(key);
			}
		});

		// Reset page when filters change (except for page itself)
		if (!('page' in updates)) {
			params.delete('page');
		}

		startTransition(() => {
			router.push(`/products?${params.toString()}`);
		});
	};

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		updateFilters({ q: searchQuery || undefined });
	};

	const handlePriceFilter = () => {
		updateFilters({
			minPrice: priceRange.min || undefined,
			maxPrice: priceRange.max || undefined,
		});
	};

	const handleAddToCart = async (product: Product) => {
		const result = await addItem(product.id, 1);
		if (result.success) {
			toast.success(`${product.name} ajouté au panier`);
		} else {
			toast.error(result.error || 'Erreur lors de l\'ajout au panier');
		}
	};

	const products = initialProducts.items;
	const totalPages = initialProducts.pageCount;
	const currentPage = initialFilters.page || 1;

	return (
		<div className="min-h-screen bg-slate-50">
			{/* Header */}
			<div className="bg-white border-b border-slate-200">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-2xl font-bold text-slate-900">Catalogue</h1>
							<p className="text-sm text-slate-500 mt-1">
								{initialProducts.total} produit{initialProducts.total > 1 ? 's' : ''} trouvé{initialProducts.total > 1 ? 's' : ''}
							</p>
						</div>
						<Link href="/" className="text-sm text-slate-600 hover:text-[#1B75BC] flex items-center gap-1">
							<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
							</svg>
							Accueil
						</Link>
					</div>
				</div>
			</div>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="grid lg:grid-cols-4 gap-8">
					{/* Sidebar Filters */}
					<div className="lg:col-span-1">
						<div className="bg-white rounded-xl border border-slate-200 p-5 sticky top-6">
							<h2 className="font-bold text-slate-900 mb-4">Filtres</h2>

							{/* Search */}
							<form onSubmit={handleSearch} className="mb-6">
								<label className="block text-sm font-medium text-slate-700 mb-2">Rechercher</label>
								<div className="flex gap-2">
									<input
										type="text"
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										placeholder="Nom du produit..."
										className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#1B75BC]"
									/>
									<button
										type="submit"
										className="px-3 py-2 bg-[#1B75BC] text-white rounded-lg hover:bg-[#145d96] transition-colors"
									>
										<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
										</svg>
									</button>
								</div>
							</form>

							{/* Categories */}
							<div className="mb-6">
								<label className="block text-sm font-medium text-slate-700 mb-2">Catégories</label>
								<div className="space-y-2">
									<button
										type="button"
										onClick={() => updateFilters({ category: undefined })}
										className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
											!initialFilters.category
												? 'bg-[#1B75BC] text-white'
												: 'text-slate-600 hover:bg-slate-100'
										}`}
									>
										Toutes les catégories
									</button>
									{categories.map((cat) => (
										<button
											key={cat.id}
											type="button"
											onClick={() => updateFilters({ category: cat.id })}
											className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
												initialFilters.category === cat.id
													? 'bg-[#1B75BC] text-white'
													: 'text-slate-600 hover:bg-slate-100'
											}`}
										>
											{cat.name}
											{cat._count?.products !== undefined && (
												<span className="ml-2 text-xs opacity-70">({cat._count.products})</span>
											)}
										</button>
									))}
								</div>
							</div>

							{/* Price Range */}
							<div className="mb-6">
								<label className="block text-sm font-medium text-slate-700 mb-2">Prix (EUR)</label>
								<div className="flex gap-2 items-center">
									<input
										type="number"
										value={priceRange.min}
										onChange={(e) => setPriceRange((prev) => ({ ...prev, min: e.target.value }))}
										placeholder="Min"
										className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#1B75BC]"
									/>
									<span className="text-slate-400">-</span>
									<input
										type="number"
										value={priceRange.max}
										onChange={(e) => setPriceRange((prev) => ({ ...prev, max: e.target.value }))}
										placeholder="Max"
										className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#1B75BC]"
									/>
								</div>
								<button
									type="button"
									onClick={handlePriceFilter}
									className="mt-2 w-full px-3 py-2 bg-slate-100 text-slate-700 text-sm rounded-lg hover:bg-slate-200 transition-colors"
								>
									Appliquer
								</button>
							</div>

							{/* Sort */}
							<div>
								<label className="block text-sm font-medium text-slate-700 mb-2">Trier par</label>
								<select
									value={`${initialFilters.sort || 'createdAt'}-${initialFilters.order || 'desc'}`}
									onChange={(e) => {
										const [sort, order] = e.target.value.split('-');
										updateFilters({ sort, order });
									}}
									className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#1B75BC]"
								>
									<option value="createdAt-desc">Plus récents</option>
									<option value="createdAt-asc">Plus anciens</option>
									<option value="price-asc">Prix croissant</option>
									<option value="price-desc">Prix décroissant</option>
									<option value="name-asc">Nom A-Z</option>
									<option value="name-desc">Nom Z-A</option>
								</select>
							</div>

							{/* Reset filters */}
							{(initialFilters.category || initialFilters.q || initialFilters.minPrice || initialFilters.maxPrice) && (
								<button
									type="button"
									onClick={() => router.push('/products')}
									className="mt-4 w-full px-3 py-2 border border-[#E63946] text-[#E63946] text-sm rounded-lg hover:bg-red-50 transition-colors"
								>
									Réinitialiser les filtres
								</button>
							)}
						</div>
					</div>

					{/* Products Grid */}
					<div className="lg:col-span-3">
						{isPending && (
							<div className="mb-4 flex items-center gap-2 text-sm text-slate-500">
								<svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
									<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
									<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
								</svg>
								Chargement...
							</div>
						)}

						{products.length === 0 ? (
							<div className="text-center py-20">
								<div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
									<svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
									</svg>
								</div>
								<h3 className="text-lg font-semibold text-slate-900 mb-2">Aucun produit trouvé</h3>
								<p className="text-slate-500 mb-6">Essayez de modifier vos filtres de recherche</p>
								<button
									type="button"
									onClick={() => router.push('/products')}
									className="px-6 py-2 bg-[#1B75BC] text-white rounded-lg hover:bg-[#145d96] transition-colors"
								>
									Voir tous les produits
								</button>
							</div>
						) : (
							<>
								<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
									{products.map((product) => {
										const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
										const originalPrice = product.discount > 0 ? price / (1 - product.discount / 100) : null;

										return (
											<div
												key={product.id}
												className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md hover:border-slate-300 transition-all duration-300"
											>
												{/* Image */}
												<Link href={`/products/${product.slug}`} className="block relative h-48 overflow-hidden bg-slate-100">
													<Image
														src={product.image || '/images/placeholder.jpg'}
														alt={product.name}
														fill
														className="object-cover transition-transform duration-500 group-hover:scale-105"
													/>
													{product.discount > 0 && (
														<span className="absolute top-3 right-3 px-2 py-1 bg-[#E63946] text-white text-xs font-bold rounded-lg">
															-{product.discount}%
														</span>
													)}
													{product.isFeatured && (
														<span className="absolute top-3 left-3 px-2 py-1 bg-[#1B75BC] text-white text-xs font-bold rounded-lg">
															Vedette
														</span>
													)}
												</Link>

												{/* Info */}
												<div className="p-4">
													{product.category && (
														<span className="text-xs font-medium text-[#1B75BC] uppercase tracking-wide">
															{product.category.name}
														</span>
													)}
													<Link href={`/products/${product.slug}`}>
														<h3 className="text-base font-bold text-slate-900 mt-1 group-hover:text-[#E63946] transition-colors line-clamp-1">
															{product.name}
														</h3>
													</Link>
													<p className="text-sm text-slate-500 mt-1 line-clamp-2">
														{product.shortDesc || product.description?.substring(0, 80)}
													</p>

													{/* Price & CTA */}
													<div className="flex items-end justify-between mt-4 pt-4 border-t border-slate-100">
														<div>
															<div className="flex items-baseline gap-2">
																<span className="text-lg font-bold text-slate-900">
																	{formatPrice(price)}
																</span>
																{originalPrice && (
																	<span className="text-sm text-slate-400 line-through">
																		{formatPrice(originalPrice)}
																	</span>
																)}
															</div>
															<span className="text-xs text-slate-400">HT / an</span>
														</div>
														<button
															type="button"
															onClick={() => handleAddToCart(product)}
															className="flex items-center gap-1.5 px-3 py-2 bg-[#E63946] text-white text-sm font-medium rounded-lg hover:bg-[#d32f3c] transition-colors"
														>
															<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
																<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
															</svg>
															Ajouter
														</button>
													</div>
												</div>
											</div>
										);
									})}
								</div>

								{/* Pagination */}
								{totalPages > 1 && (
									<div className="mt-10 flex items-center justify-center gap-2">
										<button
											type="button"
											onClick={() => updateFilters({ page: String(currentPage - 1) })}
											disabled={currentPage <= 1}
											className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
										>
											Précédent
										</button>
										<div className="flex items-center gap-1">
											{Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
												let pageNum: number;
												if (totalPages <= 5) {
													pageNum = i + 1;
												} else if (currentPage <= 3) {
													pageNum = i + 1;
												} else if (currentPage >= totalPages - 2) {
													pageNum = totalPages - 4 + i;
												} else {
													pageNum = currentPage - 2 + i;
												}

												return (
													<button
														key={pageNum}
														type="button"
														onClick={() => updateFilters({ page: String(pageNum) })}
														className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
															currentPage === pageNum
																? 'bg-[#1B75BC] text-white'
																: 'border border-slate-200 text-slate-600 hover:bg-slate-50'
														}`}
													>
														{pageNum}
													</button>
												);
											})}
										</div>
										<button
											type="button"
											onClick={() => updateFilters({ page: String(currentPage + 1) })}
											disabled={currentPage >= totalPages}
											className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
										>
											Suivant
										</button>
									</div>
								)}
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
