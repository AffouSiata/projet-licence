import { AlertCircle } from 'lucide-react';
import type { Order } from '~/validators/orders';
import { OrdersTable } from './components/orders-table';
import { fetchOrdersApi } from './lib';

const OrdersPage = async () => {
	let orders: Order[] | null = null;

	try {
		orders = await fetchOrdersApi();
	} catch (error) {
		console.error('Erreur chargement commandes:', error);
	}

	return (
		<div className="p-8">
			<p className="text-gray-500 mb-6">
				Suivez et gérez les commandes de vos clients.
			</p>

			{orders ? (
				<OrdersTable orders={orders} />
			) : (
				<div className="bg-white rounded-2xl ring-1 ring-gray-200/70 shadow-sm p-12">
					<div className="flex flex-col items-center text-center text-gray-500">
						<div className="w-12 h-12 rounded-xl bg-[#E63946]/10 flex items-center justify-center mb-4">
							<AlertCircle size={24} className="text-[#E63946]" />
						</div>
						<p className="text-sm font-medium text-gray-700">
							Erreur lors du chargement des commandes
						</p>
					</div>
				</div>
			)}
		</div>
	);
};

export default OrdersPage;
