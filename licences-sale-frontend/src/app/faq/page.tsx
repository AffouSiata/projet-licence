'use client';

import { useState } from 'react';
import { Header } from '~/components/header';
import { Footer } from '~/components/footer';
import {
	HelpCircle,
	ChevronDown,
	Search,
	ShoppingCart,
	CreditCard,
	Truck,
	ShieldCheck,
	Headphones,
	MessageCircle,
} from 'lucide-react';
import Link from 'next/link';

const faqCategories = [
	{ id: 'all', name: 'Toutes', icon: HelpCircle },
	{ id: 'commande', name: 'Commandes', icon: ShoppingCart },
	{ id: 'paiement', name: 'Paiement', icon: CreditCard },
	{ id: 'livraison', name: 'Livraison', icon: Truck },
	{ id: 'licence', name: 'Licences', icon: ShieldCheck },
	{ id: 'support', name: 'Support', icon: Headphones },
];

const faqs = [
	{
		id: 1,
		category: 'commande',
		question: 'Comment passer une commande sur License Sale ?',
		answer: "Pour passer une commande, parcourez notre catalogue, sélectionnez le produit souhaité et cliquez sur \"Ajouter au panier\". Ensuite, accédez à votre panier et remplissez le formulaire de commande avec vos informations. Après validation, vous recevrez votre licence par email.",
	},
	{
		id: 2,
		category: 'commande',
		question: 'Puis-je modifier ou annuler ma commande ?',
		answer: "Une fois la commande validée et la licence envoyée, il n'est plus possible de la modifier ou de l'annuler. Cependant, vous bénéficiez d'une garantie de remboursement de 30 jours si vous rencontrez un problème avec votre licence.",
	},
	{
		id: 3,
		category: 'commande',
		question: "Comment suivre l'état de ma commande ?",
		answer: "Après votre commande, vous recevrez un email de confirmation avec les détails de votre achat. Si vous avez un compte, vous pouvez également consulter l'historique de vos commandes dans votre espace client.",
	},
	{
		id: 4,
		category: 'paiement',
		question: 'Quels moyens de paiement acceptez-vous ?',
		answer: 'Nous acceptons plusieurs moyens de paiement : Orange Money et MTN MoMo. Tous les paiements sont sécurisés.',
	},
	{
		id: 5,
		category: 'paiement',
		question: 'Le paiement est-il sécurisé ?',
		answer: 'Oui, absolument. Toutes nos transactions sont protégées. Vos informations ne sont jamais stockées sur nos serveurs et sont traitées directement par nos partenaires de paiement certifiés.',
	},
	{
		id: 6,
		category: 'paiement',
		question: 'Puis-je payer en plusieurs fois ?',
		answer: 'Actuellement, nous ne proposons pas le paiement en plusieurs fois. Cependant, nous offrons régulièrement des promotions et des réductions pour rendre nos produits plus accessibles.',
	},
	{
		id: 7,
		category: 'livraison',
		question: 'Combien de temps faut-il pour recevoir ma licence ?',
		answer: "La livraison est instantanée ! Vous recevrez votre clé de licence par email dans les 5 à 10 minutes suivant la confirmation de votre paiement. En cas de retard, n'hésitez pas à nous contacter.",
	},
	{
		id: 8,
		category: 'livraison',
		question: "Je n'ai pas reçu mon email, que faire ?",
		answer: "Vérifiez d'abord votre dossier spam ou courrier indésirable. Si vous ne trouvez toujours pas l'email, contactez notre support via WhatsApp ou email avec votre numéro de commande, et nous vous renverrons votre licence immédiatement.",
	},
	{
		id: 9,
		category: 'licence',
		question: 'Les licences sont-elles authentiques ?',
		answer: 'Oui, 100% de nos licences sont authentiques et officielles. Elles proviennent directement des éditeurs ou de distributeurs agréés. Vous bénéficiez de toutes les mises à jour et du support officiel.',
	},
	{
		id: 10,
		category: 'licence',
		question: "Sur combien d'appareils puis-je utiliser ma licence ?",
		answer: 'Cela dépend du type de licence achetée. Les licences standard sont généralement valables pour 1 PC. Pour les licences multi-postes (Office 365 Family par exemple), vous pouvez les utiliser sur plusieurs appareils. Les détails sont précisés sur chaque fiche produit.',
	},
	{
		id: 11,
		category: 'licence',
		question: 'Ma licence est-elle à vie ?',
		answer: 'Les licences perpétuelles (comme Office 2021, Windows 10/11) sont valables à vie, sans abonnement. Les licences par abonnement (comme Office 365) sont valables pour la durée indiquée (1 an généralement).',
	},
	{
		id: 12,
		category: 'licence',
		question: 'Comment activer ma licence ?',
		answer: "Après l'installation du logiciel, entrez la clé de licence reçue par email lorsque le système vous le demande. Pour Windows, allez dans Paramètres > Système > Activation. Pour Office, ouvrez une application Office et suivez les instructions d'activation.",
	},
	{
		id: 13,
		category: 'support',
		question: 'Comment contacter le support technique ?',
		answer: 'Vous pouvez nous contacter via WhatsApp au +225 07 78 88 85 62 pour une réponse rapide, ou par email à sam_building@outlook.fr. Notre équipe est disponible du lundi au samedi, de 8h à 18h.',
	},
	{
		id: 14,
		category: 'support',
		question: "Proposez-vous une aide à l'installation ?",
		answer: "Oui, notre équipe technique peut vous guider pas à pas pour l'installation et l'activation de vos logiciels. Contactez-nous via WhatsApp et nous vous assisterons en temps réel.",
	},
	{
		id: 15,
		category: 'support',
		question: 'Quelle est votre politique de remboursement ?',
		answer: "Nous offrons une garantie de remboursement de 30 jours. Si votre licence ne fonctionne pas et que notre équipe ne peut pas résoudre le problème, vous serez intégralement remboursé. Contactez notre support pour initier une demande de remboursement.",
	},
];

