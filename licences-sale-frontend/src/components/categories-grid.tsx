import Link from 'next/link';
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
	type LucideIcon,
} from 'lucide-react';
import type { Category } from '~/validators/categories';

interface CategoriesGridProps {
	categories: Category[];
}

const categoryStyles: Record<
	string,
	{
		icon: LucideIcon;
		color: string;
		bgColor: string;
		hoverBg: string;
		count: string;
		description: string;
		brands: string;
	}
> = {
	windows: {
		icon: Monitor,
		color: '#0078D4',
		bgColor: 'bg-blue-50',
		hoverBg: 'group-hover:bg-blue-100',
		count: '45+',
		description: "Systèmes d'exploitation Microsoft",
		brands: 'Windows 11 · Windows 10 · macOS',
	},
	systemes: {
		icon: Monitor,
		color: '#0078D4',
		bgColor: 'bg-blue-50',
		hoverBg: 'group-hover:bg-blue-100',
		count: '45+',
		description: "Systèmes d'exploitation Microsoft",
		brands: 'Windows 11 · Windows 10 · macOS',
	},
	"systèmes d'exploitation": {
		icon: Monitor,
		color: '#0078D4',
		bgColor: 'bg-blue-50',
		hoverBg: 'group-hover:bg-blue-100',
		count: '45+',
		description: "Systèmes d'exploitation Microsoft",
		brands: 'Windows 11 · Windows 10 · macOS',
	},
	office: {
		icon: FileText,
		color: '#D83B01',
		bgColor: 'bg-orange-50',
		hoverBg: 'group-hover:bg-orange-100',
		count: '30+',
		description: 'Suite bureautique Microsoft',
		brands: 'Microsoft 365 · Office 2024 · Office 2021',
	},
	bureautique: {
		icon: FileText,
		color: '#D83B01',
		bgColor: 'bg-orange-50',
		hoverBg: 'group-hover:bg-orange-100',
		count: '30+',
		description: 'Suite bureautique Microsoft',
		brands: 'Microsoft 365 · Office 2024 · Office 2021',
	},
	antivirus: {
		icon: Shield,
		color: '#059669',
		bgColor: 'bg-emerald-50',
		hoverBg: 'group-hover:bg-emerald-100',
		count: '25+',
		description: 'Protection & sécurité',
		brands: 'Kaspersky · Norton · Bitdefender · ESET',
	},
	'windows server': {
		icon: Server,
		color: '#7C3AED',
		bgColor: 'bg-violet-50',
		hoverBg: 'group-hover:bg-violet-100',
		count: '20+',
		description: 'Solutions serveur entreprise',
		brands: 'Server 2022 · Server 2019 · SQL Server',
	},
	serveur: {
		icon: Server,
		color: '#7C3AED',
		bgColor: 'bg-violet-50',
		hoverBg: 'group-hover:bg-violet-100',
		count: '20+',
		description: 'Solutions serveur entreprise',
		brands: 'Server 2022 · Server 2019 · SQL Server',
	},
	adobe: {
		icon: Palette,
		color: '#DC2626',
		bgColor: 'bg-red-50',
		hoverBg: 'group-hover:bg-red-100',
		count: '35+',
		description: 'Création & design professionnel',
		brands: 'Photoshop · Illustrator · Premiere Pro',
	},
	autodesk: {
		icon: PenTool,
		color: '#0891B2',
		bgColor: 'bg-cyan-50',
		hoverBg: 'group-hover:bg-cyan-100',
		count: '28+',
		description: 'CAO & modélisation 3D',
		brands: 'AutoCAD · Revit · 3ds Max · Maya',
	},
};

