'use client';

import { useState } from 'react';
import {
	Send,
	Mail,
	Percent,
	Sparkles,
	Shield,
	CheckCircle2,
	Loader2,
	ArrowRight,
} from 'lucide-react';

export const NewsletterCTA = () => {
	const [email, setEmail] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSubscribed, setIsSubscribed] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email) return;

		setIsSubmitting(true);
		await new Promise((resolve) => setTimeout(resolve, 1500));
		setIsSubmitting(false);
		setIsSubscribed(true);
		setEmail('');
	};

	return (
		<section className="py-20 lg:py-28 bg-white overflow-hidden">
			<div className="max-w-7xl mx-auto px-6">
				<div className="relative">
					{/* Background Shape */}
					<div className="absolute inset-0 bg-gradient-to-br from-[#1B3A5F] to-[#0F2744] rounded-[2.5rem] overflow-hidden">
						{/* Animated gradient orbs */}
						<div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#2E86AB] rounded-full opacity-20 blur-[100px] -translate-y-1/2 translate-x-1/4" />
						<div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#E63946] rounded-full opacity-15 blur-[80px] translate-y-1/2 -translate-x-1/4" />

						{/* Grid pattern */}
						<div
							className="absolute inset-0 opacity-[0.03]"
							style={{
								backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
								linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
								backgroundSize: '50px 50px',
							}}
						/>
					</div>

					{/* Content */}
					<div className="relative z-10 py-16 lg:py-20 px-8 lg:px-16">
						<div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
							{/* Left Side */}
							<div>
								<div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-8 border border-white/10">
									<Sparkles size={16} className="text-amber-400" />
									<span className="text-sm font-medium text-white/90">
										Offres exclusives
									</span>
								</div>

								<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
									Recevez nos
									<span className="relative mx-3">
										<span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
											meilleures
										</span>
									</span>
									offres
								</h2>

								<p className="text-lg text-white/60 mb-10 max-w-md leading-relaxed">
									Inscrivez-vous et bénéficiez de réductions exclusives, nouveautés
									et conseils directement dans votre boîte mail.
								</p>

								{/* Benefits */}
								<div className="space-y-4">
									{[
										{ icon: Percent, text: 'Jusqu\'à -30% sur vos achats' },
										{ icon: Sparkles, text: 'Accès anticipé aux nouveautés' },
										{ icon: Shield, text: 'Conseils sécurité informatique' },
									].map((item) => {
										const Icon = item.icon;
										return (
											<div
												key={item.text}
												className="flex items-center gap-4"
											>
												<div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
													<Icon size={18} className="text-white/80" />
												</div>
												<span className="text-white/80 font-medium">
													{item.text}
												</span>
											</div>
										);
									})}
								</div>
							</div>

							{/* Right Side - Form Card */}
							<div className="lg:pl-8">
								<div className="bg-white rounded-3xl p-8 lg:p-10 shadow-2xl shadow-black/20">
									{isSubscribed ? (
										<div className="text-center py-8">
											<div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
												<CheckCircle2 size={40} className="text-white" />
											</div>
											<h3 className="text-2xl font-bold text-gray-900 mb-3">
												Inscription réussie !
											</h3>
											<p className="text-gray-500 mb-6">
												Bienvenue dans notre communauté. Vérifiez votre boîte mail
												pour confirmer votre inscription.
											</p>
											<button
												type="button"
												onClick={() => setIsSubscribed(false)}
												className="text-[#2E86AB] font-medium hover:underline"
											>
												Inscrire une autre adresse
											</button>
										</div>
									) : (
										<>
											<div className="mb-8">
												<h3 className="text-2xl font-bold text-gray-900 mb-2">
													Newsletter SoftKey
												</h3>
												<p className="text-gray-500">
													Rejoignez +5 000 abonnés
												</p>
											</div>

											<form onSubmit={handleSubmit} className="space-y-5">
												<div>
													<label
														htmlFor="newsletter-email"
														className="block text-sm font-semibold text-gray-700 mb-2"
													>
														Votre adresse email
													</label>
													<div className="relative">
														<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
															<Mail size={20} className="text-gray-400" />
														</div>
														<input
															type="email"
															id="newsletter-email"
															value={email}
															onChange={(e) => setEmail(e.target.value)}
															placeholder="exemple@email.com"
															className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-[#2E86AB] focus:bg-white transition-all text-gray-900 placeholder:text-gray-400 font-medium"
															required
														/>
													</div>
												</div>

												<button
													type="submit"
													disabled={isSubmitting}
													className="group w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-[#2E86AB] to-[#1B6B8F] text-white font-semibold rounded-2xl hover:from-[#257291] hover:to-[#155A76] transition-all duration-300 shadow-lg shadow-[#2E86AB]/30 hover:shadow-xl hover:shadow-[#2E86AB]/40 disabled:opacity-70 disabled:cursor-not-allowed"
												>
													{isSubmitting ? (
														<>
															<Loader2 size={20} className="animate-spin" />
															<span>Inscription...</span>
														</>
													) : (
														<>
															<span>S'inscrire gratuitement</span>
															<ArrowRight
																size={18}
																className="group-hover:translate-x-1 transition-transform"
															/>
														</>
													)}
												</button>
											</form>

											{/* Trust indicators */}
											<div className="mt-8 pt-6 border-t border-gray-100">
												<div className="flex items-center justify-center gap-6 text-sm text-gray-400">
													<div className="flex items-center gap-2">
														<CheckCircle2 size={14} className="text-green-500" />
														<span>Zéro spam</span>
													</div>
													<div className="w-1 h-1 bg-gray-300 rounded-full" />
													<div className="flex items-center gap-2">
														<CheckCircle2 size={14} className="text-green-500" />
														<span>Désabonnement facile</span>
													</div>
												</div>
											</div>
										</>
									)}
								</div>

								{/* Floating badge */}
								<div className="hidden lg:flex items-center gap-3 absolute -bottom-4 -right-4 bg-white rounded-2xl px-5 py-3 shadow-xl">
									<div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
										<Percent size={20} className="text-white" />
									</div>
									<div>
										<p className="text-xs text-gray-500">Code de bienvenue</p>
										<p className="font-bold text-gray-900">-10% WELCOME10</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};
