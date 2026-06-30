'use client';

import { MessageCircle, X } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { useState } from 'react';
import { toast } from 'sonner';
import type { Order, OrderStatus } from '~/validators/orders';
import { cancelOrderAction, updateOrderStatusAction } from '../actions';
import { StatusBadge } from './status-badge';

interface OrderDetailModalProps {
	isOpen: boolean;
	onClose: () => void;
	order: Order;
}

const statuses: { value: OrderStatus; label: string }[] = [
	{ value: 'PENDING', label: 'En attente' },
	{ value: 'CONFIRMED', label: 'Confirmé' },
	{ value: 'PROCESSING', label: 'En cours' },
	{ value: 'COMPLETED', label: 'Terminé' },
	{ value: 'CANCELLED', label: 'Annulé' },
];

export const OrderDetailModal = ({
	isOpen,
	onClose,
	order,
}: OrderDetailModalProps) => {
	const [newStatus, setNewStatus] = useState<OrderStatus>(order.status);

	const { execute: executeUpdateStatus, isExecuting: isUpdating } = useAction(
		updateOrderStatusAction,
		{
			onSuccess: ({ data }) => {
				if (data?.success) {
					toast.success('Statut mis à jour');
					onClose();
				} else if (data?.error) {
					toast.error(data.error);
				}
			},
		},
	);

	const { execute: executeCancel, isExecuting: isCancelling } = useAction(
		cancelOrderAction,
		{
			onSuccess: ({ data }) => {
				if (data?.success) {
					toast.success('Commande annulée');
					onClose();
				} else if (data?.error) {
					toast.error(data.error);
				}
			},
		},
	);

	const isExecuting = isUpdating || isCancelling;
	const canChangeStatus =
		order.status !== 'CANCELLED' && order.status !== 'COMPLETED';

	const handleUpdateStatus = () => {
		if (newStatus !== order.status) {
			executeUpdateStatus({ id: order.id, status: newStatus });
		}
	};

	const handleCancel = () => {
		if (
			confirm(`Voulez-vous vraiment annuler la commande ${order.orderNumber} ?`)
		) {
			executeCancel({ id: order.id });
		}
	};

	const totalAmount =
		typeof order.totalAmount === 'string'
			? Number.parseFloat(order.totalAmount)
			: order.totalAmount;

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			<button
				type="button"
				aria-label="Fermer"
				onClick={onClose}
				className="absolute inset-0 bg-black/50 backdrop-blur-sm"
			/>

			<div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
				{/* En-tête dégradé */}
				<div className="bg-gradient-to-r from-[#1D73B3] to-[#2E86AB] px-6 py-5 text-white">
					<div className="flex items-start justify-between gap-4">
						<div>
							<h2 className="text-xl font-bold tracking-tight">
								Commande {order.orderNumber}
							</h2>
							<p className="text-sm text-white/80 mt-1">
								{new Date(order.createdAt).toLocaleDateString('fr-FR', {
									day: 'numeric',
									month: 'long',
									year: 'numeric',
									hour: '2-digit',
									minute: '2-digit',
								})}
							</p>
						</div>
						<button
							type="button"
							onClick={onClose}
							aria-label="Fermer"
							className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-white/15 hover:bg-white/25 transition-colors"
						>
							<X size={18} />
						</button>
					</div>
					<div className="mt-4">
						<StatusBadge status={order.status} />
					</div>
				</div>

				<div className="p-6 space-y-6">
					{/* Informations client */}
					<div>
						<h3 className="text-sm font-semibold text-gray-900 mb-3">
							Informations client
						</h3>
						<div className="bg-[#F6F8FB] rounded-xl p-4 space-y-2">
							<p className="text-sm">
								<span className="text-gray-500">Nom :</span>{' '}
								<span className="font-medium text-gray-900">
									{order.customerName}
								</span>
							</p>
							{order.customerEmail && (
								<p className="text-sm">
									<span className="text-gray-500">Email :</span>{' '}
									<span className="font-medium text-gray-900">
										{order.customerEmail}
									</span>
								</p>
							)}
							<p className="text-sm">
								<span className="text-gray-500">Téléphone :</span>{' '}
								<span className="font-medium text-gray-900">
									{order.customerPhone}
								</span>
							</p>
						</div>
					</div>

					{/* Articles */}
					{order.items && order.items.length > 0 && (
						<div>
							<h3 className="text-sm font-semibold text-gray-900 mb-3">
								Articles ({order.items.length})
							</h3>
							<div className="ring-1 ring-gray-200/70 rounded-xl overflow-hidden">
								<table className="w-full">
									<thead>
										<tr className="border-b border-gray-100">
											<th className="px-4 py-2.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
												Produit
											</th>
											<th className="px-4 py-2.5 text-center text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
												Qté
											</th>
											<th className="px-4 py-2.5 text-right text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
												Prix unitaire
											</th>
											<th className="px-4 py-2.5 text-right text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
												Total
											</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-gray-50">
										{order.items.map((item) => {
											const itemPrice =
												typeof item.price === 'string'
													? Number.parseFloat(item.price)
													: item.price;
											return (
												<tr key={item.id}>
													<td className="px-4 py-3 text-sm font-medium text-gray-900">
														{item.productName}
													</td>
													<td className="px-4 py-3 text-sm text-gray-600 text-center">
														{item.quantity}
													</td>
													<td className="px-4 py-3 text-sm text-gray-600 text-right">
														{itemPrice.toFixed(2)} FCFA
													</td>
													<td className="px-4 py-3 text-sm font-semibold text-gray-900 text-right">
														{(itemPrice * item.quantity).toFixed(2)} FCFA
													</td>
												</tr>
											);
										})}
									</tbody>
									<tfoot className="bg-[#F6F8FB]">
										<tr>
											<td
												colSpan={3}
												className="px-4 py-3 text-sm font-semibold text-gray-700 text-right"
											>
												Total
											</td>
											<td className="px-4 py-3 text-base font-bold text-[#1D73B3] text-right">
												{totalAmount.toFixed(2)} FCFA
											</td>
										</tr>
									</tfoot>
								</table>
							</div>
						</div>
					)}

					{/* Changement de statut */}
					{canChangeStatus && (
						<div>
							<h3 className="text-sm font-semibold text-gray-900 mb-3">
								Changer le statut
							</h3>
							<div className="flex items-center gap-3">
								<select
									value={newStatus}
									onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
									disabled={isExecuting}
									className="flex-1 px-4 py-2.5 rounded-xl ring-1 ring-gray-200/70 bg-white text-sm text-gray-900 outline-none focus:ring-2 focus:ring-[#1D73B3] transition-all disabled:bg-gray-100"
								>
									{statuses.map((s) => (
										<option key={s.value} value={s.value}>
											{s.label}
										</option>
									))}
								</select>
								<button
									type="button"
									onClick={handleUpdateStatus}
									disabled={isExecuting || newStatus === order.status}
									className="px-4 py-2.5 bg-[#1D73B3] text-white text-sm font-medium rounded-xl hover:bg-[#1a6299] transition-colors disabled:opacity-50"
								>
									{isUpdating ? 'En cours...' : 'Mettre à jour'}
								</button>
							</div>
						</div>
					)}

					{/* Actions */}
					<div className="flex items-center gap-3 pt-4 border-t border-gray-100">
						{order.whatsappUrl && (
							<a
								href={order.whatsappUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-xl hover:bg-emerald-700 transition-colors"
							>
								<MessageCircle size={16} />
								WhatsApp
							</a>
						)}
						{canChangeStatus && (
							<button
								type="button"
								onClick={handleCancel}
								disabled={isExecuting}
								className="px-4 py-2.5 bg-[#E63946] text-white text-sm font-medium rounded-xl hover:bg-[#cf2f3c] transition-colors disabled:opacity-50"
							>
								{isCancelling ? 'En cours...' : 'Annuler la commande'}
							</button>
						)}
						<button
							type="button"
							onClick={onClose}
							className="ml-auto px-4 py-2.5 ring-1 ring-gray-200/70 text-gray-700 text-sm font-medium rounded-xl hover:bg-[#F6F8FB] transition-colors"
						>
							Fermer
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
