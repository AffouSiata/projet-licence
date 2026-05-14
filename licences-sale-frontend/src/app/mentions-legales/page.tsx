import Link from 'next/link';
import { Scale, ChevronRight } from 'lucide-react';
import { Header } from '~/components/header';
import { Footer } from '~/components/footer';

export default function MentionsLegalesPage() {
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
						<span className="text-[#1D70B8] font-medium">Mentions Légales</span>
					</nav>

					{/* Header */}
					<div className="flex items-center gap-4 mb-8">
						<div className="w-14 h-14 bg-[#1D70B8]/10 rounded-2xl flex items-center justify-center">
							<Scale size={28} className="text-[#1D70B8]" />
						</div>
						<div>
							<h1 className="text-3xl font-bold text-[#0D3A5C]">
								Mentions Légales
							</h1>
							<p className="text-gray-500">
								Informations légales sur l'entreprise
							</p>
						</div>
					</div>

					{/* Content */}
					<div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
						<section>
							<h2 className="text-xl font-bold text-[#0D3A5C] mb-4">
								Éditeur du site
							</h2>
							<div className="text-gray-600 leading-relaxed space-y-2">
								<p>
									<strong>Nom de l'entreprise :</strong> License Sale
								</p>
								<p>
									<strong>Forme juridique :</strong> [À compléter]
								</p>
								<p>
									<strong>Capital social :</strong> [À compléter]
								</p>
								<p>
									<strong>Numéro RCCM :</strong> [À compléter]
								</p>
								<p>
									<strong>Siège social :</strong> Abidjan, Côte d'Ivoire
								</p>
								<p>
									<strong>Téléphone :</strong> +225 07 78 88 85 62
								</p>
								<p>
									<strong>Email :</strong> sam_building@outlook.fr
								</p>
							</div>
						</section>

						<section>
							<h2 className="text-xl font-bold text-[#0D3A5C] mb-4">
								Directeur de la publication
							</h2>
							<p className="text-gray-600 leading-relaxed">
								<strong>Nom :</strong> [À compléter]
								<br />
								<strong>Qualité :</strong> Gérant
							</p>
						</section>

						<section>
							<h2 className="text-xl font-bold text-[#0D3A5C] mb-4">
								Hébergement
							</h2>
							<div className="text-gray-600 leading-relaxed space-y-2">
								<p>
									<strong>Hébergeur :</strong> [À compléter - ex: Vercel, OVH,
									etc.]
								</p>
								<p>
									<strong>Adresse :</strong> [À compléter]
								</p>
								<p>
									<strong>Site web :</strong> [À compléter]
								</p>
							</div>
						</section>

						<section>
							<h2 className="text-xl font-bold text-[#0D3A5C] mb-4">
								Activité
							</h2>
							<p className="text-gray-600 leading-relaxed">
								License Sale est spécialisé dans la vente de licences
								logicielles numériques. Nous proposons des clés d'activation
								pour les systèmes d'exploitation Windows, les suites Microsoft
								Office, les antivirus, et de nombreux autres logiciels
								professionnels.
							</p>
						</section>

						<section>
							<h2 className="text-xl font-bold text-[#0D3A5C] mb-4">
								Propriété intellectuelle
							</h2>
							<p className="text-gray-600 leading-relaxed">
								L'ensemble du contenu de ce site (textes, images, logos,
								éléments graphiques) est protégé par le droit d'auteur. Toute
								reproduction, représentation, modification ou exploitation non
								autorisée de tout ou partie du site est interdite.
							</p>
							<p className="text-gray-600 leading-relaxed mt-3">
								Les marques et logos des éditeurs de logiciels (Microsoft,
								Adobe, Norton, Autodesk, etc.) sont la propriété de leurs
								détenteurs respectifs.
							</p>
						</section>

						<section>
							<h2 className="text-xl font-bold text-[#0D3A5C] mb-4">
								Responsabilité
							</h2>
							<p className="text-gray-600 leading-relaxed">
								License Sale s'efforce d'assurer l'exactitude des informations
								diffusées sur ce site. Toutefois, nous ne pouvons garantir
								l'exactitude, la précision ou l'exhaustivité des informations
								mises à disposition.
							</p>
							<p className="text-gray-600 leading-relaxed mt-3">
								License Sale décline toute responsabilité pour toute
								imprécision, inexactitude ou omission portant sur des
								informations disponibles sur le site.
							</p>
						</section>

						<section>
							<h2 className="text-xl font-bold text-[#0D3A5C] mb-4">
								Liens hypertextes
							</h2>
							<p className="text-gray-600 leading-relaxed">
								Le site peut contenir des liens vers d'autres sites internet.
								License Sale n'exerce aucun contrôle sur ces sites et décline
								toute responsabilité quant à leur contenu.
							</p>
						</section>

						<section>
							<h2 className="text-xl font-bold text-[#0D3A5C] mb-4">
								Droit applicable
							</h2>
							<p className="text-gray-600 leading-relaxed">
								Les présentes mentions légales sont soumises au droit ivoirien.
								En cas de litige, les tribunaux d'Abidjan seront seuls
								compétents.
							</p>
						</section>

						<section>
							<h2 className="text-xl font-bold text-[#0D3A5C] mb-4">Contact</h2>
							<p className="text-gray-600 leading-relaxed">
								Pour toute question concernant ces mentions légales, vous pouvez
								nous contacter :
							</p>
							<ul className="list-disc list-inside text-gray-600 mt-3 space-y-2">
								<li>Par WhatsApp : +225 07 78 88 85 62</li>
								<li>Par email : sam_building@outlook.fr</li>
								<li>
									Via notre{' '}
									<Link
										href="/contact"
										className="text-[#1D70B8] hover:underline"
									>
										formulaire de contact
									</Link>
								</li>
							</ul>
						</section>
					</div>
				</div>
			</main>
			<Footer />
		</>
	);
}
