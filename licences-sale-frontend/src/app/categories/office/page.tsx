'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
	FileText,
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
	name: 'Microsoft Office',
	slug: 'office',
	description: 'Suite bureautique complète Microsoft Office. Word, Excel, PowerPoint et plus encore. Licences officielles à prix réduit.',
	gradient: 'from-orange-500 via-orange-600 to-red-600',
	color: '#D83B01',
	icon: FileText,
	features: [
		'Licence perpétuelle',
		'Toutes les applications Office',
		'Mises à jour incluses',
	],
	subcategories: [
		{ name: 'Microsoft 365', query: 'Microsoft 365' },
		{ name: 'Office 2024', query: 'Office 2024' },
		{ name: 'Office 2021', query: 'Office 2021' },
		{ name: 'Office 2019', query: 'Office 2019' },
		{ name: 'Office Mac', query: 'Office Mac' },
	],
};

export default function OfficePage() {
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
				const query = selectedSubcategory || 'Office';
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
								<div className="w-20 h-20 rounded-full border-4 border-gray-200 border-t-orange-600 animate-spin mx-auto" />
								<Loader2 size={32} className="text-orange-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
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
				{/* Hero Section - Office Style */}
				<section className="relative overflow-hidden min-h-[500px] lg:min-h-[550px]">
					{/* Background */}
					<div className="absolute inset-0 bg-gradient-to-br from-[#D83B01] via-[#EA4300] to-[#B7472A]" />

					{/* Office Apps Pattern */}
					<div className="absolute inset-0 overflow-hidden">
						{/* Decorative Office icons */}
						<div className="absolute top-[15%] left-[5%] w-16 h-16 bg-[#217346] rounded-xl opacity-20 flex items-center justify-center text-white text-2xl font-bold">X</div>
						<div className="absolute top-[25%] right-[8%] w-14 h-14 bg-[#2B579A] rounded-xl opacity-20 flex items-center justify-center text-white text-2xl font-bold">W</div>
						<div className="absolute bottom-[30%] left-[12%] w-12 h-12 bg-[#B7472A] rounded-xl opacity-20 flex items-center justify-center text-white text-xl font-bold">P</div>
						<div className="absolute bottom-[20%] right-[15%] w-16 h-16 bg-[#7719AA] rounded-xl opacity-15 flex items-center justify-center text-white text-2xl font-bold">N</div>

						{/* Light effects */}
						<div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-yellow-500/20 to-transparent rounded-full blur-3xl" />
						<div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-red-900/30 to-transparent rounded-full blur-3xl" />
					</div>

					<div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-12 pb-20 lg:pt-16 lg:pb-24">
						{/* Breadcrumb */}
						<nav className="flex items-center gap-2 text-sm mb-10">
							<Link href="/" className="text-white/60 hover:text-white transition-colors font-medium">Accueil</Link>
							<svg className="w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
							<span className="text-white font-medium">{CATEGORY_INFO.name}</span>
						</nav>

						<div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
							{/* Left Content */}
							<div className="max-w-xl">
								{/* Microsoft Badge */}
								<div className="inline-flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full mb-8 border border-white/20">
									<div className="w-6 h-6 bg-white rounded flex items-center justify-center">
										<svg viewBox="0 0 23 23" className="w-4 h-4">
											<path fill="#f25022" d="M0 0h11v11H0z"/>
											<path fill="#00a4ef" d="M0 12h11v11H0z"/>
											<path fill="#7fba00" d="M12 0h11v11H12z"/>
											<path fill="#ffb900" d="M12 12h11v11H12z"/>
										</svg>
									</div>
									<span className="text-sm font-medium text-white">Microsoft Office</span>
									<span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
								</div>

								<h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 leading-[1.1]">
									Microsoft Office<br />
									<span className="text-white/80">& Microsoft 365</span>
								</h1>

								<p className="text-lg text-white/70 mb-10 leading-relaxed">
									{CATEGORY_INFO.description}
								</p>

								{/* Office Apps */}
								<div className="flex items-center gap-4 mb-10">
									<div className="flex items-center gap-3 px-4 py-2 bg-white/10 rounded-xl border border-white/10">
										<div className="w-8 h-8 bg-[#2B579A] rounded-lg flex items-center justify-center text-white font-bold text-sm">W</div>
										<span className="text-white text-sm font-medium">Word</span>
									</div>
									<div className="flex items-center gap-3 px-4 py-2 bg-white/10 rounded-xl border border-white/10">
										<div className="w-8 h-8 bg-[#217346] rounded-lg flex items-center justify-center text-white font-bold text-sm">X</div>
										<span className="text-white text-sm font-medium">Excel</span>
									</div>
									<div className="flex items-center gap-3 px-4 py-2 bg-white/10 rounded-xl border border-white/10">
										<div className="w-8 h-8 bg-[#B7472A] rounded-lg flex items-center justify-center text-white font-bold text-sm">P</div>
										<span className="text-white text-sm font-medium">PowerPoint</span>
									</div>
								</div>

								{/* Stats */}
								<div className="grid grid-cols-3 gap-4">
									<div className="text-center">
										<p className="text-3xl lg:text-4xl font-bold text-white">{stats.minPrice > 0 ? `${(stats.minPrice / 1000).toFixed(0)}K` : '—'}</p>
										<p className="text-white/50 text-sm mt-1">FCFA</p>
									</div>
									<div className="text-center border-x border-white/20">
										<p className="text-3xl lg:text-4xl font-bold text-white">{products.length}</p>
										<p className="text-white/50 text-sm mt-1">Licences</p>
									</div>
									<div className="text-center">
										<p className="text-3xl lg:text-4xl font-bold text-white">∞</p>
										<p className="text-white/50 text-sm mt-1">Validité</p>
									</div>
								</div>
							</div>

							{/* Right - Visual */}
							<div className="hidden lg:flex justify-center items-center">
								<div className="relative">
									{/* Office Apps Stack */}
									<div className="relative">
										{/* Excel Card */}
										<div className="absolute -left-8 top-0 w-[200px] bg-white rounded-2xl shadow-2xl p-4 transform -rotate-6 hover:rotate-0 transition-transform duration-300">
											<div className="flex items-center gap-3 mb-3">
												<div className="w-10 h-10 bg-[#217346] rounded-xl flex items-center justify-center text-white font-bold">X</div>
												<div>
													<p className="font-bold text-gray-800 text-sm">Excel</p>
													<p className="text-gray-400 text-xs">Tableur</p>
												</div>
											</div>
											<div className="h-20 bg-gray-50 rounded-lg flex items-center justify-center">
												<div className="grid grid-cols-3 gap-1">
													{[...Array(9)].map((_, i) => (
														<div key={i} className="w-4 h-3 bg-[#217346]/20 rounded-sm" />
													))}
												</div>
											</div>
										</div>

										{/* Word Card */}
										<div className="relative z-10 w-[220px] bg-white rounded-2xl shadow-2xl p-5 transform hover:scale-105 transition-transform duration-300">
											<div className="flex items-center gap-3 mb-4">
												<div className="w-12 h-12 bg-[#2B579A] rounded-xl flex items-center justify-center text-white font-bold text-lg">W</div>
												<div>
													<p className="font-bold text-gray-800">Word</p>
													<p className="text-gray-400 text-sm">Traitement de texte</p>
												</div>
											</div>
											<div className="space-y-2">
												<div className="h-2 bg-gray-200 rounded-full w-full" />
												<div className="h-2 bg-gray-200 rounded-full w-4/5" />
												<div className="h-2 bg-gray-200 rounded-full w-full" />
												<div className="h-2 bg-gray-200 rounded-full w-3/5" />
											</div>
										</div>

										{/* PowerPoint Card */}
										<div className="absolute -right-8 top-8 w-[180px] bg-white rounded-2xl shadow-2xl p-4 transform rotate-6 hover:rotate-0 transition-transform duration-300">
											<div className="flex items-center gap-3 mb-3">
												<div className="w-10 h-10 bg-[#B7472A] rounded-xl flex items-center justify-center text-white font-bold">P</div>
												<div>
													<p className="font-bold text-gray-800 text-sm">PowerPoint</p>
													<p className="text-gray-400 text-xs">Présentations</p>
												</div>
											</div>
											<div className="h-16 bg-gradient-to-br from-[#B7472A]/10 to-[#B7472A]/5 rounded-lg flex items-center justify-center">
												<div className="w-12 h-8 bg-[#B7472A]/20 rounded" />
											</div>
										</div>
									</div>

									{/* Floating Badge */}
									<div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-full px-6 py-3 shadow-xl flex items-center gap-3">
										<Check className="w-5 h-5 text-green-500" />
										<span className="font-semibold text-gray-800">Licence officielle</span>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Bottom curve */}
					<div className="absolute bottom-0 left-0 right-0">
						<svg viewBox="0 0 1440 100" fill="none" className="w-full">
							<path d="M0 100V60C240 20 480 0 720 0C960 0 1200 20 1440 60V100H0Z" fill="#F9FAFB"/>
						</svg>
					</div>
				</section>

				{/* Subcategories */}
				<section className="py-8 bg-white border-b border-gray-100">
					<div className="max-w-7xl mx-auto px-6">
						<div className="flex flex-wrap items-center gap-3">
							<span className="text-sm font-medium text-gray-500 mr-2">Filtrer par :</span>
							<button type="button" onClick={() => setSelectedSubcategory(null)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${!selectedSubcategory ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
								Tous
							</button>
							{CATEGORY_INFO.subcategories.map((sub) => (
								<button key={sub.name} type="button" onClick={() => setSelectedSubcategory(sub.query)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedSubcategory === sub.query ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
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
									<button type="button" onClick={() => setShowFilters(!showFilters)} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${showFilters ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
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
										<button type="button" onClick={() => setViewMode('grid')} className={`p-2.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-400'}`}><Grid3X3 size={18} /></button>
										<button type="button" onClick={() => setViewMode('list')} className={`p-2.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-400'}`}><LayoutList size={18} /></button>
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
													<button key={option.label} type="button" onClick={() => setPriceRange(option.range as [number, number])} className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${priceRange[0] === option.range[0] && priceRange[1] === option.range[1] ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{option.label}</button>
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
														<Link href={`/products/${product.slug}`} className="w-9 h-9 bg-white rounded-lg shadow-md flex items-center justify-center text-gray-400 hover:text-orange-600"><Eye size={18} /></Link>
													</div>
													<Link href={`/products/${product.slug}`} className="block h-full p-6">
														<div className={`relative w-full h-full transition-transform duration-500 ${isHovered ? 'scale-110' : ''}`}>
															{product.image ? <Image src={product.image} alt={product.name} fill className="object-contain" /> : <Package size={64} className="text-gray-300 mx-auto mt-12" />}
														</div>
													</Link>
												</div>
												<div className="p-5">
													<span className="inline-block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: CATEGORY_INFO.color }}>{CATEGORY_INFO.name}</span>
													<Link href={`/products/${product.slug}`}><h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">{product.name}</h3></Link>
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
												<Link href={`/products/${product.slug}`}><h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600">{product.name}</h3></Link>
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
								<button type="button" onClick={() => { setPriceRange([0, 500000]); setSelectedSubcategory(null); }} className="px-6 py-3 bg-orange-600 text-white font-semibold rounded-xl">Réinitialiser</button>
							</div>
						)}
					</div>
				</section>
			</main>
			<Footer />
		</>
	);
}
