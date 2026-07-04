'use client';

import {
	ArrowRight,
	BadgeCheck,
	Check,
	ChevronRight,
	CircleAlert,
	Heart,
	Loader2,
	MessageCircle,
	Minus,
	Package,
	Plus,
	Share2,
	ShieldCheck,
	ShoppingCart,
	Sparkles,
	Tag,
	Truck,
	Zap,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { useCart } from '~/components/cart-provider';
import { useFavorites } from '~/components/favorites-provider';
import { getProductImage, ProductCard } from '~/components/product-card';
import type { Product } from '~/validators/products';

interface ProductDetailClientProps {
	product: Product;
	relatedProducts: Product[];
}

const formatPrice = (p: number | string) => {
	const numPrice = typeof p === 'string' ? Number.parseFloat(p) : p;
	return `${Math.round(numPrice * 655.957).toLocaleString('fr-FR')} FCFA`;
};

const TRUST_POINTS = [
	{
		icon: BadgeCheck,
		title: 'Licence officielle',
		desc: "Clé d'activation authentique",
	},
	{
		icon: Zap,
		title: 'Livraison instantanée',
		desc: 'Par email en quelques minutes',
	},
	{
		icon: ShieldCheck,
		title: 'Paiement sécurisé',
		desc: 'Cryptage SSL de bout en bout',
	},
];

type TabKey = 'description' | 'caracteristiques' | 'garanties';

const TABS: { key: TabKey; label: string }[] = [
	{ key: 'description', label: 'Description' },
	{ key: 'caracteristiques', label: 'Caractéristiques' },
	{ key: 'garanties', label: 'Garanties & Support' },
];

export default function ProductDetailClient({
	product,
	relatedProducts,
}: ProductDetailClientProps) {
	const { addItem } = useCart();
	const { isFavorite, toggleFavorite } = useFavorites();
	const [quantity, setQuantity] = useState(1);
	const [selectedImage, setSelectedImage] = useState(
		getProductImage(product) ?? product.image,
	);
	const [isAddingToCart, setIsAddingToCart] = useState(false);
	const [justAdded, setJustAdded] = useState(false);
	const [activeTab, setActiveTab] = useState<TabKey>('description');

	const price =
		typeof product.price === 'string'
			? Number.parseFloat(product.price)
			: product.price;
	const originalPrice =
		product.discount > 0 ? price / (1 - product.discount / 100) : null;
	const savings = originalPrice ? originalPrice - price : 0;
	const fav = isFavorite(product.id);
	const inStock = product.stockQuantity > 0;
	const lowStock = inStock && product.stockQuantity <= 5;

	const allImages = [
		...new Set(
			[
				getProductImage(product),
				product.image,
				...(product.images || []),
			].filter(Boolean),
		),
	];

	const handleAddToCart = async () => {
		setIsAddingToCart(true);
		const result = await addItem(product.id, quantity);
		setIsAddingToCart(false);

		if (result.success) {
			setJustAdded(true);
			setTimeout(() => setJustAdded(false), 1800);
			toast.success(`${product.name} ajouté au panier`);
		} else {
			toast.error(result.error || "Erreur lors de l'ajout au panier");
		}
	};

	const handleShare = async () => {
		if (typeof window === 'undefined') return;
		const url = window.location.href;
		if (navigator.share) {
			try {
				await navigator.share({ title: product.name, url });
			} catch {
				/* user cancelled */
			}
			return;
		}
		try {
			await navigator.clipboard.writeText(url);
			toast.success('Lien copié dans le presse-papiers');
		} catch {
			toast.error('Impossible de copier le lien');
		}
	};

	return (
		<div className="min-h-screen bg-[#FAFBFC]">
			{/* Breadcrumb */}
			<div className="border-b border-slate-200/70 bg-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
					<nav className="flex items-center gap-1.5 text-[13px]">
						<Link
							href="/"
							className="text-slate-500 hover:text-[#1D73B3] transition-colors"
						>
							Accueil
						</Link>
						<ChevronRight size={14} className="text-slate-300" />
						<Link
							href="/categories"
							className="text-slate-500 hover:text-[#1D73B3] transition-colors"
						>
							Produits
						</Link>
						{product.category && (
							<>
								<ChevronRight size={14} className="text-slate-300" />
								<Link
									href={`/products?category=${product.categoryId}`}
									className="text-slate-500 hover:text-[#1D73B3] transition-colors"
								>
									{product.category.name}
								</Link>
							</>
						)}
						<ChevronRight size={14} className="text-slate-300" />
						<span className="text-[#1B3A5F] font-medium truncate max-w-[40ch]">
							{product.name}
						</span>
					</nav>
				</div>
			</div>

			{/* Main */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
				<div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
					{/* Gallery — left */}
					<div className="lg:col-span-7">
						{/* Showcase card */}
						<div className="relative">
							{/* Ambient halos */}
							<div aria-hidden className="absolute -inset-6 -z-10 opacity-60">
								<div className="absolute top-10 left-10 w-72 h-72 bg-[#1D73B3] rounded-full blur-[120px] opacity-[0.18]" />
								<div className="absolute bottom-10 right-10 w-72 h-72 bg-[#1B3A5F] rounded-full blur-[120px] opacity-[0.12]" />
							</div>

							<div className="relative aspect-[5/4] rounded-3xl overflow-hidden bg-gradient-to-br from-white via-slate-50 to-slate-100 shadow-[0_20px_60px_-25px_rgba(15,42,71,0.25)] ring-1 ring-slate-200/70">
								{/* Subtle grid pattern */}
								<div
									aria-hidden
									className="absolute inset-0 opacity-[0.035]"
									style={{
										backgroundImage:
											'linear-gradient(#1B3A5F 1px, transparent 1px), linear-gradient(90deg, #1B3A5F 1px, transparent 1px)',
										backgroundSize: '40px 40px',
									}}
								/>

								{/* Discount + status floating top-left */}
								<div className="absolute top-5 left-5 z-20 flex flex-col items-start gap-2">
									{product.discount > 0 && (
										<span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#E63946] text-white text-[12px] font-bold rounded-full shadow-[0_8px_20px_-8px_rgba(230,57,70,0.6)] tabular-nums">
											<Tag size={12} />−{product.discount}%
										</span>
									)}
									{product.isFeatured && (
										<span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1B3A5F] text-white text-[11px] font-semibold rounded-full uppercase tracking-wider">
											<Sparkles size={12} />
											Coup de cœur
										</span>
									)}
								</div>

								{/* Action icons top-right */}
								<div className="absolute top-5 right-5 z-20 flex items-center gap-2">
									<button
										type="button"
										onClick={() => toggleFavorite(product.id)}
										aria-label={
											fav ? 'Retirer des favoris' : 'Ajouter aux favoris'
										}
										className={`w-10 h-10 rounded-full border flex items-center justify-center backdrop-blur-sm transition-all duration-200 ${
											fav
												? 'bg-red-50 border-red-100 text-red-500'
												: 'bg-white/90 border-slate-200 text-slate-400 hover:text-red-500 hover:border-slate-300'
										}`}
									>
										<Heart
											size={17}
											className={fav ? 'fill-red-500' : ''}
											strokeWidth={fav ? 2 : 1.75}
										/>
									</button>
									<button
										type="button"
										onClick={handleShare}
										aria-label="Partager"
										className="w-10 h-10 rounded-full bg-white/90 border border-slate-200 backdrop-blur-sm flex items-center justify-center text-slate-400 hover:text-[#1D73B3] hover:border-slate-300 transition-all"
									>
										<Share2 size={16} strokeWidth={1.75} />
									</button>
								</div>

								{/* Out of stock veil */}
								{!inStock && (
									<div className="absolute inset-0 z-10 bg-white/70 backdrop-blur-[3px] flex items-center justify-center">
										<span className="px-5 py-2 bg-[#1B3A5F] text-white text-xs font-semibold tracking-[0.18em] uppercase rounded-full">
											Rupture de stock
										</span>
									</div>
								)}

								{/* Image */}
								<div className="absolute inset-0 flex items-center justify-center p-10 lg:p-16">
									{selectedImage ? (
										<div className="relative w-full h-full">
											<Image
												src={selectedImage}
												alt={product.name}
												fill
												priority
												className="object-contain drop-shadow-[0_25px_30px_rgba(15,42,71,0.18)]"
												sizes="(max-width: 1024px) 100vw, 60vw"
											/>
										</div>
									) : (
										<Package size={96} className="text-slate-300" />
									)}
								</div>
							</div>
						</div>

						{/* Thumbnails */}
						{allImages.length > 1 && (
							<div className="mt-5 flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
								{allImages.map((img) => {
									const active = selectedImage === img;
									return (
										<button
											key={img}
											type="button"
											onClick={() => setSelectedImage(img)}
											className={`relative shrink-0 w-20 h-20 lg:w-24 lg:h-24 rounded-2xl overflow-hidden transition-all duration-200 ${
												active
													? 'ring-2 ring-[#1D73B3] ring-offset-2 ring-offset-[#FAFBFC]'
													: 'ring-1 ring-slate-200 hover:ring-slate-300'
											}`}
										>
											<div className="absolute inset-0 bg-white" />
											<Image
												src={img}
												alt=""
												fill
												className="object-contain p-2"
												sizes="96px"
											/>
										</button>
									);
								})}
							</div>
						)}

						{/* Tabs — desktop only inside left column for editorial feel */}
						<div className="hidden lg:block mt-14">
							<DetailTabs
								product={product}
								activeTab={activeTab}
								onChange={setActiveTab}
							/>
						</div>
					</div>

					{/* Order rail — right */}
					<div className="lg:col-span-5">
						<div className="lg:sticky lg:top-24 space-y-6">
							{/* Category pill */}
							{product.category && (
								<Link
									href={`/products?category=${product.categoryId}`}
									className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#1D73B3]/10 rounded-full hover:bg-[#1D73B3]/15 transition-colors"
								>
									<Tag size={13} className="text-[#1D73B3]" />
									<span className="text-[12px] font-semibold text-[#1D73B3] tracking-wider uppercase">
										{product.category.name}
									</span>
								</Link>
							)}

							{/* Title */}
							<div className="space-y-3">
								<h1 className="text-3xl md:text-4xl lg:text-[44px] font-bold text-[#1B3A5F] leading-[1.1] tracking-tight">
									{product.name}
								</h1>
								{product.shortDesc && (
									<p className="text-[15px] lg:text-base text-slate-500 leading-relaxed">
										{product.shortDesc}
									</p>
								)}
							</div>

							{/* Order ticket card */}
							<div className="relative rounded-2xl bg-white shadow-[0_10px_40px_-15px_rgba(15,42,71,0.18)] ring-1 ring-slate-100 overflow-hidden">
								{/* Decorative accent strip */}
								<div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-[#1D73B3] via-[#1B3A5F] to-[#1D73B3]" />

								<div className="p-6 lg:p-7 space-y-6">
									{/* Price block */}
									<div>
										<div className="flex items-baseline gap-3 flex-wrap">
											<span className="text-4xl lg:text-5xl font-bold text-[#1B3A5F] tracking-tight tabular-nums">
												{formatPrice(price)}
											</span>
											{originalPrice && (
												<span className="text-lg text-slate-400 line-through tabular-nums">
													{formatPrice(originalPrice)}
												</span>
											)}
										</div>
										<div className="mt-2 flex items-center gap-2 text-[13px]">
											<span className="text-slate-500">HT / an</span>
											{savings > 0 && (
												<>
													<span className="text-slate-300">·</span>
													<span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
														Économisez {formatPrice(savings)}
													</span>
												</>
											)}
										</div>
									</div>

									{/* Stock indicator */}
									<div className="flex items-center gap-2.5">
										{inStock ? (
											<>
												<BadgeCheck
													size={18}
													className={
														lowStock ? 'text-amber-500' : 'text-emerald-500'
													}
												/>
												<span
													className={`text-[13.5px] font-medium ${
														lowStock ? 'text-amber-700' : 'text-emerald-700'
													}`}
												>
													{lowStock
														? `Plus que ${product.stockQuantity} en stock`
														: `En stock · ${product.stockQuantity} disponible${product.stockQuantity > 1 ? 's' : ''}`}
												</span>
											</>
										) : (
											<>
												<CircleAlert size={18} className="text-red-500" />
												<span className="text-[13.5px] font-medium text-red-700">
													Indisponible pour le moment
												</span>
											</>
										)}
									</div>

									<div className="h-px bg-slate-100" />

									{/* Quantity + CTA */}
									<div className="space-y-4">
										<div className="flex items-center justify-between gap-4">
											<span className="text-[13px] font-semibold text-[#1B3A5F] tracking-wide uppercase">
												Quantité
											</span>
											<div className="inline-flex items-center rounded-xl bg-slate-50 ring-1 ring-slate-200 p-1">
												<button
													type="button"
													onClick={() => setQuantity((q) => Math.max(1, q - 1))}
													disabled={!inStock || quantity <= 1}
													aria-label="Diminuer"
													className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-600 hover:bg-white hover:text-[#1B3A5F] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
												>
													<Minus size={15} />
												</button>
												<span className="px-4 text-[15px] font-semibold text-[#1B3A5F] tabular-nums min-w-[2.5ch] text-center">
													{quantity}
												</span>
												<button
													type="button"
													onClick={() =>
														setQuantity((q) =>
															Math.min(product.stockQuantity, q + 1),
														)
													}
													disabled={
														!inStock || quantity >= product.stockQuantity
													}
													aria-label="Augmenter"
													className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-600 hover:bg-white hover:text-[#1B3A5F] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
												>
													<Plus size={15} />
												</button>
											</div>
										</div>

										{/* Primary CTA */}
										<button
											type="button"
											onClick={handleAddToCart}
											disabled={!inStock || isAddingToCart}
											className={`group relative w-full h-14 rounded-xl text-[14.5px] font-semibold flex items-center justify-center gap-2 overflow-hidden transition-all duration-300 ${
												!inStock
													? 'bg-slate-100 text-slate-400 cursor-not-allowed'
													: justAdded
														? 'bg-emerald-500 text-white shadow-[0_10px_30px_-10px_rgba(16,185,129,0.5)]'
														: 'bg-[#1D73B3] text-white hover:bg-[#1B3A5F] shadow-[0_10px_30px_-10px_rgba(29,115,179,0.55)]'
											}`}
										>
											{isAddingToCart ? (
												<>
													<Loader2 size={17} className="animate-spin" />
													<span>Ajout en cours…</span>
												</>
											) : justAdded ? (
												<>
													<Check size={17} />
													<span>Ajouté au panier</span>
												</>
											) : !inStock ? (
												<span>Produit indisponible</span>
											) : (
												<>
													<ShoppingCart
														size={17}
														className="transition-transform duration-300 group-hover:-translate-x-0.5"
													/>
													<span>Ajouter au panier</span>
													<ArrowRight
														size={16}
														className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
													/>
												</>
											)}
										</button>

										{/* Secondary CTA — WhatsApp (matches project checkout flow) */}
										<button
											type="button"
											disabled={!inStock}
											className="w-full h-12 rounded-xl text-[14px] font-semibold flex items-center justify-center gap-2 bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/80 hover:bg-emerald-100 hover:ring-emerald-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
										>
											<MessageCircle size={16} />
											Commander sur WhatsApp
										</button>
									</div>

									{/* Trust grid */}
									<div className="grid grid-cols-3 gap-2 pt-2">
										{TRUST_POINTS.map(({ icon: Icon, title, desc }) => (
											<div
												key={title}
												className="rounded-xl bg-slate-50 px-3 py-3 text-center"
											>
												<Icon
													size={18}
													className="mx-auto text-[#1D73B3]"
													strokeWidth={1.75}
												/>
												<p className="mt-1.5 text-[11.5px] font-semibold text-[#1B3A5F] leading-tight">
													{title}
												</p>
												<p className="mt-0.5 text-[10.5px] text-slate-500 leading-snug">
													{desc}
												</p>
											</div>
										))}
									</div>
								</div>

								{/* Footer note */}
								<div className="border-t border-slate-100 px-6 py-4 bg-slate-50/60 flex items-center gap-2 text-[12.5px] text-slate-600">
									<Truck size={14} className="text-[#1D73B3]" />
									<span>
										Activation envoyée par email immédiatement après paiement.
									</span>
								</div>
							</div>

							{/* Tags */}
							{product.tags && product.tags.length > 0 && (
								<div className="space-y-2.5">
									<p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
										Mots-clés
									</p>
									<div className="flex flex-wrap gap-1.5">
										{product.tags.map((tag) => (
											<span
												key={tag}
												className="px-2.5 py-1 rounded-full bg-white ring-1 ring-slate-200 text-[12px] text-slate-600"
											>
												{tag}
											</span>
										))}
									</div>
								</div>
							)}
						</div>
					</div>

					{/* Tabs — mobile only */}
					<div className="lg:hidden lg:col-span-12">
						<DetailTabs
							product={product}
							activeTab={activeTab}
							onChange={setActiveTab}
						/>
					</div>
				</div>
			</div>

			{/* Related products */}
			{relatedProducts.length > 0 && (
				<section className="py-16 lg:py-20 bg-white border-t border-slate-200/70">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="flex items-end justify-between flex-wrap gap-6 mb-10 lg:mb-12">
							<div>
								<div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#1D73B3]/10 rounded-full mb-5">
									<Sparkles size={14} className="text-[#1D73B3]" />
									<span className="text-[12px] font-semibold text-[#1D73B3] tracking-wider uppercase">
										Vous pourriez aimer
									</span>
								</div>
								<h2 className="text-3xl md:text-4xl lg:text-[44px] font-bold text-[#1B3A5F] leading-[1.1] tracking-tight">
									Produits similaires
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

						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
							{relatedProducts.map((rp) => (
								<ProductCard key={rp.id} product={rp} />
							))}
						</div>
					</div>
				</section>
			)}
		</div>
	);
}

interface DetailTabsProps {
	product: Product;
	activeTab: TabKey;
	onChange: (tab: TabKey) => void;
}

const DetailTabs = ({ product, activeTab, onChange }: DetailTabsProps) => {
	return (
		<div>
			{/* Tab bar */}
			<div className="border-b border-slate-200">
				<div className="flex gap-1 -mb-px overflow-x-auto">
					{TABS.map((t) => {
						const active = activeTab === t.key;
						return (
							<button
								key={t.key}
								type="button"
								onClick={() => onChange(t.key)}
								className={`relative px-4 lg:px-5 py-3.5 text-[14px] font-semibold tracking-wide transition-colors whitespace-nowrap ${
									active
										? 'text-[#1B3A5F]'
										: 'text-slate-500 hover:text-[#1B3A5F]'
								}`}
							>
								{t.label}
								<span
									className={`absolute left-3 right-3 -bottom-px h-[2px] rounded-full transition-all duration-300 ${
										active ? 'bg-[#1D73B3] opacity-100' : 'opacity-0'
									}`}
								/>
							</button>
						);
					})}
				</div>
			</div>

			{/* Tab content */}
			<div className="pt-7 lg:pt-8">
				{activeTab === 'description' && (
					<div className="prose-custom max-w-3xl">
						<p className="text-[15.5px] leading-[1.75] text-slate-600 whitespace-pre-line">
							{product.description}
						</p>
					</div>
				)}

				{activeTab === 'caracteristiques' && (
					<dl className="max-w-3xl grid sm:grid-cols-2 gap-x-10 gap-y-4">
						<SpecRow label="Référence" value={product.slug} />
						{product.category && (
							<SpecRow label="Catégorie" value={product.category.name} />
						)}
						<SpecRow
							label="Disponibilité"
							value={
								product.stockQuantity > 0
									? `${product.stockQuantity} en stock`
									: 'Rupture'
							}
						/>
						{product.tags && product.tags.length > 0 && (
							<SpecRow label="Tags" value={product.tags.join(', ')} />
						)}
						<SpecRow label="Format" value="Clé d'activation numérique" />
						<SpecRow label="Livraison" value="Email — instantanée" />
					</dl>
				)}

				{activeTab === 'garanties' && (
					<div className="max-w-3xl grid sm:grid-cols-2 gap-4">
						{[
							{
								icon: BadgeCheck,
								title: 'Authenticité garantie',
								desc: "Toutes nos licences sont officielles et activables auprès de l'éditeur.",
							},
							{
								icon: Zap,
								title: 'Livraison instantanée',
								desc: "Votre clé d'activation arrive par email en quelques minutes.",
							},
							{
								icon: ShieldCheck,
								title: 'Garantie 30 jours',
								desc: 'Remboursement intégral en cas de problème non résolu.',
							},
							{
								icon: MessageCircle,
								title: 'Support WhatsApp 24/7',
								desc: "Notre équipe vous accompagne pour l'installation et l'activation.",
							},
						].map(({ icon: Icon, title, desc }) => (
							<div
								key={title}
								className="rounded-2xl bg-white ring-1 ring-slate-200/80 p-5"
							>
								<div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#1D73B3]/10 text-[#1D73B3]">
									<Icon size={18} strokeWidth={2} />
								</div>
								<h3 className="mt-3 text-[15px] font-semibold text-[#1B3A5F]">
									{title}
								</h3>
								<p className="mt-1 text-[13.5px] text-slate-500 leading-relaxed">
									{desc}
								</p>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

const SpecRow = ({ label, value }: { label: string; value: string }) => (
	<div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
		<dt className="text-[13px] font-semibold uppercase tracking-[0.12em] text-slate-500">
			{label}
		</dt>
		<dd className="text-[14px] text-[#1B3A5F] font-medium text-right">
			{value}
		</dd>
	</div>
);
