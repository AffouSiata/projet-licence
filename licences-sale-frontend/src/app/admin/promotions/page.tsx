import type { Promotion } from '~/validators/promotions';
import { PromotionsClient } from './components/promotions-client';
import { getPromotions } from './lib';

const PromotionsPage = async () => {
	let promotions: Promotion[] = [];
	try {
		promotions = await getPromotions();
	} catch (error) {
		console.error('Erreur chargement promotions:', error);
	}

	return (
		<div className="p-8">
			<p className="mb-6 text-gray-500">
				Créez et gérez vos codes promotionnels. Ils sont appliqués au panier
				lors du checkout.
			</p>
			<PromotionsClient initialPromotions={promotions} />
		</div>
	);
};

export default PromotionsPage;
