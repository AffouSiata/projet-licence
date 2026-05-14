'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

interface CartItem {
	id: string;
	productId: string;
	quantity: number;
	price: string | number;
	product: {
		id: string;
		name: string;
		slug: string;
		image: string;
		price: string | number;
		discount: number;
	};
}

interface Cart {
	id: string;
	sessionId: string;
	items: CartItem[];
	expiresAt: string;
}

interface CartContextType {
	cart: Cart | null;
	isLoading: boolean;
	itemCount: number;
	total: number;
	refreshCart: () => Promise<void>;
	addItem: (productId: string, quantity?: number) => Promise<{ success: boolean; error?: string }>;
	updateItem: (itemId: string, quantity: number) => Promise<{ success: boolean; error?: string }>;
	removeItem: (itemId: string) => Promise<{ success: boolean; error?: string }>;
	clearCart: () => Promise<{ success: boolean; error?: string }>;
}

const CartContext = createContext<CartContextType | null>(null);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3020/api';

export function CartProvider({ children }: { children: ReactNode }) {
	const [cart, setCart] = useState<Cart | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const fetchCart = useCallback(async () => {
		try {
			const response = await fetch(`${API_BASE_URL}/cart`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
			});

			if (response.ok) {
				const data = await response.json();
				setCart(data);
			}
		} catch (error) {
			console.error('Erreur lors de la récupération du panier:', error);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchCart();
	}, [fetchCart]);

	const refreshCart = useCallback(async () => {
		setIsLoading(true);
		await fetchCart();
	}, [fetchCart]);

	const addItem = useCallback(
		async (productId: string, quantity: number = 1): Promise<{ success: boolean; error?: string }> => {
			// Snapshot pour rollback si la requête échoue
			const previousCart = cart;

			// Optimistic update : si l'item existe déjà, on bump sa quantité ;
			// sinon on ajoute un placeholder temporaire pour faire bouger le compteur immédiatement.
			setCart((prev) => {
				if (!prev) {
					return {
						id: 'temp-cart',
						sessionId: 'temp',
						items: [
							{
								id: `temp-${productId}`,
								productId,
								quantity,
								price: 0,
								product: {
									id: productId,
									name: '',
									slug: '',
									image: '',
									price: 0,
									discount: 0,
								},
							},
						],
						expiresAt: '',
					};
				}
				const existing = prev.items.find((it) => it.productId === productId);
				if (existing) {
					return {
						...prev,
						items: prev.items.map((it) =>
							it.productId === productId
								? { ...it, quantity: it.quantity + quantity }
								: it,
						),
					};
				}
				return {
					...prev,
					items: [
						...prev.items,
						{
							id: `temp-${productId}`,
							productId,
							quantity,
							price: 0,
							product: {
								id: productId,
								name: '',
								slug: '',
								image: '',
								price: 0,
								discount: 0,
							},
						},
					],
				};
			});

			try {
				const response = await fetch(`${API_BASE_URL}/cart/items`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					credentials: 'include',
					body: JSON.stringify({ productId, quantity }),
				});

				if (!response.ok) {
					setCart(previousCart);
					const error = await response.json();
					return { success: false, error: error.message || 'Erreur lors de l\'ajout au panier' };
				}

				const data = await response.json();
				setCart(data);
				return { success: true };
			} catch (error) {
				setCart(previousCart);
				console.error('Erreur lors de l\'ajout au panier:', error);
				return { success: false, error: 'Erreur de connexion au serveur' };
			}
		},
		[cart]
	);

	const updateItem = useCallback(
		async (itemId: string, quantity: number): Promise<{ success: boolean; error?: string }> => {
			try {
				const response = await fetch(`${API_BASE_URL}/cart/items/${itemId}`, {
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json',
					},
					credentials: 'include',
					body: JSON.stringify({ quantity }),
				});

				if (!response.ok) {
					const error = await response.json();
					return { success: false, error: error.message || 'Erreur lors de la mise à jour' };
				}

				const data = await response.json();
				setCart(data);
				return { success: true };
			} catch (error) {
				console.error('Erreur lors de la mise à jour:', error);
				return { success: false, error: 'Erreur de connexion au serveur' };
			}
		},
		[]
	);

	const removeItem = useCallback(
		async (itemId: string): Promise<{ success: boolean; error?: string }> => {
			try {
				const response = await fetch(`${API_BASE_URL}/cart/items/${itemId}`, {
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json',
					},
					credentials: 'include',
				});

				if (!response.ok) {
					const error = await response.json();
					return { success: false, error: error.message || 'Erreur lors de la suppression' };
				}

				const data = await response.json();
				setCart(data);
				return { success: true };
			} catch (error) {
				console.error('Erreur lors de la suppression:', error);
				return { success: false, error: 'Erreur de connexion au serveur' };
			}
		},
		[]
	);

	const clearCartFn = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
		try {
			const response = await fetch(`${API_BASE_URL}/cart`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
			});

			if (!response.ok) {
				const error = await response.json();
				return { success: false, error: error.message || 'Erreur lors du vidage du panier' };
			}

			const data = await response.json();
			setCart(data);
			return { success: true };
		} catch (error) {
			console.error('Erreur lors du vidage du panier:', error);
			return { success: false, error: 'Erreur de connexion au serveur' };
		}
	}, []);

	const itemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

	const total = cart?.items.reduce((sum, item) => {
		const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
		return sum + price * item.quantity;
	}, 0) || 0;

	return (
		<CartContext.Provider
			value={{
				cart,
				isLoading,
				itemCount,
				total,
				refreshCart,
				addItem,
				updateItem,
				removeItem,
				clearCart: clearCartFn,
			}}
		>
			{children}
		</CartContext.Provider>
	);
}

export function useCart() {
	const context = useContext(CartContext);
	if (!context) {
		throw new Error('useCart must be used within a CartProvider');
	}
	return context;
}
