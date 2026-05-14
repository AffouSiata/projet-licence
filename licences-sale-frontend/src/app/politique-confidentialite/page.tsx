import Link from 'next/link';

const PolitiqueConfidentialitePage = () => {
	return (
		<div className="min-h-screen bg-gray-50 py-12 px-4">
			<div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
				<div className="mb-8">
					<Link
						href="/auth/register"
						className="inline-flex items-center text-[#1B75BC] hover:text-[#1565A6] font-medium transition-colors mb-6"
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
						Retour à l'inscription
					</Link>

					<h1 className="text-4xl font-bold text-gray-900 mb-4">
						Politique de confidentialité
					</h1>
					<p className="text-gray-600">
						Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
					</p>
				</div>

				<div className="prose prose-lg max-w-none">
					<section className="mb-8">
						<h2 className="text-2xl font-semibold text-gray-900 mb-4">
							1. Collecte des informations
						</h2>
						<p className="text-gray-700 leading-relaxed">
							License Sale collecte les informations que vous nous fournissez
							directement lors de la création de votre compte, notamment votre
							nom, votre adresse e-mail et votre mot de passe.
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-semibold text-gray-900 mb-4">
							2. Utilisation des informations
						</h2>
						<p className="text-gray-700 leading-relaxed mb-3">
							Nous utilisons vos informations pour :
						</p>
						<ul className="list-disc list-inside space-y-2 text-gray-700">
							<li>Gérer votre compte et vous fournir nos services</li>
							<li>Traiter vos commandes de licences numériques</li>
							<li>Vous envoyer des communications importantes</li>
							<li>Améliorer notre plateforme et nos services</li>
						</ul>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-semibold text-gray-900 mb-4">
							3. Protection des données
						</h2>
						<p className="text-gray-700 leading-relaxed">
							Nous mettons en œuvre des mesures de sécurité appropriées pour
							protéger vos informations personnelles contre tout accès non
							autorisé, modification, divulgation ou destruction. Vos mots de
							passe sont cryptés et stockés en toute sécurité.
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-semibold text-gray-900 mb-4">
							4. Partage des informations
						</h2>
						<p className="text-gray-700 leading-relaxed">
							Nous ne vendons, n'échangeons ni ne louons vos informations
							personnelles à des tiers. Nous pouvons partager vos informations
							uniquement dans les cas suivants :
						</p>
						<ul className="list-disc list-inside space-y-2 text-gray-700 mt-3">
							<li>Avec votre consentement explicite</li>
							<li>Pour se conformer à la loi ou à une procédure légale</li>
							<li>Pour protéger nos droits et notre sécurité</li>
						</ul>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-semibold text-gray-900 mb-4">
							5. Vos droits
						</h2>
						<p className="text-gray-700 leading-relaxed mb-3">
							Vous disposez des droits suivants concernant vos données
							personnelles :
						</p>
						<ul className="list-disc list-inside space-y-2 text-gray-700">
							<li>Droit d'accès à vos données</li>
							<li>Droit de rectification de vos données</li>
							<li>Droit à l'effacement de vos données</li>
							<li>Droit à la portabilité de vos données</li>
						</ul>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-semibold text-gray-900 mb-4">
							6. Cookies
						</h2>
						<p className="text-gray-700 leading-relaxed">
							Nous utilisons des cookies pour améliorer votre expérience sur
							notre site. Les cookies sont de petits fichiers stockés sur votre
							appareil qui nous aident à vous reconnaître et à mémoriser vos
							préférences.
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-semibold text-gray-900 mb-4">
							7. Contact
						</h2>
						<p className="text-gray-700 leading-relaxed">
							Pour toute question concernant cette politique de confidentialité
							ou pour exercer vos droits, vous pouvez nous contacter à :
						</p>
						<div className="mt-4 p-4 bg-gray-50 rounded-lg">
							<p className="text-gray-700">
								<strong>Email :</strong> sam_building@outlook.fr
							</p>
							<p className="text-gray-700">
								<strong>Téléphone :</strong> +225 07 78 88 85 62
							</p>
						</div>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-semibold text-gray-900 mb-4">
							8. Modifications
						</h2>
						<p className="text-gray-700 leading-relaxed">
							Nous nous réservons le droit de modifier cette politique de
							confidentialité à tout moment. Les modifications entreront en
							vigueur dès leur publication sur cette page. Nous vous
							encourageons à consulter régulièrement cette page pour rester
							informé.
						</p>
					</section>
				</div>

				<div className="mt-12 pt-8 border-t border-gray-200">
					<Link
						href="/auth/register"
						className="inline-flex items-center justify-center px-6 py-3 bg-[#E63946] text-white rounded-lg font-medium hover:bg-[#DC2F3D] transition-all shadow-lg"
					>
						<svg
							className="w-5 h-5 mr-2"
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
						Retour à l'inscription
					</Link>
				</div>
			</div>
		</div>
	);
};

export default PolitiqueConfidentialitePage;
