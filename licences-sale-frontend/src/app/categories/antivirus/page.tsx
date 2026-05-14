'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
	Shield,
	Grid3X3,
	LayoutList,
	ChevronDown,
	ShoppingCart,
	Check,
	Zap,
	Loader2,
	Package,
	SlidersHorizontal,
	Eye,
	Heart,
	Sparkles,
} from 'lucide-react';
import { Header } from '~/components/header';
import { Footer } from '~/components/footer';
import { useCart } from '~/components/cart-provider';
import { getProducts } from '~/lib/products';
import type { Product } from '~/validators/products';

const CATEGORY_INFO = {
	name: 'Antivirus & Sécurité',
	slug: 'antivirus',
	description: 'Protégez vos appareils avec les meilleurs antivirus du marché. Kaspersky, Norton, Bitdefender et plus encore.',
	gradient: 'from-emerald-500 via-emerald-600 to-green-700',
	color: '#059669',
	icon: Shield,
	features: [
		'Protection en temps réel',
		'Multi-appareils',
		'Mises à jour automatiques',
	],
	subcategories: [
		{ name: 'Kaspersky', query: 'Kaspersky' },
		{ name: 'Norton', query: 'Norton' },
		{ name: 'Bitdefender', query: 'Bitdefender' },
		{ name: 'ESET NOD32', query: 'ESET' },
		{ name: 'Avast', query: 'Avast' },
	],
};

