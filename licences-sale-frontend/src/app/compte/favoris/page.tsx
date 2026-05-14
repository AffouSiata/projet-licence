'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart, Trash2, Package, ArrowLeft, Check } from 'lucide-react';
import { Header } from '~/components/header';
import { Footer } from '~/components/footer';
import { useFavorites } from '~/components/favorites-provider';
import { useCart } from '~/components/cart-provider';
import { getProducts } from '~/lib/products';
import type { Product } from '~/validators/products';
import { toast } from 'sonner';

export default function FavoritesPage() {
	const { favorites, removeFavorite, clearFavorites } = useFavorites();
	const { addItem } = useCart();
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const [addedProductId, setAddedProductId] = useState<string | null>(null);

	useEffect(() => {
		const fetchFavoriteProducts = async () => {
			if (favorites.length === 0) {
				setProducts([]);
				setLoading(false);
				return;
			}

			try {
				setLoading(true);
				// Récupérer tous les produits puis filtrer par favoris
				const response = await getProducts({ limit: 100 });
				const favoriteProducts = response.items.filter((product) =>
					favorites.includes(product.id)
				);
				setProducts(favoriteProducts);
			} catch (error) {
				console.error('Erreur lors du chargement des favoris:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchFavoriteProducts();
	}, [favorites]);

	const handleAddToCart = async (product: Product) => {
		try {
			await addItem(product.id, 1);
			setAddedProductId(product.id);
			toast.success(`${product.name} ajouté au panier`);
			setTimeout(() => setAddedProductId(null), 1500);
		} catch (err) {
			toast.error('Erreur lors de l\'ajout au panier');
		}
	};

	const handleRemoveFavorite = (productId: string, productName: string) => {
		removeFavorite(productId);
		toast.success(`${productName} retiré des favoris`);
	};

	const handleClearAll = () => {
		clearFavorites();
		toast.success('Tous les favoris ont été supprimés');
	};

	const getOriginalPrice = (price: number, discount?: number) => {
		if (!discount || discount <= 0) return null;
		return Math.round(price / (1 - discount / 100));
	};

	return (
		<>
			<Header />
			<main className="min-h-screen bg-gray-50 py-8 lg:py-12">
				<div className="max-w-7xl mx-auto px-6">
					{/* Header */}
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
						<div>
							<Link
								href="/"
								className="inline-flex items-center gap-2 text-gray-500 hover:text-[#1D73B3] mb-4 transition-colors"
							>
								<ArrowLeft size={18} />
								Retour à l'accueil
							</Link>
							<h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
								<Heart size={32} className="text-[#E63946]" />
								Mes Favoris
								{favorites.length > 0 && (
									<span className="text-lg font-normal text-gray-500">
										({favorites.length} produit{favorites.length > 1 ? 's' : ''})
									</span>
								)}
							</h1>
						</div>

						{favorites.length > 0 && (
							<button
								type="button"
								onClick={handleClearAll}
								className="inline-flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
							>
								<Trash2 size={18} />
								Tout supprimer
							</button>
						)}
					</div>

					{loading ? (
						<div className="flex items-center justify-center py-20">
							<div className="w-12 h-12 border-4 border-[#1D73B3] border-t-transparent rounded-full animate-spin" />
						</div>
					) : favorites.length === 0 ? (
						<div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
							<div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
								<Heart size={40} className="text-gray-300" />
							</div>
							<h2 className="text-2xl font-bold text-gray-900 mb-3">
								Aucun favori pour le moment
							</h2>
							<p className="text-gray-500 mb-8 max-w-md mx-auto">
								Parcourez notre catalogue et cliquez sur le cœur pour ajouter des produits à vos favoris.
							</p>
							<Link
								href="/products"
								className="inline-flex items-center gap-2 px-6 py-3 bg-[#1D73B3] text-white font-semibold rounded-xl hover:bg-[#165d91] transition-colors"
							>
								Découvrir nos produits
							</Link>
						</div>
					) : (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{products.map((product) => {
								const price =
									typeof product.price === 'string'
										? Number.parseFloat(product.price)
										: product.price;
								const discount = product.discount || 0;
								const originalPrice = getOriginalPrice(price, discount);

								return (
									<div
										key={product.id}
										className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300"
									>
										{/* Image */}
										<div className="relative h-56 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
											{/* Badges */}
											{discount > 0 && (
												<div className="absolute top-3 left-3 z-10">
													<span className="inline-flex items-center px-2.5 py-1 bg-red-500 text-white text-xs font-bold rounded-lg">
														-{discount}%
													</span>
												</div>
											)}

											{/* Remove button */}
											<button
												type="button"
												onClick={() => handleRemoveFavorite(product.id, product.name)}
												className="absolute top-3 right-3 z-10 w-9 h-9 bg-white rounded-lg shadow-md flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors"
											>
												<Heart size={18} className="fill-red-500" />
											</button>

											{/* Product Image */}
											<Link
												href={`/products/${product.slug}`}
												className="block h-full p-6"
											>
												<div className="relative w-full h-full group-hover:scale-105 transition-transform duration-300">
													{product.image ? (
														<Image
															src={product.image}
															alt={product.name}
															fill
															className="object-contain"
														/>
													) : (
														<div className="w-full h-full flex items-center justify-center">
															<Package size={64} className="text-gray-300" />
														</div>
													)}
												</div>
											</Link>
										</div>

										{/* Content */}
										<div className="p-5">
											{/* Category */}
											{product.category && (
												<span className="inline-block text-xs font-semibold uppercase tracking-wider mb-2 text-[#1D73B3]">
													{product.category.name}
												</span>
											)}

											{/* Title */}
											<Link href={`/products/${product.slug}`}>
												<h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#1D73B3] transition-colors">
													{product.name}
												</h3>
											</Link>

											{/* Price & Cart */}
											<div className="flex items-center justify-between pt-3 border-t border-gray-100">
												<div>
													<div className="flex items-baseline gap-2">
														<span className="text-xl font-bold text-gray-900">
															{price.toLocaleString()} F
														</span>
														{originalPrice && (
															<span className="text-sm text-gray-400 line-through">
																{originalPrice.toLocaleString()} F
															</span>
														)}
													</div>
												</div>

												<button
													type="button"
													onClick={() => handleAddToCart(product)}
													disabled={product.stockQuantity <= 0}
													className={`w-11 h-11 flex items-center justify-center rounded-xl transition-all duration-200 ${
														product.stockQuantity <= 0
															? 'bg-gray-200 text-gray-400 cursor-not-allowed'
															: addedProductId === product.id
																? 'bg-green-500 text-white scale-110'
																: 'bg-gradient-to-r from-[#1D73B3] to-[#2E86AB] text-white hover:shadow-lg hover:scale-105'
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
					)}
				</div>
			</main>
			<Footer />
		</>
	);
}
