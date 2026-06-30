'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Loader2, Package, Search, ShoppingCart, Check, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { Header } from '~/components/header';
import { Footer } from '~/components/footer';
import { useCart } from '~/components/cart-provider';
import { useFavorites } from '~/components/favorites-provider';
import { getProducts } from '~/lib/products';
import type { Product } from '~/validators/products';

const SearchPage = () => {
	const searchParams = useSearchParams();
	const query = searchParams.get('q')?.trim() ?? '';

	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(false);
	const [addedProductId, setAddedProductId] = useState<string | null>(null);

	const { addItem } = useCart();
	const { isFavorite, toggleFavorite } = useFavorites();

	useEffect(() => {
		if (!query) {
			setProducts([]);
			return;
		}
		const fetchData = async () => {
			try {
				setLoading(true);
				const response = await getProducts({ q: query, limit: 100 });
				setProducts(response.items || []);
			} catch (err) {
				setProducts([]);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, [query]);

	const handleAddToCart = async (e: React.MouseEvent, product: Product) => {
		e.preventDefault();
		e.stopPropagation();
		try {
			await addItem(product.id, 1);
			setAddedProductId(product.id);
			setTimeout(() => setAddedProductId(null), 1500);
		} catch (err) {
			// silent
		}
	};

	const handleToggleFavorite = (
		e: React.MouseEvent,
		productId: string,
		productName: string,
	) => {
		e.preventDefault();
		e.stopPropagation();
		const wasInFavorites = isFavorite(productId);
		toggleFavorite(productId);
		toast.success(
			wasInFavorites
				? `${productName} retiré des favoris`
				: `${productName} ajouté aux favoris`,
		);
	};

	return (
		<>
			<Header />
			<main className="min-h-screen bg-gray-50">
				{/* Header */}
				<section className="bg-gradient-to-br from-[#1D70B8] via-[#2E86AB] to-[#1B3A5F] py-12">
					<div className="max-w-7xl mx-auto px-6">
						<nav className="flex items-center gap-2 text-sm text-white/70 mb-6">
							<Link href="/" className="hover:text-white transition-colors">
								Accueil
							</Link>
							<span>/</span>
							<span className="text-white font-medium">Recherche</span>
						</nav>
						<div className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 rounded-full mb-4 border border-white/20">
							<Search size={16} className="text-white" />
							<span className="text-sm font-semibold text-white">
								{query ? `Résultats pour « ${query} »` : 'Rechercher un produit'}
							</span>
						</div>
						<h1 className="text-3xl md:text-4xl font-bold text-white">
							{loading
								? 'Recherche en cours...'
								: products.length > 0
									? `${products.length} produit${products.length > 1 ? 's' : ''} trouvé${products.length > 1 ? 's' : ''}`
									: query
										? 'Aucun résultat'
										: 'Tapez une recherche'}
						</h1>
					</div>
				</section>

				{/* Results */}
				<section className="py-12">
					<div className="max-w-7xl mx-auto px-6">
						{loading ? (
							<div className="flex items-center justify-center py-20">
								<div className="text-center">
									<div className="w-16 h-16 rounded-full border-4 border-gray-200 border-t-[#1D70B8] animate-spin mx-auto" />
									<Loader2
										size={28}
										className="text-[#1D70B8] -mt-12 mx-auto"
									/>
								</div>
							</div>
						) : products.length > 0 ? (
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
								{products.map((product) => {
									const price =
										typeof product.price === 'string'
											? Number.parseFloat(product.price)
											: product.price;
									const discount = product.discount || 0;

									return (
										<div
											key={product.id}
											className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-transparent hover:shadow-xl transition-all duration-300"
										>
											<div className="relative h-56 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
												{discount > 0 && (
													<div className="absolute top-3 left-3 z-10">
														<span className="inline-flex items-center px-2.5 py-1 bg-red-500 text-white text-xs font-bold rounded-lg">
															-{discount}%
														</span>
													</div>
												)}
												<button
													type="button"
													onClick={(e) =>
														handleToggleFavorite(e, product.id, product.name)
													}
													className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-lg shadow-md flex items-center justify-center transition-colors ${
														isFavorite(product.id)
															? 'bg-red-50 text-red-500'
															: 'bg-white text-gray-400 hover:text-red-500'
													}`}
												>
													<Heart
														size={18}
														className={isFavorite(product.id) ? 'fill-red-500' : ''}
													/>
												</button>
												<Link
													href={`/products/${product.slug}`}
													className="block h-full p-6"
												>
													<div className="relative w-full h-full">
														{product.image ? (
															<Image
																src={product.image}
																alt={product.name}
																fill
																className="object-contain group-hover:scale-110 transition-transform duration-500"
															/>
														) : (
															<div className="w-full h-full flex items-center justify-center">
																<Package size={64} className="text-gray-300" />
															</div>
														)}
													</div>
												</Link>
											</div>
											<div className="p-5">
												<Link href={`/products/${product.slug}`}>
													<h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#1D70B8] transition-colors">
														{product.name}
													</h3>
												</Link>
												{product.shortDesc && (
													<p className="text-sm text-gray-500 mb-4 line-clamp-2">
														{product.shortDesc}
													</p>
												)}
												<div className="flex items-center justify-between pt-3 border-t border-gray-100">
													<span className="text-xl font-bold text-gray-900">
														{price.toLocaleString()} F
													</span>
													<button
														type="button"
														onClick={(e) => handleAddToCart(e, product)}
														disabled={product.stockQuantity <= 0}
														className={`w-11 h-11 flex items-center justify-center rounded-xl transition-all duration-200 ${
															product.stockQuantity <= 0
																? 'bg-gray-200 text-gray-400 cursor-not-allowed'
																: addedProductId === product.id
																	? 'bg-green-500 text-white scale-110'
																	: 'bg-[#1D70B8] text-white hover:bg-[#155a96] hover:scale-105'
														}`}
													>
														{addedProductId === product.id ? (
															<Check size={20} />
														) : (
															<ShoppingCart size={20} />
														)}
													</button>
												</div>
											</div>
										</div>
									);
								})}
							</div>
						) : (
							<div className="text-center py-20">
								<div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
									<Search size={40} className="text-gray-300" />
								</div>
								<h3 className="text-2xl font-bold text-gray-900 mb-3">
									{query ? 'Aucun produit trouvé' : 'Tapez une recherche'}
								</h3>
								<p className="text-gray-500 mb-8 max-w-md mx-auto">
									{query
										? `Aucun produit ne correspond à « ${query} ». Essayez avec d'autres mots-clés ou parcourez les catégories.`
										: 'Utilisez la barre de recherche en haut pour trouver une licence.'}
								</p>
								<Link
									href="/categories"
									className="inline-flex items-center gap-2 px-6 py-3 bg-[#1D70B8] text-white font-semibold rounded-xl hover:bg-[#155a96] transition-colors"
								>
									Voir toutes les catégories
									<ArrowRight size={18} />
								</Link>
							</div>
						)}
					</div>
				</section>
			</main>
			<Footer />
		</>
	);
};

export default SearchPage;
