'use client';

import { useState } from 'react';
import type { Order, OrderStatus } from '~/validators/orders';
import { OrderDetailModal } from './order-detail-modal';
import { StatusBadge } from './status-badge';

interface OrdersTableProps {
	orders: Order[];
}

const filterButtons: { value: OrderStatus | 'ALL'; label: string }[] = [
	{ value: 'ALL', label: 'Tous' },
	{ value: 'PENDING', label: 'En attente' },
	{ value: 'CONFIRMED', label: 'Confirmé' },
	{ value: 'PROCESSING', label: 'En cours' },
	{ value: 'COMPLETED', label: 'Terminé' },
	{ value: 'CANCELLED', label: 'Annulé' },
];

export const OrdersTable = ({ orders }: OrdersTableProps) => {
	const [filter, setFilter] = useState<OrderStatus | 'ALL'>('ALL');
	const [selectedOrder, setSelectedOrder] = useState<Order | undefined>();

	const filteredOrders =
		filter === 'ALL'
			? orders
			: orders.filter((order) => order.status === filter);

	if (orders.length === 0) {
		return (
			<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12">
				<div className="text-center">
					<svg
						className="w-16 h-16 mx-auto mb-4 text-gray-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
						/>
					</svg>
					<p className="text-lg font-medium text-gray-900 mb-2">
						Aucune commande
					</p>
					<p className="text-sm text-gray-600">
						Les commandes apparaitront ici une fois passées
					</p>
				</div>
			</div>
		);
	}

	return (
		<>
			{/* Filtres par statut */}
			<div className="flex flex-wrap gap-2 mb-4">
				{filterButtons.map((btn) => (
					<button
						key={btn.value}
						onClick={() => setFilter(btn.value)}
						className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
							filter === btn.value
								? 'bg-blue-600 text-white'
								: 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
						}`}
					>
						{btn.label}
						{btn.value === 'ALL' ? (
							<span className="ml-1.5 text-xs opacity-75">
								({orders.length})
							</span>
						) : (
							<span className="ml-1.5 text-xs opacity-75">
								({orders.filter((o) => o.status === btn.value).length})
							</span>
						)}
					</button>
				))}
			</div>

			<div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-gray-50 border-b border-gray-200">
							<tr>
								<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									N° Commande
								</th>
								<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Client
								</th>
								<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Téléphone
								</th>
								<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Total
								</th>
								<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Statut
								</th>
								<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Date
								</th>
								<th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-200">
							{filteredOrders.map((order) => {
								const totalAmount =
									typeof order.totalAmount === 'string'
										? Number.parseFloat(order.totalAmount)
										: order.totalAmount;

								return (
									<tr
										key={order.id}
										className="hover:bg-gray-50 transition-colors"
									>
										<td className="px-6 py-4 whitespace-nowrap">
											<p className="font-medium text-gray-900">
												{order.orderNumber}
											</p>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<div>
												<p className="font-medium text-gray-900">
													{order.customerName}
												</p>
												{order.customerEmail && (
													<p className="text-xs text-gray-500">
														{order.customerEmail}
													</p>
												)}
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<p className="text-sm text-gray-600">
												{order.customerPhone}
											</p>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<p className="text-sm font-medium text-gray-900">
												{totalAmount.toFixed(2)} FCFA
											</p>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<StatusBadge status={order.status} />
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<p className="text-sm text-gray-600">
												{new Date(order.createdAt).toLocaleDateString('fr-FR')}
											</p>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
											<div className="flex items-center justify-end gap-2">
												<button
													onClick={() => setSelectedOrder(order)}
													className="text-blue-600 hover:text-blue-900 transition-colors"
													title="Voir les détails"
												>
													<svg
														className="w-5 h-5"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
														/>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
														/>
													</svg>
												</button>
												{order.whatsappUrl && (
													<a
														href={order.whatsappUrl}
														target="_blank"
														rel="noopener noreferrer"
														className="text-green-600 hover:text-green-900 transition-colors"
														title="Contacter via WhatsApp"
													>
														<svg
															className="w-5 h-5"
															fill="currentColor"
															viewBox="0 0 24 24"
														>
															<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
														</svg>
													</a>
												)}
											</div>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</div>

			{selectedOrder && (
				<OrderDetailModal
					isOpen={!!selectedOrder}
					onClose={() => setSelectedOrder(undefined)}
					order={selectedOrder}
				/>
			)}
		</>
	);
};
