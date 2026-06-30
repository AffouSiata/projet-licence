'use client';

import { Mail, Pencil, User, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { updateProfileAction } from '../actions';

interface ProfilUser {
	name: string;
	email: string;
	role: string;
	createdAt: string;
}

interface ProfilClientProps {
	user: ProfilUser;
}

export const ProfilClient = ({ user }: ProfilClientProps) => {
	const router = useRouter();
	const [editing, setEditing] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState('');
	const [form, setForm] = useState({ name: user.name, email: user.email });

	const memberSince = new Date(user.createdAt).toLocaleDateString('fr-FR', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	});

	const startEditing = () => {
		setForm({ name: user.name, email: user.email });
		setError('');
		setEditing(true);
	};

	const cancelEditing = () => {
		setForm({ name: user.name, email: user.email });
		setError('');
		setEditing(false);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');

		if (form.name.trim().length < 2) {
			setError('Le nom doit contenir au moins 2 caractères.');
			return;
		}
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
			setError('Adresse email invalide.');
			return;
		}

		setIsSubmitting(true);
		const result = await updateProfileAction({
			name: form.name.trim(),
			email: form.email.trim(),
		});
		setIsSubmitting(false);

		if (result.success) {
			setEditing(false);
			toast.success('Profil mis à jour');
			router.refresh();
		} else {
			setError(result.error || 'Erreur lors de la mise à jour du profil.');
		}
	};

	return (
		<div className="max-w-4xl mx-auto px-6 py-8">
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* Sidebar - Avatar */}
				<div className="lg:col-span-1">
					<div className="bg-white rounded-2xl shadow-lg p-6">
						<div className="text-center">
							<div className="relative inline-block mb-4">
								<div className="w-32 h-32 bg-gradient-to-br from-[#1D70B8] to-[#3B9DE8] rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg">
									{user.name.charAt(0).toUpperCase()}
								</div>
							</div>
							<h3 className="text-xl font-bold text-gray-800 mb-1">
								{user.name}
							</h3>
							<p className="text-gray-500 text-sm mb-4">{user.email}</p>
							<div className="px-4 py-2 bg-blue-50 text-[#1D70B8] rounded-lg text-sm font-semibold inline-block">
								{user.role === 'ADMIN' || user.role === 'SUPER_ADMIN'
									? 'Administrateur'
									: 'Membre'}
							</div>
						</div>

						<div className="mt-6 pt-6 border-t border-gray-100">
							<div className="space-y-3">
								<div className="flex items-center gap-3 text-sm">
									<div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
										<Mail size={14} className="text-[#1D70B8]" />
									</div>
									<div className="flex-1 min-w-0">
										<div className="text-xs text-gray-500">Email</div>
										<div className="font-medium text-gray-800 truncate">
											{user.email}
										</div>
									</div>
								</div>
								<div className="flex items-center gap-3 text-sm">
									<div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
										<User size={14} className="text-gray-600" />
									</div>
									<div className="flex-1">
										<div className="text-xs text-gray-500">Nom complet</div>
										<div className="font-medium text-gray-800">{user.name}</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Main Form */}
				<div className="lg:col-span-2">
					<form
						onSubmit={handleSubmit}
						className="bg-white rounded-2xl shadow-lg p-6"
					>
						<div className="flex items-center justify-between mb-6">
							<h2 className="text-xl font-bold text-gray-800">
								Informations personnelles
							</h2>
							{!editing && (
								<button
									type="button"
									onClick={startEditing}
									className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#1D70B8] bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
								>
									<Pencil size={16} />
									Modifier
								</button>
							)}
						</div>

						{error && (
							<div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
								{error}
							</div>
						)}

						<div className="space-y-6">
							{/* Nom */}
							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-2">
									Nom complet
								</label>
								<div className="relative">
									<User
										size={18}
										className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
									/>
									<input
										type="text"
										value={editing ? form.name : user.name}
										onChange={(e) =>
											setForm((prev) => ({ ...prev, name: e.target.value }))
										}
										disabled={!editing}
										className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl outline-none transition-all ${
											editing
												? 'bg-white border-gray-200 focus:border-[#1D70B8]'
												: 'bg-gray-50 border-gray-200 opacity-75 cursor-not-allowed'
										}`}
									/>
								</div>
							</div>

							{/* Email */}
							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-2">
									Adresse email
								</label>
								<div className="relative">
									<Mail
										size={18}
										className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
									/>
									<input
										type="email"
										value={editing ? form.email : user.email}
										onChange={(e) =>
											setForm((prev) => ({ ...prev, email: e.target.value }))
										}
										disabled={!editing}
										className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl outline-none transition-all ${
											editing
												? 'bg-white border-gray-200 focus:border-[#1D70B8]'
												: 'bg-gray-50 border-gray-200 opacity-75 cursor-not-allowed'
										}`}
									/>
								</div>
							</div>

							{/* Membre depuis (toujours en lecture seule) */}
							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-2">
									Membre depuis
								</label>
								<input
									type="text"
									value={memberSince}
									disabled
									className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl outline-none opacity-75 cursor-not-allowed"
								/>
							</div>
						</div>

						{editing && (
							<div className="flex gap-3 mt-6">
								<button
									type="submit"
									disabled={isSubmitting}
									className="flex-1 px-6 py-3 bg-gradient-to-r from-[#1D70B8] to-[#3B9DE8] hover:from-[#0D3A5C] hover:to-[#1558A0] text-white rounded-xl font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
								>
									{isSubmitting ? (
										<>
											<div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
											Enregistrement...
										</>
									) : (
										'Enregistrer les modifications'
									)}
								</button>
								<button
									type="button"
									onClick={cancelEditing}
									disabled={isSubmitting}
									className="px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all disabled:opacity-50 flex items-center gap-2"
								>
									<X size={18} />
									Annuler
								</button>
							</div>
						)}
					</form>

					{/* Sécurité */}
					<div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
						<h2 className="text-xl font-bold text-gray-800 mb-4">Sécurité</h2>
						<p className="text-gray-600 mb-4">
							Protégez votre compte en modifiant votre mot de passe
							régulièrement.
						</p>
						<Link
							href="/compte/securite"
							className="inline-flex items-center gap-2 px-6 py-3 bg-[#1D70B8] text-white font-semibold rounded-xl hover:bg-[#0D3A5C] transition-colors"
						>
							Modifier mon mot de passe
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};
