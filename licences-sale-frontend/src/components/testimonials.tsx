'use client';

import { useEffect, useRef, useState } from 'react';
import { Star } from 'lucide-react';

type Review = {
	name: string;
	role: string;
	location: string;
	date: string;
	rating: number;
	comment: string;
	photo: string;
};

const reviews: Review[] = [
	{
		name: 'Amadou Diallo',
		role: 'CEO, TechSolutions',
		location: 'Dakar',
		date: '4 octobre 2026',
		rating: 5,
		comment: 'Service exceptionnel. Livraison instantanée par email.',
		photo: 'https://i.pravatar.cc/200?img=68',
	},
	{
		name: 'Fatou Camara',
		role: 'Designer UI/UX',
		location: 'Abidjan',
		date: '4 août 2026',
		rating: 5,
		comment: 'Adobe Creative Cloud activé en moins de 10 minutes.',
		photo: 'https://i.pravatar.cc/200?img=47',
	},
	{
		name: 'Ibrahim Koné',
		role: 'Admin Système',
		location: 'Bamako',
		date: '11 juin 2026',
		rating: 5,
		comment: 'Excellente plateforme pour acheter ses licences en Afrique.',
		photo: 'https://i.pravatar.cc/200?img=12',
	},
	{
		name: 'Aïcha Touré',
		role: 'Comptable Senior',
		location: 'Conakry',
		date: '30 mars 2026',
		rating: 5,
		comment:
			'Très bon service avec des prix vraiment compétitifs. Je recommande à tous mes collègues.',
		photo: 'https://i.pravatar.cc/200?img=49',
	},
	{
		name: 'Moussa Traoré',
		role: 'Développeur Freelance',
		location: 'Ouagadougou',
		date: '12 février 2026',
		rating: 5,
		comment: 'Très bon support technique et équipe professionnelle.',
		photo: 'https://i.pravatar.cc/200?img=33',
	},
	{
		name: 'Aminata Bah',
		role: 'Responsable IT',
		location: 'Lomé',
		date: '5 décembre 2025',
		rating: 5,
		comment:
			'Plateforme formidable, expérience client au top. Recommandé pour tous les pros du logiciel.',
		photo: 'https://i.pravatar.cc/200?img=44',
	},
];

export const Testimonials = () => {
	const sectionRef = useRef<HTMLElement>(null);
	const [inView, setInView] = useState(false);

	useEffect(() => {
		const el = sectionRef.current;
		if (!el) return;
		const obs = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setInView(true);
					obs.disconnect();
				}
			},
			{ threshold: 0.1, rootMargin: '0px 0px -10% 0px' },
		);
		obs.observe(el);
		return () => obs.disconnect();
	}, []);

	const reveal = (delay = 0) => ({
		className: inView ? 'animate-fade-up' : 'opacity-0',
		style: inView ? { animationDelay: `${delay}ms` } : undefined,
	});

	return (
		<section ref={sectionRef} className="py-20 lg:py-28 bg-slate-50">
			<div className="max-w-7xl mx-auto px-6 lg:px-8">
				{/* Header */}
				<div className="flex items-end justify-between flex-wrap gap-6 mb-12 lg:mb-14">
					<div>
						<div
							className={`inline-flex items-center gap-2 px-3 py-1.5 bg-[#1D73B3]/10 rounded-full mb-5 ${reveal(0).className}`}
							style={reveal(0).style}
						>
							<Star size={14} className="text-[#1D73B3]" />
							<span className="text-[12px] font-semibold text-[#1D73B3] tracking-wider uppercase">
								Avis clients
							</span>
						</div>
						<h2
							className={`text-3xl md:text-4xl lg:text-[44px] font-bold text-[#1B3A5F] leading-[1.1] tracking-tight ${reveal(80).className}`}
							style={reveal(80).style}
						>
							Ce que nos clients disent de nous
						</h2>
					</div>
				</div>

				{/* Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
					{reviews.map((r, i) => (
						<article
							key={r.name}
							className={`relative bg-white rounded-2xl shadow-[0_10px_40px_-15px_rgba(15,42,71,0.18)] hover:shadow-[0_18px_50px_-15px_rgba(15,42,71,0.28)] transition-shadow duration-300 px-6 pt-8 pb-7 flex flex-col items-center text-center ${reveal(240 + i * 90).className}`}
							style={reveal(240 + i * 90).style}
						>
							{/* Avatar */}
							<img
								src={r.photo}
								alt={r.name}
								loading="lazy"
								width={64}
								height={64}
								className="w-16 h-16 rounded-full object-cover ring-4 ring-white shadow-md mb-4 bg-slate-200"
							/>

							{/* Name */}
							<h3 className="text-[16px] font-bold text-[#1B3A5F] leading-tight">
								{r.name}
							</h3>

							{/* Role · location */}
							<p className="mt-1 text-[12px] text-slate-500">
								{r.role} · {r.location}
							</p>

							{/* Stars */}
							<div className="mt-3 flex items-center gap-0.5">
								{Array.from({ length: 5 }).map((_, s) => (
									<Star
										key={s}
										size={15}
										className={
											s < r.rating
												? 'fill-amber-400 text-amber-400'
												: 'fill-slate-200 text-slate-200'
										}
									/>
								))}
							</div>

							{/* Date */}
							<p className="mt-2 text-[11px] text-slate-400">{r.date}</p>

							{/* Comment */}
							<p className="mt-4 text-[13.5px] leading-relaxed text-slate-600">
								{r.comment}
							</p>
						</article>
					))}
				</div>
			</div>
		</section>
	);
};
