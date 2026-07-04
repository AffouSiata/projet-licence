import { MessageSquare, Star } from 'lucide-react';
import Link from 'next/link';
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

const STAR_SLOTS = ['s1', 's2', 's3', 's4', 's5'];

const Stars = ({ rating, size = 15 }: { rating: number; size?: number }) => (
	<div className="flex items-center gap-0.5">
		{STAR_SLOTS.map((slot, i) => (
			<Star
				key={slot}
				size={size}
				className={
					i < rating
						? 'fill-amber-400 text-amber-400'
						: 'fill-slate-200 text-slate-200'
				}
			/>
		))}
	</div>
);

export const ProductReviews = ({ reviews }: { reviews: Review[] }) => {
	const count = reviews.length;
	const average =
		count > 0
			? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / count) * 10) /
				10
			: 0;

	return (
		<section className="border-t border-slate-100 bg-white py-14 lg:py-16">
			<div className="mx-auto max-w-5xl px-6 lg:px-8">
				<div className="mb-8 flex flex-wrap items-end justify-between gap-4">
					<div>
						<h2 className="text-2xl font-bold tracking-tight text-[#1B3A5F] lg:text-3xl">
							Avis clients
						</h2>
						{count > 0 ? (
							<div className="mt-2 flex items-center gap-3">
								<Stars rating={Math.round(average)} size={18} />
								<span className="text-[15px] font-semibold text-[#1B3A5F]">
									{average.toLocaleString('fr-FR')} / 5
								</span>
								<span className="text-[13px] text-slate-500">
									({count} avis)
								</span>
							</div>
						) : (
							<p className="mt-2 text-[14px] text-slate-500">
								Aucun avis pour ce produit pour le moment.
							</p>
						)}
					</div>
					<Link
						href="/compte/avis"
						className="inline-flex items-center gap-2 rounded-xl bg-[#1D73B3] px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#1B3A5F]"
					>
						<MessageSquare size={16} />
						Laisser un avis
					</Link>
				</div>

				{count > 0 && (
					<div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
						{reviews.map((r) => (
							<article
								key={r.id}
								className="rounded-2xl border border-slate-200 bg-white p-5"
							>
								<div className="flex items-center gap-3">
									<div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1D73B3]/10 text-[13px] font-bold text-[#1D73B3]">
										{initials(r.authorName)}
									</div>
									<div>
										<p className="text-[14px] font-bold text-[#1B3A5F]">
											{r.authorName}
										</p>
										{(r.authorRole || r.location) && (
											<p className="text-[12px] text-slate-500">
												{[r.authorRole, r.location].filter(Boolean).join(' · ')}
											</p>
										)}
									</div>
								</div>
								<div className="mt-3 flex items-center gap-2">
									<Stars rating={r.rating} />
									<span className="text-[11px] text-slate-400">
										{formatDate(r.createdAt)}
									</span>
								</div>
								<p className="mt-3 text-[13.5px] leading-relaxed text-slate-600">
									{r.comment}
								</p>
							</article>
						))}
					</div>
				)}
			</div>
		</section>
	);
};
