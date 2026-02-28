import { api } from '~/lib/api';
import type { Order, OrderStatus } from '~/validators/orders';

export const fetchOrdersApi = async (status?: OrderStatus) => {
	const query = status ? `?status=${status}` : '';
	return api.get<Order[]>(`/api/orders${query}`);
};

export const updateOrderStatusApi = async (id: string, status: OrderStatus) => {
	return api.patch(`/api/orders/${id}/status`, { status });
};

export const cancelOrderApi = async (id: string) => {
	return api.patch(`/api/orders/${id}/cancel`);
};
