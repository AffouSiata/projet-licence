import Link from 'next/link';
import { Key, ChevronLeft, MessageCircle, ShoppingBag } from 'lucide-react';
import { Header } from '~/components/header';
import { Footer } from '~/components/footer';

export default function LicencesPage() {
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
									<Key size={32} />
									Mes Licences
								</h1>
								<p className="text-white/80">
									Vos clés de produits vous sont envoyées directement
								</p>
							</div>
						</div>
					</div>
				</div>

				<div className="max-w-4xl mx-auto px-6 py-12">
					{/* Main Message */}
					<div className="bg-white rounded-2xl shadow-lg p-12 text-center">
						<div className="w-24 h-24 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-6">
							<MessageCircle size={48} className="text-green-600" />
						</div>
						<h2 className="text-3xl font-bold text-gray-900 mb-4">
							Vos licences vous sont envoyées par WhatsApp
						</h2>
						<p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto leading-relaxed">
							Après validation de votre commande, toutes vos clés de licence
							vous sont transmises directement via{' '}
							<strong>WhatsApp</strong> pour une livraison instantanée et
							sécurisée.
						</p>
						<div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-8 max-w-xl mx-auto">
							<h3 className="font-bold text-[#1D70B8] mb-2">
								Comment ça marche ?
							</h3>
							<ol className="text-left text-gray-700 space-y-2">
								<li className="flex items-start gap-2">
									<span className="font-bold text-[#1D70B8]">1.</span>
									<span>Vous passez votre commande sur notre boutique</span>
								</li>
								<li className="flex items-start gap-2">
									<span className="font-bold text-[#1D70B8]">2.</span>
									<span>
										Vous validez votre paiement via Orange Money ou autre
									</span>
								</li>
								<li className="flex items-start gap-2">
									<span className="font-bold text-[#1D70B8]">3.</span>
									<span>
										Vous recevez immédiatement vos licences par WhatsApp
									</span>
								</li>
							</ol>
						</div>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Link
								href="/products"
								className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#1D70B8] to-[#3B9DE8] text-white font-bold rounded-xl hover:shadow-lg transition-all"
							>
								<ShoppingBag size={20} />
								Passer une nouvelle commande
							</Link>
							<a
								href="https://wa.me/2250778888562"
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center gap-2 px-8 py-4 bg-[#25D366] text-white font-bold rounded-xl hover:shadow-lg transition-all"
							>
								<MessageCircle size={20} />
								Contacter le support
							</a>
						</div>
					</div>

					{/* Info Cards */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
						<div className="bg-white rounded-2xl shadow-lg p-6">
							<div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
								<Key size={24} className="text-[#1D70B8]" />
							</div>
							<h3 className="font-bold text-gray-800 mb-2">
								Licences authentiques
							</h3>
							<p className="text-gray-600 text-sm">
								Toutes nos licences sont 100% authentiques et proviennent de
								sources officielles. Garantie à vie sur tous nos produits.
							</p>
						</div>

						<div className="bg-white rounded-2xl shadow-lg p-6">
							<div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
								<MessageCircle size={24} className="text-green-600" />
							</div>
							<h3 className="font-bold text-gray-800 mb-2">Support 24/7</h3>
							<p className="text-gray-600 text-sm">
								Notre équipe est disponible à tout moment pour vous aider avec
								l'installation et l'activation de vos licences.
							</p>
						</div>
					</div>
				</div>
			</div>
			<Footer />
		</>
	);
}
