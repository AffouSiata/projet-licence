'use client';

import {
	Award,
	Check,
	ChevronRight,
	FileText,
	Package,
	Users,
	Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Footer } from '~/components/footer';
import { Header } from '~/components/header';
import { ProductCard } from '~/components/product-card';
import { getProducts } from '~/lib/products';
import type { Product } from '~/validators/products';

const CATEGORY = {
	name: 'Microsoft Office',
	eyebrow: 'Suite bureautique',
	description:
		'Word, Excel, PowerPoint, Outlook et tous les outils Microsoft pour être productif. Licences officielles à prix réduit.',
	brand: '#D83B01',
	brandDark: '#A22B00',
	icon: FileText,
	defaultQuery: 'Office',
	subcategories: [
		{ name: 'Toutes', slug: null, query: null },
		{ name: 'Microsoft 365', slug: 'microsoft-365', query: 'Microsoft 365' },
		{ name: 'Office 2024', slug: 'office-2024', query: 'Office 2024' },
		{ name: 'Office 2021', slug: 'office-2021', query: 'Office 2021' },
		{ name: 'Office 2020', slug: 'office-2020', query: 'Office 2020' },
		{ name: 'Office 2019', slug: 'office-2019', query: 'Office 2019' },
		{ name: 'Office Mac', slug: 'office-mac', query: 'Office Mac' },
	],
	highlights: [
		{ icon: Zap, label: 'Activation instantanée' },
		{ icon: Users, label: 'Multi-postes possible' },
		{ icon: Award, label: 'Licence officielle' },
	],
};

type SortKey = 'recent' | 'price-asc' | 'price-desc' | 'name';

const SORT_OPTIONS: Array<{ value: SortKey; label: string }> = [
	{ value: 'recent', label: 'Plus récents' },
	{ value: 'price-asc', label: 'Prix croissant' },
	{ value: 'price-desc', label: 'Prix décroissant' },
	{ value: 'name', label: 'Nom (A→Z)' },
];

