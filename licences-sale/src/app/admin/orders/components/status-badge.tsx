'use client';

import type { OrderStatus } from '~/validators/orders';

const statusConfig: Record<OrderStatus, { label: string; className: string }> =
	{
		PENDING: {
			label: 'En attente',
			className: 'bg-yellow-100 text-yellow-800',
		},
		CONFIRMED: {
			label: 'Confirmé',
			className: 'bg-blue-100 text-blue-800',
		},
		PROCESSING: {
			label: 'En cours',
			className: 'bg-purple-100 text-purple-800',
		},
		COMPLETED: {
			label: 'Terminé',
			className: 'bg-green-100 text-green-800',
		},
		CANCELLED: {
			label: 'Annulé',
			className: 'bg-red-100 text-red-800',
		},
	};

interface StatusBadgeProps {
	status: OrderStatus;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
	const config = statusConfig[status] || statusConfig.PENDING;

	return (
		<span
			className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}
		>
			{config.label}
		</span>
	);
};
