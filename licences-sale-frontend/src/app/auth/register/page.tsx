'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, Suspense } from 'react';
import { useAction } from 'next-safe-action/hooks';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { registerAction } from '~/app/auth/actions';
import {
	Mail,
	Lock,
	Eye,
	EyeOff,
	User,
	ArrowRight,
	CheckCircle2,
	Gift,
	Clock,
	ShieldCheck,
	AlertCircle,
} from 'lucide-react';

const RegisterContent = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const redirectTo = searchParams.get('redirect');
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [acceptTerms, setAcceptTerms] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const { execute, isExecuting } = useAction(registerAction, {
		onSuccess: ({ data }) => {
			if (data?.success) {
				setIsSuccess(true);
				toast.success('Compte créé avec succès !');
				setTimeout(() => {
					// Si redirect spécifié, aller vers login avec ce paramètre
					if (redirectTo) {
						router.push(`/auth/login?redirect=${encodeURIComponent(redirectTo)}`);
					} else {
						router.push('/auth/login');
					}
				}, 2000);
			} else if (data?.error) {
				setError(data.error);
			}
		},
		onError: ({ error: err }) => {
			setError(
				err.serverError || "Une erreur est survenue lors de l'inscription",
			);
		},
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);

		// Validation
		if (name.trim().length < 3) {
			setError('Le nom doit contenir au moins 3 caractères');
			return;
		}

		if (password !== confirmPassword) {
			setError('Les mots de passe ne correspondent pas');
			return;
		}

		if (password.length < 8) {
			setError('Le mot de passe doit contenir au moins 8 caractères');
			return;
		}

		execute({ email, password, name });
	};

	return (
		<main className="min-h-screen flex">
			{/* Left Side - Form */}
			<div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
				<div className="w-full max-w-md">
					{/* Mobile Logo */}
					<div className="lg:hidden text-center mb-8">
						<Link href="/">
							<Image
								src="/logo.jpeg"
								alt="License Sale"
								width={130}
								height={50}
								className="object-contain mx-auto"
							/>
						</Link>
					</div>

					{isSuccess ? (
						/* Success Message */
						<div className="text-center py-12">
							<div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
								<CheckCircle2 size={48} className="text-white" />
							</div>
							<h2 className="text-3xl font-bold text-[#0D3A5C] mb-3">
								Inscription réussie !
							</h2>
							<p className="text-gray-500 mb-8 max-w-sm mx-auto">
								Votre compte a été créé avec succès. Vous pouvez maintenant vous
								connecter.
							</p>
							<Link
								href="/auth/login"
								className="inline-flex items-center gap-2 px-8 py-4 bg-[#1D73B3] hover:bg-[#0D3A5C] text-white font-bold rounded-xl transition-all duration-300"
							>
								Se connecter
								<ArrowRight size={18} />
							</Link>
						</div>
					) : (
						<>
							{/* Header */}
							<div className="text-center mb-8">
								<h2 className="text-3xl font-bold text-[#0D3A5C] mb-2">
									Créer un compte
								</h2>
								<p className="text-gray-500">
									Rejoignez License Sale gratuitement
								</p>
							</div>

							{/* Redirect message (from checkout) */}
							{redirectTo === '/checkout' && (
								<div className="mb-6 bg-blue-50 border-2 border-blue-200 rounded-xl p-4 flex items-start gap-3">
									<svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
									<div>
										<h4 className="font-bold text-blue-800 mb-1">
											Compte requis
										</h4>
										<p className="text-sm text-blue-600">
											Créez un compte pour finaliser votre commande. C'est rapide et gratuit !
										</p>
									</div>
								</div>
							)}

							{/* Error Display */}
							{error && (
								<div className="mb-6 bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3">
									<AlertCircle
										size={20}
										className="text-red-600 flex-shrink-0 mt-0.5"
									/>
									<div>
										<h4 className="font-bold text-red-800 mb-1">Erreur</h4>
										<p className="text-sm text-red-600">{error}</p>
									</div>
								</div>
							)}

							{/* Form */}
							<form onSubmit={handleSubmit} className="space-y-4">
								{/* Name */}
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
											value={name}
											onChange={(e) => setName(e.target.value)}
											required
											minLength={3}
											disabled={isExecuting}
											className="w-full px-4 py-3.5 pl-11 bg-white border border-gray-200 rounded-xl text-gray-900 outline-none focus:border-[#E63946] focus:ring-4 focus:ring-[#E63946]/10 transition-all duration-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
											placeholder="Prénom et nom"
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
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											required
											disabled={isExecuting}
											className="w-full px-4 py-3.5 pl-11 bg-white border border-gray-200 rounded-xl text-gray-900 outline-none focus:border-[#E63946] focus:ring-4 focus:ring-[#E63946]/10 transition-all duration-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
											placeholder="votre@email.com"
										/>
									</div>
								</div>

								{/* Password */}
								<div>
									<label className="block text-sm font-semibold text-gray-700 mb-2">
										Mot de passe
									</label>
									<div className="relative">
										<Lock
											size={18}
											className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
										/>
										<input
											type={showPassword ? 'text' : 'password'}
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											required
											minLength={8}
											disabled={isExecuting}
											className="w-full px-4 py-3.5 pl-11 pr-11 bg-white border border-gray-200 rounded-xl text-gray-900 outline-none focus:border-[#E63946] focus:ring-4 focus:ring-[#E63946]/10 transition-all duration-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
											placeholder="Minimum 8 caractères"
										/>
										<button
											type="button"
											onClick={() => setShowPassword(!showPassword)}
											className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
										>
											{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
										</button>
									</div>
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
											value={confirmPassword}
											onChange={(e) => setConfirmPassword(e.target.value)}
											required
											disabled={isExecuting}
											className="w-full px-4 py-3.5 pl-11 pr-11 bg-white border border-gray-200 rounded-xl text-gray-900 outline-none focus:border-[#E63946] focus:ring-4 focus:ring-[#E63946]/10 transition-all duration-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
											placeholder="Confirmez votre mot de passe"
										/>
										<button
											type="button"
											onClick={() => setShowConfirmPassword(!showConfirmPassword)}
											className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
										>
											{showConfirmPassword ? (
												<EyeOff size={18} />
											) : (
												<Eye size={18} />
											)}
										</button>
									</div>
								</div>

								{/* Terms */}
								<div className="flex items-start gap-3 pt-2">
									<input
										type="checkbox"
										id="terms"
										checked={acceptTerms}
										onChange={(e) => setAcceptTerms(e.target.checked)}
										required
										className="mt-1 w-4 h-4 text-[#E63946] border-gray-300 rounded focus:ring-[#E63946]"
									/>
									<label htmlFor="terms" className="text-sm text-gray-500">
										J'accepte les{' '}
										<Link
											href="/cgv"
											className="text-[#1D73B3] hover:underline"
										>
											CGV
										</Link>{' '}
										et la{' '}
										<Link
											href="/politique-confidentialite"
											className="text-[#1D73B3] hover:underline"
										>
											politique de confidentialité
										</Link>
									</label>
								</div>

								{/* Submit Button */}
								<button
									type="submit"
									disabled={isExecuting || !acceptTerms}
									className="w-full px-6 py-4 bg-[#E63946] hover:bg-[#D62839] text-white font-bold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 mt-6"
								>
									{isExecuting ? (
										<>
											<div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
											Création en cours...
										</>
									) : (
										<>
											Créer mon compte
											<ArrowRight size={18} />
										</>
									)}
								</button>
							</form>

							{/* Login Link */}
							<div className="text-center mt-6 pt-6 border-t border-gray-200">
								<p className="text-gray-500">
									Vous avez déjà un compte ?{' '}
									<Link
										href={redirectTo ? `/auth/login?redirect=${encodeURIComponent(redirectTo)}` : '/auth/login'}
										className="text-[#1D73B3] hover:text-[#0D3A5C] font-semibold transition-colors"
									>
										Se connecter
									</Link>
								</p>
							</div>

						</>
					)}
				</div>
			</div>

			{/* Right Side - Image & Info */}
			<div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-[#E63946] to-[#C62838]">
				{/* Background Pattern */}
				<div className="absolute inset-0 opacity-10">
					<div className="absolute top-20 right-20 w-72 h-72 border border-white rounded-full" />
					<div className="absolute top-32 right-32 w-48 h-48 border border-white rounded-full" />
					<div className="absolute bottom-20 left-20 w-96 h-96 border border-white rounded-full" />
					<div className="absolute bottom-32 left-32 w-64 h-64 border border-white rounded-full" />
				</div>

				{/* Content */}
				<div className="relative z-10 flex flex-col justify-between p-12 w-full">
					{/* Logo */}
					<div className="flex justify-end">
						<Link href="/">
							<div className="bg-white rounded-xl p-3 inline-block">
								<Image
									src="/logo.jpeg"
									alt="License Sale"
									width={130}
									height={50}
									className="object-contain"
								/>
							</div>
						</Link>
					</div>

					{/* Main Content */}
					<div className="max-w-md ml-auto">
						<h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight text-right">
							Rejoignez <span className="text-white/90">License Sale</span>
						</h1>
						<p className="text-white/70 text-lg mb-10 leading-relaxed text-right">
							Créez votre compte et profitez de tous les avantages de notre
							plateforme.
						</p>

						{/* Features */}
						<div className="space-y-5">
							<div className="flex items-center gap-4 flex-row-reverse">
								<div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
									<Gift size={22} className="text-white" />
								</div>
								<div className="text-right">
									<h3 className="text-white font-semibold">Offres exclusives</h3>
									<p className="text-white/60 text-sm">
										Réductions réservées aux membres
									</p>
								</div>
							</div>
							<div className="flex items-center gap-4 flex-row-reverse">
								<div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
									<Clock size={22} className="text-white" />
								</div>
								<div className="text-right">
									<h3 className="text-white font-semibold">
										Historique de commandes
									</h3>
									<p className="text-white/60 text-sm">
										Retrouvez toutes vos licences
									</p>
								</div>
							</div>
							<div className="flex items-center gap-4 flex-row-reverse">
								<div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
									<ShieldCheck size={22} className="text-white" />
								</div>
								<div className="text-right">
									<h3 className="text-white font-semibold">Support prioritaire</h3>
									<p className="text-white/60 text-sm">Assistance dédiée 24/7</p>
								</div>
							</div>
						</div>
					</div>

					{/* Footer */}
					<div className="flex items-center justify-between flex-row-reverse">
						<p className="text-white/50 text-sm">
							© {new Date().getFullYear()} License Sale. Tous droits réservés.
						</p>
						<a
							href="https://wa.me/+22507788885862"
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-2 text-white/70 hover:text-white text-sm transition-colors"
						>
							<svg
								width="18"
								height="18"
								viewBox="0 0 24 24"
								fill="currentColor"
							>
								<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
							</svg>
							+225 07 78 88 85 62
						</a>
					</div>
				</div>
			</div>
		</main>
	);
};

const RegisterPage = () => {
	return (
		<Suspense fallback={
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="w-8 h-8 border-4 border-[#E63946] border-t-transparent rounded-full animate-spin" />
			</div>
		}>
			<RegisterContent />
		</Suspense>
	);
};

export default RegisterPage;
