'use client';

import { Check, EyeOff, Inbox, Star, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import type { Review } from '~/validators/reviews';
import {
	approveReviewAction,
	deleteReviewAction,
	rejectReviewAction,
} from '../actions';

type Filter = 'pending' | 'published' | 'all';

const formatDate = (iso: string) => {
	try {
		return new Intl.DateTimeFormat('fr-FR', {
			day: 'numeric',
			month: 'short',
			year: 'numeric',
		}).format(new Date(iso));
	} catch {
		return '';
	}
};

export const ReviewsClient = ({
	initialReviews,
}: {
	initialReviews: Review[];
}) => {
	const router = useRouter();
	const [filter, setFilter] = useState<Filter>('pending');
	const [busyId, setBusyId] = useState<string | null>(null);

	const pending = initialReviews.filter((r) => !r.isApproved);
	const published = initialReviews.filter((r) => r.isApproved);
	const shown =
		filter === 'pending'
			? pending
			: filter === 'published'
				? published
				: initialReviews;

	const run = async (
		id: string,
		fn: (id: string) => Promise<{ success: boolean; error?: string }>,
		okMessage: string,
	) => {
		setBusyId(id);
		const result = await fn(id);
		setBusyId(null);
		if (result.success) {
			toast.success(okMessage);
			router.refresh();
		} else {
			toast.error(result.error || 'Une erreur est survenue.');
		}
	};

	const tabs: Array<{ key: Filter; label: string; count: number }> = [
		{ key: 'pending', label: 'En attente', count: pending.length },
		{ key: 'published', label: 'Publiés', count: published.length },
		{ key: 'all', label: 'Tous', count: initialReviews.length },
	];

	return (
		<div>
			{/* Filtres */}
			<div className="mb-6 flex flex-wrap items-center gap-2">
				{tabs.map((t) => (
					<button
						key={t.key}
						type="button"
						onClick={() => setFilter(t.key)}
						className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-semibold transition-colors ${
							filter === t.key
								? 'bg-[#1D73B3] text-white'
								: 'bg-gray-100 text-gray-600 hover:bg-gray-200'
						}`}
					>
						{t.label}
						<span
							className={`rounded-full px-2 py-0.5 text-[11px] ${
								filter === t.key ? 'bg-white/20' : 'bg-white'
							}`}
						>
							{t.count}
						</span>
					</button>
				))}
			</div>

			{shown.length === 0 ? (
				<div className="rounded-2xl bg-white py-16 text-center ring-1 ring-gray-200/70">
					<Inbox size={40} className="mx-auto mb-3 text-gray-300" />
					<p className="text-[15px] font-semibold text-[#1B3A5F]">
						Aucun avis {filter === 'pending' ? 'en attente' : ''}
					</p>
					<p className="mt-1 text-[13px] text-gray-500">
						Les avis soumis par les clients apparaîtront ici.
					</p>
				</div>
			) : (
				<div className="space-y-4">
					{shown.map((r) => (
						<div
							key={r.id}
							className="rounded-2xl bg-white p-5 ring-1 ring-gray-200/70 lg:p-6"
						>
							<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
								<div className="min-w-0">
									<div className="flex flex-wrap items-center gap-2">
										<span className="text-[15px] font-bold text-[#1B3A5F]">
											{r.authorName}
										</span>
										{(r.authorRole || r.location) && (
											<span className="text-[12px] text-gray-400">
												{[r.authorRole, r.location].filter(Boolean).join(' · ')}
											</span>
										)}
										<span
											className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
												r.isApproved
													? 'bg-emerald-50 text-emerald-600'
													: 'bg-amber-50 text-amber-600'
											}`}
										>
											{r.isApproved ? 'Publié' : 'En attente'}
										</span>
									</div>

									<div className="mt-2 flex items-center gap-0.5">
										{Array.from({ length: 5 }).map((_, s) => (
											<Star
												key={`${r.id}-s-${s}`}
												size={14}
												className={
													s < r.rating
														? 'fill-amber-400 text-amber-400'
														: 'fill-gray-200 text-gray-200'
												}
											/>
										))}
										<span className="ml-2 text-[11px] text-gray-400">
											{formatDate(r.createdAt)}
										</span>
									</div>

									<p className="mt-3 text-[13.5px] leading-relaxed text-gray-600">
										{r.comment}
									</p>
								</div>

								{/* Actions */}
								<div className="flex shrink-0 items-center gap-2">
									{r.isApproved ? (
										<button
											type="button"
											disabled={busyId === r.id}
											onClick={() =>
												run(r.id, rejectReviewAction, 'Avis masqué')
											}
											className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-2 text-[12.5px] font-semibold text-gray-600 transition-colors hover:bg-gray-200 disabled:opacity-50"
										>
											<EyeOff size={15} />
											Masquer
										</button>
									) : (
										<button
											type="button"
											disabled={busyId === r.id}
											onClick={() =>
												run(r.id, approveReviewAction, 'Avis publié')
											}
											className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-2 text-[12.5px] font-semibold text-white transition-colors hover:bg-emerald-600 disabled:opacity-50"
										>
											<Check size={15} />
											Approuver
										</button>
									)}
									<button
										type="button"
										disabled={busyId === r.id}
										onClick={() =>
											run(r.id, deleteReviewAction, 'Avis supprimé')
										}
										aria-label="Supprimer"
										className="inline-flex items-center justify-center rounded-lg bg-red-50 p-2 text-red-500 transition-colors hover:bg-red-100 disabled:opacity-50"
									>
										<Trash2 size={15} />
									</button>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};
