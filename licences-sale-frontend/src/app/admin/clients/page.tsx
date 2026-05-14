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
			<div className="flex items-center justify-between mb-8">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Clients</h1>
					<p className="text-gray-600 mt-2">
						Gérez les utilisateurs de votre plateforme
					</p>
				</div>
			</div>

			{clientsList ? (
				<>
					<div className="mb-4 text-sm text-gray-600">
						{clientsList.total} client{clientsList.total > 1 ? 's' : ''} au
						total
					</div>
					<ClientsTable clients={clientsList.items} />
				</>
			) : (
				<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12">
					<div className="text-center text-gray-500">
						<p>Erreur lors du chargement des clients</p>
					</div>
				</div>
			)}
		</div>
	);
};

export default ClientsPage;
