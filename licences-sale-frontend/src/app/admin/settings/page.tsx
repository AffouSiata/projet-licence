import {
	ArrowRight,
	Lock,
	type LucideIcon,
	SlidersHorizontal,
	User,
} from 'lucide-react';
import Link from 'next/link';

interface SettingCard {
	icon: LucideIcon;
	title: string;
	description: string;
	href?: string;
	cta?: string;
}

const cards: SettingCard[] = [
	{
		icon: User,
		title: 'Profil administrateur',
		description:
			'Gestion du nom et de l’email de l’administrateur (à venir dans le back-office).',
	},
	{
		icon: Lock,
		title: 'Sécurité et accès',
		description:
			'Changement de mot de passe administrateur (à venir dans le back-office).',
	},
	{
		icon: SlidersHorizontal,
		title: 'Paramètres généraux',
		description: 'Réglages globaux de la plateforme (à venir).',
	},
];

const SettingsPage = () => {
	return (
		<div className="p-8">
			<p className="text-gray-500 mb-6">
				Configurez votre profil et les paramètres de la plateforme.
			</p>

			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{cards.map((card) => {
					const Icon = card.icon;
					return (
						<div
							key={card.title}
							className="bg-white rounded-2xl ring-1 ring-gray-200/70 shadow-sm p-6 flex flex-col"
						>
							<div className="w-12 h-12 rounded-xl bg-[#1D73B3]/10 flex items-center justify-center mb-4">
								<Icon size={22} className="text-[#1D73B3]" />
							</div>
							<h2 className="text-base font-bold text-gray-900 mb-1">
								{card.title}
							</h2>
							<p className="text-sm text-gray-500 flex-1">{card.description}</p>

							<div className="mt-5">
								{card.href ? (
									<Link
										href={card.href}
										className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1D73B3] hover:gap-2.5 transition-all"
									>
										{card.cta}
										<ArrowRight size={16} />
									</Link>
								) : (
									<span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold ring-1 ring-amber-200">
										Bientôt disponible
									</span>
								)}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default SettingsPage;
