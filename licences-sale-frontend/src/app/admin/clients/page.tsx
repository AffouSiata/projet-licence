import { Users } from 'lucide-react';
import type { ClientsList } from '~/validators/clients';
import { ClientsTable } from './components/clients-table';
import { fetchClientsApi } from './lib';

const ClientsPage = async () => {
	let clientsList: ClientsList | null = null;

	try {
		clientsList = await fetchClientsApi({ role: 'CLIENT', limit: '100' });
	} catch (error) {
		console.error('Erreur chargement clients:', error);
	}

	return (
		<div className="p-8">
			<div className="mb-8 flex items-center justify-between gap-4">
				<p className="text-gray-500">
					Gérez les utilisateurs de votre plateforme.
				</p>
				{clientsList ? (
					<span className="inline-flex items-center gap-2 rounded-xl bg-[#1D73B3]/10 px-3.5 py-2 text-sm font-semibold text-[#1D73B3]">
						<Users size={16} />
						{clientsList.total} client{clientsList.total > 1 ? 's' : ''}
					</span>
				) : null}
			</div>

			<div className="bg-white rounded-2xl ring-1 ring-gray-200/70 shadow-sm overflow-hidden">
				<div className="px-6 py-5 border-b border-gray-100">
					<h2 className="text-lg font-bold text-gray-900 tracking-tight">
						Tous les clients
					</h2>
					<p className="text-sm text-gray-400">
						Liste des comptes inscrits sur la plateforme
					</p>
				</div>
				{clientsList ? (
					<ClientsTable clients={clientsList.items} />
				) : (
					<div className="text-gray-500 text-center py-12">
						Erreur lors du chargement des clients
					</div>
				)}
			</div>
		</div>
	);
};

export default ClientsPage;
