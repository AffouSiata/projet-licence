'use client';

import {
	AlertCircle,
	Check,
	ChevronLeft,
	Eye,
	EyeOff,
	Key,
	Lock,
	Shield,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Footer } from '~/components/footer';
import { Header } from '~/components/header';
import { changePasswordAction } from './actions';

export default function SecuritePage() {
	const [showCurrentPassword, setShowCurrentPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState('');

	const [formData, setFormData] = useState({
		currentPassword: '',
		newPassword: '',
		confirmPassword: '',
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
		setError('');
	};

	const validatePassword = (password: string) => {
		if (password.length < 8) {
			return 'Le mot de passe doit contenir au moins 8 caractères';
		}
		if (!/[A-Z]/.test(password)) {
			return 'Le mot de passe doit contenir au moins une majuscule';
		}
		if (!/[a-z]/.test(password)) {
			return 'Le mot de passe doit contenir au moins une minuscule';
		}
		if (!/[0-9]/.test(password)) {
			return 'Le mot de passe doit contenir au moins un chiffre';
		}
		return null;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');

		// Validations
		if (!formData.currentPassword) {
			setError('Veuillez entrer votre mot de passe actuel');
			return;
		}

		const passwordError = validatePassword(formData.newPassword);
		if (passwordError) {
			setError(passwordError);
			return;
		}

		if (formData.newPassword !== formData.confirmPassword) {
			setError('Les mots de passe ne correspondent pas');
			return;
		}

		if (formData.currentPassword === formData.newPassword) {
			setError("Le nouveau mot de passe doit être différent de l'ancien");
			return;
		}

		setIsSubmitting(true);

		const result = await changePasswordAction({
			currentPassword: formData.currentPassword,
			newPassword: formData.newPassword,
		});

		setIsSubmitting(false);

		if (result.success) {
			setSuccess(true);
			setFormData({
				currentPassword: '',
				newPassword: '',
				confirmPassword: '',
			});
			setTimeout(() => setSuccess(false), 5000);
		} else {
			setError(result.error || 'Erreur lors du changement de mot de passe');
		}
	};

	const getPasswordStrength = (password: string) => {
		let strength = 0;
		if (password.length >= 8) strength++;
		if (/[A-Z]/.test(password)) strength++;
		if (/[a-z]/.test(password)) strength++;
		if (/[0-9]/.test(password)) strength++;
		if (/[^A-Za-z0-9]/.test(password)) strength++;
		return strength;
	};

	const passwordStrength = getPasswordStrength(formData.newPassword);
	const strengthColors = [
		'bg-red-500',
		'bg-orange-500',
		'bg-yellow-500',
		'bg-lime-500',
		'bg-green-500',
	];
	const strengthLabels = [
		'Très faible',
		'Faible',
		'Moyen',
		'Fort',
		'Très fort',
	];

	return (
		<>
			<Header />
			<div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
				{/* Header */}
				<div className="bg-gradient-to-r from-[#1D70B8] to-[#3B9DE8] text-white">
					<div className="max-w-7xl mx-auto px-6 py-8">
						<Link
							href="/compte"
							className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
						>
							<ChevronLeft size={20} />
							Retour au tableau de bord
						</Link>
						<div className="flex items-center justify-between">
							<div>
								<h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
									<Shield size={32} />
									Sécurité
								</h1>
								<p className="text-white/80">
									Modifiez votre mot de passe et sécurisez votre compte
								</p>
							</div>
						</div>
					</div>
				</div>

				<div className="max-w-3xl mx-auto px-6 py-8">
					{/* Success Message */}
					{success && (
						<div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3 animate-fade-up">
							<div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
								<Check size={20} className="text-white" />
							</div>
							<div>
								<h4 className="font-bold text-green-800">
									Mot de passe modifié !
								</h4>
								<p className="text-sm text-green-600">
									Votre mot de passe a été changé avec succès
								</p>
							</div>
						</div>
					)}

					{/* Error Message */}
					{error && (
						<div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3 animate-fade-up">
							<div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
								<AlertCircle size={20} className="text-white" />
							</div>
							<div>
								<h4 className="font-bold text-red-800">Erreur</h4>
								<p className="text-sm text-red-600">{error}</p>
							</div>
						</div>
					)}

					<div className="grid grid-cols-1 gap-8">
						{/* Change Password Form */}
						<div className="bg-white rounded-2xl shadow-lg p-6">
							<div className="flex items-center gap-3 mb-6">
								<div className="w-12 h-12 bg-gradient-to-br from-[#1D70B8] to-[#3B9DE8] rounded-xl flex items-center justify-center">
									<Key size={24} className="text-white" />
								</div>
								<div>
									<h2 className="text-xl font-bold text-gray-800">
										Changer le mot de passe
									</h2>
									<p className="text-sm text-gray-500">
										Assurez-vous qu'il soit sûr et unique
									</p>
								</div>
							</div>

							<form onSubmit={handleSubmit} className="space-y-6">
								{/* Current Password */}
								<div>
									<label className="block text-sm font-semibold text-gray-700 mb-2">
										Mot de passe actuel
									</label>
									<div className="relative">
										<Lock
											size={18}
											className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
										/>
										<input
											type={showCurrentPassword ? 'text' : 'password'}
											name="currentPassword"
											value={formData.currentPassword}
											onChange={handleChange}
											required
											className="w-full pl-12 pr-12 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl outline-none focus:border-[#1D70B8] focus:bg-white transition-all"
											placeholder="Entrez votre mot de passe actuel"
										/>
										<button
											type="button"
											onClick={() =>
												setShowCurrentPassword(!showCurrentPassword)
											}
											className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
										>
											{showCurrentPassword ? (
												<EyeOff size={18} />
											) : (
												<Eye size={18} />
											)}
										</button>
									</div>
								</div>

								{/* New Password */}
								<div>
									<label className="block text-sm font-semibold text-gray-700 mb-2">
										Nouveau mot de passe
									</label>
									<div className="relative">
										<Lock
											size={18}
											className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
										/>
										<input
											type={showNewPassword ? 'text' : 'password'}
											name="newPassword"
											value={formData.newPassword}
											onChange={handleChange}
											required
											className="w-full pl-12 pr-12 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl outline-none focus:border-[#1D70B8] focus:bg-white transition-all"
											placeholder="Entrez votre nouveau mot de passe"
										/>
										<button
											type="button"
											onClick={() => setShowNewPassword(!showNewPassword)}
											className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
										>
											{showNewPassword ? (
												<EyeOff size={18} />
											) : (
												<Eye size={18} />
											)}
										</button>
									</div>

									{/* Password Strength Indicator */}
									{formData.newPassword && (
										<div className="mt-3">
											<div className="flex gap-1 mb-2">
												{[...Array(5)].map((_, i) => (
													<div
														key={i}
														className={`h-1.5 flex-1 rounded-full transition-all ${
															i < passwordStrength
																? strengthColors[passwordStrength - 1]
																: 'bg-gray-200'
														}`}
													/>
												))}
											</div>
											<p
												className={`text-xs font-semibold ${passwordStrength >= 3 ? 'text-green-600' : passwordStrength >= 2 ? 'text-yellow-600' : 'text-red-600'}`}
											>
												Force :{' '}
												{strengthLabels[passwordStrength - 1] || 'Très faible'}
											</p>
										</div>
									)}
								</div>

								{/* Confirm Password */}
								<div>
									<label className="block text-sm font-semibold text-gray-700 mb-2">
										Confirmer le mot de passe
									</label>
									<div className="relative">
										<Lock
											size={18}
											className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
										/>
										<input
											type={showConfirmPassword ? 'text' : 'password'}
											name="confirmPassword"
											value={formData.confirmPassword}
											onChange={handleChange}
											required
											className="w-full pl-12 pr-12 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl outline-none focus:border-[#1D70B8] focus:bg-white transition-all"
											placeholder="Confirmez votre nouveau mot de passe"
										/>
										<button
											type="button"
											onClick={() =>
												setShowConfirmPassword(!showConfirmPassword)
											}
											className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
										>
											{showConfirmPassword ? (
												<EyeOff size={18} />
											) : (
												<Eye size={18} />
											)}
										</button>
									</div>
								</div>

								{/* Submit Button */}
								<button
									type="submit"
									disabled={isSubmitting}
									className="w-full px-6 py-3 bg-gradient-to-r from-[#1D70B8] to-[#3B9DE8] hover:from-[#0D3A5C] hover:to-[#1558A0] text-white rounded-xl font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
								>
									{isSubmitting ? (
										<>
											<div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
											Modification en cours...
										</>
									) : (
										<>
											<Shield size={18} />
											Modifier le mot de passe
										</>
									)}
								</button>
							</form>
						</div>

						{/* Security Tips */}
						<div className="bg-white rounded-2xl shadow-lg p-6">
							<h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
								<AlertCircle size={20} className="text-[#1D70B8]" />
								Conseils de sécurité
							</h3>
							<ul className="space-y-3 text-sm text-gray-600">
								<li className="flex items-start gap-2">
									<Check
										size={16}
										className="text-green-500 flex-shrink-0 mt-0.5"
									/>
									<span>
										Utilisez au moins 8 caractères avec majuscules, minuscules
										et chiffres
									</span>
								</li>
								<li className="flex items-start gap-2">
									<Check
										size={16}
										className="text-green-500 flex-shrink-0 mt-0.5"
									/>
									<span>
										Évitez d'utiliser des informations personnelles (nom, date
										de naissance)
									</span>
								</li>
								<li className="flex items-start gap-2">
									<Check
										size={16}
										className="text-green-500 flex-shrink-0 mt-0.5"
									/>
									<span>
										N'utilisez pas le même mot de passe sur plusieurs sites
									</span>
								</li>
								<li className="flex items-start gap-2">
									<Check
										size={16}
										className="text-green-500 flex-shrink-0 mt-0.5"
									/>
									<span>
										Changez votre mot de passe régulièrement (tous les 3-6 mois)
									</span>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
			<Footer />
		</>
	);
}
