import { api } from '~/lib/api';
import type { Order } from '~/validators/orders';

export interface DashboardStats {
	totalClients: number;
	totalProducts: number;
	totalOrders: number;
	totalRevenue: number | string;
	recentOrders: Order[];
}

export const fetchDashboardStatsApi = async () => {
	return api.get<DashboardStats>('/api/auth/dashboard-stats');
};
