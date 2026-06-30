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
			<div className="text-gray-500 text-center py-12">
				Aucune commande pour le moment
			</div>
		);
	}

	return (
		<div>
			<div className="overflow-x-auto">
				<table className="w-full">
					<thead>
						<tr className="border-b border-gray-100">
							<th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
								N° Commande
							</th>
							<th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
								Client
							</th>
							<th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
								Total
							</th>
							<th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
								Statut
							</th>
							<th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
								Date
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-50">
						{orders.map((order) => {
							const totalAmount =
								typeof order.totalAmount === 'string'
									? Number.parseFloat(order.totalAmount)
									: order.totalAmount;

							return (
								<tr
									key={order.id}
									className="hover:bg-[#F6F8FB] transition-colors"
								>
									<td className="px-6 py-4 whitespace-nowrap">
										<p className="text-sm font-semibold text-[#1D73B3]">
											{order.orderNumber}
										</p>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<p className="text-sm text-gray-700">
											{order.customerName}
										</p>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<p className="text-sm font-semibold text-gray-900">
											{totalAmount.toFixed(2)} FCFA
										</p>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<StatusBadge status={order.status} />
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<p className="text-sm text-gray-500">
											{new Date(order.createdAt).toLocaleDateString('fr-FR')}
										</p>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
			<div className="px-6 py-4 border-t border-gray-100">
				<Link
					href="/admin/orders"
					className="inline-flex items-center gap-1 text-sm font-semibold text-[#1D73B3] hover:gap-2 transition-all"
				>
					Voir toutes les commandes →
				</Link>
			</div>
		</div>
	);
};
