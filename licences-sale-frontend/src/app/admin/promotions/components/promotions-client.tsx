'use client';

import { BadgePercent, Pencil, Plus, Power, Trash2, X } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { handleActionError } from '~/lib/action-error';
import type { Promotion } from '~/validators/promotions';
import {
	createPromotionAction,
	deletePromotionAction,
	togglePromotionAction,
	updatePromotionAction,
} from '../actions';

const inputClass =
	'w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#1D73B3] focus:ring-2 focus:ring-[#1D73B3]/20 transition-all outline-none';

const fmtValue = (p: Promotion) =>
	p.type === 'PERCENTAGE'
		? `${Number(p.value)} %`
		: `${Number(p.value).toLocaleString('fr-FR')} F`;

export const PromotionsClient = ({
	initialPromotions,
}: {
	initialPromotions: Promotion[];
}) => {
	const router = useRouter();
	const [isOpen, setIsOpen] = useState(false);
	const [editing, setEditing] = useState<Promotion | null>(null);
	const [busyId, setBusyId] = useState<string | null>(null);

	const [code, setCode] = useState('');
	const [description, setDescription] = useState('');
	const [type, setType] = useState<'PERCENTAGE' | 'FIXED'>('PERCENTAGE');
	const [value, setValue] = useState('');
	const [minAmount, setMinAmount] = useState('');
	const [maxUses, setMaxUses] = useState('');
	const [isActive, setIsActive] = useState(true);

	const openCreate = () => {
		setEditing(null);
		setCode('');
		setDescription('');
		setType('PERCENTAGE');
		setValue('');
		setMinAmount('');
		setMaxUses('');
		setIsActive(true);
		setIsOpen(true);
	};

	const openEdit = (p: Promotion) => {
		setEditing(p);
		setCode(p.code);
		setDescription(p.description ?? '');
		setType(p.type);
		setValue(String(Number(p.value)));
		setMinAmount(p.minAmount != null ? String(Number(p.minAmount)) : '');
		setMaxUses(p.maxUses != null ? String(p.maxUses) : '');
		setIsActive(p.isActive);
		setIsOpen(true);
	};

	const onDone = (msg: string) => {
		toast.success(msg);
		setIsOpen(false);
		router.refresh();
	};

	const { execute: create, isExecuting: creating } = useAction(
		createPromotionAction,
		{
			onSuccess: ({ data }) => {
				if (data?.success) onDone('Code promo créé');
				else if (data?.error) toast.error(data.error);
			},
			onError: handleActionError,
		},
	);
	const { execute: update, isExecuting: updating } = useAction(
		updatePromotionAction,
		{
			onSuccess: ({ data }) => {
				if (data?.success) onDone('Code promo modifié');
				else if (data?.error) toast.error(data.error);
			},
			onError: handleActionError,
		},
	);

	const submit = (e: React.FormEvent) => {
		e.preventDefault();
		const payload = {
			code: code.trim(),
			description: description.trim() || undefined,
			type,
			value: Number(value),
			minAmount: minAmount ? Number(minAmount) : undefined,
			maxUses: maxUses ? Number(maxUses) : undefined,
			isActive,
		};
		if (editing) update({ ...payload, id: editing.id });
		else create(payload);
	};

	const runRow = async (
		id: string,
		fn: (arg: {
			id: string;
		}) => Promise<{ data?: { success?: boolean; error?: string } }>,
		msg: string,
	) => {
		setBusyId(id);
		try {
			const result = await fn({ id });
			if (result?.data?.success) {
				toast.success(msg);
				router.refresh();
			} else {
				toast.error(result?.data?.error || 'Une erreur est survenue.');
			}
		} catch {
			toast.error('Une erreur est survenue.');
		} finally {
			setBusyId(null);
		}
	};

	return (
		<div>
			<div className="mb-6 flex justify-end">
				<button
					type="button"
					onClick={openCreate}
					className="inline-flex items-center gap-2 rounded-xl bg-[#1D73B3] px-4 py-2.5 font-semibold text-white transition-colors hover:bg-[#1B3A5F]"
				>
					<Plus size={18} />
					Créer un code promo
				</button>
			</div>

			{initialPromotions.length === 0 ? (
				<div className="rounded-2xl bg-white py-16 text-center ring-1 ring-gray-200/70">
					<BadgePercent size={40} className="mx-auto mb-3 text-gray-300" />
					<p className="text-[15px] font-semibold text-[#1B3A5F]">
						Aucun code promo
					</p>
					<p className="mt-1 text-[13px] text-gray-500">
						Créez votre premier code pour offrir des réductions.
					</p>
				</div>
			) : (
				<div className="overflow-x-auto rounded-2xl bg-white ring-1 ring-gray-200/70">
					<table className="w-full min-w-[720px] text-left">
						<thead className="border-b border-gray-100 text-[12px] uppercase tracking-wide text-gray-400">
							<tr>
								<th className="px-5 py-3">Code</th>
								<th className="px-5 py-3">Valeur</th>
								<th className="px-5 py-3">Min. panier</th>
								<th className="px-5 py-3">Utilisations</th>
								<th className="px-5 py-3">Statut</th>
								<th className="px-5 py-3 text-right">Actions</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-50">
							{initialPromotions.map((p) => (
								<tr key={p.id} className="text-[13.5px]">
									<td className="px-5 py-4">
										<span className="rounded-md bg-slate-100 px-2 py-1 font-mono font-bold text-[#1B3A5F]">
											{p.code}
										</span>
										{p.description && (
											<p className="mt-1 text-[12px] text-gray-400">
												{p.description}
											</p>
										)}
									</td>
									<td className="px-5 py-4 font-semibold text-[#1B3A5F]">
										{fmtValue(p)}
									</td>
									<td className="px-5 py-4 text-gray-600">
										{p.minAmount != null
											? `${Number(p.minAmount).toLocaleString('fr-FR')} F`
											: '—'}
									</td>
									<td className="px-5 py-4 text-gray-600">
										{p.usedCount}
										{p.maxUses != null ? ` / ${p.maxUses}` : ''}
									</td>
									<td className="px-5 py-4">
										<span
											className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
												p.isActive
													? 'bg-emerald-50 text-emerald-600'
													: 'bg-gray-100 text-gray-500'
											}`}
										>
											{p.isActive ? 'Actif' : 'Inactif'}
										</span>
									</td>
									<td className="px-5 py-4">
										<div className="flex items-center justify-end gap-1.5">
											<button
												type="button"
												disabled={busyId === p.id}
												onClick={() =>
													runRow(
														p.id,
														togglePromotionAction,
														p.isActive ? 'Désactivé' : 'Activé',
													)
												}
												aria-label="Activer/désactiver"
												className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 disabled:opacity-50"
											>
												<Power size={15} />
											</button>
											<button
												type="button"
												onClick={() => openEdit(p)}
												aria-label="Modifier"
												className="rounded-lg p-2 text-[#1D73B3] transition-colors hover:bg-blue-50"
											>
												<Pencil size={15} />
											</button>
											<button
												type="button"
												disabled={busyId === p.id}
												onClick={() =>
													runRow(p.id, deletePromotionAction, 'Supprimé')
												}
												aria-label="Supprimer"
												className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50 disabled:opacity-50"
											>
												<Trash2 size={15} />
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}

			{isOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
					<button
						type="button"
						aria-label="Fermer"
						onClick={() => setIsOpen(false)}
						className="absolute inset-0 bg-black/40"
					/>
					<div className="relative z-10 w-full max-w-lg rounded-2xl bg-white shadow-xl">
						<div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
							<h2 className="text-lg font-bold text-[#1B3A5F]">
								{editing ? 'Modifier le code promo' : 'Nouveau code promo'}
							</h2>
							<button
								type="button"
								onClick={() => setIsOpen(false)}
								className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100"
							>
								<X size={18} />
							</button>
						</div>
						<form onSubmit={submit} className="space-y-4 p-6">
							<div>
								<label
									htmlFor="promo-code"
									className="mb-1.5 block text-[13px] font-semibold text-[#1B3A5F]"
								>
									Code *
								</label>
								<input
									id="promo-code"
									value={code}
									onChange={(e) => setCode(e.target.value.toUpperCase())}
									placeholder="Ex : PROMO10"
									required
									className={`${inputClass} font-mono uppercase`}
								/>
							</div>
							<div>
								<label
									htmlFor="promo-desc"
									className="mb-1.5 block text-[13px] font-semibold text-[#1B3A5F]"
								>
									Description
								</label>
								<input
									id="promo-desc"
									value={description}
									onChange={(e) => setDescription(e.target.value)}
									placeholder="Ex : 10% sur tout le catalogue"
									className={inputClass}
								/>
							</div>
							<div className="grid grid-cols-2 gap-4">
								<div>
									<label
										htmlFor="promo-type"
										className="mb-1.5 block text-[13px] font-semibold text-[#1B3A5F]"
									>
										Type *
									</label>
									<select
										id="promo-type"
										value={type}
										onChange={(e) =>
											setType(e.target.value as 'PERCENTAGE' | 'FIXED')
										}
										className={inputClass}
									>
										<option value="PERCENTAGE">Pourcentage (%)</option>
										<option value="FIXED">Montant fixe (F)</option>
									</select>
								</div>
								<div>
									<label
										htmlFor="promo-value"
										className="mb-1.5 block text-[13px] font-semibold text-[#1B3A5F]"
									>
										Valeur *
									</label>
									<input
										id="promo-value"
										type="number"
										step="0.01"
										min="0"
										value={value}
										onChange={(e) => setValue(e.target.value)}
										placeholder={type === 'PERCENTAGE' ? '10' : '5000'}
										required
										className={inputClass}
									/>
								</div>
							</div>
							<div className="grid grid-cols-2 gap-4">
								<div>
									<label
										htmlFor="promo-min"
										className="mb-1.5 block text-[13px] font-semibold text-[#1B3A5F]"
									>
										Min. panier (F)
									</label>
									<input
										id="promo-min"
										type="number"
										min="0"
										value={minAmount}
										onChange={(e) => setMinAmount(e.target.value)}
										placeholder="Optionnel"
										className={inputClass}
									/>
								</div>
								<div>
									<label
										htmlFor="promo-max"
										className="mb-1.5 block text-[13px] font-semibold text-[#1B3A5F]"
									>
										Utilisations max
									</label>
									<input
										id="promo-max"
										type="number"
										min="1"
										value={maxUses}
										onChange={(e) => setMaxUses(e.target.value)}
										placeholder="Illimité"
										className={inputClass}
									/>
								</div>
							</div>
							<label className="flex items-center gap-2 text-[14px] text-[#1B3A5F]">
								<input
									type="checkbox"
									checked={isActive}
									onChange={(e) => setIsActive(e.target.checked)}
									className="h-4 w-4"
								/>
								Actif
							</label>

							<div className="flex justify-end gap-3 pt-2">
								<button
									type="button"
									onClick={() => setIsOpen(false)}
									className="rounded-xl border border-gray-200 px-5 py-2.5 text-[13px] font-semibold text-gray-600 hover:bg-gray-50"
								>
									Annuler
								</button>
								<button
									type="submit"
									disabled={creating || updating}
									className="rounded-xl bg-[#1D73B3] px-6 py-2.5 text-[13px] font-semibold text-white hover:bg-[#1B3A5F] disabled:opacity-60"
								>
									{editing ? 'Enregistrer' : 'Créer'}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};
