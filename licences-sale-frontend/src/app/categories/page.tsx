'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
	Monitor,
	FileText,
	Shield,
	Server,
	Palette,
	PenTool,
	LayoutGrid,
	ArrowRight,
	Grid3X3,
	Loader2,
	Search,
	Package,
	type LucideIcon,
} from 'lucide-react';
import { Header } from '~/components/header';
import { Footer } from '~/components/footer';
import { getCategories } from '~/lib/products';
import type { Category } from '~/validators/categories';

// Mapping des icônes et couleurs par nom de catégorie
const categoryStyles: Record<
	string,
	{
		icon: LucideIcon;
		color: string;
		gradient: string;
		bgColor: string;
		hoverBg: string;
	}
> = {
	windows: {
		icon: Monitor,
		color: '#0078D4',
		gradient: 'from-blue-400 to-blue-600',
		bgColor: 'bg-blue-50',
		hoverBg: 'group-hover:bg-blue-100',
	},
	systemes: {
		icon: Monitor,
		color: '#0078D4',
		gradient: 'from-blue-400 to-blue-600',
		bgColor: 'bg-blue-50',
		hoverBg: 'group-hover:bg-blue-100',
	},
	"systèmes d'exploitation": {
		icon: Monitor,
		color: '#0078D4',
		gradient: 'from-blue-400 to-blue-600',
		bgColor: 'bg-blue-50',
		hoverBg: 'group-hover:bg-blue-100',
	},
	office: {
		icon: FileText,
		color: '#D83B01',
		gradient: 'from-orange-400 to-red-500',
		bgColor: 'bg-orange-50',
		hoverBg: 'group-hover:bg-orange-100',
	},
	bureautique: {
		icon: FileText,
		color: '#D83B01',
		gradient: 'from-orange-400 to-red-500',
		bgColor: 'bg-orange-50',
		hoverBg: 'group-hover:bg-orange-100',
	},
	antivirus: {
		icon: Shield,
		color: '#059669',
		gradient: 'from-emerald-400 to-green-600',
		bgColor: 'bg-emerald-50',
		hoverBg: 'group-hover:bg-emerald-100',
	},
	sécurité: {
		icon: Shield,
		color: '#059669',
		gradient: 'from-emerald-400 to-green-600',
		bgColor: 'bg-emerald-50',
		hoverBg: 'group-hover:bg-emerald-100',
	},
	'windows server': {
		icon: Server,
		color: '#7C3AED',
		gradient: 'from-violet-400 to-purple-600',
		bgColor: 'bg-violet-50',
		hoverBg: 'group-hover:bg-violet-100',
	},
	serveur: {
		icon: Server,
		color: '#7C3AED',
		gradient: 'from-violet-400 to-purple-600',
		bgColor: 'bg-violet-50',
		hoverBg: 'group-hover:bg-violet-100',
	},
	adobe: {
		icon: Palette,
		color: '#DC2626',
		gradient: 'from-red-400 to-rose-600',
		bgColor: 'bg-red-50',
		hoverBg: 'group-hover:bg-red-100',
	},
	autodesk: {
		icon: PenTool,
		color: '#0891B2',
		gradient: 'from-cyan-400 to-teal-600',
		bgColor: 'bg-cyan-50',
		hoverBg: 'group-hover:bg-cyan-100',
	},
};

