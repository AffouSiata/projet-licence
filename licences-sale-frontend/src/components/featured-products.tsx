'use client';

import { ArrowRight, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { ProductCard } from '~/components/product-card';
import type { Product } from '~/validators/products';

interface FeaturedProductsProps {
	products: Product[];
}

export const FeaturedProducts = ({ products }: FeaturedProductsProps) => {
	if (products.length === 0) return null;

	return (
		<section className="py-20 lg:py-28 bg-white">
			<div className="max-w-7xl mx-auto px-6 lg:px-8">
				{/* Header */}
				<div className="flex items-end justify-between flex-wrap gap-6 mb-12 lg:mb-14">
					<div>
						<div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#1D73B3]/10 rounded-full mb-5">
							<TrendingUp size={14} className="text-[#1D73B3]" />
							<span className="text-[12px] font-semibold text-[#1D73B3] tracking-wider uppercase">
								Les plus demandés
							</span>
						</div>
						<h2 className="text-3xl md:text-4xl lg:text-[44px] font-bold text-[#1B3A5F] leading-[1.1] tracking-tight">
							Produits populaires
						</h2>
					</div>
					<Link
						href="/categories"
						className="group hidden md:inline-flex items-center gap-2 text-[14px] font-semibold text-slate-700 hover:text-[#1D73B3] transition-colors"
					>
						Voir tous les produits
						<ArrowRight
							size={16}
							className="group-hover:translate-x-1 transition-transform"
						/>
					</Link>
				</div>

				{/* Products Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6">
					{products.slice(0, 8).map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
				</div>

				{/* Mobile CTA */}
				<div className="md:hidden flex justify-center mt-10">
					<Link
						href="/categories"
						className="inline-flex items-center gap-2 px-6 py-3 bg-[#1D73B3] text-white text-[14px] font-semibold rounded-full hover:bg-[#1B3A5F] transition-colors"
					>
						Voir tous les produits
						<ArrowRight size={16} />
					</Link>
				</div>
			</div>
		</section>
	);
};
