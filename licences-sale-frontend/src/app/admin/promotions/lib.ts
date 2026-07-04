import { api } from '~/lib/api';
import type { Promotion, PromotionInput } from '~/validators/promotions';

export const getPromotions = () => api.get<Promotion[]>('/promotions');

export const createPromotionApi = (data: PromotionInput) =>
	api.post('/promotions', data);

export const updatePromotionApi = (id: string, data: PromotionInput) =>
	api.put(`/promotions/${id}`, data);

export const deletePromotionApi = (id: string) =>
	api.delete(`/promotions/${id}`);

export const togglePromotionApi = (id: string) =>
	api.patch(`/promotions/${id}/toggle`);
