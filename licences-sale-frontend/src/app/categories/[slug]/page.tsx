'use client';

import {
	ArrowRight,
	Award,
	BadgeCheck,
	Check,
	ChevronDown,
	ChevronUp,
	Clock,
	FileText,
	Grid3X3,
	LayoutList,
	Loader2,
	Monitor,
	Package,
	Palette,
	PenTool,
	Server,
	Shield,
	ShoppingCart,
	SlidersHorizontal,
	Sparkles,
	TrendingUp,
	X,
	Zap,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useCart } from '~/components/cart-provider';
import { Footer } from '~/components/footer';
import { Header } from '~/components/header';
import { ProductCard } from '~/components/product-card';
import { getCategoryBySlug, getProducts } from '~/lib/products';
import type { Category } from '~/validators/categories';
import type { Product } from '~/validators/products';

// Configuration des styles par catégorie
const categoryStyles: Record<
	string,
	{
		icon: typeof Monitor;
		gradient: string;
		gradientDark: string;
		color: string;
		lightBg: string;
	}
> = {
	windows: {
		icon: Monitor,
		gradient: 'from-blue-400 via-blue-500 to-blue-600',
		gradientDark: 'from-blue-600 to-blue-800',
		color: '#0078D4',
		lightBg: 'bg-blue-50',
	},
	systemes: {
		icon: Monitor,
		gradient: 'from-blue-400 via-blue-500 to-blue-600',
		gradientDark: 'from-blue-600 to-blue-800',
		color: '#0078D4',
		lightBg: 'bg-blue-50',
	},
	"systèmes d'exploitation": {
		icon: Monitor,
		gradient: 'from-blue-400 via-blue-500 to-blue-600',
		gradientDark: 'from-blue-600 to-blue-800',
		color: '#0078D4',
		lightBg: 'bg-blue-50',
	},
	office: {
		icon: FileText,
		gradient: 'from-orange-400 via-orange-500 to-red-500',
		gradientDark: 'from-orange-600 to-red-700',
		color: '#D83B01',
		lightBg: 'bg-orange-50',
	},
	bureautique: {
		icon: FileText,
		gradient: 'from-orange-400 via-orange-500 to-red-500',
		gradientDark: 'from-orange-600 to-red-700',
		color: '#D83B01',
		lightBg: 'bg-orange-50',
	},
	antivirus: {
		icon: Shield,
		gradient: 'from-emerald-400 via-emerald-500 to-green-600',
		gradientDark: 'from-emerald-600 to-green-800',
		color: '#059669',
		lightBg: 'bg-emerald-50',
	},
	sécurité: {
		icon: Shield,
		gradient: 'from-emerald-400 via-emerald-500 to-green-600',
		gradientDark: 'from-emerald-600 to-green-800',
		color: '#059669',
		lightBg: 'bg-emerald-50',
	},
	'windows server': {
		icon: Server,
		gradient: 'from-violet-400 via-violet-500 to-purple-600',
		gradientDark: 'from-violet-600 to-purple-800',
		color: '#7C3AED',
		lightBg: 'bg-violet-50',
	},
	serveur: {
		icon: Server,
		gradient: 'from-violet-400 via-violet-500 to-purple-600',
		gradientDark: 'from-violet-600 to-purple-800',
		color: '#7C3AED',
		lightBg: 'bg-violet-50',
	},
	adobe: {
		icon: Palette,
		gradient: 'from-red-400 via-red-500 to-rose-600',
		gradientDark: 'from-red-600 to-rose-800',
		color: '#DC2626',
		lightBg: 'bg-red-50',
	},
	autodesk: {
		icon: PenTool,
		gradient: 'from-cyan-400 via-cyan-500 to-teal-600',
		gradientDark: 'from-cyan-600 to-teal-800',
		color: '#0891B2',
		lightBg: 'bg-cyan-50',
	},
};

const defaultStyle = {
	icon: Monitor,
	gradient: 'from-sky-400 via-sky-500 to-blue-600',
	gradientDark: 'from-sky-600 to-blue-800',
	color: '#1D73B3',
	lightBg: 'bg-sky-50',
};

