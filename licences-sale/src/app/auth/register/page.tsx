'use client';

import Link from 'next/link';
import Image from 'next/image';
import { RegisterForm } from './components/register-form';

const RegisterPage = () => {
	return (
		<div className="h-screen flex overflow-hidden">
			<div className="w-full grid lg:grid-cols-2">
				{/* Left side - Form */}
				<div className="flex items-center justify-center p-8 lg:p-16 bg-gray-50">
					<div className="w-full max-w-md">
						{/* Header */}
						<div className="mb-10">
							<h1 className="text-4xl font-bold text-gray-900 mb-3">
								Créer un compte
							</h1>
							<p className="text-gray-600 text-lg">
								Rejoignez License Sale gratuitement
							</p>
						</div>

						{/* Form */}
						<RegisterForm />

						{/* Already have account */}
						<div className="mt-8 text-center">
							<p className="text-gray-600">
								Vous avez déjà un compte ?{' '}
								<Link
									href="/auth/login"
									className="text-[#1B75BC] font-semibold hover:text-[#E63946] transition-colors"
								>
									Se connecter
								</Link>
							</p>
						</div>
					</div>
				</div>

				{/* Right side - Branding */}
				<div className="hidden lg:flex flex-col justify-between p-16 bg-gradient-to-br from-[#E63946] to-[#DC2F3D] text-white relative overflow-hidden">
					{/* Background geometric patterns */}
					<div className="absolute -top-20 -right-20 w-[500px] h-[500px] border-2 border-white/5 rounded-full" />
					<div className="absolute top-32 right-10 w-[400px] h-[400px] border border-white/10 rounded-full" />
					<div className="absolute top-1/3 -right-32 w-[600px] h-[600px] border-2 border-white/5 rounded-full" />
					<div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] border border-white/10 rounded-full" />
					<div className="absolute -bottom-32 -right-40 w-[550px] h-[550px] border-2 border-white/5 rounded-full" />

					{/* Accent circles */}
					<div className="absolute top-20 right-1/3 w-3 h-3 bg-[#1B75BC]/30 rounded-full blur-sm" />
					<div className="absolute top-1/2 right-20 w-2 h-2 bg-white/20 rounded-full" />
					<div className="absolute bottom-32 right-1/2 w-4 h-4 bg-[#1B75BC]/20 rounded-full blur-sm" />
					{/* Logo */}
					<div className="flex justify-end relative z-10">
						<div className="bg-white rounded-2xl p-4 shadow-lg">
							<Image
								src="/logo.jpeg"
								alt="License Sale"
								width={180}
								height={90}
								className="object-contain"
								priority
							/>
						</div>
					</div>

					{/* Main content */}
					<div className="flex-1 flex flex-col justify-center mt-12 relative z-10">
						<h2 className="text-5xl font-bold mb-6 leading-tight">
							Rejoignez License Sale
						</h2>
						<p className="text-xl text-white/90 mb-16">
							Créez votre compte et profitez de tous les avantages de notre plateforme.
						</p>

						{/* Features - Right aligned */}
						<div className="space-y-8">
							<div className="flex items-start gap-4 justify-end">
								<div className="text-right">
									<h3 className="text-xl font-semibold mb-1">Offres exclusives</h3>
									<p className="text-white/80">Réductions réservées aux membres</p>
								</div>
								<div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
									<svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
									</svg>
								</div>
							</div>

							<div className="flex items-start gap-4 justify-end">
								<div className="text-right">
									<h3 className="text-xl font-semibold mb-1">Historique de commandes</h3>
									<p className="text-white/80">Retrouvez toutes vos licences</p>
								</div>
								<div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
									<svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
								</div>
							</div>

							<div className="flex items-start gap-4 justify-end">
								<div className="text-right">
									<h3 className="text-xl font-semibold mb-1">Support prioritaire</h3>
									<p className="text-white/80">Assistance dédiée 24/7</p>
								</div>
								<div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
									<svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
									</svg>
								</div>
							</div>
						</div>
					</div>

					{/* Footer */}
					<div className="space-y-3 mt-12 relative z-10">
						<a
							href="https://wa.me/+22507788885862"
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors"
						>
							<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
								<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
							</svg>
							+225 07 78 88 85 62
						</a>
						<p className="text-white/70 text-sm">
							© 2024 License Sale. Tous droits réservés.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default RegisterPage;
