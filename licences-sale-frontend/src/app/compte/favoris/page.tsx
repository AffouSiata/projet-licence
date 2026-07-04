'use client';

import { ArrowLeft, Heart, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useFavorites } from '~/components/favorites-provider';
import { Footer } from '~/components/footer';
import { Header } from '~/components/header';
import { ProductCard } from '~/components/product-card';
import { getProducts } from '~/lib/products';
import type { Product } from '~/validators/products';

export default function FavoritesPage() {
	const { favorites, clearFavorites } = useFavorites();
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);

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
					favorites.includes(product.id),
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

	const handleClearAll = () => {
		clearFavorites();
		toast.success('Tous les favoris ont été supprimés');
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
										({favorites.length} produit{favorites.length > 1 ? 's' : ''}
										)
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
								Parcourez notre catalogue et cliquez sur le cœur pour ajouter
								des produits à vos favoris.
							</p>
							<Link
								href="/categories"
								className="inline-flex items-center gap-2 px-6 py-3 bg-[#1D73B3] text-white font-semibold rounded-xl hover:bg-[#165d91] transition-colors"
							>
								Découvrir nos produits
							</Link>
						</div>
					) : (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{products.map((product) => (
								<ProductCard key={product.id} product={product} />
							))}
						</div>
					)}
				</div>
			</main>
			<Footer />
		</>
	);
}
