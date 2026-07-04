'use server';

import { api } from '~/lib/api';

/**
 * Synchronise les favoris au montage :
 * - fusionne les favoris « invités » (localStorage) dans le compte,
 * - renvoie la liste faisant autorité côté serveur.
 * Si l'utilisateur n'est pas connecté (401), renvoie loggedIn: false.
 */
export async function syncFavoritesAction(
	guestIds: string[],
): Promise<{ loggedIn: boolean; ids: string[] }> {
	try {
		if (guestIds.length) {
			await Promise.all(
				guestIds.map((id) =>
					api.post('/favorites', { productId: id }).catch(() => null),
				),
			);
		}
		const ids = await api.get<string[]>('/favorites');
		return { loggedIn: true, ids };
	} catch {
		return { loggedIn: false, ids: [] };
	}
}

export async function addFavoriteAction(productId: string): Promise<boolean> {
	try {
		await api.post('/favorites', { productId });
		return true;
	} catch {
		return false;
	}
}

export async function removeFavoriteAction(
	productId: string,
): Promise<boolean> {
	try {
		await api.delete(`/favorites/${productId}`);
		return true;
	} catch {
		return false;
	}
}
