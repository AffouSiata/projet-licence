'use client';

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
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
			<div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
				<div className="p-6 border-b border-gray-200 flex items-center justify-between">
					<div>
						<h2 className="text-2xl font-bold text-gray-900">
							Commande {order.orderNumber}
						</h2>
						<p className="text-sm text-gray-500 mt-1">
							{new Date(order.createdAt).toLocaleDateString('fr-FR', {
								day: 'numeric',
								month: 'long',
								year: 'numeric',
								hour: '2-digit',
								minute: '2-digit',
							})}
						</p>
					</div>
					<StatusBadge status={order.status} />
				</div>

				<div className="p-6 space-y-6">
					{/* Informations client */}
					<div>
						<h3 className="text-sm font-semibold text-gray-900 mb-3">
							Informations client
						</h3>
						<div className="bg-gray-50 rounded-lg p-4 space-y-2">
							<p className="text-sm">
								<span className="text-gray-500">Nom :</span>{' '}
								<span className="font-medium">{order.customerName}</span>
							</p>
							{order.customerEmail && (
								<p className="text-sm">
									<span className="text-gray-500">Email :</span>{' '}
									<span className="font-medium">{order.customerEmail}</span>
								</p>
							)}
							<p className="text-sm">
								<span className="text-gray-500">Téléphone :</span>{' '}
								<span className="font-medium">{order.customerPhone}</span>
							</p>
						</div>
					</div>

					{/* Articles */}
					{order.items && order.items.length > 0 && (
						<div>
							<h3 className="text-sm font-semibold text-gray-900 mb-3">
								Articles ({order.items.length})
							</h3>
							<div className="border border-gray-200 rounded-lg overflow-hidden">
								<table className="w-full">
									<thead className="bg-gray-50">
										<tr>
											<th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
												Produit
											</th>
											<th className="px-4 py-2 text-center text-xs font-medium text-gray-500">
												Qté
											</th>
											<th className="px-4 py-2 text-right text-xs font-medium text-gray-500">
												Prix unitaire
											</th>
											<th className="px-4 py-2 text-right text-xs font-medium text-gray-500">
												Total
											</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-gray-200">
										{order.items.map((item) => {
											const itemPrice =
												typeof item.price === 'string'
													? Number.parseFloat(item.price)
													: item.price;
											return (
												<tr key={item.id}>
													<td className="px-4 py-3 text-sm text-gray-900">
														{item.productName}
													</td>
													<td className="px-4 py-3 text-sm text-gray-600 text-center">
														{item.quantity}
													</td>
													<td className="px-4 py-3 text-sm text-gray-600 text-right">
														{itemPrice.toFixed(2)} FCFA
													</td>
													<td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
														{(itemPrice * item.quantity).toFixed(2)} FCFA
													</td>
												</tr>
											);
										})}
									</tbody>
									<tfoot className="bg-gray-50">
										<tr>
											<td
												colSpan={3}
												className="px-4 py-3 text-sm font-semibold text-gray-900 text-right"
											>
												Total
											</td>
											<td className="px-4 py-3 text-sm font-bold text-gray-900 text-right">
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
									className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none disabled:bg-gray-100"
								>
									{statuses.map((s) => (
										<option key={s.value} value={s.value}>
											{s.label}
										</option>
									))}
								</select>
								<button
									onClick={handleUpdateStatus}
									disabled={isExecuting || newStatus === order.status}
									className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
								>
									{isUpdating ? 'En cours...' : 'Mettre à jour'}
								</button>
							</div>
						</div>
					)}

					{/* Actions */}
					<div className="flex items-center gap-3 pt-4 border-t border-gray-200">
						{order.whatsappUrl && (
							<a
								href={order.whatsappUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
							>
								<svg
									className="w-4 h-4"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
								</svg>
								WhatsApp
							</a>
						)}
						{canChangeStatus && (
							<button
								onClick={handleCancel}
								disabled={isExecuting}
								className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
							>
								{isCancelling ? 'En cours...' : 'Annuler la commande'}
							</button>
						)}
						<button
							onClick={onClose}
							className="ml-auto px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
						>
							Fermer
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
