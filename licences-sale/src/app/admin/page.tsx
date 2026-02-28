import { RecentOrdersTable } from './components/recent-orders-table';
import { type DashboardStats, fetchDashboardStatsApi } from './lib';

const formatRevenue = (revenue: number | string) => {
	const num =
		typeof revenue === 'string' ? Number.parseFloat(revenue) : revenue;
	if (num >= 1000000) {
		return `${(num / 1000000).toFixed(1)}M`;
	}
	if (num >= 1000) {
		return `${(num / 1000).toFixed(1)}k`;
	}
	return num.toFixed(0);
};

const AdminPage = async () => {
	let stats: DashboardStats | null = null;

	try {
		stats = await fetchDashboardStatsApi();
	} catch (error) {
		console.error('Erreur chargement dashboard:', error);
	}

	return (
		<div className="p-8">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
				<p className="text-gray-600 mt-2">Vue d'ensemble de votre plateforme</p>
			</div>

			{/* Statistiques principales */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
				<div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-600 mb-1">Clients</p>
							<p className="text-2xl font-bold text-gray-900">
								{stats?.totalClients ?? '—'}
							</p>
						</div>
						<div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
							<svg
								className="w-6 h-6 text-blue-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
								/>
							</svg>
						</div>
					</div>
				</div>

				<div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-600 mb-1">Produits</p>
							<p className="text-2xl font-bold text-gray-900">
								{stats?.totalProducts ?? '—'}
							</p>
						</div>
						<div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
							<svg
								className="w-6 h-6 text-purple-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
								/>
							</svg>
						</div>
					</div>
				</div>

				<div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-600 mb-1">Commandes</p>
							<p className="text-2xl font-bold text-gray-900">
								{stats?.totalOrders ?? '—'}
							</p>
						</div>
						<div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
							<svg
								className="w-6 h-6 text-green-600"
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
						</div>
					</div>
				</div>

				<div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-600 mb-1">Chiffre d'affaires</p>
							<p className="text-2xl font-bold text-gray-900">
								{stats ? `${formatRevenue(stats.totalRevenue)} FCFA` : '—'}
							</p>
						</div>
						<div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
							<svg
								className="w-6 h-6 text-orange-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						</div>
					</div>
				</div>
			</div>

			{/* Dernières commandes */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-100">
				<div className="p-6 border-b border-gray-200">
					<h2 className="text-xl font-semibold text-gray-900">
						Dernières commandes
					</h2>
				</div>
				{stats ? (
					<RecentOrdersTable orders={stats.recentOrders} />
				) : (
					<div className="text-gray-600 text-center py-8">
						Erreur lors du chargement des données
					</div>
				)}
			</div>
		</div>
	);
};

export default AdminPage;
