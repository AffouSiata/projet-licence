import Link from 'next/link';
import { ShoppingBag, ChevronLeft } from 'lucide-react';
import { Header } from '~/components/header';
import { Footer } from '~/components/footer';
import { requireSession } from '~/lib/session';
import { api } from '~/lib/api';
import { CommandesClient } from './components/commandes-client';

interface OrderItem {
	productName: string;
	quantity: number;
	price: number;
}

interface Order {
	id: string;
	orderNumber: string;
	totalAmount: number;
	status: string;
	createdAt: string;
	items?: OrderItem[];
	metadata?: {
		paymentMethod?: string;
	};
}

async function getOrders(): Promise<Order[]> {
	try {
		return await api.get<Order[]>('/orders/me');
	} catch {
		return [];
	}
}

export default async function CommandesPage() {
	await requireSession();
	const orders = await getOrders();

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
									<ShoppingBag size={32} />
									Mes Commandes
								</h1>
								<p className="text-white/80">
									Consultez l'historique complet de vos achats
								</p>
							</div>
							<div className="text-right">
								<div className="text-4xl font-bold">{orders.length}</div>
								<div className="text-white/80 text-sm">Commandes totales</div>
							</div>
						</div>
					</div>
				</div>

				<CommandesClient orders={orders} />
			</div>
			<Footer />
		</>
	);
}