const defaultStyle = {
	icon: LayoutGrid,
	color: '#1D73B3',
	gradient: 'from-sky-400 to-blue-600',
	bgColor: 'bg-sky-50',
	hoverBg: 'group-hover:bg-sky-100',
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

export default function CategoriesPage() {
	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState('');

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				setLoading(true);
				const data = await getCategories();
				setCategories(data.items || []);
			} catch (error) {
				console.error('Error fetching categories:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchCategories();
	}, []);

	const filteredCategories = categories.filter((category) =>
		category.name.toLowerCase().includes(searchQuery.toLowerCase())
	);

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
								Chargement des catégories...
							</p>
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
				<section className="relative overflow-hidden bg-gradient-to-br from-[#1D70B8] via-[#2E86AB] to-[#1B3A5F]">
					{/* Background decorations */}
					<div className="absolute inset-0 overflow-hidden">
						<div className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] rounded-full bg-white/5 blur-3xl" />
						<div className="absolute -bottom-1/2 -left-1/4 w-[600px] h-[600px] rounded-full bg-black/10 blur-3xl" />
					</div>

					{/* Dot pattern */}
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
							<span className="text-white/50">/</span>
							<span className="text-white font-medium">Catégories</span>
						</nav>

						<div className="text-center max-w-3xl mx-auto">
							{/* Badge */}
							<div className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-sm rounded-full mb-6 border border-white/20">
								<Grid3X3 size={16} className="text-white" />
								<span className="text-sm font-semibold text-white">
									{categories.length} CATÉGORIES DISPONIBLES
								</span>
							</div>

							{/* Title */}
							<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
								Nos Catégories
							</h1>

							<p className="text-lg text-white/80 mb-10 leading-relaxed">
								Explorez notre catalogue complet de licences logicielles.
								Trouvez rapidement la catégorie qui correspond à vos besoins.
							</p>

							{/* Search bar */}
							<div className="relative max-w-xl mx-auto">
								<Search
									size={20}
									className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
								/>
								<input
									type="text"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									placeholder="Rechercher une catégorie..."
									className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl text-gray-900 placeholder-gray-400 outline-none focus:ring-4 focus:ring-white/20 shadow-xl"
								/>
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

				{/* Categories Grid */}
				<section className="py-12 lg:py-16">
					<div className="max-w-7xl mx-auto px-6">
						{filteredCategories.length > 0 ? (
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
								{filteredCategories.map((category) => {
									const style = getStyleForCategory(category.name);
									const Icon = style.icon;

									return (
										<Link
											key={category.id}
											href={`/categories/${category.slug}`}
											className="group"
										>
											<div className="relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-transparent hover:shadow-2xl transition-all duration-300 h-full">
												{/* Gradient overlay on hover */}
												<div
													className={`absolute inset-0 bg-gradient-to-br ${style.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
												/>

												{/* Image or Icon header */}
												<div
													className={`relative h-40 ${style.bgColor} ${style.hoverBg} transition-colors duration-300 flex items-center justify-center overflow-hidden`}
												>
													{category.image ? (
														<Image
															src={category.image}
															alt={category.name}
															fill
															className="object-cover group-hover:scale-110 transition-transform duration-500"
														/>
													) : (
														<Icon
															size={64}
															style={{ color: style.color }}
															strokeWidth={1.2}
															className="transition-transform duration-300 group-hover:scale-110"
														/>
													)}

													{/* Decorative elements */}
													<div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-white/30 blur-xl" />
												</div>

												{/* Content */}
												<div className="p-6">
													<h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#1D70B8] transition-colors">
														{category.name}
													</h3>

													{category.description && (
														<p className="text-gray-500 text-sm mb-4 line-clamp-2">
															{category.description}
														</p>
													)}

													{/* Footer */}
													<div className="flex items-center justify-between pt-4 border-t border-gray-100">
														<span
															className="text-sm font-medium px-3 py-1 rounded-full"
															style={{
																backgroundColor: `${style.color}15`,
																color: style.color,
															}}
														>
															Voir les produits
														</span>

														<div
															className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:translate-x-1"
															style={{
																backgroundColor: `${style.color}15`,
															}}
														>
															<ArrowRight
																size={18}
																style={{ color: style.color }}
															/>
														</div>
													</div>
												</div>
											</div>
										</Link>
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
									Aucune catégorie trouvée
								</h3>
								<p className="text-gray-500 mb-8 max-w-md mx-auto">
									{searchQuery
										? `Aucune catégorie ne correspond à "${searchQuery}"`
										: 'Aucune catégorie disponible pour le moment.'}
								</p>
								{searchQuery && (
									<button
										type="button"
										onClick={() => setSearchQuery('')}
										className="inline-flex items-center gap-2 px-6 py-3 bg-[#1D70B8] text-white font-semibold rounded-xl hover:bg-[#155a96] transition-colors"
									>
										Effacer la recherche
									</button>
								)}
							</div>
						)}
					</div>
				</section>

				{/* CTA Section */}
				<section className="py-16 bg-white">
					<div className="max-w-4xl mx-auto px-6 text-center">
						<h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
							Vous ne trouvez pas ce que vous cherchez ?
						</h2>
						<p className="text-gray-500 mb-8">
							Contactez-nous pour toute demande spécifique. Notre équipe est là
							pour vous aider.
						</p>
						<Link
							href="/contact"
							className="inline-flex items-center gap-2 px-8 py-4 bg-[#1D70B8] text-white font-semibold rounded-xl hover:bg-[#155a96] transition-colors shadow-lg shadow-[#1D70B8]/20"
						>
							Nous contacter
							<ArrowRight size={18} />
						</Link>
					</div>
				</section>
			</main>
			<Footer />
		</>
	);
}
