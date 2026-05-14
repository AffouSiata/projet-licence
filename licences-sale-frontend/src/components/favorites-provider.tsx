'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

interface FavoritesContextType {
	favorites: string[];
	isFavorite: (productId: string) => boolean;
	toggleFavorite: (productId: string) => void;
	addFavorite: (productId: string) => void;
	removeFavorite: (productId: string) => void;
	clearFavorites: () => void;
	favoritesCount: number;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

const STORAGE_KEY = 'softkey_favorites';

export function FavoritesProvider({ children }: { children: ReactNode }) {
	const [favorites, setFavorites] = useState<string[]>([]);
	const [isLoaded, setIsLoaded] = useState(false);

	// Charger les favoris depuis localStorage au montage
	useEffect(() => {
		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			if (stored) {
				const parsed = JSON.parse(stored);
				if (Array.isArray(parsed)) {
					setFavorites(parsed);
				}
			}
		} catch (error) {
			console.error('Erreur lors du chargement des favoris:', error);
		}
		setIsLoaded(true);
	}, []);

	// Sauvegarder les favoris dans localStorage à chaque changement
	useEffect(() => {
		if (isLoaded) {
			try {
				localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
			} catch (error) {
				console.error('Erreur lors de la sauvegarde des favoris:', error);
			}
		}
	}, [favorites, isLoaded]);

	const isFavorite = useCallback(
		(productId: string) => favorites.includes(productId),
		[favorites]
	);

	const addFavorite = useCallback((productId: string) => {
		setFavorites((prev) => {
			if (prev.includes(productId)) return prev;
			return [...prev, productId];
		});
	}, []);

	const removeFavorite = useCallback((productId: string) => {
		setFavorites((prev) => prev.filter((id) => id !== productId));
	}, []);

	const toggleFavorite = useCallback((productId: string) => {
		setFavorites((prev) => {
			if (prev.includes(productId)) {
				return prev.filter((id) => id !== productId);
			}
			return [...prev, productId];
		});
	}, []);

	const clearFavorites = useCallback(() => {
		setFavorites([]);
	}, []);

	return (
		<FavoritesContext.Provider
			value={{
				favorites,
				isFavorite,
				toggleFavorite,
				addFavorite,
				removeFavorite,
				clearFavorites,
				favoritesCount: favorites.length,
			}}
		>
			{children}
		</FavoritesContext.Provider>
	);
}

export function useFavorites() {
	const context = useContext(FavoritesContext);
	if (!context) {
		throw new Error('useFavorites must be used within a FavoritesProvider');
	}
	return context;
}
