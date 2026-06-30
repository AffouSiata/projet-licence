'use client';

import {
	Calendar,
	CheckCircle,
	Clock,
	CreditCard,
	Download,
	Eye,
	Filter,
	Package,
	Search,
	ShoppingBag,
	X,
	XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

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
	customerName?: string;
	customerEmail?: string;
	customerPhone?: string;
	whatsappUrl?: string;
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

const getStatus = (status: string) =>
	statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;

const formatF = (amount: number) => `${amount.toLocaleString('fr-FR')} F`;

const formatDate = (iso: string) =>
	new Date(iso).toLocaleDateString('fr-FR', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	});

const escapeHtml = (value: string) =>
	value.replace(
		/[&<>"']/g,
		(char) =>
			({
				'&': '&amp;',
				'<': '&lt;',
				'>': '&gt;',
				'"': '&quot;',
				"'": '&#39;',
			})[char] as string,
	);

// Génère une facture HTML autonome et ouvre la boîte d'impression du navigateur
// (l'utilisateur peut « Enregistrer au format PDF »). Aucune dépendance externe.
const downloadInvoice = (order: Order) => {
	const rows = (order.items || [])
		.map(
			(item) => `
				<tr>
					<td>${escapeHtml(item.productName)}</td>
					<td class="num">${item.quantity}</td>
					<td class="num">${formatF(item.price)}</td>
					<td class="num">${formatF(item.price * item.quantity)}</td>
				</tr>`,
		)
		.join('');

	const client = [
		order.customerName && escapeHtml(order.customerName),
		order.customerEmail && escapeHtml(order.customerEmail),
		order.customerPhone && escapeHtml(order.customerPhone),
	]
		.filter(Boolean)
		.join('<br>');

	const html = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<title>Facture-${escapeHtml(order.orderNumber)}</title>
<style>
	* { box-sizing: border-box; }
	body { font-family: -apple-system, system-ui, sans-serif; color: #1f2937; margin: 0; padding: 40px; }
	.head { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #1D73B3; padding-bottom: 20px; }
	.brand { font-size: 22px; font-weight: 800; color: #1D73B3; }
	.brand small { display: block; font-size: 12px; font-weight: 500; color: #6b7280; margin-top: 4px; }
	.title { text-align: right; }
	.title h1 { margin: 0; font-size: 26px; letter-spacing: 2px; color: #1B3A5F; }
	.title p { margin: 4px 0 0; color: #6b7280; font-size: 13px; }
	.meta { display: flex; justify-content: space-between; margin-top: 28px; font-size: 14px; }
	.meta h3 { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #9ca3af; margin: 0 0 8px; }
	table { width: 100%; border-collapse: collapse; margin-top: 32px; font-size: 14px; }
	th { text-align: left; background: #f1f5f9; color: #475569; padding: 10px 12px; font-size: 12px; text-transform: uppercase; letter-spacing: .5px; }
	td { padding: 12px; border-bottom: 1px solid #e5e7eb; }
	.num { text-align: right; }
	.total { display: flex; justify-content: flex-end; margin-top: 24px; }
	.total .box { min-width: 240px; }
	.total .line { display: flex; justify-content: space-between; padding: 8px 0; }
	.total .grand { border-top: 2px solid #1D73B3; margin-top: 6px; padding-top: 12px; font-size: 18px; font-weight: 800; color: #1D73B3; }
	.foot { margin-top: 48px; padding-top: 16px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af; text-align: center; }
	@media print { body { padding: 0; } }
</style>
</head>
<body>
	<div class="head">
		<div class="brand">Licences Sale
			<small>+225 07 78 88 85 62 · sam_building@outlook.fr</small>
		</div>
		<div class="title">
			<h1>FACTURE</h1>
			<p>N° ${escapeHtml(order.orderNumber)}</p>
			<p>${formatDate(order.createdAt)}</p>
		</div>
	</div>

	<div class="meta">
		<div>
			<h3>Facturé à</h3>
			<div>${client || 'Client'}</div>
		</div>
		<div style="text-align:right">
			<h3>Statut</h3>
			<div>${getStatus(order.status).label}</div>
		</div>
	</div>

	<table>
		<thead>
			<tr>
				<th>Produit</th>
				<th class="num">Qté</th>
				<th class="num">Prix unitaire</th>
				<th class="num">Total</th>
			</tr>
		</thead>
		<tbody>${rows}</tbody>
	</table>

	<div class="total">
		<div class="box">
			<div class="line"><span>Sous-total</span><span>${formatF(order.totalAmount)}</span></div>
			<div class="line"><span>Livraison</span><span>Gratuite</span></div>
			<div class="line grand"><span>Total</span><span>${formatF(order.totalAmount)}</span></div>
		</div>
	</div>

	<div class="foot">
		Merci pour votre commande. Le paiement et la livraison des licences sont finalisés via WhatsApp.<br>
		Licences Sale — Licences logicielles officielles.
	</div>
</body>
</html>`;

	const win = window.open('', '_blank', 'width=820,height=920');
	if (!win) return;
	win.document.open();
	win.document.write(html);
	win.document.close();
	win.focus();
	// Laisser le contenu se rendre avant d'ouvrir l'impression
	win.onload = () => win.print();
};

export const CommandesClient = ({ orders }: CommandesClientProps) => {
	const [searchQuery, setSearchQuery] = useState('');
	const [filterStatus, setFilterStatus] = useState('all');
	const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

	// Fermeture du modal par Échap + blocage du scroll de fond
	useEffect(() => {
		if (!selectedOrder) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') setSelectedOrder(null);
		};
		document.addEventListener('keydown', onKey);
		document.body.style.overflow = 'hidden';
		return () => {
			document.removeEventListener('keydown', onKey);
			document.body.style.overflow = '';
		};
	}, [selectedOrder]);

	const filteredOrders = orders.filter((order) => {
		const matchesSearch =
			order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
			(order.items || []).some((item) =>
				item.productName.toLowerCase().includes(searchQuery.toLowerCase()),
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

				<div className="mt-4 text-sm text-gray-500">
					{filteredOrders.length} commande
					{filteredOrders.length > 1 ? 's' : ''} trouvée
					{filteredOrders.length > 1 ? 's' : ''}
				</div>
			</div>

			{/* Orders List */}
			<div className="space-y-6">
				{filteredOrders.map((order) => {
					const status = getStatus(order.status);
					const StatusIcon = status.icon;

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
													{formatDate(order.createdAt)}
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
											className={`px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 ${status.color}`}
										>
											<StatusIcon size={16} />
											{status.label}
										</span>
									</div>
								</div>
							</div>

							{/* Order Products */}
							<div className="px-6 py-4">
								<div className="space-y-3">
									{(order.items || []).map((item) => (
										<div
											key={`${order.id}-${item.productName}`}
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
													{formatF(item.price * item.quantity)}
												</div>
												<div className="text-xs text-gray-500">
													{formatF(item.price)} × {item.quantity}
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
										<button
											type="button"
											onClick={() => setSelectedOrder(order)}
											className="px-5 py-2.5 bg-[#1D70B8] hover:bg-[#0D3A5C] text-white rounded-lg font-medium transition-all flex items-center gap-2"
										>
											<Eye size={18} />
											Voir détails
										</button>
										<button
											type="button"
											onClick={() => downloadInvoice(order)}
											className="px-5 py-2.5 bg-white border-2 border-gray-200 hover:border-[#E63946] text-gray-700 hover:text-[#E63946] rounded-lg font-medium transition-all flex items-center gap-2"
										>
											<Download size={18} />
											Télécharger facture
										</button>
									</div>
									<div className="text-right">
										<div className="text-sm text-gray-500 mb-1">Total</div>
										<div className="text-2xl font-bold text-[#1D70B8]">
											{formatF(order.totalAmount)}
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
						href="/categories"
						className="inline-block px-6 py-3 bg-gradient-to-r from-[#1D70B8] to-[#3B9DE8] text-white rounded-lg font-semibold hover:shadow-lg transition-all"
					>
						Commencer vos achats
					</Link>
				</div>
			)}

			{/* Modal détails commande */}
			{selectedOrder && (
				<div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
					<button
						type="button"
						aria-label="Fermer la fenêtre"
						onClick={() => setSelectedOrder(null)}
						className="absolute inset-0 bg-black/50 backdrop-blur-sm"
					/>
					<div
						className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-scale-in"
						role="dialog"
						aria-modal="true"
						aria-label={`Détails de la commande ${selectedOrder.orderNumber}`}
					>
						{/* En-tête modal */}
						<div className="relative bg-gradient-to-r from-[#1D70B8] to-[#3B9DE8] text-white px-6 py-5">
							<button
								type="button"
								onClick={() => setSelectedOrder(null)}
								className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
								aria-label="Fermer"
							>
								<X size={18} />
							</button>
							<p className="text-white/80 text-sm">Commande</p>
							<h3 className="text-2xl font-bold">
								#{selectedOrder.orderNumber}
							</h3>
							<div className="flex items-center gap-3 mt-2 text-sm text-white/85">
								<span className="flex items-center gap-1">
									<Calendar size={14} />
									{formatDate(selectedOrder.createdAt)}
								</span>
								<span className="px-2.5 py-0.5 rounded-full bg-white/15 text-xs font-semibold">
									{getStatus(selectedOrder.status).label}
								</span>
							</div>
						</div>

						{/* Corps modal */}
						<div className="p-6 overflow-y-auto">
							{(selectedOrder.customerName ||
								selectedOrder.customerEmail ||
								selectedOrder.customerPhone) && (
								<div className="mb-5 grid sm:grid-cols-3 gap-4 text-sm">
									{selectedOrder.customerName && (
										<div>
											<p className="text-gray-400 text-xs uppercase tracking-wide mb-1">
												Client
											</p>
											<p className="font-medium text-gray-800">
												{selectedOrder.customerName}
											</p>
										</div>
									)}
									{selectedOrder.customerPhone && (
										<div>
											<p className="text-gray-400 text-xs uppercase tracking-wide mb-1">
												Téléphone
											</p>
											<p className="font-medium text-gray-800">
												{selectedOrder.customerPhone}
											</p>
										</div>
									)}
									{selectedOrder.customerEmail && (
										<div>
											<p className="text-gray-400 text-xs uppercase tracking-wide mb-1">
												Email
											</p>
											<p className="font-medium text-gray-800 truncate">
												{selectedOrder.customerEmail}
											</p>
										</div>
									)}
								</div>
							)}

							<p className="text-gray-400 text-xs uppercase tracking-wide mb-3">
								Articles
							</p>
							<div className="space-y-2">
								{(selectedOrder.items || []).map((item) => (
									<div
										key={`modal-${selectedOrder.id}-${item.productName}`}
										className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl"
									>
										<div className="flex items-center gap-3">
											<div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
												<Package size={18} className="text-[#1D70B8]" />
											</div>
											<div>
												<h4 className="font-semibold text-gray-800">
													{item.productName}
												</h4>
												<p className="text-sm text-gray-500">
													{formatF(item.price)} × {item.quantity}
												</p>
											</div>
										</div>
										<div className="font-bold text-gray-800">
											{formatF(item.price * item.quantity)}
										</div>
									</div>
								))}
							</div>

							<div className="flex items-center justify-between mt-5 pt-5 border-t border-gray-100">
								<span className="text-lg font-bold text-gray-800">Total</span>
								<span className="text-2xl font-bold text-[#1D70B8]">
									{formatF(selectedOrder.totalAmount)}
								</span>
							</div>
						</div>

						{/* Pied modal */}
						<div className="flex flex-wrap gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
							{selectedOrder.whatsappUrl && (
								<a
									href={selectedOrder.whatsappUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="flex-1 min-w-[160px] px-5 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl font-semibold text-center transition-colors"
								>
									Finaliser sur WhatsApp
								</a>
							)}
							<button
								type="button"
								onClick={() => downloadInvoice(selectedOrder)}
								className="flex-1 min-w-[160px] px-5 py-3 bg-white border-2 border-gray-200 hover:border-[#1D70B8] text-gray-700 hover:text-[#1D70B8] rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
							>
								<Download size={18} />
								Télécharger facture
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};
