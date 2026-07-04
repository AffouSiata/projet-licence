import { BadgeCheck, Lock, Mail, MessageCircle, Star } from 'lucide-react';

const badges = [
	{ icon: Mail, label: 'Livraison par email' },
	{ icon: BadgeCheck, label: 'Licences officielles' },
	{ icon: Lock, label: 'Paiement sécurisé' },
	{ icon: MessageCircle, label: 'Support 7j/7' },
];

// Affiché à la place des témoignages tant qu'aucun avis client n'a été publié.
// Distinct de la section « Nos avantages » : bandeau compact de réassurance.
export const TrustSection = () => {
	return (
		<section className="py-16 lg:py-20 bg-slate-50">
			<div className="max-w-5xl mx-auto px-6 lg:px-8">
				<div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1B3A5F] to-[#1D73B3] px-8 py-12 lg:px-14 lg:py-14 text-center shadow-[0_20px_60px_-20px_rgba(15,42,71,0.45)]">
					<div
						aria-hidden
						className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/5 blur-3xl"
					/>
					<div className="relative">
						<div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 ring-1 ring-white/20 rounded-full mb-6">
							<Star size={14} className="text-amber-300" />
							<span className="text-[12px] font-semibold text-white tracking-wider uppercase">
								La confiance, notre priorité
							</span>
						</div>

						<h2 className="text-2xl md:text-3xl lg:text-[38px] font-bold text-white leading-[1.15] tracking-tight">
							Une boutique pensée pour votre sérénité
						</h2>
						<p className="mt-4 max-w-2xl mx-auto text-[14.5px] leading-relaxed text-white/75">
							Vos premières commandes ouvriront cet espace aux avis clients. En
							attendant, voici nos engagements sur chaque licence vendue.
						</p>

						<div className="mt-9 grid grid-cols-2 sm:grid-cols-4 gap-4">
							{badges.map(({ icon: Icon, label }) => (
								<div
									key={label}
									className="flex flex-col items-center gap-3 rounded-2xl bg-white/8 ring-1 ring-white/15 backdrop-blur-sm px-4 py-5"
								>
									<div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/12">
										<Icon size={20} className="text-white" />
									</div>
									<span className="text-[12.5px] font-medium text-white/90 leading-tight">
										{label}
									</span>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};
