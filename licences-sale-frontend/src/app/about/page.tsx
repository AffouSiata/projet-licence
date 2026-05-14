import { Header } from '~/components/header';
import { Footer } from '~/components/footer';
import {
	Target,
	Eye,
	Heart,
	Users,
	Zap,
	ShieldCheck,
	Headphones,
	CheckCircle2,
	Sparkles,
	Clock,
	Package,
} from 'lucide-react';
import Link from 'next/link';

const stats = [
	{
		value: '10 000+',
		label: 'Clients satisfaits',
		icon: Users,
		color: 'blue',
		description: 'qui nous font confiance',
	},
	{
		value: '50 000+',
		label: 'Licences vendues',
		icon: Package,
		color: 'red',
		description: 'livrées avec succès',
	},
	{
		value: '5 min',
		label: 'Temps de livraison',
		icon: Clock,
		color: 'blue',
		description: 'en moyenne',
	},
	{
		value: '24/7',
		label: 'Support disponible',
		icon: Headphones,
		color: 'red',
		description: 'à votre écoute',
	},
];

const values = [
	{
		icon: ShieldCheck,
		title: 'Authenticité',
		description:
			'Nous garantissons des licences 100% officielles et légitimes pour tous nos produits.',
	},
	{
		icon: Zap,
		title: 'Rapidité',
		description: 'Livraison instantanée par email, disponible 24h/24 et 7j/7.',
	},
	{
		icon: Headphones,
		title: 'Support',
		description:
			'Une équipe dédiée pour vous accompagner avant et après votre achat.',
	},
	{
		icon: Heart,
		title: 'Satisfaction',
		description:
			'Votre satisfaction est notre priorité avec une garantie de remboursement 30 jours.',
	},
];

const steps = [
	{
		number: '01',
		title: 'Choisissez votre produit',
		description:
			'Parcourez notre catalogue et sélectionnez la licence dont vous avez besoin.',
		icon: Package,
	},
	{
		number: '02',
		title: 'Passez commande',
		description:
			'Remplissez le formulaire de commande avec vos informations.',
		icon: ShieldCheck,
	},
	{
		number: '03',
		title: 'Effectuez le paiement',
		description: 'Payez en toute sécurité via Orange Money ou MTN MoMo.',
		icon: Zap,
	},
	{
		number: '04',
		title: 'Recevez votre licence',
		description: 'Recevez votre clé de licence par email en quelques minutes.',
		icon: Clock,
	},
];

