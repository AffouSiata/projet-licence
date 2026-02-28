'use client';

import Link from 'next/link';
import type { Order } from '~/validators/orders';
import { StatusBadge } from '../orders/components/status-badge';

interface RecentOrdersTableProps {
	orders: Order[];
}

export const RecentOrdersTable = ({ orders }: RecentOrdersTableProps) => {
	if (orders.length === 0) {
		return (
			<div className="text-gray-600 text-center py-8">
				Aucune commande pour le moment
			</div>
		);
	}

	return (
		<div>
			<div className="overflow-x-auto">
				<table className="w-full">
					<thead className="bg-gray-50 border-b border-gray-200">
						<tr>
							<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								N° Commande
							</th>
							<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Client
							</th>
							<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Total
							</th>
							<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Statut
							</th>
							<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Date
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-200">
						{orders.map((order) => {
							const totalAmount =
								typeof order.totalAmount === 'string'
									? Number.parseFloat(order.totalAmount)
									: order.totalAmount;

							return (
								<tr
									key={order.id}
									className="hover:bg-gray-50 transition-colors"
								>
									<td className="px-4 py-3 whitespace-nowrap">
										<p className="text-sm font-medium text-gray-900">
											{order.orderNumber}
										</p>
									</td>
									<td className="px-4 py-3 whitespace-nowrap">
										<p className="text-sm text-gray-900">
											{order.customerName}
										</p>
									</td>
									<td className="px-4 py-3 whitespace-nowrap">
										<p className="text-sm font-medium text-gray-900">
											{totalAmount.toFixed(2)} FCFA
										</p>
									</td>
									<td className="px-4 py-3 whitespace-nowrap">
										<StatusBadge status={order.status} />
									</td>
									<td className="px-4 py-3 whitespace-nowrap">
										<p className="text-sm text-gray-600">
											{new Date(order.createdAt).toLocaleDateString('fr-FR')}
										</p>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
			<div className="p-4 border-t border-gray-200">
				<Link
					href="/admin/orders"
					className="text-sm text-blue-600 hover:text-blue-800 font-medium"
				>
					Voir toutes les commandes →
				</Link>
			</div>
		</div>
	);
};
