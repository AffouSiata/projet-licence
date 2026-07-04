'use client';

import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react';
import {
	addFavoriteAction,
	removeFavoriteAction,
	syncFavoritesAction,
} from './favorites-actions';

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
	// 'guest' -> persistance localStorage ; 'user' -> persistance backend (compte)
	const modeRef = useRef<'guest' | 'user'>('guest');
	const favoritesRef = useRef<string[]>([]);

	useEffect(() => {
		favoritesRef.current = favorites;
	}, [favorites]);

	// Montage : charge le localStorage, puis synchronise avec le compte si connecté.
	useEffect(() => {
		let guestIds: string[] = [];
		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			const parsed = stored ? JSON.parse(stored) : [];
			if (Array.isArray(parsed)) guestIds = parsed;
		} catch (error) {
			console.error('Erreur lors du chargement des favoris:', error);
		}
		setFavorites(guestIds);

		syncFavoritesAction(guestIds)
			.then(({ loggedIn, ids }) => {
				if (loggedIn) {
					modeRef.current = 'user';
					setFavorites(ids);
					// Les favoris vivent désormais dans le compte : on nettoie le local.
					try {
						localStorage.removeItem(STORAGE_KEY);
					} catch {}
				}
			})
			.finally(() => setIsLoaded(true));
	}, []);

	// Persistance localStorage uniquement pour les invités.
	useEffect(() => {
		if (isLoaded && modeRef.current === 'guest') {
			try {
				localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
			} catch (error) {
				console.error('Erreur lors de la sauvegarde des favoris:', error);
			}
		}
	}, [favorites, isLoaded]);

	const isFavorite = useCallback(
		(productId: string) => favorites.includes(productId),
		[favorites],
	);

	const addFavorite = useCallback((productId: string) => {
		if (favoritesRef.current.includes(productId)) return;
		setFavorites((prev) =>
			prev.includes(productId) ? prev : [...prev, productId],
		);
		if (modeRef.current === 'user') {
			addFavoriteAction(productId).catch(() => {});
		}
	}, []);

	const removeFavorite = useCallback((productId: string) => {
		setFavorites((prev) => prev.filter((id) => id !== productId));
		if (modeRef.current === 'user') {
			removeFavoriteAction(productId).catch(() => {});
		}
	}, []);

	const toggleFavorite = useCallback(
		(productId: string) => {
			if (favoritesRef.current.includes(productId)) {
				removeFavorite(productId);
			} else {
				addFavorite(productId);
			}
		},
		[addFavorite, removeFavorite],
	);

	const clearFavorites = useCallback(() => {
		const current = favoritesRef.current;
		setFavorites([]);
		if (modeRef.current === 'user') {
			for (const id of current) removeFavoriteAction(id).catch(() => {});
		}
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
