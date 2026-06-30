import { Package, ShoppingCart, Users, Wallet } from 'lucide-react';
import { AuthenticationError } from '~/lib/api';
import { RecentOrdersTable } from './components/recent-orders-table';
import { type DashboardStats, fetchDashboardStatsApi } from './lib';

const formatRevenue = (revenue: number | string) => {
	const num =
		typeof revenue === 'string' ? Number.parseFloat(revenue) : revenue;
	if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
	if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
	return num.toFixed(0);
};

const AdminPage = async () => {
	let stats: DashboardStats | null = null;

	try {
		stats = await fetchDashboardStatsApi();
	} catch (error) {
		if (!(error instanceof AuthenticationError)) {
			console.error('Erreur chargement dashboard:', error);
		}
	}

	const cards = [
		{
			label: 'Clients',
			value: stats?.totalClients ?? '—',
			icon: Users,
			tint: 'text-[#1D73B3]',
			bg: 'bg-[#1D73B3]/10',
			bar: 'bg-[#1D73B3]',
		},
		{
			label: 'Produits',
			value: stats?.totalProducts ?? '—',
			icon: Package,
			tint: 'text-[#0891B2]',
			bg: 'bg-[#0891B2]/10',
			bar: 'bg-[#0891B2]',
		},
		{
			label: 'Commandes',
			value: stats?.totalOrders ?? '—',
			icon: ShoppingCart,
			tint: 'text-[#059669]',
			bg: 'bg-[#059669]/10',
			bar: 'bg-[#059669]',
		},
		{
			label: "Chiffre d'affaires",
			value: stats ? `${formatRevenue(stats.totalRevenue)} FCFA` : '—',
			icon: Wallet,
			tint: 'text-[#D97706]',
			bg: 'bg-[#D97706]/10',
			bar: 'bg-[#D97706]',
		},
	];

	return (
		<div className="p-8">
			<div className="mb-8">
				<h1 className="text-2xl font-bold text-gray-900 tracking-tight">
					Bonjour 👋
				</h1>
				<p className="text-gray-500 mt-1">
					Voici un aperçu de l'activité de votre plateforme.
				</p>
			</div>

			{/* Statistiques principales */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
				{cards.map((card) => {
					const Icon = card.icon;
					return (
						<div
							key={card.label}
							className="group relative bg-white rounded-2xl ring-1 ring-gray-200/70 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all overflow-hidden p-6"
						>
							<span
								className={`absolute inset-x-0 top-0 h-1 ${card.bar} opacity-80`}
							/>
							<div className="flex items-start justify-between">
								<div>
									<p className="text-sm text-gray-500 mb-2">{card.label}</p>
									<p className="text-3xl font-bold text-gray-900 tracking-tight">
										{card.value}
									</p>
								</div>
								<div
									className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center`}
								>
									<Icon size={24} className={card.tint} />
								</div>
							</div>
						</div>
					);
				})}
			</div>

			{/* Dernières commandes */}
			<div className="bg-white rounded-2xl ring-1 ring-gray-200/70 shadow-sm overflow-hidden">
				<div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
					<div>
						<h2 className="text-lg font-bold text-gray-900 tracking-tight">
							Dernières commandes
						</h2>
						<p className="text-sm text-gray-400">
							Les 10 commandes les plus récentes
						</p>
					</div>
				</div>
				{stats ? (
					<RecentOrdersTable orders={stats.recentOrders} />
				) : (
					<div className="text-gray-500 text-center py-12">
						Erreur lors du chargement des données
					</div>
				)}
			</div>
		</div>
	);
};

export default AdminPage;
