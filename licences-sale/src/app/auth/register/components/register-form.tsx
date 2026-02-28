'use client';

import { useAction } from 'next-safe-action/hooks';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { registerAction } from '~/app/auth/actions';

export const RegisterForm = () => {
	const router = useRouter();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [name, setName] = useState('');
	const [showPassword, setShowPassword] = useState(false);

	const { execute, isExecuting } = useAction(registerAction, {
		onSuccess: ({ data }) => {
			if (data?.success) {
				toast.success('Compte créé avec succès !');
				setTimeout(() => {
					router.push('/auth/login');
				}, 1500);
			} else if (data?.error) {
				toast.error(data.error);
			}
		},
		onError: ({ error }) => {
			toast.error(
				error.serverError || "Une erreur est survenue lors de l'inscription",
			);
		},
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		execute({ email, password, name });
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			{/* Name */}
			<div>
				<label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
					Nom complet
				</label>
				<div className="relative">
					<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
						<svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
						</svg>
					</div>
					<input
						id="name"
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
						disabled={isExecuting}
						className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#E63946] focus:border-[#E63946] outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900"
						placeholder="Prénom et nom"
					/>
				</div>
			</div>

			{/* Email */}
			<div>
				<label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
					Adresse email
				</label>
				<div className="relative">
					<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
						<svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
						</svg>
					</div>
					<input
						id="email"
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						disabled={isExecuting}
						className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#E63946] focus:border-[#E63946] outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900"
						placeholder="votre@email.com"
					/>
				</div>
			</div>

			{/* Password */}
			<div>
				<label htmlFor="password" className="block text-sm font-semibold text-gray-900 mb-2">
					Mot de passe
				</label>
				<div className="relative">
					<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
						<svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
						</svg>
					</div>
					<input
						id="password"
						type={showPassword ? 'text' : 'password'}
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						disabled={isExecuting}
						className="w-full pl-12 pr-12 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#E63946] focus:border-[#E63946] outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900"
						placeholder="Ex: Password123"
					/>
					<button
						type="button"
						onClick={() => setShowPassword(!showPassword)}
						className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
					>
						{showPassword ? (
							<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
							</svg>
						) : (
							<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
							</svg>
						)}
					</button>
				</div>
				<div className="mt-2 flex items-start gap-2">
					<svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
					<p className="text-xs text-gray-500">
						Doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre
					</p>
				</div>
			</div>

			{/* Submit button */}
			<button
				type="submit"
				disabled={isExecuting}
				className="w-full bg-[#E63946] hover:bg-[#DC2F3D] text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
			>
				{isExecuting ? (
					<>
						<svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
							<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
							<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
						</svg>
						Création en cours...
					</>
				) : (
					<>
						Créer mon compte
						<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
						</svg>
					</>
				)}
			</button>
		</form>
	);
};
