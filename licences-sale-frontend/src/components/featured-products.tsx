'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
	ArrowRight,
	TrendingUp,
	ShoppingCart,
	Heart,
	Check,
	Package,
} from 'lucide-react';
import { useState } from 'react';
import type { Product } from '~/validators/products';
import { useCart } from '~/components/cart-provider';
import { useFavorites } from '~/components/favorites-provider';
import { toast } from 'sonner';

interface FeaturedProductsProps {
	products: Product[];
}

const localImages: Record<string, string> = {
	'windows-11-pro': '/products/windows-11-pro.jpg',
	'windows-11-home': '/products/windows-11-pro.jpg',
	'windows-10-pro': '/products/windows-10-pro.jpg',
	'office-2021-pro-plus': '/products/office-2021-pro.jpg',
	'microsoft-365-personnel': '/products/office-2024-pro.webp',
	'microsoft-365-famille': '/products/office-2024-pro.webp',
	'norton-360-deluxe': '/products/norton-360.jpg',
	'kaspersky-total-security': '/products/kaspersky.jpg',
	'bitdefender-total-security': '/products/norton-360.jpg',
	'autocad-2025': '/products/autocad.jpg',
	'adobe-acrobat-pro-dc': '/products/adobe-acrobat.jpg',
	'adobe-creative-cloud': '/products/adobe-acrobat.jpg',
	'adobe-photoshop': '/products/adobe-acrobat.jpg',
	'windows-server-2022-standard': '/products/windows-server-2022.jpg',
};

const getProductImage = (product: Product): string | null => {
	if (localImages[product.slug]) return localImages[product.slug];
	return product.images?.[0] || product.image || null;
};

export const FeaturedProducts = ({ products }: FeaturedProductsProps) => {
	const { addItem } = useCart();
	const { isFavorite, toggleFavorite } = useFavorites();
	const [addedProductId, setAddedProductId] = useState<string | null>(null);

	const handleAddToCart = (e: React.MouseEvent, product: Product) => {
		e.preventDefault();
		e.stopPropagation();
		setAddedProductId(product.id);
		setTimeout(() => setAddedProductId(null), 1500);
		addItem(product.id, 1);
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

	const getOriginalPrice = (price: number, discount?: number) => {
		if (!discount || discount <= 0) return null;
		return Math.round(price / (1 - discount / 100));
	};

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
						href="/products"
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
					{products.slice(0, 8).map((product) => {
						const price =
							typeof product.price === 'string'
								? Number.parseFloat(product.price)
								: product.price;
						const discount = product.discount || 0;
						const originalPrice = getOriginalPrice(price, discount);
						const productImage = getProductImage(product);
						const isOutOfStock = product.stockQuantity <= 0;
						const isLowStock =
							product.stockQuantity > 0 && product.stockQuantity <= 5;
						const wasAdded = addedProductId === product.id;
						const fav = isFavorite(product.id);

						return (
							<div
								key={product.id}
								className="group relative flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden transition-all duration-300 hover:border-slate-300 hover:shadow-md"
							>
								{/* Image area */}
								<Link
									href={`/products/${product.slug}`}
									className="relative aspect-square bg-slate-50 overflow-hidden block"
								>
									{/* Top badges */}
									<div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
										{discount > 0 && (
											<span className="inline-flex items-center px-2.5 py-1 bg-[#E63946] text-white text-[11px] font-bold rounded-md tabular-nums">
												−{discount}%
											</span>
										)}
										{isLowStock && (
											<span className="inline-flex items-center px-2.5 py-1 bg-amber-500/95 text-white text-[10px] font-semibold rounded-md tracking-wide uppercase">
												Stock limité
											</span>
										)}
									</div>

									{/* Favorite button - always visible */}
									<button
										type="button"
										onClick={(e) =>
											handleToggleFavorite(e, product.id, product.name)
										}
										aria-label="Ajouter aux favoris"
										className={`absolute top-4 right-4 z-10 w-9 h-9 rounded-full border flex items-center justify-center transition-colors duration-200 ${
											fav
												? 'bg-red-50 border-red-100 text-red-500'
												: 'bg-white border-slate-200 text-slate-400 hover:text-red-500 hover:border-slate-300'
										}`}
									>
										<Heart
											size={16}
											className={fav ? 'fill-red-500' : ''}
											strokeWidth={fav ? 2 : 1.75}
										/>
									</button>

									{/* Out of stock overlay */}
									{isOutOfStock && (
										<div className="absolute inset-0 z-10 bg-white/70 backdrop-blur-[2px] flex items-center justify-center">
											<span className="px-4 py-1.5 bg-[#1B3A5F] text-white text-xs font-semibold tracking-wider uppercase rounded">
												Rupture de stock
											</span>
										</div>
									)}

									{/* Product image */}
									<div className="absolute inset-0 flex items-center justify-center p-8 lg:p-10">
										{productImage ? (
											<div className="relative w-full h-full transition-transform duration-700 ease-out group-hover:scale-105">
												<Image
													src={productImage}
													alt={product.name}
													fill
													className="object-contain drop-shadow-md"
													sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 25vw"
												/>
											</div>
										) : (
											<Package size={56} className="text-slate-300" />
										)}
									</div>
								</Link>

								{/* Content */}
								<div className="flex flex-col flex-1 p-5 lg:p-6">
									{/* Category */}
									{product.category && (
										<span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 mb-2">
											{product.category.name}
										</span>
									)}

									{/* Title */}
									<Link href={`/products/${product.slug}`} className="group/title">
										<h3 className="text-[15px] lg:text-base font-semibold text-[#1B3A5F] leading-snug line-clamp-2 mb-2 group-hover/title:text-[#1D73B3] transition-colors">
											{product.name}
										</h3>
									</Link>

									{/* Short description */}
									{product.shortDesc && (
										<p className="text-[13px] text-slate-500 line-clamp-2 mb-5 leading-relaxed">
											{product.shortDesc}
										</p>
									)}

									{/* Spacer */}
									<div className="flex-1" />

									{/* Price */}
									<div className="flex items-baseline gap-2 mb-4">
										<span className="text-xl lg:text-[22px] font-bold text-[#1B3A5F] tabular-nums">
											{price.toLocaleString('fr-FR')}
											<span className="text-sm font-semibold text-slate-500 ml-1">
												F
											</span>
										</span>
										{originalPrice && (
											<span className="text-[13px] text-slate-400 line-through tabular-nums">
												{originalPrice.toLocaleString('fr-FR')} F
											</span>
										)}
									</div>

									{/* CTA - full width */}
									<button
										type="button"
										onClick={(e) => handleAddToCart(e, product)}
										disabled={isOutOfStock}
										className={`relative w-full h-11 rounded-xl text-[13px] font-semibold flex items-center justify-center gap-2 transition-all duration-300 overflow-hidden ${
											isOutOfStock
												? 'bg-slate-100 text-slate-400 cursor-not-allowed'
												: wasAdded
													? 'bg-emerald-500 text-white'
													: 'bg-[#1D73B3] text-white hover:bg-[#1B3A5F]'
										}`}
									>
										{wasAdded ? (
											<>
												<Check size={16} />
												<span>Ajouté</span>
											</>
										) : isOutOfStock ? (
											<span>Indisponible</span>
										) : (
											<>
												<ShoppingCart
													size={16}
													className="transition-transform duration-300 group-hover:-translate-x-0.5"
												/>
												<span>Ajouter au panier</span>
											</>
										)}
									</button>
								</div>
							</div>
						);
					})}
				</div>

				{/* Mobile CTA */}
				<div className="md:hidden flex justify-center mt-10">
					<Link
						href="/products"
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