export default function AntivirusPage() {
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
	const [sortBy, setSortBy] = useState<'price' | 'name' | 'createdAt'>('createdAt');
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
	const [addedProductId, setAddedProductId] = useState<string | null>(null);
	const [showFilters, setShowFilters] = useState(false);
	const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000]);
	const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
	const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

	const { addItem } = useCart();

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				const query = selectedSubcategory || 'antivirus';
				const productsResponse = await getProducts({
					q: query,
					limit: 100,
					sort: sortBy,
					order: sortOrder,
				});
				setProducts(productsResponse.items || []);
			} catch (err) {
				console.error('Error fetching products:', err);
				setProducts([]);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [sortBy, sortOrder, selectedSubcategory]);

	const filteredProducts = useMemo(() => {
		return products.filter((product) => {
			const price = typeof product.price === 'string' ? Number.parseFloat(product.price) : product.price;
			return price >= priceRange[0] && price <= priceRange[1];
		});
	}, [products, priceRange]);

	const stats = useMemo(() => {
		if (products.length === 0) return { minPrice: 0, maxPrice: 0 };
		const prices = products.map((p) => (typeof p.price === 'string' ? Number.parseFloat(p.price) : p.price));
		return { minPrice: Math.min(...prices), maxPrice: Math.max(...prices) };
	}, [products]);

	const handleAddToCart = async (product: Product) => {
		try {
			await addItem(product.id, 1);
			setAddedProductId(product.id);
			setTimeout(() => setAddedProductId(null), 1500);
		} catch (err) {
			console.error('Error adding to cart:', err);
		}
	};

	const handleSortChange = (value: string) => {
		switch (value) {
			case 'price-asc': setSortBy('price'); setSortOrder('asc'); break;
			case 'price-desc': setSortBy('price'); setSortOrder('desc'); break;
			case 'name': setSortBy('name'); setSortOrder('asc'); break;
			default: setSortBy('createdAt'); setSortOrder('desc'); break;
		}
	};

	const getSortValue = () => {
		if (sortBy === 'price' && sortOrder === 'asc') return 'price-asc';
		if (sortBy === 'price' && sortOrder === 'desc') return 'price-desc';
		if (sortBy === 'name') return 'name';
		return 'popular';
	};

	const getOriginalPrice = (price: number | string, discount?: number) => {
		const priceNum = typeof price === 'string' ? Number.parseFloat(price) : price;
		if (!discount || discount <= 0) return null;
		return Math.round(priceNum / (1 - discount / 100));
	};

	const Icon = CATEGORY_INFO.icon;

	if (loading) {
		return (
			<>
				<Header />
				<main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
					<div className="flex items-center justify-center min-h-[60vh]">
						<div className="text-center">
							<div className="relative">
								<div className="w-20 h-20 rounded-full border-4 border-gray-200 border-t-emerald-600 animate-spin mx-auto" />
								<Loader2 size={32} className="text-emerald-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
							</div>
							<p className="text-gray-500 mt-6 font-medium">Chargement des produits...</p>
						</div>
					</div>
				</main>
				<Footer />
			</>
		);
	}

	return (
		<>
			<Header />
			<main className="min-h-screen bg-gray-50">
				{/* Hero Section */}
				<section className="relative overflow-hidden">
					<div className={`absolute inset-0 bg-gradient-to-br ${CATEGORY_INFO.gradient}`} />
					<div className="absolute inset-0 overflow-hidden">
						<div className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] rounded-full bg-white/10 blur-3xl" />
						<div className="absolute -bottom-1/2 -left-1/4 w-[600px] h-[600px] rounded-full bg-black/10 blur-3xl" />
					</div>
					<div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />

					<div className="relative z-10 max-w-7xl mx-auto px-6 py-16 lg:py-24">
						<nav className="flex items-center gap-2 text-sm mb-8">
							<Link href="/" className="text-white/70 hover:text-white transition-colors">Accueil</Link>
							<ChevronDown size={14} className="text-white/50 rotate-[-90deg]" />
							<Link href="/categories" className="text-white/70 hover:text-white transition-colors">Catégories</Link>
							<ChevronDown size={14} className="text-white/50 rotate-[-90deg]" />
							<span className="text-white font-medium">{CATEGORY_INFO.name}</span>
						</nav>

						<div className="grid lg:grid-cols-2 gap-12 items-center">
							<div>
								<div className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-sm rounded-full mb-6 border border-white/20">
									<Sparkles size={16} className="text-white" />
									<span className="text-sm font-semibold text-white">{products.length} PRODUITS DISPONIBLES</span>
								</div>

								<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">{CATEGORY_INFO.name}</h1>
								<p className="text-lg text-white/80 mb-8 leading-relaxed max-w-lg">{CATEGORY_INFO.description}</p>

								<div className="flex flex-wrap gap-3">
									{CATEGORY_INFO.features.map((feature) => (
										<div key={feature} className="flex items-center gap-2 px-4 py-2.5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10">
											<Zap size={16} className="text-white" />
											<span className="text-white text-sm font-medium">{feature}</span>
										</div>
									))}
								</div>

								<div className="flex gap-8 mt-10 pt-8 border-t border-white/20">
									<div>
										<p className="text-3xl font-bold text-white">{stats.minPrice.toLocaleString()} F</p>
										<p className="text-white/60 text-sm">À partir de</p>
									</div>
									<div>
										<p className="text-3xl font-bold text-white">{products.length}</p>
										<p className="text-white/60 text-sm">Produits</p>
									</div>
									<div>
										<p className="text-3xl font-bold text-white">5 min</p>
										<p className="text-white/60 text-sm">Livraison</p>
									</div>
								</div>
							</div>

							<div className="hidden lg:flex justify-center items-center">
								<div className="relative w-80 h-80">
									<div className="absolute inset-0 rounded-full bg-white/10 animate-pulse" />
									<div className="absolute inset-4 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center shadow-2xl">
										<Icon size={120} className="text-white" strokeWidth={1.2} />
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="absolute bottom-0 left-0 right-0">
						<svg viewBox="0 0 1440 120" fill="none" className="w-full">
							<path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#F9FAFB" />
						</svg>
					</div>
				</section>

				{/* Subcategories */}
				<section className="py-8 bg-white border-b border-gray-100">
					<div className="max-w-7xl mx-auto px-6">
						<div className="flex flex-wrap items-center gap-3">
							<span className="text-sm font-medium text-gray-500 mr-2">Filtrer par :</span>
							<button type="button" onClick={() => setSelectedSubcategory(null)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${!selectedSubcategory ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
								Tous
							</button>
							{CATEGORY_INFO.subcategories.map((sub) => (
								<button key={sub.name} type="button" onClick={() => setSelectedSubcategory(sub.query)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedSubcategory === sub.query ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
									{sub.name}
								</button>
							))}
						</div>
					</div>
				</section>

				{/* Products Section */}
				<section className="py-12 lg:py-16">
					<div className="max-w-7xl mx-auto px-6">
						<div className="bg-white rounded-2xl p-4 lg:p-5 shadow-sm border border-gray-100 mb-8">
							<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
								<div className="flex items-center gap-4">
									<button type="button" onClick={() => setShowFilters(!showFilters)} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${showFilters ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
										<SlidersHorizontal size={18} />
										<span>Filtres</span>
									</button>
									<div className="hidden sm:block h-8 w-px bg-gray-200" />
									<p className="text-gray-500"><span className="font-bold text-gray-900">{filteredProducts.length}</span> produit{filteredProducts.length > 1 ? 's' : ''}</p>
								</div>
								<div className="flex items-center gap-3">
									<div className="relative flex-1 sm:flex-none">
										<select value={getSortValue()} onChange={(e) => handleSortChange(e.target.value)} className="w-full sm:w-auto appearance-none px-4 py-2.5 pr-10 bg-gray-100 rounded-xl text-gray-700 font-medium outline-none cursor-pointer">
											<option value="popular">Plus récents</option>
											<option value="price-asc">Prix croissant</option>
											<option value="price-desc">Prix décroissant</option>
											<option value="name">Nom (A-Z)</option>
										</select>
										<ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
									</div>
									<div className="flex items-center bg-gray-100 rounded-xl p-1">
										<button type="button" onClick={() => setViewMode('grid')} className={`p-2.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-400'}`}><Grid3X3 size={18} /></button>
										<button type="button" onClick={() => setViewMode('list')} className={`p-2.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-400'}`}><LayoutList size={18} /></button>
									</div>
								</div>
							</div>

							{showFilters && (
								<div className="mt-5 pt-5 border-t border-gray-100">
									<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
										<div>
											<label className="block text-sm font-semibold text-gray-700 mb-3">Fourchette de prix</label>
											<div className="flex items-center gap-3">
												<input type="number" value={priceRange[0]} onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none" />
												<span className="text-gray-400">-</span>
												<input type="number" value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none" />
											</div>
										</div>
										<div>
											<label className="block text-sm font-semibold text-gray-700 mb-3">Prix rapide</label>
											<div className="flex flex-wrap gap-2">
												{[{ label: 'Tous', range: [0, 500000] }, { label: '< 50K', range: [0, 50000] }, { label: '50K - 100K', range: [50000, 100000] }, { label: '> 100K', range: [100000, 500000] }].map((option) => (
													<button key={option.label} type="button" onClick={() => setPriceRange(option.range as [number, number])} className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${priceRange[0] === option.range[0] && priceRange[1] === option.range[1] ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{option.label}</button>
												))}
											</div>
										</div>
										<div className="flex items-end">
											<button type="button" onClick={() => setPriceRange([0, 500000])} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700">Réinitialiser</button>
										</div>
									</div>
								</div>
							)}
						</div>

						{filteredProducts.length > 0 ? (
							<div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
								{filteredProducts.map((product) => {
									const price = typeof product.price === 'string' ? Number.parseFloat(product.price) : product.price;
									const originalPrice = getOriginalPrice(product.price, product.discount);
									const isHovered = hoveredProduct === product.id;

									return viewMode === 'grid' ? (
										<div key={product.id} className="group relative" onMouseEnter={() => setHoveredProduct(product.id)} onMouseLeave={() => setHoveredProduct(null)}>
											<div className={`absolute -inset-1 bg-gradient-to-r ${CATEGORY_INFO.gradient} rounded-3xl blur-lg opacity-0 group-hover:opacity-20 transition-all duration-500`} />
											<div className={`relative bg-white rounded-2xl overflow-hidden border transition-all duration-300 ${isHovered ? 'border-transparent shadow-2xl -translate-y-2' : 'border-gray-100 shadow-sm'}`}>
												<div className="relative h-56 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
													{product.discount && product.discount > 0 && <span className="absolute top-3 left-3 z-10 px-2.5 py-1 bg-red-500 text-white text-xs font-bold rounded-lg">-{product.discount}%</span>}
													<div className={`absolute top-3 right-3 z-10 flex flex-col gap-2 transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
														<button type="button" className="w-9 h-9 bg-white rounded-lg shadow-md flex items-center justify-center text-gray-400 hover:text-red-500"><Heart size={18} /></button>
														<Link href={`/products/${product.slug}`} className="w-9 h-9 bg-white rounded-lg shadow-md flex items-center justify-center text-gray-400 hover:text-emerald-600"><Eye size={18} /></Link>
													</div>
													<Link href={`/products/${product.slug}`} className="block h-full p-6">
														<div className={`relative w-full h-full transition-transform duration-500 ${isHovered ? 'scale-110' : ''}`}>
															{product.image ? <Image src={product.image} alt={product.name} fill className="object-contain" /> : <Package size={64} className="text-gray-300 mx-auto mt-12" />}
														</div>
													</Link>
												</div>
												<div className="p-5">
													<span className="inline-block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: CATEGORY_INFO.color }}>{CATEGORY_INFO.name}</span>
													<Link href={`/products/${product.slug}`}><h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">{product.name}</h3></Link>
													<div className="flex items-center justify-between pt-3 border-t border-gray-100">
														<div className="flex items-baseline gap-2">
															<span className="text-xl font-bold text-gray-900">{price.toLocaleString()} F</span>
															{originalPrice && <span className="text-sm text-gray-400 line-through">{originalPrice.toLocaleString()} F</span>}
														</div>
														<button type="button" onClick={() => handleAddToCart(product)} className={`w-11 h-11 flex items-center justify-center rounded-xl transition-all ${addedProductId === product.id ? 'bg-green-500 text-white scale-110' : `bg-gradient-to-r ${CATEGORY_INFO.gradient} text-white hover:shadow-lg hover:scale-105`}`}>
															{addedProductId === product.id ? <Check size={20} /> : <ShoppingCart size={20} />}
														</button>
													</div>
												</div>
											</div>
										</div>
									) : (
										<div key={product.id} className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all flex flex-col sm:flex-row">
											<div className="relative w-full sm:w-64 h-48 sm:h-auto flex-shrink-0 bg-gradient-to-br from-gray-50 to-gray-100">
												<Link href={`/products/${product.slug}`} className="flex items-center justify-center h-full p-6">
													{product.image ? <Image src={product.image} alt={product.name} width={160} height={160} className="object-contain" /> : <Package size={64} className="text-gray-300" />}
												</Link>
											</div>
											<div className="flex-1 p-6 flex flex-col justify-center">
												<span className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: CATEGORY_INFO.color }}>{CATEGORY_INFO.name}</span>
												<Link href={`/products/${product.slug}`}><h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600">{product.name}</h3></Link>
												<div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
													<span className="text-2xl font-bold text-gray-900">{price.toLocaleString()} F</span>
													<button type="button" onClick={() => handleAddToCart(product)} className={`px-5 py-2.5 font-semibold rounded-xl flex items-center gap-2 ${addedProductId === product.id ? 'bg-green-500 text-white' : `bg-gradient-to-r ${CATEGORY_INFO.gradient} text-white`}`}>
														{addedProductId === product.id ? <><Check size={18} /> Ajouté</> : <><ShoppingCart size={18} /> Ajouter</>}
													</button>
												</div>
											</div>
										</div>
									);
								})}
							</div>
						) : (
							<div className="text-center py-20">
								<Package size={64} className="text-gray-300 mx-auto mb-6" />
								<h3 className="text-2xl font-bold text-gray-900 mb-3">Aucun produit trouvé</h3>
								<button type="button" onClick={() => { setPriceRange([0, 500000]); setSelectedSubcategory(null); }} className="px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl">Réinitialiser</button>
							</div>
						)}
					</div>
				</section>
			</main>
			<Footer />
		</>
	);
}
