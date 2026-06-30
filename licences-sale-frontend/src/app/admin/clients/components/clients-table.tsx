'use client';

import { Users } from 'lucide-react';
import type { Client } from '~/validators/clients';

interface ClientsTableProps {
	clients: Client[];
}

const getRoleBadge = (role: string) => {
	switch (role) {
		case 'SUPER_ADMIN':
			return 'bg-[#E63946]/10 text-[#E63946]';
		case 'ADMIN':
			return 'bg-[#1B3A5F]/10 text-[#1B3A5F]';
		default:
			return 'bg-[#1D73B3]/10 text-[#1D73B3]';
	}
};

const getRoleLabel = (role: string) => {
	switch (role) {
		case 'SUPER_ADMIN':
			return 'Super Admin';
		case 'ADMIN':
			return 'Admin';
		default:
			return 'Client';
	}
};

const getInitials = (name: string) =>
	name
		.split(' ')
		.map((part) => part.charAt(0))
		.join('')
		.slice(0, 2)
		.toUpperCase();

export const ClientsTable = ({ clients }: ClientsTableProps) => {
	if (clients.length === 0) {
		return (
			<div className="py-16 text-center">
				<div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1D73B3]/10">
					<Users size={26} className="text-[#1D73B3]" />
				</div>
				<p className="text-lg font-semibold text-gray-900 mb-1">Aucun client</p>
				<p className="text-sm text-gray-500">
					Les clients apparaîtront ici après leur inscription
				</p>
			</div>
		);
	}

	return (
		<div className="overflow-x-auto">
			<table className="w-full">
				<thead>
					<tr className="border-b border-gray-100">
						<th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
							Nom
						</th>
						<th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
							Email
						</th>
						<th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
							Rôle
						</th>
						<th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
							Statut
						</th>
						<th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
							Date d'inscription
						</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-gray-50">
					{clients.map((client) => (
						<tr
							key={client.id}
							className="hover:bg-[#F6F8FB] transition-colors"
						>
							<td className="px-6 py-4 whitespace-nowrap">
								<div className="flex items-center gap-3">
									<div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1D73B3]/10 text-xs font-semibold text-[#1D73B3]">
										{getInitials(client.name)}
									</div>
									<p className="text-sm font-semibold text-gray-900">
										{client.name}
									</p>
								</div>
							</td>
							<td className="px-6 py-4 whitespace-nowrap">
								<p className="text-sm text-gray-600">{client.email}</p>
							</td>
							<td className="px-6 py-4 whitespace-nowrap">
								<span
									className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${getRoleBadge(client.role)}`}
								>
									{getRoleLabel(client.role)}
								</span>
							</td>
							<td className="px-6 py-4 whitespace-nowrap">
								<span
									className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
										client.isActive
											? 'bg-emerald-50 text-emerald-700'
											: 'bg-gray-100 text-gray-600'
									}`}
								>
									<span
										className={`h-1.5 w-1.5 rounded-full ${
											client.isActive ? 'bg-emerald-500' : 'bg-gray-400'
										}`}
									/>
									{client.isActive ? 'Actif' : 'Inactif'}
								</span>
							</td>
							<td className="px-6 py-4 whitespace-nowrap">
								<p className="text-sm text-gray-500">
									{new Date(client.createdAt).toLocaleDateString('fr-FR', {
										day: 'numeric',
										month: 'long',
										year: 'numeric',
									})}
								</p>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};
