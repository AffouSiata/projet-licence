import type { z } from 'zod';
import { api } from '~/lib/api';
import type { categorySchema } from '~/validators/categories';

export type CategoryInput = z.infer<typeof categorySchema>;

const toCategoryFormData = (data: CategoryInput) => {
	const formData = new FormData();
	formData.append('name', data.name);

	if (data.description) {
		formData.append('description', data.description);
	}

	if (data.parentId) {
		formData.append('parentId', data.parentId);
	}

	if (data.order !== undefined) {
		formData.append('order', String(data.order));
	}

	if (data.image instanceof Blob) {
		formData.append('image', data.image);
	}

	return formData;
};

export const createCategoryApi = async (data: CategoryInput) => {
	return api.post('/api/categories', toCategoryFormData(data));
};

export const updateCategoryApi = async (id: string, data: CategoryInput) => {
	return api.put(`/api/categories/${id}`, toCategoryFormData(data));
};

export const deleteCategoryApi = async (id: string) => {
	return api.delete(`/api/categories/${id}`);
};

export const toggleCategoryApi = async (id: string) => {
	return api.patch(`/api/categories/${id}/toggle`);
};
