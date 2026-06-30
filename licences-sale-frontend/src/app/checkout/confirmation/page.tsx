'use client';

import Link from 'next/link';
import {
	CheckCircle,
	Package,
	Mail,
	Key,
	Download,
	Home,
	ShoppingBag,
	Calendar,
	CreditCard,
	Phone,
} from 'lucide-react';

export default function ConfirmationPage() {
	// Données mockées - seront remplacées par l'API
	const orderData = {
		orderNumber: 'CMD-2026-12345',
		date: '02 Avr 2026, 14:30',
		customerName: 'Client',
		customerEmail: 'client@example.com',
		customerPhone: '+225 07 XX XX XX XX',
		paymentMethod: 'Orange Money',
		products: [
			{ id: 1, name: 'Windows 11 Professionnel', quantity: 1, price: 45000 },
			{ id: 2, name: 'Office 2024 Pro Plus', quantity: 1, price: 65000 },
		],
		totalAmount: 110000,
		whatsappUrl: 'https://wa.me/2250778888562',
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
			{/* Success Header */}
			<div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-16">
				<div className="max-w-4xl mx-auto px-6 text-center">
					<div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
						<CheckCircle size={60} className="text-green-500" />
					</div>
					<h1 className="text-4xl font-bold mb-4">Commande confirmée !</h1>
					<p className="text-xl text-white/90 mb-2">
						Merci pour votre confiance, {orderData.customerName}
					</p>
					<p className="text-white/80">
						Votre commande a été reçue et est en cours de traitement
					</p>
				</div>
			</div>

			<div className="max-w-4xl mx-auto px-6 py-8 -mt-8">
				{/* Order Number Card */}
				<div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
					<div className="text-center">
						<p className="text-sm text-gray-500 mb-2">Numéro de commande</p>
						<h2 className="text-3xl font-bold text-[#1D70B8] mb-6">
							{orderData.orderNumber}
						</h2>

						<div className="flex flex-wrap justify-center gap-4 text-sm">
							<div className="flex items-center gap-2 text-gray-600">
								<Calendar size={16} />
								{orderData.date}
							</div>
							<div className="flex items-center gap-2 text-gray-600">
								<CreditCard size={16} />
								{orderData.paymentMethod}
							</div>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Main Content */}
					<div className="lg:col-span-2 space-y-8">
						{/* What's Next */}
						<div className="bg-white rounded-2xl shadow-lg p-6">
							<h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
								<Package size={24} className="text-[#1D70B8]" />
								Prochaines étapes
							</h3>

							<div className="space-y-4">
								<div className="flex gap-4 p-4 bg-blue-50 rounded-xl">
									<div className="w-10 h-10 bg-[#1D70B8] rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
										1
									</div>
									<div className="flex-1">
										<h4 className="font-semibold text-gray-800 mb-1">
											Vérification de paiement
										</h4>
										<p className="text-sm text-gray-600">
											Nous vérifions votre paiement Orange Money (peut prendre
											quelques minutes)
										</p>
									</div>
								</div>

								<div className="flex gap-4 p-4 bg-green-50 rounded-xl">
									<div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
										2
									</div>
									<div className="flex-1">
										<h4 className="font-semibold text-gray-800 mb-1">
											Réception par email
										</h4>
										<p className="text-sm text-gray-600">
											Vos clés de licence seront envoyées à{' '}
											<span className="font-semibold">
												{orderData.customerEmail}
											</span>{' '}
											dans les prochaines minutes
										</p>
									</div>
								</div>

								<div className="flex gap-4 p-4 bg-purple-50 rounded-xl">
									<div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
										3
									</div>
									<div className="flex-1">
										<h4 className="font-semibold text-gray-800 mb-1">
											Installation
										</h4>
										<p className="text-sm text-gray-600">
											Suivez les instructions fournies pour activer vos produits
										</p>
									</div>
								</div>
							</div>
						</div>

						{/* Order Summary */}
						<div className="bg-white rounded-2xl shadow-lg p-6">
							<h3 className="text-xl font-bold text-gray-800 mb-6">
								Récapitulatif de commande
							</h3>

							<div className="space-y-4">
								{orderData.products.map((product) => (
									<div
										key={product.id}
										className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0"
									>
										<div className="flex items-center gap-4">
											<div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
												<Key size={20} className="text-[#1D70B8]" />
											</div>
											<div>
												<h4 className="font-semibold text-gray-800">
													{product.name}
												</h4>
												<p className="text-sm text-gray-500">
													Quantité : {product.quantity}
												</p>
											</div>
										</div>
										<div className="text-right">
											<div className="font-bold text-gray-800">
												{(product.price * product.quantity).toLocaleString()} F
											</div>
										</div>
									</div>
								))}
							</div>

							<div className="mt-6 pt-6 border-t border-gray-200">
								<div className="flex items-center justify-between">
									<span className="text-lg font-semibold text-gray-800">
										Total
									</span>
									<span className="text-2xl font-bold text-[#1D70B8]">
										{orderData.totalAmount.toLocaleString()} F
									</span>
								</div>
							</div>
						</div>

						{/* WhatsApp Contact */}
						{orderData.whatsappUrl && (
							<div className="bg-gradient-to-r from-[#25D366] to-[#20BA59] rounded-2xl p-6 text-white">
								<div className="flex items-start gap-4">
									<div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
										<Phone size={24} />
									</div>
									<div className="flex-1">
										<h4 className="font-bold mb-2">Besoin d'aide ?</h4>
										<p className="text-white/90 text-sm mb-4">
											Notre équipe est disponible sur WhatsApp pour répondre à
											toutes vos questions
										</p>
										<a
											href={orderData.whatsappUrl}
											target="_blank"
											rel="noopener noreferrer"
											className="inline-block px-6 py-3 bg-white text-[#25D366] rounded-lg font-semibold hover:bg-gray-50 transition-all"
										>
											Contacter par WhatsApp
										</a>
									</div>
								</div>
							</div>
						)}
					</div>

					{/* Sidebar */}
					<div className="lg:col-span-1 space-y-6">
						{/* Quick Actions */}
						<div className="bg-white rounded-2xl shadow-lg p-6">
							<h4 className="font-bold text-gray-800 mb-4">Actions rapides</h4>

							<div className="space-y-3">
								<Link
									href="/compte/licences"
									className="flex items-center gap-3 p-3 bg-[#1D70B8] hover:bg-[#0D3A5C] text-white rounded-xl font-medium transition-all"
								>
									<Key size={18} />
									Voir mes licences
								</Link>

								<Link
									href="/compte/commandes"
									className="flex items-center gap-3 p-3 bg-white border-2 border-gray-200 hover:border-[#1D70B8] text-gray-700 hover:text-[#1D70B8] rounded-xl font-medium transition-all"
								>
									<Package size={18} />
									Mes commandes
								</Link>

								<button
									type="button"
									className="w-full flex items-center gap-3 p-3 bg-white border-2 border-gray-200 hover:border-[#E63946] text-gray-700 hover:text-[#E63946] rounded-xl font-medium transition-all"
								>
									<Download size={18} />
									Télécharger facture
								</button>

								<Link
									href="/"
									className="flex items-center gap-3 p-3 bg-white border-2 border-gray-200 hover:border-[#FF6600] text-gray-700 hover:text-[#FF6600] rounded-xl font-medium transition-all"
								>
									<ShoppingBag size={18} />
									Continuer mes achats
								</Link>

								<Link
									href="/"
									className="flex items-center gap-3 p-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all"
								>
									<Home size={18} />
									Retour à l'accueil
								</Link>
							</div>
						</div>

						{/* Important Info */}
						<div className="bg-blue-50 border-2 border-blue-100 rounded-2xl p-6">
							<div className="flex items-start gap-3">
								<Mail size={20} className="text-[#1D70B8] flex-shrink-0 mt-1" />
								<div>
									<h5 className="font-semibold text-gray-800 mb-2">
										Email de confirmation
									</h5>
									<p className="text-sm text-gray-600">
										Un email de confirmation contenant tous les détails de votre
										commande vous a été envoyé.
									</p>
								</div>
							</div>
						</div>

						{/* Support Info */}
						<div className="bg-white rounded-2xl shadow-lg p-6">
							<h5 className="font-semibold text-gray-800 mb-4">
								Informations de contact
							</h5>
							<div className="space-y-3 text-sm">
								<div className="flex items-center gap-3">
									<Mail size={16} className="text-gray-400" />
									<span className="text-gray-600">
										{orderData.customerEmail}
									</span>
								</div>
								<div className="flex items-center gap-3">
									<Phone size={16} className="text-gray-400" />
									<span className="text-gray-600">
										{orderData.customerPhone}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
