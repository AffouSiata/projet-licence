'use client';

import { Star } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { Review } from '~/validators/reviews';

const initials = (name: string) =>
	name
		.trim()
		.split(/\s+/)
		.slice(0, 2)
		.map((w) => w[0]?.toUpperCase() ?? '')
		.join('');

const formatDate = (iso: string) => {
	try {
		return new Intl.DateTimeFormat('fr-FR', {
			day: 'numeric',
			month: 'long',
			year: 'numeric',
		}).format(new Date(iso));
	} catch {
		return '';
	}
};

export const Testimonials = ({ reviews }: { reviews: Review[] }) => {
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
							key={r.id}
							className={`relative bg-white rounded-2xl shadow-[0_10px_40px_-15px_rgba(15,42,71,0.18)] hover:shadow-[0_18px_50px_-15px_rgba(15,42,71,0.28)] transition-shadow duration-300 px-6 pt-8 pb-7 flex flex-col items-center text-center ${reveal(240 + i * 90).className}`}
							style={reveal(240 + i * 90).style}
						>
							{/* Avatar (initiales) */}
							<div className="w-16 h-16 rounded-full ring-4 ring-white shadow-md mb-4 flex items-center justify-center bg-[#1D73B3]/10 text-[#1D73B3] font-bold text-lg">
								{initials(r.authorName)}
							</div>

							{/* Name */}
							<h3 className="text-[16px] font-bold text-[#1B3A5F] leading-tight">
								{r.authorName}
							</h3>

							{/* Role · location */}
							{(r.authorRole || r.location) && (
								<p className="mt-1 text-[12px] text-slate-500">
									{[r.authorRole, r.location].filter(Boolean).join(' · ')}
								</p>
							)}

							{/* Stars */}
							<div className="mt-3 flex items-center gap-0.5">
								{Array.from({ length: 5 }).map((_, s) => (
									<Star
										key={`${r.id}-star-${s}`}
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
							<p className="mt-2 text-[11px] text-slate-400">
								{formatDate(r.createdAt)}
							</p>

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
