'use client';

import type { Client } from '~/validators/clients';

interface ClientsTableProps {
	clients: Client[];
}

const getRoleBadge = (role: string) => {
	switch (role) {
		case 'SUPER_ADMIN':
			return 'bg-red-100 text-red-800';
		case 'ADMIN':
			return 'bg-purple-100 text-purple-800';
		default:
			return 'bg-blue-100 text-blue-800';
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

export const ClientsTable = ({ clients }: ClientsTableProps) => {
	if (clients.length === 0) {
		return (
			<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12">
				<div className="text-center">
					<svg
						className="w-16 h-16 mx-auto mb-4 text-gray-400"
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
					<p className="text-lg font-medium text-gray-900 mb-2">Aucun client</p>
					<p className="text-sm text-gray-600">
						Les clients apparaitront ici après leur inscription
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
			<div className="overflow-x-auto">
				<table className="w-full">
					<thead className="bg-gray-50 border-b border-gray-200">
						<tr>
							<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Nom
							</th>
							<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Email
							</th>
							<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Rôle
							</th>
							<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Statut
							</th>
							<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Date d'inscription
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-200">
						{clients.map((client) => (
							<tr
								key={client.id}
								className="hover:bg-gray-50 transition-colors"
							>
								<td className="px-6 py-4 whitespace-nowrap">
									<p className="font-medium text-gray-900">{client.name}</p>
								</td>
								<td className="px-6 py-4 whitespace-nowrap">
									<p className="text-sm text-gray-600">{client.email}</p>
								</td>
								<td className="px-6 py-4 whitespace-nowrap">
									<span
										className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadge(client.role)}`}
									>
										{getRoleLabel(client.role)}
									</span>
								</td>
								<td className="px-6 py-4 whitespace-nowrap">
									<span
										className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
											client.isActive
												? 'bg-green-100 text-green-800'
												: 'bg-gray-100 text-gray-800'
										}`}
									>
										{client.isActive ? 'Actif' : 'Inactif'}
									</span>
								</td>
								<td className="px-6 py-4 whitespace-nowrap">
									<p className="text-sm text-gray-600">
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
		</div>
	);
};
