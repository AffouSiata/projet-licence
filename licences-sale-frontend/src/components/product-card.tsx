'use client';

import { Check, Heart, Package, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { useCart } from '~/components/cart-provider';
import { useFavorites } from '~/components/favorites-provider';
import type { Product } from '~/validators/products';

// Visuels locaux soignés par slug produit (fallback sur l'image de l'API).
// Les chemins pointent vers public/images/<Catégorie>/ ; les espaces et
// apostrophes des dossiers sont encodés (%20, %27) pour être servis tels quels.
const localImages: Record<string, string> = {
	// Adobe
	'adobe-acrobat-pro-dc': '/images/Adobe/adobe-acrobat.jpg',
	'adobe-photoshop': '/images/Adobe/adobe-photoshop-2025.jpg',
	'adobe-creative-cloud': '/images/Adobe/creative.jpeg',
	'adobe-premiere-pro': '/images/Adobe/premier%20pro.jpeg',
	'adobe-illustrator': '/images/Adobe/illusttator.jpeg',
	'adobe-after-effects': '/images/Adobe/after.webp',
	// Antivirus
	'kaspersky-total-security': '/images/Antivirus/kaspersky.jpg',
	'norton-360-deluxe': '/images/Antivirus/norton-360.jpg',
	'bitdefender-total-security':
		'/images/Antivirus/7dc4ffcb-6e36-4b03-8a24-c5f9338fdbd8.avif',
	'avast-premium-security':
		'/images/Antivirus/Avast-Pro-Antivirus-1-Year-10-PC-Windows_dfddaa4a-7d02-4d4a-82a9-67c322a5d08e.3b1a24fbbcf7896d302568d710610068.avif',
	// Autodesk
	'autocad-2025': '/images/Autodeck/autocad.jpg',
	'revit-2025': '/images/Autodeck/revit.jpeg',
	'3ds-max-2025': '/images/Autodeck/3ds%20max.jpeg',
	'autodesk-inventor': '/images/Autodeck/Autodesk-inventor.webp',
	'autodesk-civil-3d':
		'/images/Autodeck/civil-3d-copy-dbdd95563fb11b01e417539654142158-1024-1024-ceee2cc4be6477fc5017539857442237-1024-1024.webp',
	// Microsoft Office
	'office-2021-pro-plus': '/images/office/office-2021-pro.jpg',
	'microsoft-365-personnel': '/images/office/office-2024-pro.webp',
	'microsoft-365-famille': '/images/office/office-2024-pro.webp',
	'office-2024-pro-plus':
		'/images/office/microsoft-microsoft-office-2024-professional-plus.webp',
	'office-2019-pro-plus':
		'/images/office/microsoft-office-2019-pro-plus-retail-308.webp',
	'office-2020-pro-plus': '/images/office/MS-Office-2020-Box.png',
	// Systèmes d'exploitation (4 produits ↔ 4 visuels du dossier)
	'windows-11-pro': "/images/Systeme%20d'exploitation/windows-11-pro.jpg",
	'windows-10-pro': "/images/Systeme%20d'exploitation/windows-10-pro.jpg",
	'windows-7-professionnel': "/images/Systeme%20d'exploitation/window7.png",
	'windows-11-home': "/images/Systeme%20d'exploitation/windows-10.png",
	// Windows Server (4 produits ↔ 4 visuels du dossier Window server/)
	'windows-server-2022-standard':
		'/images/Window%20server/windows-server-2022.jpg',
	'windows-server-2019-standard': '/images/Window%20server/server.png',
	'windows-server-2016-standard':
		'/images/Window%20server/1777457232909-4aff59ff5bb8.webp',
	'sql-server-2022-standard':
		'/images/Window%20server/sql-server-2022-standard-10-core.webp',
};

export const getProductImage = (product: Product): string | null => {
	if (localImages[product.slug]) return localImages[product.slug];
	return product.images?.[0] || product.image || null;
};

const toNumber = (value: string | number): number =>
	typeof value === 'string' ? Number.parseFloat(value) : value;

interface ProductCardProps {
	product: Product;
	priority?: boolean;
}

export const ProductCard = ({
	product,
	priority = false,
}: ProductCardProps) => {
	const { addItem } = useCart();
	const { isFavorite, toggleFavorite } = useFavorites();
	const [wasAdded, setWasAdded] = useState(false);

	const price = toNumber(product.price);
	const discount = product.discount || 0;
	const originalPrice =
		discount > 0 ? Math.round(price / (1 - discount / 100)) : null;
	const productImage = getProductImage(product);
	const isOutOfStock = product.stockQuantity <= 0;
	const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= 5;
	const fav = isFavorite(product.id);

	const handleAddToCart = async (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (isOutOfStock) return;
		try {
			await addItem(product.id, 1);
			setWasAdded(true);
			setTimeout(() => setWasAdded(false), 1500);
		} catch {
			toast.error("Erreur lors de l'ajout au panier");
		}
	};

	const handleToggleFavorite = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		const wasFav = fav;
		toggleFavorite(product.id);
		toast.success(
			wasFav
				? `${product.name} retiré des favoris`
				: `${product.name} ajouté aux favoris`,
		);
	};

	return (
		<div className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/60">
			{/* Image */}
			<Link
				href={`/products/${product.slug}`}
				className="relative block aspect-square overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100/70"
			>
				{/* Badges */}
				<div className="absolute left-4 top-4 z-10 flex flex-col gap-1.5">
					{discount > 0 && (
						<span className="inline-flex items-center rounded-md bg-[#E63946] px-2.5 py-1 text-[11px] font-bold tabular-nums text-white">
							−{discount}%
						</span>
					)}
					{isLowStock && (
						<span className="inline-flex items-center rounded-md bg-amber-500/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
							Stock limité
						</span>
					)}
				</div>

				{/* Favori */}
				<button
					type="button"
					onClick={handleToggleFavorite}
					aria-label={fav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
					className={`absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border transition-colors duration-200 ${
						fav
							? 'border-red-100 bg-red-50 text-red-500'
							: 'border-slate-200 bg-white text-slate-400 hover:border-slate-300 hover:text-red-500'
					}`}
				>
					<Heart
						size={16}
						className={fav ? 'fill-red-500' : ''}
						strokeWidth={fav ? 2 : 1.75}
					/>
				</button>

				{/* Rupture de stock */}
				{isOutOfStock && (
					<div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 backdrop-blur-[2px]">
						<span className="rounded bg-[#1B3A5F] px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white">
							Rupture de stock
						</span>
					</div>
				)}

				{/* Visuel produit */}
				<div className="absolute inset-0 flex items-center justify-center p-8 lg:p-10">
					{productImage ? (
						<div className="relative h-full w-full transition-transform duration-700 ease-out group-hover:scale-105">
							<Image
								src={productImage}
								alt={product.name}
								fill
								priority={priority}
								className="object-contain drop-shadow-md"
								sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 25vw"
							/>
						</div>
					) : (
						<Package size={56} className="text-slate-300" />
					)}
				</div>
			</Link>

			{/* Contenu */}
			<div className="flex flex-1 flex-col p-5 lg:p-6">
				{product.category && (
					<span className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
						{product.category.name}
					</span>
				)}

				<Link href={`/products/${product.slug}`} className="group/title">
					<h3 className="mb-2 line-clamp-2 text-[15px] font-semibold leading-snug text-[#1B3A5F] transition-colors group-hover/title:text-[#1D73B3] lg:text-base">
						{product.name}
					</h3>
				</Link>

				{product.shortDesc && (
					<p className="mb-5 line-clamp-2 text-[13px] leading-relaxed text-slate-500">
						{product.shortDesc}
					</p>
				)}

				<div className="flex-1" />

				{/* Prix */}
				<div className="mb-4 flex items-baseline gap-2">
					<span className="text-xl font-bold tabular-nums text-[#1B3A5F] lg:text-[22px]">
						{price.toLocaleString('fr-FR')}
						<span className="ml-1 text-sm font-semibold text-slate-500">F</span>
					</span>
					{originalPrice && (
						<span className="text-[13px] tabular-nums text-slate-400 line-through">
							{originalPrice.toLocaleString('fr-FR')} F
						</span>
					)}
				</div>

				{/* CTA */}
				<button
					type="button"
					onClick={handleAddToCart}
					disabled={isOutOfStock}
					className={`flex h-12 w-full items-center justify-center gap-2 rounded-xl text-[13px] font-semibold transition-all duration-300 ${
						isOutOfStock
							? 'cursor-not-allowed bg-slate-100 text-slate-400'
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
							<ShoppingCart size={16} />
							<span>Ajouter au panier</span>
						</>
					)}
				</button>
			</div>
		</div>
	);
};
