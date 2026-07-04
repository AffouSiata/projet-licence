import type { Review } from '~/validators/reviews';

const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3020/api';

// Récupérer les avis clients approuvés (public — côté serveur ou client).
// Optionnellement filtrés sur un produit (fiche produit).
export async function getReviews(
	opts: { limit?: number; productId?: string } = {},
): Promise<Review[]> {
	const params = new URLSearchParams();
	params.set('limit', String(opts.limit ?? 12));
	if (opts.productId) params.set('productId', opts.productId);

	const response = await fetch(`${API_BASE_URL}/reviews?${params.toString()}`, {
		headers: { 'Content-Type': 'application/json' },
		cache: 'no-store',
	});

	if (!response.ok) {
		throw new Error(`API Error: ${response.status}`);
	}

	return response.json();
}
