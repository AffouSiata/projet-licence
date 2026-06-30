import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
	ShoppingBag,
	Key,
	User,
	LogOut,
	Package,
	TrendingUp,
	ChevronRight,
} from 'lucide-react';
import { requireSession, clearSession } from '~/lib/session';
import { api } from '~/lib/api';
import { Header } from '~/components/header';
import { Footer } from '~/components/footer';

interface Order {
	id: string;
	orderNumber: string;
	totalAmount: number;
	status: string;
	createdAt: string;
	items?: Array<{
		productName: string;
		quantity: number;
	}>;
}

async function getOrders(): Promise<Order[]> {
	try {
		return await api.get<Order[]>('/orders/me');
	} catch {
		return [];
	}
}

export default async function ComptePage() {
	const user = await requireSession();
	const orders = await getOrders();

	// Calcul des statistiques
	const totalOrders = orders.length;
	const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);
	const recentOrders = orders.slice(0, 3);

	return (
		<>
			<Header />
			<div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
				{/* Header */}
				<div className="bg-gradient-to-r from-[#1D70B8] to-[#3B9DE8] text-white">
					<div className="max-w-7xl mx-auto px-6 py-8">
						<div className="flex items-center justify-between">
							<div>
								<h1 className="text-3xl font-bold mb-2">
									Bienvenue, {user.name}
								</h1>
								<p className="text-white/80">
									Gérez vos commandes, licences et informations personnelles
								</p>
							</div>
							<Link
								href="/"
								className="px-5 py-2.5 bg-white/10 hover:bg-white/20 rounded-lg transition-all backdrop-blur-sm border border-white/20"
							>
								Retour à l'accueil
							</Link>
						</div>
					</div>
				</div>

				<div className="max-w-7xl mx-auto px-6 py-8">
					<div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
						{/* Sidebar - Menu */}
						<div className="lg:col-span-1">
							<div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
								<div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
									<div className="w-16 h-16 bg-gradient-to-br from-[#1D70B8] to-[#3B9DE8] rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
										{user.name.charAt(0).toUpperCase()}
									</div>
									<div>
										<h3 className="font-bold text-gray-800">{user.name}</h3>
										<p className="text-sm text-gray-500">{user.email}</p>
									</div>
								</div>

								<nav className="space-y-2">
									<Link
										href="/compte"
										className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-50 to-transparent text-[#1D70B8] rounded-xl font-semibold transition-all"
									>
										<Package size={20} />
										<span>Tableau de bord</span>
									</Link>

									<Link
										href="/compte/commandes"
										className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-all"
									>
										<ShoppingBag size={20} />
										<span>Mes commandes</span>
									</Link>

									<Link
										href="/compte/licences"
										className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-all"
									>
										<Key size={20} />
										<span>Mes licences</span>
									</Link>

									<Link
										href="/compte/profil"
										className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-all"
									>
										<User size={20} />
										<span>Mon profil</span>
									</Link>

									<hr className="my-4 border-gray-100" />

									<form
										action={async () => {
											'use server';
											await clearSession();
											redirect('/auth/login');
										}}
									>
										<button
											type="submit"
											className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-medium transition-all w-full"
										>
											<LogOut size={20} />
											<span>Déconnexion</span>
										</button>
									</form>
								</nav>
							</div>
						</div>

						{/* Main Content */}
						<div className="lg:col-span-3 space-y-8">
							{/* Statistics Cards */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								{/* Total Commandes */}
								<div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all">
									<div className="flex items-center justify-between mb-4">
										<div className="w-12 h-12 bg-gradient-to-br from-[#1D70B8] to-[#3B9DE8] rounded-xl flex items-center justify-center shadow-md">
											<ShoppingBag size={24} className="text-white" />
										</div>
									</div>
									<h3 className="text-3xl font-bold text-gray-800 mb-1">
										{totalOrders}
									</h3>
									<p className="text-gray-500 text-sm">Commandes totales</p>
								</div>

								{/* Total Dépensé */}
								<div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all">
									<div className="flex items-center justify-between mb-4">
										<div className="w-12 h-12 bg-gradient-to-br from-[#FF6600] to-[#FF8C00] rounded-xl flex items-center justify-center shadow-md">
											<TrendingUp size={24} className="text-white" />
										</div>
									</div>
									<h3 className="text-3xl font-bold text-gray-800 mb-1">
										{totalSpent.toLocaleString()} F
									</h3>
									<p className="text-gray-500 text-sm">Total dépensé</p>
								</div>
							</div>

							{/* Quick Actions */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<Link
									href="/compte/licences"
									className="bg-gradient-to-br from-[#1D70B8] to-[#3B9DE8] rounded-2xl p-6 text-white hover:shadow-xl transition-all group"
								>
									<div className="flex items-center justify-between mb-4">
										<div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
											<Key size={28} />
										</div>
										<ChevronRight
											size={24}
											className="group-hover:translate-x-1 transition-transform"
										/>
									</div>
									<h3 className="text-2xl font-bold mb-2">Voir mes licences</h3>
									<p className="text-white/80 text-sm">
										Accédez à toutes vos clés de produits
									</p>
								</Link>

								<Link
									href="/categories"
									className="bg-gradient-to-br from-[#E63946] to-[#FF6B6B] rounded-2xl p-6 text-white hover:shadow-xl transition-all group"
								>
									<div className="flex items-center justify-between mb-4">
										<div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
											<ShoppingBag size={28} />
										</div>
										<ChevronRight
											size={24}
											className="group-hover:translate-x-1 transition-transform"
										/>
									</div>
									<h3 className="text-2xl font-bold mb-2">
										Acheter des licences
									</h3>
									<p className="text-white/80 text-sm">
										Découvrez nos produits en promotion
									</p>
								</Link>
							</div>

							{/* Recent Orders */}
							<div className="bg-white rounded-2xl shadow-lg p-6">
								<div className="flex items-center justify-between mb-6">
									<h2 className="text-xl font-bold text-gray-800">
										Commandes récentes
									</h2>
									<Link
										href="/compte/commandes"
										className="text-[#1D70B8] hover:text-[#0D3A5C] font-semibold text-sm flex items-center gap-1 transition-colors"
									>
										Voir tout
										<ChevronRight size={16} />
									</Link>
								</div>

								{recentOrders.length === 0 ? (
									<div className="text-center py-12">
										<Package size={48} className="text-gray-300 mx-auto mb-4" />
										<p className="text-gray-500">
											Aucune commande pour le moment
										</p>
										<Link
											href="/categories"
											className="inline-block mt-4 px-6 py-2 bg-[#1D70B8] text-white font-semibold rounded-lg hover:bg-[#155a96] transition-all"
										>
											Découvrir nos produits
										</Link>
									</div>
								) : (
									<div className="space-y-4">
										{recentOrders.map((order) => (
											<Link
												href="/compte/commandes"
												key={order.id}
												className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all cursor-pointer group"
											>
												<div className="flex items-center gap-4">
													<div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
														<Package size={20} className="text-[#1D70B8]" />
													</div>
													<div>
														<h4 className="font-semibold text-gray-800 group-hover:text-[#1D70B8] transition-colors">
															Commande #{order.orderNumber}
														</h4>
														<p className="text-sm text-gray-500">
															{new Date(order.createdAt).toLocaleDateString(
																'fr-FR',
																{
																	day: 'numeric',
																	month: 'short',
																	year: 'numeric',
																}
															)}
															{' • '}
															{order.items?.length || 0} article
															{(order.items?.length || 0) > 1 ? 's' : ''}
														</p>
													</div>
												</div>
												<div className="text-right">
													<p className="font-bold text-gray-800">
														{order.totalAmount.toLocaleString()} F
													</p>
													<span
														className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
															order.status === 'COMPLETED'
																? 'bg-green-100 text-green-700'
																: order.status === 'PENDING'
																	? 'bg-yellow-100 text-yellow-700'
																	: order.status === 'CANCELLED'
																		? 'bg-red-100 text-red-700'
																		: 'bg-gray-100 text-gray-700'
														}`}
													>
														{order.status === 'COMPLETED'
															? 'Complétée'
															: order.status === 'PENDING'
																? 'En attente'
																: order.status === 'CANCELLED'
																	? 'Annulée'
																	: order.status}
													</span>
												</div>
											</Link>
										))}
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
			<Footer />
		</>
	);
}