const getStyleForCategory = (categoryName: string) => {
	const normalizedName = categoryName.toLowerCase();
	for (const [key, style] of Object.entries(categoryStyles)) {
		if (normalizedName.includes(key)) {
			return style;
		}
	}
	return defaultStyle;
};

export default function CategoryPage() {
	const params = useParams();
	const slug = (params?.slug as string) || '';

	const [category, setCategory] = useState<Category | null>(null);
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
	const [sortBy, setSortBy] = useState<'price' | 'name' | 'createdAt'>(
		'createdAt',
	);
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
	const [addedProductId, setAddedProductId] = useState<string | null>(null);
	const [showFilters, setShowFilters] = useState(false);
	const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000]);

	const { addItem } = useCart();

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				setError(null);

				const categoryData = await getCategoryBySlug(slug);
				setCategory(categoryData);

				const productsResponse = await getProducts({
					categoryId: categoryData.id,
					limit: 100,
					sort: sortBy,
					order: sortOrder,
				});
				setProducts(productsResponse.items);
			} catch (err) {
				setError('Catégorie introuvable');
			} finally {
				setLoading(false);
			}
		};

		if (slug) {
			fetchData();
		}
	}, [slug, sortBy, sortOrder]);

	// Filtrer les produits par prix
	const filteredProducts = useMemo(() => {
		return products.filter((product) => {
			const price =
				typeof product.price === 'string'
					? Number.parseFloat(product.price)
					: product.price;
			return price >= priceRange[0] && price <= priceRange[1];
		});
	}, [products, priceRange]);

	// Calculer les stats
	const stats = useMemo(() => {
		if (products.length === 0) return { minPrice: 0, maxPrice: 0, avgPrice: 0 };
		const prices = products.map((p) =>
			typeof p.price === 'string' ? Number.parseFloat(p.price) : p.price,
		);
		return {
			minPrice: Math.min(...prices),
			maxPrice: Math.max(...prices),
			avgPrice: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
		};
	}, [products]);

	const handleAddToCart = async (product: Product) => {
		try {
			await addItem(product.id, 1);
			setAddedProductId(product.id);
			setTimeout(() => setAddedProductId(null), 1500);
		} catch (err) {
			// Error handled silently
		}
	};

	const handleSortChange = (value: string) => {
		switch (value) {
			case 'price-asc':
				setSortBy('price');
				setSortOrder('asc');
				break;
			case 'price-desc':
				setSortBy('price');
				setSortOrder('desc');
				break;
			case 'name':
				setSortBy('name');
				setSortOrder('asc');
				break;
			case 'popular':
			default:
				setSortBy('createdAt');
				setSortOrder('desc');
				break;
		}
	};

	const getSortValue = () => {
		if (sortBy === 'price' && sortOrder === 'asc') return 'price-asc';
		if (sortBy === 'price' && sortOrder === 'desc') return 'price-desc';
		if (sortBy === 'name') return 'name';
		return 'popular';
	};

	const getOriginalPrice = (price: number | string, discount?: number) => {
		const priceNum =
			typeof price === 'string' ? Number.parseFloat(price) : price;
		if (!discount || discount <= 0) return null;
		return Math.round(priceNum / (1 - discount / 100));
	};

	if (loading) {
		return (
			<>
				<Header />
				<main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
					<div className="flex items-center justify-center min-h-[60vh]">
						<div className="text-center">
							<div className="relative">
								<div className="w-20 h-20 rounded-full border-4 border-gray-200 border-t-[#1D70B8] animate-spin mx-auto" />
								<Loader2
									size={32}
									className="text-[#1D70B8] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
								/>
							</div>
							<p className="text-gray-500 mt-6 font-medium">
								Chargement des produits...
							</p>
						</div>
					</div>
				</main>
				<Footer />
			</>
		);
	}

	if (error || !category) {
		return (
			<>
				<Header />
				<main className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-20">
					<div className="max-w-2xl mx-auto px-6 text-center">
						<div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
							<X size={40} className="text-red-500" />
						</div>
						<h1 className="text-3xl font-bold text-gray-900 mb-4">
							Catégorie introuvable
						</h1>
						<p className="text-gray-500 mb-8">
							La catégorie que vous recherchez n'existe pas ou a été supprimée.
						</p>
						<Link
							href="/categories"
							className="inline-flex items-center gap-2 px-6 py-3 bg-[#1D70B8] text-white font-semibold rounded-xl hover:bg-[#155a96] transition-colors"
						>
							Voir toutes les catégories
							<ArrowRight size={18} />
						</Link>
					</div>
				</main>
				<Footer />
			</>
		);
	}

	const style = getStyleForCategory(category.name);
	const Icon = style.icon;

	return (
		<>
			<Header />
			<main className="min-h-screen bg-gray-50">
				{/* Hero Section - Style moderne avec image */}
				<section className="relative overflow-hidden">
					{/* Background gradient */}
					<div
						className={`absolute inset-0 bg-gradient-to-br ${style.gradient}`}
					/>

					{/* Animated background shapes */}
					<div className="absolute inset-0 overflow-hidden">
						<div className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] rounded-full bg-white/10 blur-3xl" />
						<div className="absolute -bottom-1/2 -left-1/4 w-[600px] h-[600px] rounded-full bg-black/10 blur-3xl" />
						<div className="absolute top-1/4 left-1/3 w-[300px] h-[300px] rounded-full bg-white/5 blur-2xl" />
					</div>

					{/* Dot pattern overlay */}
					<div
						className="absolute inset-0 opacity-10"
						style={{
							backgroundImage:
								'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
							backgroundSize: '32px 32px',
						}}
					/>

					<div className="relative z-10 max-w-7xl mx-auto px-6 py-16 lg:py-24">
						{/* Breadcrumb */}
						<nav className="flex items-center gap-2 text-sm mb-8">
							<Link
								href="/"
								className="text-white/70 hover:text-white transition-colors"
							>
								Accueil
							</Link>
							<ChevronDown
								size={14}
								className="text-white/50 rotate-[-90deg]"
							/>
							<Link
								href="/categories"
								className="text-white/70 hover:text-white transition-colors"
							>
								Catégories
							</Link>
							<ChevronDown
								size={14}
								className="text-white/50 rotate-[-90deg]"
							/>
							<span className="text-white font-medium">{category.name}</span>
						</nav>

						<div className="grid lg:grid-cols-2 gap-12 items-center">
							{/* Left content */}
							<div>
								{/* Badge */}
								<div className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-sm rounded-full mb-6 border border-white/20">
									<Sparkles size={16} className="text-white" />
									<span className="text-sm font-semibold text-white">
										{products.length} PRODUITS DISPONIBLES
									</span>
								</div>

								{/* Title */}
								<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
									{category.name}
								</h1>

								<p className="text-lg text-white/80 mb-8 leading-relaxed max-w-lg">
									{category.description ||
										`Découvrez notre sélection complète de ${category.name}. Licences officielles avec livraison instantanée.`}
								</p>

								{/* Features pills */}
								<div className="flex flex-wrap gap-3">
									{[
										{ icon: Zap, text: 'Livraison instantanée' },
										{ icon: BadgeCheck, text: 'Licence officielle' },
										{ icon: Clock, text: 'Support 24/7' },
									].map((feature) => (
										<div
											key={feature.text}
											className="flex items-center gap-2 px-4 py-2.5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10"
										>
											<feature.icon size={16} className="text-white" />
											<span className="text-white text-sm font-medium">
												{feature.text}
											</span>
										</div>
									))}
								</div>

								{/* Stats row */}
								<div className="flex gap-8 mt-10 pt-8 border-t border-white/20">
									<div>
										<p className="text-3xl font-bold text-white">
											{stats.minPrice.toLocaleString()} F
										</p>
										<p className="text-white/60 text-sm">À partir de</p>
									</div>
									<div>
										<p className="text-3xl font-bold text-white">
											{products.length}
										</p>
										<p className="text-white/60 text-sm">Produits</p>
									</div>
									<div>
										<p className="text-3xl font-bold text-white">5 min</p>
										<p className="text-white/60 text-sm">Livraison</p>
									</div>
								</div>
							</div>

							{/* Right - Visual element */}
							<div className="hidden lg:flex justify-center items-center">
								<div className="relative">
									{/* Main circle with icon */}
									<div className="relative w-80 h-80">
										{/* Outer glow ring */}
										<div className="absolute inset-0 rounded-full bg-white/10 animate-pulse" />

										{/* Inner circle */}
										<div className="absolute inset-4 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center shadow-2xl">
											{category.image ? (
												<div className="relative w-48 h-48 rounded-2xl overflow-hidden">
													<Image
														src={category.image}
														alt={category.name}
														fill
														className="object-cover"
													/>
												</div>
											) : (
												<Icon
													size={120}
													className="text-white"
													strokeWidth={1.2}
												/>
											)}
										</div>

										{/* Decorative floating elements */}
										<div className="absolute -top-4 -right-4 w-20 h-20 bg-white/20 rounded-2xl backdrop-blur-sm flex items-center justify-center shadow-xl animate-bounce-slow">
											<Package size={32} className="text-white" />
										</div>

										<div className="absolute -bottom-2 -left-6 w-16 h-16 bg-white/20 rounded-xl backdrop-blur-sm flex items-center justify-center shadow-xl">
											<Award size={28} className="text-white" />
										</div>

										<div className="absolute top-1/2 -right-10 w-14 h-14 bg-white/20 rounded-lg backdrop-blur-sm flex items-center justify-center shadow-xl">
											<TrendingUp size={24} className="text-white" />
										</div>
									</div>

									{/* Orbit rings */}
									<div className="absolute inset-0 rounded-full border border-white/10 scale-125" />
									<div className="absolute inset-0 rounded-full border border-white/5 scale-150" />
								</div>
							</div>
						</div>
					</div>

					{/* Bottom wave */}
					<div className="absolute bottom-0 left-0 right-0">
						<svg
							viewBox="0 0 1440 120"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							className="w-full"
						>
							<path
								d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
								fill="#F9FAFB"
							/>
						</svg>
					</div>
				</section>

				{/* Products Section */}
				<section className="py-12 lg:py-16">
					<div className="max-w-7xl mx-auto px-6">
						{/* Toolbar */}
						<div className="bg-white rounded-2xl p-4 lg:p-5 shadow-sm border border-gray-100 mb-8">
							<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
								{/* Left */}
								<div className="flex items-center gap-4">
									<button
										type="button"
										onClick={() => setShowFilters(!showFilters)}
										className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
											showFilters
												? 'bg-[#1D70B8] text-white'
												: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
										}`}
									>
										<SlidersHorizontal size={18} />
										<span>Filtres</span>
										{showFilters && <ChevronUp size={16} className="ml-1" />}
									</button>

									<div className="hidden sm:block h-8 w-px bg-gray-200" />

									<p className="text-gray-500">
										<span className="font-bold text-gray-900">
											{filteredProducts.length}
										</span>{' '}
										produit{filteredProducts.length > 1 ? 's' : ''} trouvé
										{filteredProducts.length > 1 ? 's' : ''}
									</p>
								</div>

								{/* Right */}
								<div className="flex items-center gap-3">
									{/* Sort dropdown */}
									<div className="relative flex-1 sm:flex-none">
										<select
											value={getSortValue()}
											onChange={(e) => handleSortChange(e.target.value)}
											className="w-full sm:w-auto appearance-none px-4 py-2.5 pr-10 bg-gray-100 rounded-xl text-gray-700 font-medium outline-none focus:ring-2 focus:ring-[#1D70B8]/20 cursor-pointer"
										>
											<option value="popular">Plus récents</option>
											<option value="price-asc">Prix croissant</option>
											<option value="price-desc">Prix décroissant</option>
											<option value="name">Nom (A-Z)</option>
										</select>
										<ChevronDown
											size={16}
											className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
										/>
									</div>

									{/* View Mode Toggle */}
									<div className="flex items-center bg-gray-100 rounded-xl p-1">
										<button
											type="button"
											onClick={() => setViewMode('grid')}
											className={`p-2.5 rounded-lg transition-all ${
												viewMode === 'grid'
													? 'bg-white shadow-sm text-[#1D70B8]'
													: 'text-gray-400 hover:text-gray-600'
											}`}
										>
											<Grid3X3 size={18} />
										</button>
										<button
											type="button"
											onClick={() => setViewMode('list')}
											className={`p-2.5 rounded-lg transition-all ${
												viewMode === 'list'
													? 'bg-white shadow-sm text-[#1D70B8]'
													: 'text-gray-400 hover:text-gray-600'
											}`}
										>
											<LayoutList size={18} />
										</button>
									</div>
								</div>
							</div>

							{/* Expanded Filters */}
							{showFilters && (
								<div className="mt-5 pt-5 border-t border-gray-100">
									<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
										{/* Price Range */}
										<div>
											<label className="block text-sm font-semibold text-gray-700 mb-3">
												Fourchette de prix
											</label>
											<div className="flex items-center gap-3">
												<input
													type="number"
													value={priceRange[0]}
													onChange={(e) =>
														setPriceRange([
															Number(e.target.value),
															priceRange[1],
														])
													}
													placeholder="Min"
													className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1D70B8]/20 focus:border-[#1D70B8] outline-none"
												/>
												<span className="text-gray-400">-</span>
												<input
													type="number"
													value={priceRange[1]}
													onChange={(e) =>
														setPriceRange([
															priceRange[0],
															Number(e.target.value),
														])
													}
													placeholder="Max"
													className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#1D70B8]/20 focus:border-[#1D70B8] outline-none"
												/>
											</div>
										</div>

										{/* Quick price buttons */}
										<div>
											<label className="block text-sm font-semibold text-gray-700 mb-3">
												Prix rapide
											</label>
											<div className="flex flex-wrap gap-2">
												{[
													{ label: 'Tous', range: [0, 500000] },
													{ label: '< 50K', range: [0, 50000] },
													{ label: '50K - 100K', range: [50000, 100000] },
													{ label: '> 100K', range: [100000, 500000] },
												].map((option) => (
													<button
														key={option.label}
														type="button"
														onClick={() =>
															setPriceRange(option.range as [number, number])
														}
														className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
															priceRange[0] === option.range[0] &&
															priceRange[1] === option.range[1]
																? 'bg-[#1D70B8] text-white'
																: 'bg-gray-100 text-gray-600 hover:bg-gray-200'
														}`}
													>
														{option.label}
													</button>
												))}
											</div>
										</div>

										{/* Reset */}
										<div className="flex items-end">
											<button
												type="button"
												onClick={() => setPriceRange([0, 500000])}
												className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
											>
												Réinitialiser les filtres
											</button>
										</div>
									</div>
								</div>
							)}
						</div>

						{/* Products Grid/List */}
						{filteredProducts.length > 0 ? (
							<div
								className={`grid gap-6 ${
									viewMode === 'grid'
										? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
										: 'grid-cols-1'
								}`}
							>
								{filteredProducts.map((product) => {
									const price =
										typeof product.price === 'string'
											? Number.parseFloat(product.price)
											: product.price;
									const discount = product.discount || 0;
									const originalPrice = getOriginalPrice(
										product.price,
										product.discount,
									);
									return viewMode === 'grid' ? (
										<ProductCard key={product.id} product={product} />
									) : (
										/* List View */
										<div
											key={product.id}
											className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-transparent hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row"
										>
											{/* Image */}
											<div className="relative w-full sm:w-64 h-48 sm:h-auto flex-shrink-0 bg-gradient-to-br from-gray-50 to-gray-100">
												{discount > 0 && (
													<div className="absolute top-4 left-4 z-10">
														<span className="inline-flex items-center px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-lg">
															-{discount}%
														</span>
													</div>
												)}

												<Link
													href={`/products/${product.slug}`}
													className="flex items-center justify-center h-full p-6"
												>
													<div className="relative w-40 h-40">
														{product.image ? (
															<Image
																src={product.image}
																alt={product.name}
																fill
																className="object-contain group-hover:scale-105 transition-transform duration-300"
															/>
														) : (
															<Package
																size={64}
																className="text-gray-300 mx-auto"
															/>
														)}
													</div>
												</Link>
											</div>

											{/* Info */}
											<div className="flex-1 p-6 flex flex-col justify-center">
												<span
													className="text-xs font-semibold uppercase tracking-wider mb-2"
													style={{ color: style.color }}
												>
													{category.name}
												</span>

												<Link href={`/products/${product.slug}`}>
													<h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#1D70B8] transition-colors">
														{product.name}
													</h3>
												</Link>

												{product.shortDesc && (
													<p className="text-gray-500 mb-4 line-clamp-2">
														{product.shortDesc}
													</p>
												)}

												<div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100">
													<div>
														<div className="flex items-baseline gap-2">
															<span className="text-2xl font-bold text-gray-900">
																{price.toLocaleString()} F
															</span>
															{originalPrice && (
																<span className="text-sm text-gray-400 line-through">
																	{originalPrice.toLocaleString()} F
																</span>
															)}
														</div>
														{product.stockQuantity <= 0 && (
															<p className="text-xs text-red-500 font-medium mt-1">
																Rupture de stock
															</p>
														)}
													</div>

													<div className="flex items-center gap-3">
														<Link
															href={`/products/${product.slug}`}
															className="px-5 py-2.5 border border-gray-200 text-gray-700 font-medium rounded-xl hover:border-[#1D70B8] hover:text-[#1D70B8] transition-colors"
														>
															Voir détails
														</Link>
														<button
															type="button"
															onClick={() => handleAddToCart(product)}
															disabled={product.stockQuantity <= 0}
															className={`px-5 py-2.5 font-semibold rounded-xl transition-all flex items-center gap-2 ${
																product.stockQuantity <= 0
																	? 'bg-gray-200 text-gray-400 cursor-not-allowed'
																	: addedProductId === product.id
																		? 'bg-green-500 text-white'
																		: `bg-gradient-to-r ${style.gradient} text-white hover:shadow-lg`
															}`}
														>
															{addedProductId === product.id ? (
																<>
																	<Check size={18} />
																	Ajouté
																</>
															) : (
																<>
																	<ShoppingCart size={18} />
																	Ajouter
																</>
															)}
														</button>
													</div>
												</div>
											</div>
										</div>
									);
								})}
							</div>
						) : (
							/* Empty State */
							<div className="text-center py-20">
								<div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
									<Package size={40} className="text-gray-300" />
								</div>
								<h3 className="text-2xl font-bold text-gray-900 mb-3">
									Aucun produit trouvé
								</h3>
								<p className="text-gray-500 mb-8 max-w-md mx-auto">
									Aucun produit ne correspond à vos critères de recherche.
									Essayez de modifier les filtres.
								</p>
								<button
									type="button"
									onClick={() => setPriceRange([0, 500000])}
									className="inline-flex items-center gap-2 px-6 py-3 bg-[#1D70B8] text-white font-semibold rounded-xl hover:bg-[#155a96] transition-colors"
								>
									Réinitialiser les filtres
								</button>
							</div>
						)}
					</div>
				</section>

				{/* Related Categories */}
				<section className="py-16 bg-white">
					<div className="max-w-7xl mx-auto px-6">
						<div className="text-center mb-10">
							<h2 className="text-2xl font-bold text-gray-900 mb-2">
								Autres catégories
							</h2>
							<p className="text-gray-500">
								Découvrez nos autres catégories de logiciels
							</p>
						</div>

						<div className="flex justify-center">
							<Link
								href="/categories"
								className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
							>
								Voir toutes les catégories
								<ArrowRight size={18} />
							</Link>
						</div>
					</div>
				</section>
			</main>
			<Footer />

			{/* Add custom animation */}
			<style jsx global>{`
				@keyframes bounce-slow {
					0%, 100% {
						transform: translateY(0);
					}
					50% {
						transform: translateY(-10px);
					}
				}
				.animate-bounce-slow {
					animation: bounce-slow 3s ease-in-out infinite;
				}
			`}</style>
		</>
	);
}
