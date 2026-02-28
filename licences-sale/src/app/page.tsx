'use client';

import Link from 'next/link';
import Image from 'next/image';

const HomePage = () => {
	return (
		<div className="min-h-screen bg-white">
			{/* Header */}
			<header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200">
				<div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
					<Link href="/" className="relative w-40 h-12">
						<Image
							src="/logo.jpeg"
							alt="License Sale"
							fill
							className="object-contain object-left"
							priority
						/>
					</Link>

					<nav className="hidden md:flex items-center gap-8">
						<Link
							href="/products"
							className="text-sm font-medium text-gray-700 hover:text-[#E63946] transition-colors"
						>
							Produits
						</Link>
						<Link
							href="/about"
							className="text-sm font-medium text-gray-700 hover:text-[#E63946] transition-colors"
						>
							À propos
						</Link>
						<Link
							href="/contact"
							className="text-sm font-medium text-gray-700 hover:text-[#E63946] transition-colors"
						>
							Contact
						</Link>
					</nav>

					<div className="flex items-center gap-4">
						<Link
							href="/auth/login"
							className="text-sm font-medium text-gray-700 hover:text-[#1B75BC] transition-colors"
						>
							Connexion
						</Link>
						<Link
							href="/auth/register"
							className="px-5 py-2.5 bg-[#E63946] text-white text-sm font-medium rounded-lg hover:bg-[#DC2F3D] transition-all shadow-lg shadow-red-500/20"
						>
							S'inscrire
						</Link>
					</div>
				</div>
			</header>

			{/* Hero Section */}
			<section className="pt-32 pb-20 px-6 relative overflow-hidden">
				{/* Background geometric shapes */}
				<div className="absolute inset-0 -z-10">
					<div className="absolute top-20 right-0 w-96 h-96 bg-[#E63946]/5 rounded-full blur-3xl" />
					<div className="absolute bottom-0 left-0 w-96 h-96 bg-[#1B75BC]/5 rounded-full blur-3xl" />
				</div>

				<div className="max-w-7xl mx-auto">
					<div className="grid lg:grid-cols-2 gap-16 items-center">
						{/* Left content */}
						<div className="space-y-8">
							<div className="inline-block">
								<span className="px-4 py-2 bg-[#E63946]/10 text-[#E63946] text-sm font-semibold rounded-full">
									Licences Officielles • 100% Authentiques
								</span>
							</div>

							<h1 className="text-6xl font-bold leading-tight tracking-tight">
								Vos licences{' '}
								<span className="text-[#E63946]">professionnelles</span>
								<br />
								en quelques clics
							</h1>

							<p className="text-xl text-gray-600 leading-relaxed">
								Achetez vos licences AutoCAD, Revit, ArchiCAD et Robot Structure
								en toute sécurité. Livraison instantanée par email.
							</p>

							<div className="flex flex-wrap gap-4">
								<Link
									href="/auth/register"
									className="group px-8 py-4 bg-[#E63946] text-white font-semibold rounded-lg hover:bg-[#DC2F3D] transition-all shadow-xl shadow-red-500/30 hover:shadow-2xl hover:shadow-red-500/40 hover:-translate-y-0.5"
								>
									<span className="flex items-center gap-2">
										Commencer maintenant
										<svg
											className="w-5 h-5 group-hover:translate-x-1 transition-transform"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M17 8l4 4m0 0l-4 4m4-4H3"
											/>
										</svg>
									</span>
								</Link>

								<Link
									href="/products"
									className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-[#1B75BC] hover:text-[#1B75BC] transition-all"
								>
									Voir les produits
								</Link>
							</div>

							{/* Stats */}
							<div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200">
								<div>
									<div className="text-3xl font-bold text-[#E63946]">500+</div>
									<div className="text-sm text-gray-600 mt-1">
										Clients satisfaits
									</div>
								</div>
								<div>
									<div className="text-3xl font-bold text-[#1B75BC]">24/7</div>
									<div className="text-sm text-gray-600 mt-1">
										Support disponible
									</div>
								</div>
								<div>
									<div className="text-3xl font-bold text-gray-900">100%</div>
									<div className="text-sm text-gray-600 mt-1">Authentiques</div>
								</div>
							</div>
						</div>

						{/* Right content - Visual element */}
						<div className="relative">
							<div className="relative aspect-square bg-gradient-to-br from-[#E63946] to-[#DC2F3D] rounded-3xl p-12 shadow-2xl">
								<div className="relative h-full flex flex-col justify-between text-white">
									<div className="space-y-4">
										<div className="text-sm font-semibold opacity-80">
											Logiciels disponibles
										</div>
										<div className="space-y-3">
											{['AutoCAD', 'Revit', 'ArchiCAD', 'Robot Structure'].map(
												(software, i) => (
													<div
														key={software}
														className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-4 rounded-xl animate-slide-in"
														style={{
															animationDelay: `${i * 0.1}s`,
														}}
													>
														<div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
															<svg
																className="w-6 h-6"
																fill="none"
																stroke="currentColor"
																viewBox="0 0 24 24"
															>
																<path
																	strokeLinecap="round"
																	strokeLinejoin="round"
																	strokeWidth={2}
																	d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
																/>
															</svg>
														</div>
														<span className="font-semibold">{software}</span>
													</div>
												),
											)}
										</div>
									</div>
								</div>
							</div>

							{/* Floating elements */}
							<div className="absolute -top-6 -right-6 w-24 h-24 bg-[#1B75BC] rounded-2xl shadow-xl animate-float" />
							<div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white border-4 border-gray-200 rounded-2xl shadow-xl animate-float-delay" />
						</div>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="py-20 px-6 bg-gray-50">
				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold mb-4">
							Pourquoi choisir License Sale ?
						</h2>
						<p className="text-xl text-gray-600">
							Une expérience d'achat simple, rapide et sécurisée
						</p>
					</div>

					<div className="grid md:grid-cols-3 gap-8">
						{[
							{
								icon: '🔒',
								title: 'Licences authentiques',
								desc: '100% officielles et garanties par les éditeurs',
								color: '#E63946',
							},
							{
								icon: '⚡',
								title: 'Livraison instantanée',
								desc: 'Recevez vos clés par email en quelques minutes',
								color: '#1B75BC',
							},
							{
								icon: '💬',
								title: 'Support 24/7',
								desc: 'Une équipe dédiée pour répondre à vos questions',
								color: '#E63946',
							},
						].map((feature, i) => (
							<div
								key={i}
								className="group relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
							>
								<div
									className="absolute top-0 left-0 w-2 h-16 rounded-r-full transition-all duration-500 group-hover:h-24"
									style={{ backgroundColor: feature.color }}
								/>
								<div className="text-5xl mb-4">{feature.icon}</div>
								<h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
								<p className="text-gray-600 leading-relaxed">{feature.desc}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-20 px-6 bg-gradient-to-br from-[#E63946] to-[#DC2F3D] relative overflow-hidden">
				<div className="max-w-4xl mx-auto text-center relative z-10">
					<h2 className="text-5xl font-bold text-white mb-6">
						Prêt à démarrer ?
					</h2>
					<p className="text-xl text-white/90 mb-10">
						Rejoignez des centaines de professionnels qui nous font confiance
					</p>
					<div className="flex flex-wrap gap-4 justify-center">
						<Link
							href="/auth/register"
							className="px-10 py-5 bg-white text-[#E63946] font-bold rounded-xl hover:shadow-2xl transition-all hover:-translate-y-1 text-lg"
						>
							Créer un compte gratuitement
						</Link>
						<a
							href="https://wa.me/+22507788885862"
							target="_blank"
							rel="noopener noreferrer"
							className="px-10 py-5 bg-white/10 backdrop-blur-sm text-white font-bold rounded-xl border-2 border-white/30 hover:bg-white/20 transition-all text-lg flex items-center gap-2"
						>
							<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
								<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
							</svg>
							Nous contacter
						</a>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="bg-gray-900 text-gray-300 py-12 px-6">
				<div className="max-w-7xl mx-auto">
					<div className="grid md:grid-cols-4 gap-8 mb-8">
						<div>
							<div className="mb-4 relative w-40 h-12">
								<Image
									src="/logo.jpeg"
									alt="License Sale"
									fill
									className="object-contain object-left brightness-0 invert"
								/>
							</div>
							<p className="text-sm text-gray-400">
								Votre partenaire de confiance pour l'achat de licences
								logicielles professionnelles.
							</p>
						</div>

						<div>
							<h3 className="font-semibold text-white mb-4">Produits</h3>
							<ul className="space-y-2 text-sm">
								<li>
									<Link
										href="/products"
										className="hover:text-white transition-colors"
									>
										AutoCAD
									</Link>
								</li>
								<li>
									<Link
										href="/products"
										className="hover:text-white transition-colors"
									>
										Revit
									</Link>
								</li>
								<li>
									<Link
										href="/products"
										className="hover:text-white transition-colors"
									>
										ArchiCAD
									</Link>
								</li>
								<li>
									<Link
										href="/products"
										className="hover:text-white transition-colors"
									>
										Robot Structure
									</Link>
								</li>
							</ul>
						</div>

						<div>
							<h3 className="font-semibold text-white mb-4">Entreprise</h3>
							<ul className="space-y-2 text-sm">
								<li>
									<Link
										href="/about"
										className="hover:text-white transition-colors"
									>
										À propos
									</Link>
								</li>
								<li>
									<Link
										href="/contact"
										className="hover:text-white transition-colors"
									>
										Contact
									</Link>
								</li>
								<li>
									<Link
										href="/politique-confidentialite"
										className="hover:text-white transition-colors"
									>
										Politique de confidentialité
									</Link>
								</li>
							</ul>
						</div>

						<div>
							<h3 className="font-semibold text-white mb-4">Contact</h3>
							<ul className="space-y-2 text-sm">
								<li className="flex items-start gap-2">
									<svg
										className="w-5 h-5 text-[#E63946] flex-shrink-0"
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
									sam_building@outlook.fr
								</li>
								<li className="flex items-start gap-2">
									<svg
										className="w-5 h-5 text-[#1B75BC] flex-shrink-0"
										fill="currentColor"
										viewBox="0 0 24 24"
									>
										<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
									</svg>
									+225 07 78 88 85 62
								</li>
							</ul>
						</div>
					</div>

					<div className="pt-8 border-t border-gray-800 text-center text-sm">
						<p>© 2024 License Sale. Tous droits réservés.</p>
					</div>
				</div>
			</footer>

			<style jsx>{`
				@keyframes slideIn {
					from {
						opacity: 0;
						transform: translateX(20px);
					}
					to {
						opacity: 1;
						transform: translateX(0);
					}
				}

				@keyframes float {
					0%,
					100% {
						transform: translateY(0);
					}
					50% {
						transform: translateY(-20px);
					}
				}

				.animate-slide-in {
					animation: slideIn 0.5s ease-out backwards;
				}

				.animate-float {
					animation: float 3s ease-in-out infinite;
				}

				.animate-float-delay {
					animation: float 3s ease-in-out 1.5s infinite;
				}
			`}</style>
		</div>
	);
};

export default HomePage;
