import type { z } from 'zod';
import { api } from '~/lib/api';
import type { productSchema } from '~/validators/products';

export type ProductInput = z.infer<typeof productSchema>;

const toProductFormData = (data: ProductInput) => {
	const formData = new FormData();
	formData.append('name', data.name);
	formData.append('description', data.description);
	formData.append('price', String(data.price));
	formData.append('categoryId', data.categoryId);

	if (data.discount !== undefined) {
		formData.append('discount', String(data.discount));
	}

	if (data.stockQuantity !== undefined) {
		formData.append('stockQuantity', String(data.stockQuantity));
	}

	if (data.tags) {
		formData.append('tags', data.tags);
	}

	if (data.isActive !== undefined) {
		formData.append('isActive', String(data.isActive));
	}

	if (data.isFeatured !== undefined) {
		formData.append('isFeatured', String(data.isFeatured));
	}

	if (data.image instanceof Blob) {
		formData.append('image', data.image);
	}

	return formData;
};

export const fetchProductsApi = async (params?: Record<string, string>) => {
	const query = params ? `?${new URLSearchParams(params).toString()}` : '';
	return api.get(`/api/products${query}`);
};

export const createProductApi = async (data: ProductInput) => {
	return api.post('/api/products', toProductFormData(data));
};

export const updateProductApi = async (id: string, data: ProductInput) => {
	return api.put(`/api/products/${id}`, toProductFormData(data));
};

export const deleteProductApi = async (id: string) => {
	return api.delete(`/api/products/${id}`);
};

export const restoreProductApi = async (id: string) => {
	return api.patch(`/api/products/${id}/restore`);
};

export const toggleProductApi = async (id: string) => {
	return api.patch(`/api/products/${id}/toggle`);
};