const FAQPage = () => {
	const [activeCategory, setActiveCategory] = useState('all');
	const [openQuestion, setOpenQuestion] = useState<number | null>(null);
	const [searchQuery, setSearchQuery] = useState('');

	const filteredFaqs = faqs.filter((faq) => {
		const matchesCategory =
			activeCategory === 'all' || faq.category === activeCategory;
		const matchesSearch =
			faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
			faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
		return matchesCategory && matchesSearch;
	});

	const toggleQuestion = (id: number) => {
		setOpenQuestion(openQuestion === id ? null : id);
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
						backgroundImage: `url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
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
							<HelpCircle size={16} className="text-[#E63946]" />
							<span className="text-sm font-semibold text-white">
								CENTRE D'AIDE
							</span>
						</div>
						<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
							Questions <span className="text-[#E63946]">fréquentes</span>
						</h1>
						<p className="text-lg lg:text-xl text-white/80 leading-relaxed mb-10">
							Trouvez rapidement des réponses à toutes vos questions sur nos
							produits et services.
						</p>

						{/* Search Bar */}
						<div className="max-w-xl mx-auto">
							<div className="flex items-center bg-white rounded-xl overflow-hidden">
								<div className="flex-1 relative">
									<Search
										size={20}
										className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
									/>
									<input
										type="text"
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										placeholder="Rechercher une question..."
										className="w-full px-4 py-4 pl-12 text-gray-900 outline-none"
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* FAQ Content */}
			<section className="py-16 lg:py-20 bg-white">
				<div className="max-w-7xl mx-auto px-6">
					{/* Category Tabs */}
					<div className="flex flex-wrap justify-center gap-3 mb-12">
						{faqCategories.map((category) => {
							const Icon = category.icon;
							const isActive = activeCategory === category.id;

							return (
								<button
									key={category.id}
									type="button"
									onClick={() => setActiveCategory(category.id)}
									className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all duration-300 ${
										isActive
											? 'bg-[#1D73B3] text-white'
											: 'bg-gray-100 text-gray-600 hover:bg-gray-200'
									}`}
								>
									<Icon size={18} />
									{category.name}
								</button>
							);
						})}
					</div>

					{/* FAQ List */}
					<div className="max-w-3xl mx-auto space-y-4">
						{filteredFaqs.length === 0 ? (
							<div className="text-center py-16">
								<div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
									<Search size={32} className="text-gray-400" />
								</div>
								<h3 className="text-xl font-bold text-gray-900 mb-2">
									Aucun résultat trouvé
								</h3>
								<p className="text-gray-500">
									Essayez avec d'autres mots-clés ou consultez une autre
									catégorie.
								</p>
							</div>
						) : (
							filteredFaqs.map((faq) => {
								const isOpen = openQuestion === faq.id;

								return (
									<div
										key={faq.id}
										className={`bg-gray-50 rounded-2xl transition-all duration-300 overflow-hidden ${
											isOpen ? 'ring-2 ring-[#1D73B3]/20' : ''
										}`}
									>
										<button
											type="button"
											onClick={() => toggleQuestion(faq.id)}
											className="w-full flex items-center justify-between gap-4 p-6 text-left"
										>
											<h3 className="text-lg font-semibold text-gray-900">
												{faq.question}
											</h3>
											<ChevronDown
												size={22}
												className={`text-[#1D73B3] flex-shrink-0 transition-transform duration-300 ${
													isOpen ? 'rotate-180' : ''
												}`}
											/>
										</button>
										<div
											className={`overflow-hidden transition-all duration-300 ${
												isOpen ? 'max-h-96' : 'max-h-0'
											}`}
										>
											<div className="px-6 pb-6">
												<p className="text-gray-600 leading-relaxed">
													{faq.answer}
												</p>
											</div>
										</div>
									</div>
								);
							})
						)}
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-16 bg-gray-50">
				<div className="max-w-3xl mx-auto px-6">
					<div className="bg-white rounded-2xl p-8 lg:p-10 text-center border border-gray-100">
						<div className="w-16 h-16 bg-[#1D73B3]/10 rounded-full flex items-center justify-center mx-auto mb-6">
							<MessageCircle size={28} className="text-[#1D73B3]" />
						</div>
						<h2 className="text-2xl font-bold text-[#0D3A5C] mb-3">
							Vous n'avez pas trouvé votre réponse ?
						</h2>
						<p className="text-gray-500 mb-8">
							Notre équipe est disponible pour répondre à toutes vos questions.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Link
								href="/contact"
								className="px-6 py-3 bg-[#1D73B3] text-white font-semibold rounded-xl hover:bg-[#1558A0] transition-all duration-300"
							>
								Nous contacter
							</Link>
							<a
								href="https://wa.me/+22507788885862"
								target="_blank"
								rel="noopener noreferrer"
								className="px-6 py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-all duration-300 flex items-center justify-center gap-2"
							>
								<MessageCircle size={18} />
								WhatsApp
							</a>
						</div>
					</div>
				</div>
			</section>

			<Footer />
		</main>
	);
};

export default FAQPage;
