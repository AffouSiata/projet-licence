import Link from 'next/link';

const ForgotPasswordPage = () => {
	return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
			<div className="max-w-md w-full">
				<div className="bg-white rounded-xl shadow-lg p-8">
					{/* En-tête */}
					<div className="text-center mb-8">
						<div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4">
							<svg
								className="w-8 h-8 text-[#1B75BC]"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
								/>
							</svg>
						</div>
						<h1 className="text-3xl font-bold text-gray-900 mb-2">
							Mot de passe oublié ?
						</h1>
						<p className="text-gray-600">
							Entrez votre adresse email pour réinitialiser votre mot de passe
						</p>
					</div>

					{/* Formulaire */}
					<form className="space-y-6">
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium text-gray-700 mb-2"
							>
								Adresse email
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<svg
										className="h-5 w-5 text-gray-400"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
										/>
									</svg>
								</div>
								<input
									id="email"
									type="email"
									required
									className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1B75BC] focus:border-transparent transition-all outline-none"
									placeholder="votre@email.com"
								/>
							</div>
						</div>

						{/* Info */}
						<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
							<div className="flex items-start gap-3">
								<svg
									className="w-5 h-5 text-[#1B75BC] flex-shrink-0 mt-0.5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
								<p className="text-sm text-[#1B75BC]">
									Si cette adresse email existe dans notre système, vous
									recevrez un lien de réinitialisation sous quelques minutes.
								</p>
							</div>
						</div>

						<button
							type="submit"
							className="w-full bg-[#1B75BC] text-white py-3.5 px-4 rounded-lg font-medium hover:bg-[#1565A6] focus:outline-none focus:ring-2 focus:ring-[#1B75BC] focus:ring-offset-2 transition-all shadow-lg"
						>
							Envoyer le lien de réinitialisation
						</button>
					</form>

					{/* Retour à la connexion */}
					<div className="mt-8 text-center">
						<Link
							href="/auth/login"
							className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
						>
							<svg
								className="w-4 h-4 mr-2"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M10 19l-7-7m0 0l7-7m-7 7h18"
								/>
							</svg>
							Retour à la connexion
						</Link>
					</div>
				</div>

				{/* Besoin d'aide */}
				<div className="mt-6 text-center">
					<p className="text-sm text-gray-600">
						Besoin d'aide ?{' '}
						<a
							href="https://wa.me/+22507788885862"
							target="_blank"
							rel="noopener noreferrer"
							className="text-[#1B75BC] hover:text-[#1565A6] font-medium"
						>
							Contactez-nous sur WhatsApp
						</a>
					</p>
				</div>
			</div>
		</div>
	);
};

export default ForgotPasswordPage;
