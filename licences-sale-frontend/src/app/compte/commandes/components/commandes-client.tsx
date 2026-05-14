'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
	ShoppingBag,
	Eye,
	Download,
	Package,
	Calendar,
	CreditCard,
	Search,
	Filter,
	CheckCircle,
	Clock,
	XCircle,
} from 'lucide-react';

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

interface CommandesClientProps {
	orders: Order[];
}

const statusConfig = {
	COMPLETED: {
		label: 'Livrée',
		color: 'bg-green-100 text-green-700',
		icon: CheckCircle,
	},
	PENDING: {
		label: 'En attente',
		color: 'bg-yellow-100 text-yellow-700',
		icon: Clock,
	},
	CANCELLED: {
		label: 'Annulée',
		color: 'bg-red-100 text-red-700',
		icon: XCircle,
	},
	CONFIRMED: {
		label: 'Confirmée',
		color: 'bg-blue-100 text-blue-700',
		icon: CheckCircle,
	},
	PROCESSING: {
		label: 'En traitement',
		color: 'bg-purple-100 text-purple-700',
		icon: Clock,
	},
};

export const CommandesClient = ({ orders }: CommandesClientProps) => {
	const [searchQuery, setSearchQuery] = useState('');
	const [filterStatus, setFilterStatus] = useState('all');

	// Filtrer les commandes
	const filteredOrders = orders.filter((order) => {
		const matchesSearch =
			order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
			(order.items || []).some((item) =>
				item.productName.toLowerCase().includes(searchQuery.toLowerCase())
			);
		const matchesStatus =
			filterStatus === 'all' || order.status === filterStatus;
		return matchesSearch && matchesStatus;
	});

	return (
		<div className="max-w-7xl mx-auto px-6 py-8">
			{/* Filters & Search */}
			<div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
				<div className="flex flex-col md:flex-row gap-4">
					{/* Search */}
					<div className="flex-1 relative">
						<Search
							size={20}
							className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
						/>
						<input
							type="text"
							placeholder="Rechercher par numéro de commande ou produit..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl outline-none focus:border-[#1D70B8] focus:bg-white transition-all"
						/>
					</div>

					{/* Status Filter */}
					<div className="flex items-center gap-2">
						<Filter size={20} className="text-gray-400" />
						<select
							value={filterStatus}
							onChange={(e) => setFilterStatus(e.target.value)}
							className="px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl outline-none focus:border-[#1D70B8] cursor-pointer transition-all"
						>
							<option value="all">Tous les statuts</option>
							<option value="COMPLETED">Livrées</option>
							<option value="CONFIRMED">Confirmées</option>
							<option value="PROCESSING">En traitement</option>
							<option value="PENDING">En attente</option>
							<option value="CANCELLED">Annulées</option>
						</select>
					</div>
				</div>

				{/* Results count */}
				<div className="mt-4 text-sm text-gray-500">
					{filteredOrders.length} commande
					{filteredOrders.length > 1 ? 's' : ''} trouvée
					{filteredOrders.length > 1 ? 's' : ''}
				</div>
			</div>

			{/* Orders List */}
			<div className="space-y-6">
				{filteredOrders.map((order) => {
					const StatusIcon =
						statusConfig[order.status as keyof typeof statusConfig]?.icon ||
						Clock;
					const statusStyle =
						statusConfig[order.status as keyof typeof statusConfig] ||
						statusConfig.PENDING;

					return (
						<div
							key={order.id}
							className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden"
						>
							{/* Order Header */}
							<div className="bg-gradient-to-r from-blue-50 to-transparent px-6 py-4 border-b border-gray-100">
								<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
									<div className="flex items-center gap-4">
										<div className="w-12 h-12 bg-gradient-to-br from-[#1D70B8] to-[#3B9DE8] rounded-xl flex items-center justify-center">
											<Package size={24} className="text-white" />
										</div>
										<div>
											<h3 className="font-bold text-gray-800 text-lg">
												#{order.orderNumber}
											</h3>
											<div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
												<span className="flex items-center gap-1">
													<Calendar size={14} />
													{new Date(order.createdAt).toLocaleDateString(
														'fr-FR',
														{
															day: 'numeric',
															month: 'short',
															year: 'numeric',
														}
													)}
												</span>
												{order.metadata?.paymentMethod && (
													<span className="flex items-center gap-1">
														<CreditCard size={14} />
														{order.metadata.paymentMethod}
													</span>
												)}
											</div>
										</div>
									</div>

									<div className="flex items-center gap-3">
										<span
											className={`px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 ${statusStyle.color}`}
										>
											<StatusIcon size={16} />
											{statusStyle.label}
										</span>
									</div>
								</div>
							</div>

							{/* Order Products */}
							<div className="px-6 py-4">
								<div className="space-y-3">
									{(order.items || []).map((item, index) => (
										<div
											key={index}
											className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
										>
											<div className="flex items-center gap-3">
												<div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
													<Package size={18} className="text-[#1D70B8]" />
												</div>
												<div>
													<h4 className="font-semibold text-gray-800">
														{item.productName}
													</h4>
													<p className="text-sm text-gray-500">
														Quantité : {item.quantity}
													</p>
												</div>
											</div>
											<div className="text-right">
												<div className="font-bold text-gray-800">
													{(item.price * item.quantity).toLocaleString()} F
												</div>
												<div className="text-xs text-gray-500">
													{item.price.toLocaleString()} F × {item.quantity}
												</div>
											</div>
										</div>
									))}
								</div>
							</div>

							{/* Order Footer */}
							<div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
								<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
									<div className="flex flex-wrap gap-3">
										<Link
											href={`/compte/commandes/${order.id}`}
											className="px-5 py-2.5 bg-[#1D70B8] hover:bg-[#0D3A5C] text-white rounded-lg font-medium transition-all flex items-center gap-2"
										>
											<Eye size={18} />
											Voir détails
										</Link>
										<button
											type="button"
											className="px-5 py-2.5 bg-white border-2 border-gray-200 hover:border-[#E63946] text-gray-700 hover:text-[#E63946] rounded-lg font-medium transition-all flex items-center gap-2"
										>
											<Download size={18} />
											Télécharger facture
										</button>
									</div>
									<div className="text-right">
										<div className="text-sm text-gray-500 mb-1">Total</div>
										<div className="text-2xl font-bold text-[#1D70B8]">
											{order.totalAmount.toLocaleString()} F
										</div>
									</div>
								</div>
							</div>
						</div>
					);
				})}
			</div>

			{/* Empty State */}
			{filteredOrders.length === 0 && (
				<div className="bg-white rounded-2xl shadow-lg p-12 text-center">
					<div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<ShoppingBag size={40} className="text-gray-400" />
					</div>
					<h3 className="text-xl font-bold text-gray-800 mb-2">
						Aucune commande trouvée
					</h3>
					<p className="text-gray-500 mb-6">
						Essayez de modifier vos critères de recherche ou filtres
					</p>
					<Link
						href="/products"
						className="inline-block px-6 py-3 bg-gradient-to-r from-[#1D70B8] to-[#3B9DE8] text-white rounded-lg font-semibold hover:shadow-lg transition-all"
					>
						Commencer vos achats
					</Link>
				</div>
			)}
		</div>
	);
};
