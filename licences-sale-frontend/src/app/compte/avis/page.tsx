import { Info } from 'lucide-react';
import Link from 'next/link';
import { Footer } from '~/components/footer';
import { Header } from '~/components/header';
import { requireSession } from '~/lib/session';
import { AvisClient } from './components/avis-client';

export default async function CompteAvisPage() {
	await requireSession();

	return (
		<>
			<Header />
			<main className="min-h-screen bg-[#FAFBFC] py-10 lg:py-14">
				<div className="mx-auto max-w-3xl px-6 lg:px-8">
					<nav className="mb-6 text-[13px] text-slate-500">
						<Link href="/compte" className="hover:text-[#1D73B3]">
							Mon compte
						</Link>
						<span className="mx-2 text-slate-300">/</span>
						<span className="font-medium text-[#1B3A5F]">Laisser un avis</span>
					</nav>

					<h1 className="text-2xl font-bold tracking-tight text-[#1B3A5F] lg:text-3xl">
						Partagez votre expérience
					</h1>
					<p className="mt-2 text-[14px] text-slate-500">
						Votre avis aide les autres clients et sera publié sur le site après
						validation.
					</p>

					<div className="mt-5 mb-8 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
						<Info size={18} className="mt-0.5 shrink-0 text-[#1D73B3]" />
						<p className="text-[13px] leading-relaxed text-slate-600">
							Seuls les clients ayant déjà passé une commande peuvent laisser un
							avis. Chaque avis est vérifié par notre équipe avant publication.
						</p>
					</div>

					<AvisClient />
				</div>
			</main>
			<Footer />
		</>
	);
}