const OfficePage = () => {
	const searchParams = useSearchParams();
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const [sort, setSort] = useState<SortKey>('recent');
	const [activeQuery, setActiveQuery] = useState<string | null>(() => {
		const slug = searchParams.get('filter');
		return CATEGORY.subcategories.find((s) => s.slug === slug)?.query ?? null;
	});

	useEffect(() => {
		const slug = searchParams.get('filter');
		const match = CATEGORY.subcategories.find((s) => s.slug === slug);
		setActiveQuery(match?.query ?? null);
	}, [searchParams]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				const sortBy =
					sort === 'name'
						? 'name'
						: sort.startsWith('price')
							? 'price'
							: 'createdAt';
				const order = sort === 'price-asc' || sort === 'name' ? 'asc' : 'desc';
				const response = await getProducts({
					q: activeQuery || undefined,
					limit: 100,
					sort: sortBy,
					order,
				});
				// Scoper à la catégorie : la recherche par nom peut attraper
				// d'autres catégories (ou ne rien renvoyer par défaut).
				setProducts(
					(response.items || []).filter(
						(p) => p.category?.slug === 'office',
					),
				);
			} catch (err) {
				console.error('Error fetching products:', err);
				setProducts([]);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, [sort, activeQuery]);

	const Icon = CATEGORY.icon;

	return (
		<>
			<Header />
			<main className="min-h-screen bg-white">
				<section
					className="relative overflow-hidden"
					style={{
						background: `linear-gradient(135deg, ${CATEGORY.brand} 0%, ${CATEGORY.brandDark} 100%)`,
					}}
				>
					<div
						aria-hidden
						className="absolute inset-0 opacity-[0.07]"
						style={{
							backgroundImage:
								'radial-gradient(circle at 1.5px 1.5px, white 1px, transparent 0)',
							backgroundSize: '28px 28px',
						}}
					/>
					<div
						aria-hidden
						className="absolute -top-32 -right-32 h-[480px] w-[480px] rounded-full bg-white/5 blur-3xl"
					/>
					<div
						aria-hidden
						className="absolute -bottom-40 -left-32 h-[400px] w-[400px] rounded-full bg-amber-400/10 blur-3xl"
					/>

					<div className="relative z-10 mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
						<nav className="mb-8 flex items-center gap-2 text-[13px]">
							<Link
								href="/"
								className="text-white/60 transition-colors hover:text-white"
							>
								Accueil
							</Link>
							<ChevronRight size={14} className="text-white/40" />
							<Link
								href="/categories"
								className="text-white/60 transition-colors hover:text-white"
							>
								Catégories
							</Link>
							<ChevronRight size={14} className="text-white/40" />
							<span className="font-medium text-white">{CATEGORY.name}</span>
						</nav>

						<div className="grid items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
							<div className="max-w-2xl">
								<div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1.5 backdrop-blur-sm ring-1 ring-white/20">
									<Award size={14} className="text-amber-200" />
									<span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
										{CATEGORY.eyebrow}
									</span>
								</div>

								<h1 className="text-4xl font-bold leading-[1.05] tracking-tight text-white md:text-5xl lg:text-[56px]">
									{CATEGORY.name}
								</h1>

								<p className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/75 lg:text-base">
									{CATEGORY.description}
								</p>

								<div className="mt-7 flex flex-wrap gap-2.5">
									{CATEGORY.highlights.map(({ icon: HI, label }) => (
										<div
											key={label}
											className="inline-flex items-center gap-2 rounded-lg bg-white/8 px-3 py-1.5 text-[12.5px] font-medium text-white/90 ring-1 ring-white/15 backdrop-blur-sm"
										>
											<HI size={14} className="text-amber-200" />
											{label}
										</div>
									))}
								</div>
							</div>

							<div className="hidden lg:flex lg:justify-end">
								<div className="relative">
									<div className="flex h-[260px] w-[260px] items-center justify-center rounded-3xl bg-white/10 ring-1 ring-white/20 backdrop-blur-sm">
										<Icon size={120} strokeWidth={1.2} className="text-white" />
									</div>
									<div className="absolute -bottom-3 -right-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-400 shadow-xl shadow-amber-400/30">
										<Zap size={28} className="text-white" />
									</div>
									<div className="absolute -top-3 -left-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-xl">
										<Check size={22} style={{ color: CATEGORY.brand }} />
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				<section className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-md">
					<div className="mx-auto max-w-7xl px-6 lg:px-8">
						<div className="flex items-center justify-between gap-4 overflow-x-auto py-4">
							<div className="flex items-center gap-2">
								{CATEGORY.subcategories.map((sub) => {
									const isActive =
										(sub.query === null && activeQuery === null) ||
										sub.query === activeQuery;
									return (
										<button
											key={sub.name}
											type="button"
											onClick={() => setActiveQuery(sub.query)}
											className={`whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-semibold transition-all ${
												isActive
													? 'text-white shadow-md'
													: 'bg-slate-100 text-slate-700 hover:bg-slate-200'
											}`}
											style={
												isActive
													? { backgroundColor: CATEGORY.brand }
													: undefined
											}
										>
											{sub.name}
										</button>
									);
								})}
							</div>

							<div className="hidden items-center gap-3 md:flex">
								<span className="text-[12px] font-medium text-slate-500">
									Trier :
								</span>
								<select
									value={sort}
									onChange={(e) => setSort(e.target.value as SortKey)}
									className="cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px] font-medium text-slate-700 outline-none transition-colors hover:border-slate-300 focus:border-[#1D73B3] focus:ring-2 focus:ring-[#1D73B3]/15"
								>
									{SORT_OPTIONS.map((opt) => (
										<option key={opt.value} value={opt.value}>
											{opt.label}
										</option>
									))}
								</select>
							</div>
						</div>
					</div>
				</section>

				<section className="bg-[#FAFBFC] py-12 lg:py-16">
					<div className="mx-auto max-w-7xl px-6 lg:px-8">
						<div className="mb-8 flex items-end justify-between gap-6 flex-wrap">
							<div>
								<div
									className="mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5"
									style={{ backgroundColor: `${CATEGORY.brand}15` }}
								>
									<Icon size={14} style={{ color: CATEGORY.brand }} />
									<span
										className="text-[12px] font-semibold uppercase tracking-wider"
										style={{ color: CATEGORY.brand }}
									>
										Catalogue
									</span>
								</div>
								<h2 className="text-2xl font-bold leading-tight tracking-tight text-[#1B3A5F] md:text-3xl">
									{loading
										? 'Chargement…'
										: `${products.length} licence${products.length > 1 ? 's' : ''} disponible${products.length > 1 ? 's' : ''}`}
								</h2>
							</div>
							<p className="text-[13px] text-slate-500">
								Activation par e-mail dans les minutes qui suivent la commande.
							</p>
						</div>

						{loading ? (
							<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-6">
								{Array.from({ length: 8 }).map((_, i) => (
									<div
										key={`skel-${i}`}
										className="overflow-hidden rounded-xl border border-slate-200 bg-white"
									>
										<div className="aspect-square bg-slate-100" />
										<div className="space-y-3 p-5">
											<div className="h-3 w-16 rounded bg-slate-100" />
											<div className="h-4 w-3/4 rounded bg-slate-200" />
											<div className="h-3 w-full rounded bg-slate-100" />
											<div className="h-9 w-full rounded-lg bg-slate-100" />
										</div>
									</div>
								))}
							</div>
						) : products.length > 0 ? (
							<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-6">
								{products.map((product) => (
									<ProductCard key={product.id} product={product} />
								))}
							</div>
						) : (
							<div className="rounded-2xl border border-slate-200 bg-white py-20 text-center">
								<div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
									<Package size={28} className="text-slate-400" />
								</div>
								<h3 className="text-xl font-bold text-[#1B3A5F]">
									Aucune licence pour cette sélection
								</h3>
								<p className="mx-auto mt-2 max-w-md text-[14px] text-slate-500">
									Essayez de retirer le filtre ou de changer de sous-catégorie.
								</p>
								<button
									type="button"
									onClick={() => setActiveQuery(null)}
									className="mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:opacity-90"
									style={{ backgroundColor: CATEGORY.brand }}
								>
									Voir toutes les licences
								</button>
							</div>
						)}
					</div>
				</section>
			</main>
			<Footer />
		</>
	);
};

export default OfficePage;
