import { ChevronLeft, User } from 'lucide-react';
import Link from 'next/link';
import { Footer } from '~/components/footer';
import { Header } from '~/components/header';
import { requireSession } from '~/lib/session';
import { ProfilClient } from './components/profil-client';

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

				<ProfilClient
					user={{
						name: user.name,
						email: user.email,
						role: user.role,
						createdAt: user.createdAt,
					}}
				/>
			</div>
			<Footer />
		</>
	);
}
