import { BadgePercent, Plus } from 'lucide-react';
import { ComingSoon } from '../components/coming-soon';

const PromotionsPage = () => {
	return (
		<div className="p-8">
			<div className="flex items-center justify-between mb-6">
				<p className="text-gray-500">
					Créez et gérez vos codes promo et réductions.
				</p>
				<button
					type="button"
					disabled
					className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1D73B3] text-white rounded-xl font-semibold opacity-50 cursor-not-allowed"
				>
					<Plus size={18} />
					Créer une promotion
				</button>
			</div>

			<div className="bg-white rounded-2xl ring-1 ring-gray-200/70 shadow-sm">
				<ComingSoon
					icon={BadgePercent}
					title="Gestion des promotions"
					description="La création de codes promo et de réductions sera disponible ici prochainement."
				/>
			</div>
		</div>
	);
};

export default PromotionsPage;
