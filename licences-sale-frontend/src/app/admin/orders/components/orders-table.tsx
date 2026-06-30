'use client';

import { Eye, MessageCircle, Search, ShoppingBag } from 'lucide-react';
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
	const [search, setSearch] = useState('');
	const [selectedOrder, setSelectedOrder] = useState<Order | undefined>();

	const query = search.trim().toLowerCase();
	const filteredOrders = orders.filter((order) => {
		const matchesStatus = filter === 'ALL' || order.status === filter;
		const matchesSearch =
			query === '' ||
			order.orderNumber.toLowerCase().includes(query) ||
			order.customerName.toLowerCase().includes(query) ||
			(order.customerEmail?.toLowerCase().includes(query) ?? false) ||
			order.customerPhone.toLowerCase().includes(query);
		return matchesStatus && matchesSearch;
	});

	if (orders.length === 0) {
		return (
			<div className="bg-white rounded-2xl ring-1 ring-gray-200/70 shadow-sm p-12">
				<div className="flex flex-col items-center text-center">
					<div className="w-14 h-14 rounded-2xl bg-[#1D73B3]/10 flex items-center justify-center mb-4">
						<ShoppingBag size={26} className="text-[#1D73B3]" />
					</div>
					<p className="text-lg font-semibold text-gray-900 mb-1">
						Aucune commande
					</p>
					<p className="text-sm text-gray-500">
						Les commandes apparaitront ici une fois passées
					</p>
				</div>
			</div>
		);
	}

	return (
		<>
			{/* Barre d'outils : recherche + filtres par statut */}
			<div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-center lg:justify-between">
				<div className="relative w-full lg:max-w-xs">
					<Search
						size={18}
						className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
					/>
					<input
						type="text"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Rechercher une commande..."
						className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white ring-1 ring-gray-200/70 shadow-sm text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#1D73B3] transition-all"
					/>
				</div>

				<div className="flex flex-wrap gap-2">
					{filterButtons.map((btn) => {
						const count =
							btn.value === 'ALL'
								? orders.length
								: orders.filter((o) => o.status === btn.value).length;
						const isActive = filter === btn.value;
						return (
							<button
								type="button"
								key={btn.value}
								onClick={() => setFilter(btn.value)}
								className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
									isActive
										? 'bg-[#1D73B3] text-white shadow-sm'
										: 'bg-white text-gray-600 ring-1 ring-gray-200/70 hover:bg-[#F6F8FB]'
								}`}
							>
								{btn.label}
								<span
									className={`ml-1.5 text-xs ${isActive ? 'opacity-80' : 'text-gray-400'}`}
								>
									({count})
								</span>
							</button>
						);
					})}
				</div>
			</div>

			<div className="bg-white rounded-2xl ring-1 ring-gray-200/70 shadow-sm overflow-hidden">
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
									Téléphone
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
								<th className="px-6 py-3 text-right text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-50">
							{filteredOrders.map((order) => {
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
											<p className="text-sm font-medium text-gray-900">
												{order.customerName}
											</p>
											{order.customerEmail && (
												<p className="text-xs text-gray-400">
													{order.customerEmail}
												</p>
											)}
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<p className="text-sm text-gray-600">
												{order.customerPhone}
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
										<td className="px-6 py-4 whitespace-nowrap text-right">
											<div className="flex items-center justify-end gap-1">
												<button
													type="button"
													onClick={() => setSelectedOrder(order)}
													className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-[#1D73B3] hover:bg-[#1D73B3]/10 transition-colors"
													title="Voir les détails"
												>
													<Eye size={18} />
												</button>
												{order.whatsappUrl && (
													<a
														href={order.whatsappUrl}
														target="_blank"
														rel="noopener noreferrer"
														className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
														title="Contacter via WhatsApp"
													>
														<MessageCircle size={18} />
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

				{filteredOrders.length === 0 && (
					<div className="px-6 py-12 text-center text-sm text-gray-500">
						Aucune commande ne correspond à votre recherche
					</div>
				)}
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
