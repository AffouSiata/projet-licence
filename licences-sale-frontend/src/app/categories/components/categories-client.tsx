'use client';

import {
	ArrowRight,
	FileText,
	LayoutGrid,
	type LucideIcon,
	Monitor,
	Package,
	Palette,
	PenTool,
	Search,
	Server,
	Shield,
	Sparkles,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Footer } from '~/components/footer';
import { Header } from '~/components/header';
import type { Category } from '~/validators/categories';

interface CategoryStyle {
	icon: LucideIcon;
	color: string;
}

// Icône + couleur d'accent par famille de catégorie (matching par mot-clé du nom)
const categoryStyles: Record<string, CategoryStyle> = {
	windows: { icon: Monitor, color: '#0078D4' },
	systeme: { icon: Monitor, color: '#0078D4' },
	office: { icon: FileText, color: '#D83B01' },
	bureautique: { icon: FileText, color: '#D83B01' },
	antivirus: { icon: Shield, color: '#059669' },
	securite: { icon: Shield, color: '#059669' },
	server: { icon: Server, color: '#7C3AED' },
	serveur: { icon: Server, color: '#7C3AED' },
	adobe: { icon: Palette, color: '#DC2626' },
	autodesk: { icon: PenTool, color: '#0891B2' },
};

const defaultStyle: CategoryStyle = { icon: LayoutGrid, color: '#1D73B3' };

const getStyleForCategory = (categoryName: string): CategoryStyle => {
	const normalized = categoryName.toLowerCase();
	for (const [key, style] of Object.entries(categoryStyles)) {
		if (normalized.includes(key)) return style;
	}
	return defaultStyle;
};

const productLabel = (count?: number) => {
	if (count === undefined) return null;
	return `${count} ${count > 1 ? 'produits' : 'produit'}`;
};

interface CategoriesClientProps {
	categories: Category[];
}

