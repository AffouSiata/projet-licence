'use client';

import type { OrderStatus } from '~/validators/orders';

const statusConfig: Record<
	OrderStatus,
	{ label: string; className: string; dot: string }
> = {
	PENDING: {
		label: 'En attente',
		className: 'bg-amber-50 text-amber-700 ring-amber-200',
		dot: 'bg-amber-500',
	},
	CONFIRMED: {
		label: 'Confirmé',
		className: 'bg-blue-50 text-blue-700 ring-blue-200',
		dot: 'bg-blue-500',
	},
	PROCESSING: {
		label: 'En cours',
		className: 'bg-sky-50 text-sky-700 ring-sky-200',
		dot: 'bg-sky-500',
	},
	COMPLETED: {
		label: 'Terminé',
		className: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
		dot: 'bg-emerald-500',
	},
	CANCELLED: {
		label: 'Annulé',
		className: 'bg-red-50 text-red-700 ring-red-200',
		dot: 'bg-red-500',
	},
};

interface StatusBadgeProps {
	status: OrderStatus;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
	const config = statusConfig[status] || statusConfig.PENDING;

	return (
		<span
			className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ${config.className}`}
		>
			<span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
			{config.label}
		</span>
	);
};
