'use client';

import { ArrowRight, Loader2, Search } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Footer } from '~/components/footer';
import { Header } from '~/components/header';
import { ProductCard } from '~/components/product-card';
import { getProducts } from '~/lib/products';
import type { Product } from '~/validators/products';

const SearchPage = () => {
	const searchParams = useSearchParams();
	const query = searchParams.get('q')?.trim() ?? '';

	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(false);

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
								{query
									? `Résultats pour « ${query} »`
									: 'Rechercher un produit'}
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
								{products.map((product) => (
									<ProductCard key={product.id} product={product} />
								))}
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
