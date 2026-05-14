import Link from 'next/link';
import { User, ChevronLeft, Mail, AlertCircle } from 'lucide-react';
import { requireSession } from '~/lib/session';
import { Header } from '~/components/header';
import { Footer } from '~/components/footer';

export default async function ProfilPage() {
	const user = await requireSession();

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
									<User size={32} />
									Mon Profil
								</h1>
								<p className="text-white/80">
									Gérez vos informations personnelles
								</p>
							</div>
						</div>
					</div>
				</div>

				<div className="max-w-4xl mx-auto px-6 py-8">
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
						{/* Sidebar - Avatar */}
						<div className="lg:col-span-1">
							<div className="bg-white rounded-2xl shadow-lg p-6">
								<div className="text-center">
									<div className="relative inline-block mb-4">
										<div className="w-32 h-32 bg-gradient-to-br from-[#1D70B8] to-[#3B9DE8] rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg">
											{user.name.charAt(0).toUpperCase()}
										</div>
									</div>
									<h3 className="text-xl font-bold text-gray-800 mb-1">
										{user.name}
									</h3>
									<p className="text-gray-500 text-sm mb-4">{user.email}</p>
									<div className="px-4 py-2 bg-blue-50 text-[#1D70B8] rounded-lg text-sm font-semibold inline-block">
										{user.role === 'ADMIN' || user.role === 'SUPER_ADMIN'
											? 'Administrateur'
											: 'Membre'}
									</div>
								</div>

								<div className="mt-6 pt-6 border-t border-gray-100">
									<div className="space-y-3">
										<div className="flex items-center gap-3 text-sm">
											<div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
												<Mail size={14} className="text-[#1D70B8]" />
											</div>
											<div className="flex-1">
												<div className="text-xs text-gray-500">Email</div>
												<div className="font-medium text-gray-800">
													{user.email}
												</div>
											</div>
										</div>
										<div className="flex items-center gap-3 text-sm">
											<div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
												<User size={14} className="text-gray-600" />
											</div>
											<div className="flex-1">
												<div className="text-xs text-gray-500">Nom complet</div>
												<div className="font-medium text-gray-800">
													{user.name}
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Main Form */}
						<div className="lg:col-span-2">
							{/* Info Notice */}
							<div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6 flex items-start gap-3">
								<AlertCircle
									size={20}
									className="text-[#1D70B8] flex-shrink-0 mt-0.5"
								/>
								<div>
									<h4 className="font-bold text-[#1D70B8] mb-1">
										Modification du profil bientôt disponible
									</h4>
									<p className="text-sm text-gray-600">
										La fonctionnalité de modification des informations
										personnelles sera disponible prochainement.
									</p>
								</div>
							</div>

							<div className="bg-white rounded-2xl shadow-lg p-6">
								<div className="flex items-center justify-between mb-6">
									<h2 className="text-xl font-bold text-gray-800">
										Informations personnelles
									</h2>
								</div>

								<div className="space-y-6">
									{/* Nom */}
									<div>
										<label className="block text-sm font-semibold text-gray-700 mb-2">
											Nom complet
										</label>
										<div className="relative">
											<User
												size={18}
												className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
											/>
											<input
												type="text"
												value={user.name}
												disabled
												className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl outline-none opacity-75 cursor-not-allowed"
											/>
										</div>
									</div>

									{/* Email */}
									<div>
										<label className="block text-sm font-semibold text-gray-700 mb-2">
											Adresse email
										</label>
										<div className="relative">
											<Mail
												size={18}
												className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
											/>
											<input
												type="email"
												value={user.email}
												disabled
												className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl outline-none opacity-75 cursor-not-allowed"
											/>
										</div>
									</div>

									{/* Membre depuis */}
									<div>
										<label className="block text-sm font-semibold text-gray-700 mb-2">
											Membre depuis
										</label>
										<input
											type="text"
											value={new Date(user.createdAt).toLocaleDateString(
												'fr-FR',
												{
													day: 'numeric',
													month: 'long',
													year: 'numeric',
												}
											)}
											disabled
											className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl outline-none opacity-75 cursor-not-allowed"
										/>
									</div>
								</div>
							</div>

							{/* Sécurité */}
							<div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
								<h2 className="text-xl font-bold text-gray-800 mb-4">
									Sécurité
								</h2>
								<p className="text-gray-600 mb-4">
									Protégez votre compte en modifiant votre mot de passe
									régulièrement.
								</p>
								<Link
									href="/compte/securite"
									className="inline-flex items-center gap-2 px-6 py-3 bg-[#1D70B8] text-white font-semibold rounded-xl hover:bg-[#0D3A5C] transition-colors"
								>
									Modifier mon mot de passe
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
			<Footer />
		</>
	);
}
