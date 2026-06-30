'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { useCart } from '~/components/cart-provider';
import { Footer } from '~/components/footer';
import { Header } from '~/components/header';

const CartPage = () => {
	const router = useRouter();
	const {
		cart,
		isLoading,
		itemCount,
		total,
		updateItem,
		removeItem,
		clearCart,
	} = useCart();
	const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());

	// Gérer le clic sur "Passer la commande"
	const handleCheckout = () => {
		router.push('/checkout');
	};

	const formatPrice = (price: number | string) => {
		const numPrice = typeof price === 'string' ? parseFloat(price) : price;
		return `${Math.round(numPrice * 655.957).toLocaleString('fr-FR')} FCFA`;
	};

	const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
		if (newQuantity < 1) return;

		setUpdatingItems((prev) => new Set(prev).add(itemId));
		const result = await updateItem(itemId, newQuantity);
		setUpdatingItems((prev) => {
			const newSet = new Set(prev);
			newSet.delete(itemId);
			return newSet;
		});

		if (!result.success) {
			toast.error(result.error || 'Erreur lors de la mise à jour');
		}
	};

	const handleRemoveItem = async (itemId: string, productName: string) => {
		setUpdatingItems((prev) => new Set(prev).add(itemId));
		const result = await removeItem(itemId);
		setUpdatingItems((prev) => {
			const newSet = new Set(prev);
			newSet.delete(itemId);
			return newSet;
		});

		if (result.success) {
			toast.success(`${productName} retiré du panier`);
		} else {
			toast.error(result.error || 'Erreur lors de la suppression');
		}
	};

	const handleClearCart = async () => {
		const result = await clearCart();
		if (result.success) {
			toast.success('Panier vidé');
		} else {
			toast.error(result.error || 'Erreur lors du vidage du panier');
		}
	};

	// Loading state
	if (isLoading) {
		return (
			<div className="min-h-screen bg-slate-50 flex flex-col">
				<Header />
				<div className="flex-1 flex items-center justify-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B75BC]" />
				</div>
				<Footer />
			</div>
		);
	}

	// Empty cart
	if (!cart || cart.items.length === 0) {
		return (
			<div className="min-h-screen bg-slate-50 flex flex-col">
				<Header />

				<div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-20">
					<div className="text-center">
						<div className="w-24 h-24 mx-auto mb-6 rounded-full bg-slate-100 flex items-center justify-center">
							<svg
								className="w-12 h-12 text-slate-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={1.5}
									d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121 0 2.002-.881 2.002-2.003V6.75H5.625m1.875 7.5L6.106 5.272M7.5 14.25L5.106 5.272"
								/>
							</svg>
						</div>
						<h1 className="text-2xl font-bold text-slate-900 mb-2">
							Votre panier est vide
						</h1>
						<p className="text-slate-500 mb-8">
							Découvrez nos licences logicielles professionnelles
						</p>
						<Link
							href="/categories"
							className="inline-flex items-center gap-2 px-6 py-3 bg-[#E63946] text-white font-semibold rounded-xl hover:bg-[#d32f3c] transition-all"
						>
							Parcourir le catalogue
							<svg
								className="w-4 h-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M17 8l4 4m0 0l-4 4m4-4H3"
								/>
							</svg>
						</Link>
					</div>
				</div>

				<Footer />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-slate-50 flex flex-col">
			<Header />

			{/* Sous-en-tête du panier */}
			<section className="bg-white border-b border-slate-200">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
					<div className="flex items-center justify-between">
						<Link
							href="/categories"
							className="inline-flex items-center gap-2 text-slate-600 hover:text-[#1B75BC] transition-colors"
						>
							<svg
								className="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M15 19l-7-7 7-7"
								/>
							</svg>
							Continuer mes achats
						</Link>
						<h1 className="text-lg font-bold text-slate-900">
							Mon Panier ({itemCount})
						</h1>
						<button
							type="button"
							onClick={handleClearCart}
							className="text-sm text-slate-500 hover:text-[#E63946] transition-colors"
						>
							Vider le panier
						</button>
					</div>
				</div>
			</section>

			{/* Cart content */}
			<div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="grid lg:grid-cols-3 gap-8">
					{/* Cart items */}
					<div className="lg:col-span-2 space-y-4">
						{cart.items.map((item) => {
							const price =
								typeof item.price === 'string'
									? parseFloat(item.price)
									: item.price;
							const isUpdating = updatingItems.has(item.id);

							return (
								<div
									key={item.id}
									className={`bg-white rounded-2xl border border-slate-200 p-5 flex gap-5 transition-opacity ${
										isUpdating ? 'opacity-60' : ''
									}`}
								>
									{/* Image */}
									<Link
										href={`/products/${item.product.slug}`}
										className="relative w-28 h-28 rounded-xl overflow-hidden bg-slate-100 shrink-0"
									>
										<Image
											src={item.product.image || '/images/placeholder.jpg'}
											alt={item.product.name}
											fill
											className="object-cover"
										/>
									</Link>

									{/* Details */}
									<div className="flex-1 min-w-0">
										<div className="flex items-start justify-between gap-4">
											<div>
												<Link href={`/products/${item.product.slug}`}>
													<h3 className="font-bold text-slate-900 hover:text-[#1B75BC] transition-colors">
														{item.product.name}
													</h3>
												</Link>
												<p className="text-sm text-slate-500 mt-0.5">
													Licence 1 an
												</p>
											</div>
											<button
												type="button"
												onClick={() =>
													handleRemoveItem(item.id, item.product.name)
												}
												disabled={isUpdating}
												className="p-2 text-slate-400 hover:text-[#E63946] hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
											>
												<svg
													className="w-5 h-5"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
													/>
												</svg>
											</button>
										</div>

										<div className="flex items-end justify-between mt-4">
											{/* Quantity */}
											<div className="flex items-center gap-2">
												<button
													type="button"
													onClick={() =>
														handleUpdateQuantity(item.id, item.quantity - 1)
													}
													disabled={isUpdating || item.quantity <= 1}
													className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:border-[#1B75BC] hover:text-[#1B75BC] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
												>
													<svg
														className="w-4 h-4"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M20 12H4"
														/>
													</svg>
												</button>
												<span className="w-10 text-center font-semibold text-slate-900">
													{item.quantity}
												</span>
												<button
													type="button"
													onClick={() =>
														handleUpdateQuantity(item.id, item.quantity + 1)
													}
													disabled={isUpdating}
													className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:border-[#1B75BC] hover:text-[#1B75BC] transition-all disabled:opacity-50"
												>
													<svg
														className="w-4 h-4"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={2}
															d="M12 4v16m8-8H4"
														/>
													</svg>
												</button>
											</div>

											{/* Price */}
											<div className="text-right">
												<p className="text-lg font-bold text-slate-900">
													{formatPrice(price * item.quantity)}
												</p>
												{item.quantity > 1 && (
													<p className="text-sm text-slate-400">
														{formatPrice(price)} / unité
													</p>
												)}
											</div>
										</div>
									</div>
								</div>
							);
						})}
					</div>

					{/* Order summary */}
					<div className="lg:col-span-1">
						<div className="bg-white rounded-2xl border border-slate-200 p-6 sticky top-6">
							<h2 className="text-lg font-bold text-slate-900 mb-5">
								Récapitulatif
							</h2>

							{/* Totals */}
							<div className="space-y-3 py-5 border-y border-slate-100">
								<div className="flex items-center justify-between text-sm">
									<span className="text-slate-600">Sous-total</span>
									<span className="font-medium text-slate-900">
										{formatPrice(total)}
									</span>
								</div>
								<div className="flex items-center justify-between text-sm">
									<span className="text-slate-600">Livraison</span>
									<span className="font-medium text-green-600">Gratuite</span>
								</div>
							</div>

							{/* Total */}
							<div className="flex items-center justify-between py-5">
								<span className="text-lg font-bold text-slate-900">Total</span>
								<span className="text-2xl font-bold text-slate-900">
									{formatPrice(total)}
								</span>
							</div>

							{/* Checkout button */}
							<button
								type="button"
								onClick={handleCheckout}
								className="w-full flex items-center justify-center gap-2 py-4 bg-[#E63946] hover:bg-[#d32f3c] text-white font-bold rounded-xl transition-all shadow-lg shadow-red-500/20"
							>
								Passer la commande
								<svg
									className="w-5 h-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M17 8l4 4m0 0l-4 4m4-4H3"
									/>
								</svg>
							</button>

							{/* WhatsApp alternative */}
							<a
								href={`https://wa.me/+22507788885862?text=${encodeURIComponent(
									`Bonjour, je souhaite commander:\n\n${cart.items.map((item) => `• ${item.product.name} (x${item.quantity}) - ${formatPrice(typeof item.price === 'string' ? parseFloat(item.price) * item.quantity : item.price * item.quantity)}`).join('\n')}\n\nTotal: ${formatPrice(total)}`,
								)}`}
								target="_blank"
								rel="noopener noreferrer"
								className="mt-3 w-full flex items-center justify-center gap-2 py-3 border-2 border-[#25D366] text-[#25D366] font-semibold rounded-xl hover:bg-[#25D366] hover:text-white transition-all"
							>
								<svg
									className="w-5 h-5"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
								</svg>
								Commander via WhatsApp
							</a>

							{/* Trust badges */}
							<div className="mt-5 pt-5 border-t border-slate-100 space-y-3">
								<div className="flex items-center gap-2 text-sm text-slate-600">
									<svg
										className="w-4 h-4 text-green-500"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M5 13l4 4L19 7"
										/>
									</svg>
									Licences 100% officielles
								</div>
								<div className="flex items-center gap-2 text-sm text-slate-600">
									<svg
										className="w-4 h-4 text-green-500"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M5 13l4 4L19 7"
										/>
									</svg>
									Livraison instantanée par email
								</div>
								<div className="flex items-center gap-2 text-sm text-slate-600">
									<svg
										className="w-4 h-4 text-green-500"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M5 13l4 4L19 7"
										/>
									</svg>
									Support 24/7
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<Footer />
		</div>
	);
};

export default CartPage;
