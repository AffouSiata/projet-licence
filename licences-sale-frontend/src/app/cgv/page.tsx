import Link from 'next/link';
import { FileText, ChevronRight } from 'lucide-react';
import { Header } from '~/components/header';
import { Footer } from '~/components/footer';

export default function CGVPage() {
	return (
		<>
			<Header />
			<main className="min-h-screen bg-gray-50 pt-8 pb-16">
				<div className="max-w-4xl mx-auto px-4">
					{/* Breadcrumb */}
					<nav className="flex items-center gap-2 text-sm mb-8">
						<Link href="/" className="text-gray-500 hover:text-[#1D70B8]">
							Accueil
						</Link>
						<ChevronRight size={14} className="text-gray-300" />
						<span className="text-[#1D70B8] font-medium">
							Conditions Générales de Vente
						</span>
					</nav>

					{/* Header */}
					<div className="flex items-center gap-4 mb-8">
						<div className="w-14 h-14 bg-[#1D70B8]/10 rounded-2xl flex items-center justify-center">
							<FileText size={28} className="text-[#1D70B8]" />
						</div>
						<div>
							<h1 className="text-3xl font-bold text-[#0D3A5C]">
								Conditions Générales de Vente
							</h1>
							<p className="text-gray-500">Dernière mise à jour : Avril 2026</p>
						</div>
					</div>

					{/* Content */}
					<div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
						<section>
							<h2 className="text-xl font-bold text-[#0D3A5C] mb-4">
								Article 1 - Objet
							</h2>
							<p className="text-gray-600 leading-relaxed">
								Les présentes Conditions Générales de Vente (CGV) régissent les
								ventes de licences logicielles effectuées sur le site License
								Sale. Toute commande implique l'acceptation sans réserve des
								présentes CGV.
							</p>
						</section>

						<section>
							<h2 className="text-xl font-bold text-[#0D3A5C] mb-4">
								Article 2 - Produits
							</h2>
							<p className="text-gray-600 leading-relaxed">
								License Sale propose à la vente des licences logicielles
								numériques (clés d'activation) pour différents logiciels :
								systèmes d'exploitation Windows, suites bureautiques Microsoft
								Office, logiciels antivirus, logiciels Adobe, Autodesk, et
								autres.
							</p>
							<p className="text-gray-600 leading-relaxed mt-3">
								Toutes les licences vendues sont authentiques et proviennent de
								sources officielles. Elles sont destinées à un usage personnel
								ou professionnel selon les termes de chaque éditeur.
							</p>
						</section>

						<section>
							<h2 className="text-xl font-bold text-[#0D3A5C] mb-4">
								Article 3 - Prix
							</h2>
							<p className="text-gray-600 leading-relaxed">
								Les prix sont indiqués en Francs CFA (F CFA) toutes taxes
								comprises. License Sale se réserve le droit de modifier ses prix
								à tout moment, mais les produits seront facturés sur la base des
								tarifs en vigueur au moment de la validation de la commande.
							</p>
						</section>

						<section>
							<h2 className="text-xl font-bold text-[#0D3A5C] mb-4">
								Article 4 - Commande
							</h2>
							<p className="text-gray-600 leading-relaxed">
								Pour passer commande, le client doit remplir le formulaire de
								commande en fournissant ses informations personnelles (nom,
								prénom, email, numéro WhatsApp). La commande est confirmée après
								réception du paiement.
							</p>
						</section>

						<section>
							<h2 className="text-xl font-bold text-[#0D3A5C] mb-4">
								Article 5 - Paiement
							</h2>
							<p className="text-gray-600 leading-relaxed">
								Le paiement peut être effectué par les moyens suivants :
							</p>
							<ul className="list-disc list-inside text-gray-600 mt-3 space-y-2">
								<li>Orange Money</li>
								<li>MTN Mobile Money</li>
								<li>PayPal</li>
								<li>Carte Visa</li>
							</ul>
							<p className="text-gray-600 leading-relaxed mt-3">
								Le paiement est exigible immédiatement à la commande. La
								commande ne sera traitée qu'après confirmation du paiement.
							</p>
						</section>

						<section>
							<h2 className="text-xl font-bold text-[#0D3A5C] mb-4">
								Article 6 - Livraison
							</h2>
							<p className="text-gray-600 leading-relaxed">
								Les licences sont livrées par voie électronique (email et/ou
								WhatsApp) dans un délai de quelques minutes à 24 heures maximum
								après confirmation du paiement. Le client recevra sa clé de
								licence ainsi que les instructions d'activation.
							</p>
						</section>

						<section>
							<h2 className="text-xl font-bold text-[#0D3A5C] mb-4">
								Article 7 - Droit de rétractation
							</h2>
							<p className="text-gray-600 leading-relaxed">
								Conformément à la réglementation en vigueur, le droit de
								rétractation ne s'applique pas aux contenus numériques fournis
								sur un support immatériel dont l'exécution a commencé après
								accord préalable du consommateur. Une fois la clé de licence
								envoyée, aucun remboursement ne pourra être effectué.
							</p>
						</section>

						<section>
							<h2 className="text-xl font-bold text-[#0D3A5C] mb-4">
								Article 8 - Garantie
							</h2>
							<p className="text-gray-600 leading-relaxed">
								License Sale garantit le bon fonctionnement des clés de licence
								vendues. En cas de problème d'activation, notre service client
								est disponible pour vous assister. Si la clé s'avère
								défectueuse, un remplacement ou un remboursement sera proposé.
							</p>
						</section>

						<section>
							<h2 className="text-xl font-bold text-[#0D3A5C] mb-4">
								Article 9 - Service client
							</h2>
							<p className="text-gray-600 leading-relaxed">
								Pour toute question ou réclamation, vous pouvez nous contacter :
							</p>
							<ul className="list-disc list-inside text-gray-600 mt-3 space-y-2">
								<li>Par WhatsApp : +225 07 78 88 85 62</li>
								<li>Par email : sam_building@outlook.fr</li>
							</ul>
						</section>

						<section>
							<h2 className="text-xl font-bold text-[#0D3A5C] mb-4">
								Article 10 - Propriété intellectuelle
							</h2>
							<p className="text-gray-600 leading-relaxed">
								Les licences vendues restent la propriété intellectuelle de
								leurs éditeurs respectifs (Microsoft, Adobe, Norton, Autodesk,
								etc.). L'achat d'une licence confère uniquement un droit
								d'utilisation selon les termes définis par chaque éditeur.
							</p>
						</section>

						<section>
							<h2 className="text-xl font-bold text-[#0D3A5C] mb-4">
								Article 11 - Litiges
							</h2>
							<p className="text-gray-600 leading-relaxed">
								Les présentes CGV sont soumises au droit ivoirien. En cas de
								litige, une solution amiable sera recherchée avant toute action
								judiciaire. À défaut, les tribunaux d'Abidjan seront seuls
								compétents.
							</p>
						</section>
					</div>
				</div>
			</main>
			<Footer />
		</>
	);
}
