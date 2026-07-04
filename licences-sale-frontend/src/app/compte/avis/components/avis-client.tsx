'use client';

import { Send, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { createReviewAction } from '../actions';

export const AvisClient = () => {
	const router = useRouter();
	const [rating, setRating] = useState(5);
	const [hover, setHover] = useState(0);
	const [comment, setComment] = useState('');
	const [role, setRole] = useState('');
	const [location, setLocation] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState('');
	const [done, setDone] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');

		if (comment.trim().length < 10) {
			setError('Votre avis doit contenir au moins 10 caractères.');
			return;
		}

		setIsSubmitting(true);
		const result = await createReviewAction({
			rating,
			comment: comment.trim(),
			authorRole: role.trim() || undefined,
			location: location.trim() || undefined,
		});
		setIsSubmitting(false);

		if (result.success) {
			setDone(true);
			setComment('');
			setRole('');
			setLocation('');
			setRating(5);
			toast.success('Merci ! Votre avis a été envoyé.');
			router.refresh();
		} else {
			setError(result.error || "Erreur lors de l'envoi de votre avis.");
		}
	};

	if (done) {
		return (
			<div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
				<div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500">
					<Star size={26} className="fill-white text-white" />
				</div>
				<h2 className="text-xl font-bold text-[#1B3A5F]">
					Merci pour votre avis !
				</h2>
				<p className="mx-auto mt-2 max-w-md text-[14px] text-slate-600">
					Votre avis a bien été envoyé. Il sera publié sur le site après
					validation par notre équipe.
				</p>
				<button
					type="button"
					onClick={() => setDone(false)}
					className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#1D73B3] px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#1B3A5F]"
				>
					Laisser un autre avis
				</button>
			</div>
		);
	}

	return (
		<form
			onSubmit={handleSubmit}
			className="rounded-2xl border border-slate-200 bg-white p-6 lg:p-8"
		>
			{/* Note */}
			<span className="block text-[13px] font-semibold text-[#1B3A5F]">
				Votre note
			</span>
			<div className="mt-2 flex items-center gap-1">
				{Array.from({ length: 5 }).map((_, i) => {
					const value = i + 1;
					const active = value <= (hover || rating);
					return (
						<button
							key={`rate-${value}`}
							type="button"
							onClick={() => setRating(value)}
							onMouseEnter={() => setHover(value)}
							onMouseLeave={() => setHover(0)}
							aria-label={`${value} étoile${value > 1 ? 's' : ''}`}
							className="p-1"
						>
							<Star
								size={28}
								className={
									active
										? 'fill-amber-400 text-amber-400'
										: 'fill-slate-200 text-slate-200'
								}
							/>
						</button>
					);
				})}
			</div>

			{/* Commentaire */}
			<label
				htmlFor="comment"
				className="mt-6 block text-[13px] font-semibold text-[#1B3A5F]"
			>
				Votre avis
			</label>
			<textarea
				id="comment"
				value={comment}
				onChange={(e) => setComment(e.target.value)}
				rows={4}
				maxLength={500}
				placeholder="Partagez votre expérience (livraison, activation, support…)"
				className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-[14px] text-slate-700 outline-none transition-colors focus:border-[#1D73B3] focus:ring-2 focus:ring-[#1D73B3]/15"
			/>
			<p className="mt-1 text-right text-[11px] text-slate-400">
				{comment.length}/500
			</p>

			{/* Rôle + ville (optionnels) */}
			<div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
				<div>
					<label
						htmlFor="role"
						className="block text-[13px] font-semibold text-[#1B3A5F]"
					>
						Votre fonction <span className="text-slate-400">(optionnel)</span>
					</label>
					<input
						id="role"
						value={role}
						onChange={(e) => setRole(e.target.value)}
						maxLength={60}
						placeholder="Ex : Designer, Responsable IT…"
						className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-[14px] text-slate-700 outline-none transition-colors focus:border-[#1D73B3] focus:ring-2 focus:ring-[#1D73B3]/15"
					/>
				</div>
				<div>
					<label
						htmlFor="location"
						className="block text-[13px] font-semibold text-[#1B3A5F]"
					>
						Votre ville <span className="text-slate-400">(optionnel)</span>
					</label>
					<input
						id="location"
						value={location}
						onChange={(e) => setLocation(e.target.value)}
						maxLength={60}
						placeholder="Ex : Abidjan, Dakar…"
						className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-[14px] text-slate-700 outline-none transition-colors focus:border-[#1D73B3] focus:ring-2 focus:ring-[#1D73B3]/15"
					/>
				</div>
			</div>

			{error && (
				<p className="mt-4 rounded-lg bg-red-50 px-4 py-2.5 text-[13px] text-red-600">
					{error}
				</p>
			)}

			<button
				type="submit"
				disabled={isSubmitting}
				className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1D73B3] text-[14px] font-semibold text-white transition-colors hover:bg-[#1B3A5F] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-8"
			>
				<Send size={16} />
				{isSubmitting ? 'Envoi…' : 'Envoyer mon avis'}
			</button>
		</form>
	);
};
