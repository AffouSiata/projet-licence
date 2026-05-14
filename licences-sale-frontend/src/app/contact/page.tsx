'use client';

import { useState } from 'react';
import { Header } from '~/components/header';
import { Footer } from '~/components/footer';
import {
	Mail,
	Phone,
	MapPin,
	Send,
	MessageCircle,
	CheckCircle2,
	ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

const ContactPage = () => {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		phone: '',
		subject: '',
		message: '',
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>,
	) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		// Simulate form submission
		await new Promise((resolve) => setTimeout(resolve, 1500));

		setIsSubmitting(false);
		setIsSubmitted(true);

		// Reset form after 3 seconds
		setTimeout(() => {
			setIsSubmitted(false);
			setFormData({
				name: '',
				email: '',
				phone: '',
				subject: '',
				message: '',
			});
		}, 3000);
	};

	return (
		<main>
			<Header />

			{/* Hero Section with Background Image */}
			<section className="relative min-h-[500px] lg:min-h-[600px] flex items-center overflow-hidden">
				{/* Background Image */}
				<div
					className="absolute inset-0 bg-cover bg-center bg-no-repeat"
					style={{
						backgroundImage: `url('https://images.unsplash.com/photo-1423666639041-f56000c27a9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80')`,
					}}
				/>
				{/* Dark Overlay */}
				<div className="absolute inset-0 bg-gradient-to-r from-[#0D3A5C]/95 via-[#1D73B3]/85 to-[#1D73B3]/75" />

				{/* Decorative Circles */}
				<div className="absolute inset-0 opacity-10">
					<div className="absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full" />
					<div className="absolute bottom-10 right-10 w-40 h-40 border-2 border-white rounded-full" />
				</div>

				{/* Content */}
				<div className="max-w-7xl mx-auto px-6 relative z-10 py-16">
					<div className="text-center max-w-3xl mx-auto">
						<div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6 border border-white/20">
							<MessageCircle size={16} className="text-[#E63946]" />
							<span className="text-sm font-semibold text-white">
								CONTACTEZ-NOUS
							</span>
						</div>
						<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
							Comment pouvons-nous{' '}
							<span className="text-[#E63946]">vous aider</span> ?
						</h1>
						<p className="text-lg lg:text-xl text-white/80 leading-relaxed">
							Notre équipe est disponible pour répondre à toutes vos questions
							et vous accompagner dans vos achats.
						</p>
					</div>
				</div>
			</section>

			{/* Contact Cards */}
			<section className="py-12 bg-white">
				<div className="max-w-7xl mx-auto px-6">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{/* Phone */}
						<div className="bg-gray-50 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300">
							<div className="w-14 h-14 bg-[#1D73B3] rounded-full flex items-center justify-center mx-auto mb-4">
								<Phone size={24} className="text-white" />
							</div>
							<h3 className="text-lg font-bold text-[#0D3A5C] mb-1">
								Téléphone
							</h3>
							<p className="text-[#1D73B3] font-semibold mb-1">
								+225 07 78 88 85 62
							</p>
							<p className="text-sm text-gray-500">Lun - Sam, 8h - 18h</p>
						</div>

						{/* Email */}
						<div className="bg-gray-50 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300">
							<div className="w-14 h-14 bg-[#E63946] rounded-full flex items-center justify-center mx-auto mb-4">
								<Mail size={24} className="text-white" />
							</div>
							<h3 className="text-lg font-bold text-[#0D3A5C] mb-1">Email</h3>
							<p className="text-[#E63946] font-semibold mb-1">
								sam_building@outlook.fr
							</p>
							<p className="text-sm text-gray-500">Réponse sous 24h</p>
						</div>

						{/* Location */}
						<div className="bg-gray-50 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300">
							<div className="w-14 h-14 bg-[#1D73B3] rounded-full flex items-center justify-center mx-auto mb-4">
								<MapPin size={24} className="text-white" />
							</div>
							<h3 className="text-lg font-bold text-[#0D3A5C] mb-1">Adresse</h3>
							<p className="text-[#1D73B3] font-semibold mb-1">
								Abidjan, Côte d'Ivoire
							</p>
							<p className="text-sm text-gray-500">Cocody, Riviera</p>
						</div>
					</div>
				</div>
			</section>

			{/* Form Section */}
			<section className="py-16 lg:py-20 bg-white">
				<div className="max-w-7xl mx-auto px-6">
					<div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
						{/* Left Side - Info */}
						<div className="lg:col-span-2">
							<h2 className="text-3xl font-bold text-[#0D3A5C] mb-4">
								Envoyez-nous un message
							</h2>
							<p className="text-gray-500 mb-8">
								Remplissez le formulaire ci-contre et notre équipe vous répondra
								dans les plus brefs délais.
							</p>

							{/* WhatsApp CTA */}
							<div className="bg-green-50 border border-green-100 rounded-2xl p-6 mb-6">
								<div className="flex items-center gap-4 mb-4">
									<div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
										<MessageCircle size={22} className="text-white" />
									</div>
									<div>
										<h3 className="font-bold text-gray-900">WhatsApp</h3>
										<p className="text-sm text-gray-500">Réponse instantanée</p>
									</div>
								</div>
								<a
									href="https://wa.me/+22507788885862"
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center gap-2 px-5 py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-all duration-300 w-full justify-center"
								>
									<MessageCircle size={18} />
									Discuter sur WhatsApp
								</a>
							</div>

							{/* FAQ Link */}
							<div className="bg-gray-50 rounded-2xl p-6">
								<h3 className="font-bold text-gray-900 mb-2">
									Questions fréquentes
								</h3>
								<p className="text-sm text-gray-500 mb-4">
									Consultez notre FAQ pour trouver rapidement des réponses.
								</p>
								<Link
									href="/faq"
									className="inline-flex items-center gap-2 text-[#1D73B3] font-semibold hover:gap-3 transition-all duration-300"
								>
									Voir la FAQ
									<ArrowRight size={16} />
								</Link>
							</div>
						</div>

						{/* Right Side - Form */}
						<div className="lg:col-span-3">
							<div className="bg-gray-50 rounded-3xl p-8 lg:p-10">
								{isSubmitted ? (
									<div className="flex flex-col items-center justify-center py-16">
										<div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6">
											<CheckCircle2 size={40} className="text-white" />
										</div>
										<h3 className="text-2xl font-bold text-gray-900 mb-2">
											Message envoyé !
										</h3>
										<p className="text-gray-500 text-center">
											Nous vous répondrons dans les plus brefs délais.
										</p>
									</div>
								) : (
									<form onSubmit={handleSubmit} className="space-y-5">
										<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
											<div>
												<label className="block text-sm font-semibold text-gray-700 mb-2">
													Nom complet *
												</label>
												<input
													type="text"
													name="name"
													value={formData.name}
													onChange={handleChange}
													required
													className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 outline-none focus:border-[#1D73B3] focus:ring-2 focus:ring-[#1D73B3]/10 transition-all duration-300"
													placeholder="Votre nom"
												/>
											</div>
											<div>
												<label className="block text-sm font-semibold text-gray-700 mb-2">
													Email *
												</label>
												<input
													type="email"
													name="email"
													value={formData.email}
													onChange={handleChange}
													required
													className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 outline-none focus:border-[#1D73B3] focus:ring-2 focus:ring-[#1D73B3]/10 transition-all duration-300"
													placeholder="votre@email.com"
												/>
											</div>
										</div>

										<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
											<div>
												<label className="block text-sm font-semibold text-gray-700 mb-2">
													Téléphone
												</label>
												<input
													type="tel"
													name="phone"
													value={formData.phone}
													onChange={handleChange}
													className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 outline-none focus:border-[#1D73B3] focus:ring-2 focus:ring-[#1D73B3]/10 transition-all duration-300"
													placeholder="+225 XX XX XX XX"
												/>
											</div>
											<div>
												<label className="block text-sm font-semibold text-gray-700 mb-2">
													Sujet *
												</label>
												<select
													name="subject"
													value={formData.subject}
													onChange={handleChange}
													required
													className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 outline-none focus:border-[#1D73B3] focus:ring-2 focus:ring-[#1D73B3]/10 transition-all duration-300 appearance-none cursor-pointer"
												>
													<option value="">Sélectionnez un sujet</option>
													<option value="question">Question générale</option>
													<option value="commande">Suivi de commande</option>
													<option value="technique">Support technique</option>
													<option value="remboursement">
														Demande de remboursement
													</option>
													<option value="autre">Autre</option>
												</select>
											</div>
										</div>

										<div>
											<label className="block text-sm font-semibold text-gray-700 mb-2">
												Message *
											</label>
											<textarea
												name="message"
												value={formData.message}
												onChange={handleChange}
												required
												rows={5}
												className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 outline-none focus:border-[#1D73B3] focus:ring-2 focus:ring-[#1D73B3]/10 transition-all duration-300 resize-none"
												placeholder="Décrivez votre demande..."
											/>
										</div>

										<button
											type="submit"
											disabled={isSubmitting}
											className="w-full px-8 py-4 bg-[#1D73B3] hover:bg-[#1558A0] text-white font-bold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
										>
											{isSubmitting ? (
												<>
													<div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
													Envoi en cours...
												</>
											) : (
												<>
													<Send size={18} />
													Envoyer le message
												</>
											)}
										</button>
									</form>
								)}
							</div>
						</div>
					</div>
				</div>
			</section>

			<Footer />
		</main>
	);
};

export default ContactPage;