const defaultStyle = {
	icon: LayoutGrid,
	color: '#1D73B3',
	bgColor: 'bg-sky-50',
	hoverBg: 'group-hover:bg-sky-100',
	count: '15+',
	description: 'Découvrir cette collection',
	brands: 'Multiples éditeurs',
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

export const CategoriesGrid = ({ categories }: CategoriesGridProps) => {
	if (categories.length === 0) return null;

	return (
		<section className="py-20 lg:py-28 bg-slate-50">
			<div className="max-w-7xl mx-auto px-6 lg:px-8">
				{/* Header */}
				<div className="flex items-end justify-between flex-wrap gap-6 mb-12 lg:mb-14">
					<div>
						<div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#1D73B3]/10 rounded-full mb-5">
							<Grid3X3 size={14} className="text-[#1D73B3]" />
							<span className="text-[12px] font-semibold text-[#1D73B3] tracking-wider uppercase">
								Nos catégories
							</span>
						</div>
						<h2 className="text-3xl md:text-4xl lg:text-[44px] font-bold text-[#1B3A5F] leading-[1.1] tracking-tight">
							Parcourir par catégorie
						</h2>
					</div>
					<Link
						href="/categories"
						className="group hidden md:inline-flex items-center gap-2 text-[14px] font-semibold text-slate-700 hover:text-[#1D73B3] transition-colors"
					>
						Voir toutes les catégories
						<ArrowRight
							size={16}
							className="group-hover:translate-x-1 transition-transform"
						/>
					</Link>
				</div>

				{/* Categories Grid - 3 par ligne */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
					{categories.slice(0, 6).map((category) => {
						const style = getStyleForCategory(category.name);
						const Icon = style.icon;

						return (
							<Link
								key={category.id}
								href={`/categories/${category.slug}`}
								className="group"
							>
								<div className="relative flex items-start gap-5 p-7 lg:p-8 rounded-2xl bg-white border border-gray-200/80 shadow-sm shadow-slate-200/50 ring-1 ring-slate-900/[0.02] hover:border-transparent hover:shadow-xl hover:shadow-gray-200/60 hover:-translate-y-1 transition-all duration-500 h-full overflow-hidden">
									{/* Decorative corner accent */}
									<div
										className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-0 group-hover:opacity-15 blur-2xl transition-opacity duration-500"
										style={{ backgroundColor: style.color }}
									/>

									{/* Icon container */}
									<div
										className={`relative z-10 shrink-0 w-16 h-16 lg:w-[72px] lg:h-[72px] ${style.bgColor} ${style.hoverBg} rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-105 group-hover:rotate-3`}
									>
										<Icon
											size={30}
											style={{ color: style.color }}
											strokeWidth={1.6}
										/>
									</div>

									{/* Content */}
									<div className="relative z-10 flex-1 min-w-0">
										{/* Top row: name + count */}
										<div className="flex items-start justify-between gap-3 mb-2">
											<h3 className="text-lg lg:text-xl font-bold text-gray-900 leading-tight">
												{category.name}
											</h3>
											<span
												className="shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap"
												style={{
													backgroundColor: `${style.color}15`,
													color: style.color,
												}}
											>
												{style.count}
											</span>
										</div>

										{/* Description */}
										<p className="text-[13px] text-gray-500 mb-3 leading-relaxed">
											{style.description}
										</p>

										{/* Brands */}
										<p className="text-[12px] text-gray-400 mb-5 line-clamp-1">
											{style.brands}
										</p>

										{/* CTA inline */}
										<div className="flex items-center gap-2 text-[13px] font-semibold transition-colors duration-300" style={{ color: style.color }}>
											<span>Découvrir</span>
											<ArrowRight
												size={14}
												className="group-hover:translate-x-1 transition-transform duration-300"
											/>
										</div>
									</div>
								</div>
							</Link>
						);
					})}
				</div>

				{/* Mobile CTA */}
				<div className="md:hidden flex justify-center mt-10">
					<Link
						href="/categories"
						className="inline-flex items-center gap-2 px-6 py-3 bg-[#1D73B3] text-white text-[14px] font-semibold rounded-full hover:bg-[#1B3A5F] transition-colors"
					>
						Voir toutes les catégories
						<ArrowRight size={16} />
					</Link>
				</div>
			</div>
		</section>
	);
};
