import { api } from '~/lib/api';
import type { Review } from '~/validators/reviews';

// Liste complète des avis (modération) — admin uniquement.
export const getAdminReviews = async () =>
	api.get<Review[]>('/reviews/admin/all');

export const approveReviewApi = async (id: string) =>
	api.patch(`/reviews/${id}/approve`, {});

export const rejectReviewApi = async (id: string) =>
	api.patch(`/reviews/${id}/reject`, {});

export const deleteReviewApi = async (id: string) =>
	api.delete(`/reviews/${id}`);
