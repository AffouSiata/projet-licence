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
			<div className="flex items-center justify-between mb-8">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Commandes</h1>
					<p className="text-gray-600 mt-2">
						Suivez et gérez les commandes de vos clients
					</p>
				</div>
			</div>

			{orders ? (
				<>
					<div className="mb-4 text-sm text-gray-600">
						{orders.length} commande{orders.length > 1 ? 's' : ''} au total
					</div>
					<OrdersTable orders={orders} />
				</>
			) : (
				<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12">
					<div className="text-center text-gray-500">
						<p>Erreur lors du chargement des commandes</p>
					</div>
				</div>
			)}
		</div>
	);
};

export default OrdersPage;
