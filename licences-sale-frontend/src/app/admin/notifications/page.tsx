import { Bell, Plus } from 'lucide-react';
import { ComingSoon } from '../components/coming-soon';

const NotificationsPage = () => {
	return (
		<div className="p-8">
			<div className="flex items-center justify-between mb-6">
				<p className="text-gray-500">
					Envoyez et gérez les notifications de votre plateforme.
				</p>
				<button
					type="button"
					disabled
					className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1D73B3] text-white rounded-xl font-semibold opacity-50 cursor-not-allowed"
				>
					<Plus size={18} />
					Créer une notification
				</button>
			</div>

			<div className="bg-white rounded-2xl ring-1 ring-gray-200/70 shadow-sm">
				<ComingSoon
					icon={Bell}
					title="Centre de notifications"
					description="L'envoi et le suivi des notifications (nouvelles commandes, stock faible…) arriveront ici prochainement."
				/>
			</div>
		</div>
	);
};

export default NotificationsPage;
