import type { Review } from '~/validators/reviews';
import { ReviewsClient } from './components/reviews-client';
import { getAdminReviews } from './lib';

const AdminReviewsPage = async () => {
	let reviews: Review[] = [];
	try {
		reviews = await getAdminReviews();
	} catch (error) {
		console.error('Erreur chargement avis:', error);
	}

	return (
		<div className="p-8">
			<p className="mb-6 text-gray-500">
				Modérez les avis clients : approuvez-les pour les publier sur le site,
				masquez-les ou supprimez-les.
			</p>
			<ReviewsClient initialReviews={reviews} />
		</div>
	);
};

export default AdminReviewsPage;