export const CategoriesClient = ({ categories }: CategoriesClientProps) => {
	const [searchQuery, setSearchQuery] = useState('');
	const query = searchQuery.trim().toLowerCase();
	const isSearching = query.length > 0;

	const filtered = categories.filter((category) =>
		category.name.toLowerCase().includes(query),
	);

	const totalProducts = categories.reduce(
		(sum, category) => sum + (category._count?.products ?? 0),
		0,
	);

	return (
		<>
			<Header />
			<main className="min-h-screen bg-gray-50">
				{/* ── Hero ── */}
				<section className="relative overflow-hidden">
					{/* Couches de fond : dégradé marque + halos + grille fine */}
					<div className="absolute inset-0 bg-gradient-to-br from-[#1D73B3] via-[#2E86AB] to-[#1B3A5F]" />
					<div className="absolute -top-40 right-0 w-[760px] h-[760px] rounded-full bg-[#54B4E6]/30 blur-[120px]" />
					<div className="absolute -bottom-48 -left-24 w-[620px] h-[620px] rounded-full bg-[#15324f]/50 blur-[110px]" />
					<div
						className="absolute inset-0 opacity-[0.07]"
						style={{
							backgroundImage:
								'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
							backgroundSize: '54px 54px',
						}}
					/>
					{/* Fondu vers le fond de page */}
					<div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-gray-50" />

					<div className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-24 lg:pt-16 lg:pb-32">
						<nav className="flex items-center gap-2 text-sm mb-10 animate-fade-up">
							<Link
								href="/"
								className="text-white/60 hover:text-white transition-colors"
							>
								Accueil
							</Link>
							<span className="text-white/40">/</span>
							<span className="text-white/90 font-medium">Catégories</span>
						</nav>

						<div className="max-w-2xl">
							<div
								className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/10 backdrop-blur-md rounded-full mb-7 border border-white/15 animate-fade-up"
								style={{ animationDelay: '60ms' }}
							>
								<Sparkles size={14} className="text-amber-300" />
								<span className="text-xs font-semibold tracking-wider text-white/90 uppercase">
									{categories.length} catégories
									{totalProducts > 0 ? ` · ${totalProducts} licences` : ''}
								</span>
							</div>

							<h1
								className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-white leading-[1.05] tracking-tight mb-6 animate-fade-up"
								style={{ animationDelay: '120ms' }}
							>
								Explorez nos
								<span className="block bg-gradient-to-r from-white via-[#CDEBFB] to-[#9AD4F5] bg-clip-text text-transparent">
									catégories de licences
								</span>
							</h1>

							<p
								className="text-lg text-white/75 leading-relaxed mb-9 max-w-xl animate-fade-up"
								style={{ animationDelay: '180ms' }}
							>
								Des logiciels officiels, classés par univers. Trouvez en un coup
								d'œil la solution adaptée à vos besoins.
							</p>

							<div
								className="relative max-w-lg animate-fade-up"
								style={{ animationDelay: '240ms' }}
							>
								<Search
									size={20}
									className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
								/>
								<input
									type="text"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									placeholder="Rechercher une catégorie..."
									className="w-full pl-[3.25rem] pr-4 py-4 bg-white/95 backdrop-blur rounded-2xl text-gray-900 placeholder-gray-400 outline-none ring-1 ring-white/40 focus:ring-4 focus:ring-white/30 shadow-2xl shadow-[#0d2c47]/30 transition-all"
								/>
							</div>
						</div>
					</div>
				</section>

				{/* ── Grille ── */}
				<section className="max-w-7xl mx-auto px-6 -mt-10 relative z-10 pb-20">
					<div className="flex items-end justify-between mb-8">
						<div>
							<p className="text-xs font-bold tracking-[0.2em] text-[#2E86AB] uppercase mb-2">
								Catalogue
							</p>
							<h2 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
								Parcourir par catégorie
							</h2>
						</div>
						<p className="hidden sm:block text-sm text-gray-400 font-medium">
							{filtered.length}
							{filtered.length > 1 ? ' catégories' : ' catégorie'}
						</p>
					</div>

					{filtered.length > 0 ? (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{filtered.map((category, index) => {
								const style = getStyleForCategory(category.name);
								const Icon = style.icon;
								const label = productLabel(category._count?.products);
								const color = style.color;

								return (
									<Link
										key={category.id}
										href={`/categories/${category.slug}`}
										className="group block animate-fade-up"
										style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
									>
										<article className="relative h-full rounded-2xl bg-white ring-1 ring-gray-200/70 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden">
											{/* Liseré coloré en haut, révélé au survol */}
											<span
												className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 z-10"
												style={{
													background: `linear-gradient(90deg, ${color}, ${color}66)`,
												}}
											/>

											{/* En-tête visuel teinté par la couleur de la catégorie */}
											<div
												className="relative h-44 flex items-center justify-center overflow-hidden"
												style={{
													background: `linear-gradient(135deg, ${color}16, #ffffff 78%)`,
												}}
											>
												{category.image ? (
													<Image
														src={category.image}
														alt={category.name}
														fill
														sizes="(max-width: 640px) 100vw, (max-width: 1280px) 33vw, 25vw"
														className="object-cover group-hover:scale-105 transition-transform duration-500"
													/>
												) : (
													<>
														<div
															className="absolute w-28 h-28 rounded-full blur-2xl opacity-60 group-hover:opacity-90 transition-opacity duration-300"
															style={{ backgroundColor: `${color}26` }}
														/>
														<div
															className="relative w-20 h-20 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-105 group-hover:-rotate-3 transition-transform duration-300"
															style={{ backgroundColor: `${color}14` }}
														>
															<Icon
																size={38}
																style={{ color }}
																strokeWidth={1.6}
															/>
														</div>
													</>
												)}

												{label && (
													<span className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/85 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-700 shadow-sm ring-1 ring-black/5">
														<Package size={12} style={{ color }} />
														{category._count?.products}
													</span>
												)}
											</div>

											{/* Contenu */}
											<div className="p-6">
												<h3 className="text-lg font-bold text-gray-900 tracking-tight group-hover:text-[#1D73B3] transition-colors">
													{category.name}
												</h3>

												<p className="mt-2 text-sm text-gray-500 leading-relaxed line-clamp-2 min-h-[2.5rem]">
													{category.description ||
														'Découvrez notre sélection de licences officielles.'}
												</p>

												<div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
													<span
														className="text-sm font-semibold"
														style={{ color }}
													>
														Voir les produits
													</span>
													<span
														className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 group-hover:translate-x-0.5"
														style={{ backgroundColor: `${color}12` }}
													>
														<ArrowRight size={17} style={{ color }} />
													</span>
												</div>
											</div>
										</article>
									</Link>
								);
							})}
						</div>
					) : (
						<div className="text-center py-20 bg-white rounded-2xl ring-1 ring-gray-200/70">
							<div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
								<Package size={36} className="text-gray-300" />
							</div>
							<h3 className="text-xl font-bold text-gray-900 mb-2">
								Aucune catégorie trouvée
							</h3>
							<p className="text-gray-500 mb-7 max-w-md mx-auto">
								{isSearching
									? `Aucune catégorie ne correspond à « ${searchQuery} ».`
									: 'Aucune catégorie disponible pour le moment.'}
							</p>
							{isSearching && (
								<button
									type="button"
									onClick={() => setSearchQuery('')}
									className="inline-flex items-center gap-2 px-6 py-3 bg-[#1D73B3] text-white font-semibold rounded-xl hover:bg-[#155a96] transition-colors"
								>
									Effacer la recherche
								</button>
							)}
						</div>
					)}
				</section>

				{/* ── CTA contact ── */}
				<section className="relative overflow-hidden bg-white border-t border-gray-100">
					<div className="max-w-5xl mx-auto px-6 py-16">
						<div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1D73B3] to-[#1B3A5F] px-8 py-12 lg:px-14 text-center">
							<div className="absolute -top-20 -right-10 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
							<div className="relative">
								<h2 className="text-2xl lg:text-3xl font-bold text-white mb-3 tracking-tight">
									Vous ne trouvez pas ce que vous cherchez ?
								</h2>
								<p className="text-white/75 mb-8 max-w-xl mx-auto">
									Contactez notre équipe pour toute demande spécifique. Nous
									vous répondons rapidement.
								</p>
								<Link
									href="/contact"
									className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#1B3A5F] font-bold rounded-xl hover:gap-3 transition-all shadow-lg"
								>
									Nous contacter
									<ArrowRight size={18} />
								</Link>
							</div>
						</div>
					</div>
				</section>
			</main>
			<Footer />
		</>
	);
};