const AboutPage = () => {
	return (
		<main>
			<Header />

			{/* Hero Section */}
			<section className="relative min-h-[500px] lg:min-h-[600px] flex items-center overflow-hidden">
				{/* Background Image with Overlay */}
				<div
					className="absolute inset-0 bg-cover bg-center bg-no-repeat"
					style={{
						backgroundImage: `url('https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
					}}
				/>
				{/* Dark Overlay */}
				<div className="absolute inset-0 bg-gradient-to-r from-[#0D3A5C]/95 via-[#1D73B3]/85 to-[#1D73B3]/75" />

				{/* Decorative Pattern */}
				<div className="absolute inset-0 opacity-10">
					<div className="absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full" />
					<div className="absolute top-20 left-20 w-24 h-24 border-2 border-white rounded-full" />
					<div className="absolute bottom-10 right-10 w-40 h-40 border-2 border-white rounded-full" />
					<div className="absolute bottom-20 right-24 w-28 h-28 border-2 border-white rounded-full" />
				</div>

				{/* Content */}
				<div className="max-w-7xl mx-auto px-6 relative z-10 py-20">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
						{/* Left - Text */}
						<div>
							{/* Badge */}
							<div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6 border border-white/20">
								<Sparkles size={16} className="text-[#E63946]" />
								<span className="text-sm font-semibold text-white">
									QUI SOMMES-NOUS ?
								</span>
							</div>

							{/* Title */}
							<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
								À propos de{' '}
								<span className="text-[#E63946]">License Sale</span>
							</h1>

							{/* Description */}
							<p className="text-lg lg:text-xl text-white/80 leading-relaxed mb-8">
								Votre partenaire de confiance pour l'achat de licences
								numériques authentiques en Côte d'Ivoire et dans toute l'Afrique
								de l'Ouest. Nous nous engageons à vous fournir des produits de
								qualité au meilleur prix.
							</p>

							{/* CTA Buttons */}
							<div className="flex flex-wrap gap-4">
								<Link
									href="/products"
									className="px-8 py-4 bg-[#E63946] text-white font-bold rounded-2xl hover:bg-[#D62839] transition-all duration-300 hover:scale-105 shadow-lg shadow-[#E63946]/30"
								>
									Découvrir nos produits
								</Link>
								<Link
									href="/contact"
									className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-2xl border border-white/30 hover:bg-white/20 transition-all duration-300"
								>
									Nous contacter
								</Link>
							</div>
						</div>

						{/* Right - Stats Cards */}
						<div className="grid grid-cols-2 gap-4">
							<div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
								<div className="w-12 h-12 bg-[#E63946] rounded-xl flex items-center justify-center mb-4">
									<Users size={24} className="text-white" />
								</div>
								<p className="text-3xl lg:text-4xl font-bold text-white mb-1">
									10K+
								</p>
								<p className="text-sm text-white/70">Clients satisfaits</p>
							</div>

							<div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
								<div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4">
									<Package size={24} className="text-[#1D73B3]" />
								</div>
								<p className="text-3xl lg:text-4xl font-bold text-white mb-1">
									50K+
								</p>
								<p className="text-sm text-white/70">Licences vendues</p>
							</div>

							<div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
								<div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4">
									<Clock size={24} className="text-[#1D73B3]" />
								</div>
								<p className="text-3xl lg:text-4xl font-bold text-white mb-1">
									5 min
								</p>
								<p className="text-sm text-white/70">Livraison moyenne</p>
							</div>

							<div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
								<div className="w-12 h-12 bg-[#E63946] rounded-xl flex items-center justify-center mb-4">
									<Headphones size={24} className="text-white" />
								</div>
								<p className="text-3xl lg:text-4xl font-bold text-white mb-1">
									24/7
								</p>
								<p className="text-sm text-white/70">Support disponible</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Mission & Vision */}
			<section className="py-16 lg:py-20 bg-white">
				<div className="max-w-7xl mx-auto px-6">
					{/* Header */}
					<div className="text-center mb-14">
						<div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1D73B3]/10 rounded-full mb-6">
							<Target size={16} className="text-[#1D73B3]" />
							<span className="text-sm font-semibold text-[#1D73B3]">
								QUI SOMMES-NOUS
							</span>
						</div>
						<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0D3A5C] mb-5">
							Notre Mission & Vision
						</h2>
						<p className="text-lg text-gray-500 max-w-2xl mx-auto">
							Ce qui nous motive et guide nos actions au quotidien
						</p>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
						{/* Mission */}
						<div className="group relative bg-white rounded-3xl p-8 lg:p-10 border-2 border-[#1D73B3]/10 hover:border-[#1D73B3]/30 hover:shadow-2xl hover:shadow-[#1D73B3]/10 transition-all duration-500">
							{/* Decorative line */}
							<div className="absolute top-0 left-10 right-10 h-1 bg-gradient-to-r from-transparent via-[#1D73B3] to-transparent rounded-full" />

							<div className="flex items-center gap-4 mb-6">
								<div className="w-16 h-16 bg-[#1D73B3] rounded-2xl flex items-center justify-center shadow-lg shadow-[#1D73B3]/25 group-hover:scale-110 transition-transform duration-300">
									<Target size={32} className="text-white" />
								</div>
								<div>
									<span className="text-[#1D73B3] text-sm font-semibold">
										01
									</span>
									<h2 className="text-2xl lg:text-3xl font-bold text-[#0D3A5C]">
										Notre Mission
									</h2>
								</div>
							</div>

							<p className="text-gray-600 leading-relaxed mb-8">
								Rendre les logiciels professionnels accessibles à tous en
								proposant des licences authentiques à des prix compétitifs, avec
								une livraison instantanée et un support technique de qualité.
							</p>

							<div className="space-y-3">
								{[
									'Licences 100% officielles',
									'Prix accessibles',
									'Livraison immédiate',
								].map((item, idx) => (
									<div key={idx} className="flex items-center gap-3">
										<div className="w-6 h-6 rounded-lg bg-[#1D73B3]/10 flex items-center justify-center">
											<CheckCircle2 size={14} className="text-[#1D73B3]" />
										</div>
										<span className="text-gray-700 font-medium">{item}</span>
									</div>
								))}
							</div>
						</div>

						{/* Vision */}
						<div className="group relative bg-white rounded-3xl p-8 lg:p-10 border-2 border-[#E63946]/10 hover:border-[#E63946]/30 hover:shadow-2xl hover:shadow-[#E63946]/10 transition-all duration-500">
							{/* Decorative line */}
							<div className="absolute top-0 left-10 right-10 h-1 bg-gradient-to-r from-transparent via-[#E63946] to-transparent rounded-full" />

							<div className="flex items-center gap-4 mb-6">
								<div className="w-16 h-16 bg-[#E63946] rounded-2xl flex items-center justify-center shadow-lg shadow-[#E63946]/25 group-hover:scale-110 transition-transform duration-300">
									<Eye size={32} className="text-white" />
								</div>
								<div>
									<span className="text-[#E63946] text-sm font-semibold">
										02
									</span>
									<h2 className="text-2xl lg:text-3xl font-bold text-[#0D3A5C]">
										Notre Vision
									</h2>
								</div>
							</div>

							<p className="text-gray-600 leading-relaxed mb-8">
								Devenir le leader de la distribution de licences numériques en
								Afrique, en offrant une expérience d'achat simple, sécurisée et
								accessible à tous les professionnels et particuliers.
							</p>

							<div className="space-y-3">
								{[
									'Leader en Afrique',
									'Innovation continue',
									'Satisfaction client',
								].map((item, idx) => (
									<div key={idx} className="flex items-center gap-3">
										<div className="w-6 h-6 rounded-lg bg-[#E63946]/10 flex items-center justify-center">
											<CheckCircle2 size={14} className="text-[#E63946]" />
										</div>
										<span className="text-gray-700 font-medium">{item}</span>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Stats */}
			<section className="py-16 lg:py-20 bg-gray-50">
				<div className="max-w-7xl mx-auto px-6">
					{/* Stats Grid - Simple horizontal layout */}
					<div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 lg:p-12">
						<div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
							{stats.map((stat, index) => {
								const Icon = stat.icon;
								const isBlue = stat.color === 'blue';
								const isLast = index === stats.length - 1;

								return (
									<div
										key={index}
										className={`text-center ${!isLast ? 'lg:border-r lg:border-gray-100' : ''}`}
									>
										{/* Icon */}
										<div
											className={`w-14 h-14 ${isBlue ? 'bg-[#1D73B3]' : 'bg-[#E63946]'} rounded-2xl flex items-center justify-center mx-auto mb-4`}
										>
											<Icon size={26} className="text-white" strokeWidth={2} />
										</div>

										{/* Value */}
										<p
											className={`text-3xl lg:text-4xl font-black ${isBlue ? 'text-[#1D73B3]' : 'text-[#E63946]'} mb-1`}
										>
											{stat.value}
										</p>

										{/* Label */}
										<p className="text-gray-900 font-semibold mb-0.5">
											{stat.label}
										</p>

										{/* Description */}
										<p className="text-sm text-gray-400">{stat.description}</p>
									</div>
								);
							})}
						</div>
					</div>
				</div>
			</section>

			{/* Values */}
			<section className="py-16 lg:py-20 bg-gray-50">
				<div className="max-w-7xl mx-auto px-6">
					<div className="text-center mb-14">
						<div className="inline-flex items-center gap-2 px-4 py-2 bg-[#E63946]/10 rounded-full mb-6">
							<Heart size={16} className="text-[#E63946]" />
							<span className="text-sm font-semibold text-[#E63946]">
								NOS VALEURS
							</span>
						</div>
						<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0D3A5C] mb-5">
							Ce qui nous définit
						</h2>
						<p className="text-lg text-gray-500 max-w-2xl mx-auto">
							Des valeurs fortes qui guident chacune de nos actions
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{values.map((value, index) => {
							const Icon = value.icon;
							const isOdd = index % 2 === 1;

							return (
								<div
									key={index}
									className="group flex items-start gap-5 bg-white rounded-2xl p-7 border border-gray-100 hover:shadow-xl transition-all duration-300"
								>
									{/* Icon */}
									<div
										className={`flex-shrink-0 w-14 h-14 ${isOdd ? 'bg-[#E63946]' : 'bg-[#1D73B3]'} rounded-2xl flex items-center justify-center shadow-lg ${isOdd ? 'shadow-[#E63946]/25' : 'shadow-[#1D73B3]/25'}`}
									>
										<Icon size={26} className="text-white" strokeWidth={2} />
									</div>

									{/* Content */}
									<div className="flex-1 pt-1">
										<h3 className="text-xl font-bold text-[#0D3A5C] mb-2">
											{value.title}
										</h3>
										<p className="text-gray-500 text-sm leading-relaxed">
											{value.description}
										</p>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</section>

			{/* How it works */}
			<section className="py-16 lg:py-20 bg-white">
				<div className="max-w-7xl mx-auto px-6">
					<div className="text-center mb-14">
						<div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1D73B3]/10 rounded-full mb-6">
							<Zap size={16} className="text-[#1D73B3]" />
							<span className="text-sm font-semibold text-[#1D73B3]">
								SIMPLE ET RAPIDE
							</span>
						</div>
						<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0D3A5C] mb-5">
							Comment ça marche ?
						</h2>
						<p className="text-lg text-gray-500 max-w-2xl mx-auto">
							Obtenez votre licence en 4 étapes simples
						</p>
					</div>

					{/* Steps with arrows */}
					<div className="flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-0">
						{steps.map((step, index) => {
							const Icon = step.icon;
							const isLast = index === steps.length - 1;

							return (
								<div key={index} className="flex items-center">
									{/* Step card */}
									<div className="flex flex-col items-center text-center w-56">
										{/* Circle with icon */}
										<div className="relative mb-4">
											<div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center shadow-lg shadow-gray-200/50">
												<Icon size={32} className="text-[#1D73B3]" />
											</div>
											{/* Number badge */}
											<div className="absolute -top-2 -right-2 w-8 h-8 bg-[#E63946] rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md">
												{step.number}
											</div>
										</div>

										{/* Title */}
										<h3 className="text-lg font-bold text-gray-900 mb-2">
											{step.title}
										</h3>

										{/* Description */}
										<p className="text-gray-500 text-sm leading-relaxed">
											{step.description}
										</p>
									</div>

									{/* Arrow */}
									{!isLast && (
										<div className="hidden lg:flex items-center justify-center w-16 mx-2">
											<svg
												width="40"
												height="16"
												viewBox="0 0 40 16"
												fill="none"
												className="text-[#1D73B3]"
											>
												<path
													d="M0 8H36M36 8L28 1M36 8L28 15"
													stroke="currentColor"
													strokeWidth="2"
													strokeLinecap="round"
													strokeLinejoin="round"
												/>
											</svg>
										</div>
									)}

									{/* Mobile arrow (vertical) */}
									{!isLast && (
										<div className="flex lg:hidden items-center justify-center h-8 my-2">
											<svg
												width="16"
												height="24"
												viewBox="0 0 16 24"
												fill="none"
												className="text-[#1D73B3]"
											>
												<path
													d="M8 0V20M8 20L1 12M8 20L15 12"
													stroke="currentColor"
													strokeWidth="2"
													strokeLinecap="round"
													strokeLinejoin="round"
												/>
											</svg>
										</div>
									)}
								</div>
							);
						})}
					</div>
				</div>
			</section>

			<Footer />
		</main>
	);
};

export default AboutPage;
