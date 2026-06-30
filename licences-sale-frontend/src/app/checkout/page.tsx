'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useCart } from '~/components/cart-provider';
import { createOrderAction } from './actions';

interface User {
	id: string;
	name: string;
	email: string;
	role: string;
}

interface OrderResponse {
	id: string;
	orderNumber: string;
	whatsappUrl: string;
	totalAmount: string | number;
}

const CheckoutPage = () => {
	const { cart, isLoading, total, refreshCart } = useCart();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [orderComplete, setOrderComplete] = useState<OrderResponse | null>(
		null,
	);
	const [user, setUser] = useState<User | null>(null);
	const [authChecking, setAuthChecking] = useState(true);

	const [formData, setFormData] = useState({
		customerName: '',
		customerEmail: '',
		customerPhone: '',
	});

	// Vérifier si l'utilisateur est connecté (via BFF Next.js qui lit le cookie httpOnly)
	useEffect(() => {
		const checkAuth = async () => {
			try {
				const response = await fetch('/api/auth/me');
				if (response.ok) {
					const userData = await response.json();
					setUser(userData);
					// Pré-remplir les champs avec les infos de l'utilisateur
					setFormData((prev) => ({
						...prev,
						customerName: userData.name || '',
						customerEmail: userData.email || '',
					}));
				}
				// Pas de redirection - l'utilisateur peut commander sans être connecté
			} catch {
				// Erreur silencieuse - l'utilisateur peut continuer
			} finally {
				setAuthChecking(false);
			}
		};
		checkAuth();
	}, []);

	const [errors, setErrors] = useState<Record<string, string>>({});

	const formatPrice = (price: number | string) => {
		const numPrice = typeof price === 'string' ? parseFloat(price) : price;
		return `${Math.round(numPrice * 655.957).toLocaleString('fr-FR')} FCFA`;
	};

	// Met à jour un champ et efface son éventuelle erreur dès que l'utilisateur le corrige
	const handleFieldChange = (field: keyof typeof formData, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		setErrors((prev) => {
			if (!prev[field]) return prev;
			const next = { ...prev };
			delete next[field];
			return next;
		});
	};

	// Nettoie le numéro pour correspondre au format attendu par le backend :
	// on conserve le « + » initial et les chiffres, on retire espaces/tirets/points/parenthèses.
	const sanitizePhone = (phone: string) =>
		phone.trim().replace(/[\s.()-]/g, '');

	const validateForm = () => {
		const newErrors: Record<string, string> = {};

		if (!formData.customerName.trim()) {
			newErrors.customerName = 'Le nom est requis';
		}

		if (!formData.customerPhone.trim()) {
			newErrors.customerPhone = 'Le téléphone est requis';
		} else if (
			// Même règle que le backend (Zod) une fois le numéro nettoyé
			!/^(\+|00)?[0-9]{8,15}$/.test(sanitizePhone(formData.customerPhone))
		) {
			newErrors.customerPhone =
				'Numéro de téléphone invalide (8 à 15 chiffres)';
		}

		if (
			formData.customerEmail &&
			!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)
		) {
			newErrors.customerEmail = 'Email invalide';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) return;

		setIsSubmitting(true);

		const result = await createOrderAction({
			customerName: formData.customerName.trim(),
			customerEmail: formData.customerEmail.trim() || undefined,
			customerPhone: sanitizePhone(formData.customerPhone),
		});

		if (result.success && result.order) {
			setOrderComplete(result.order);
			await refreshCart();
			toast.success('Commande créée avec succès !');
		} else if (result.fieldErrors) {
			// Erreurs de validation backend : on les affiche sous chaque champ concerné
			setErrors(result.fieldErrors);
			toast.error('Veuillez corriger les champs en rouge');
		} else {
			toast.error(result.error || 'Erreur lors de la création de la commande');
		}

		setIsSubmitting(false);
	};

	// Auth checking or loading state
	if (authChecking || isLoading) {
		return (
			<div className="min-h-screen bg-slate-50 flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B75BC]" />
			</div>
		);
	}

	// Order complete
	if (orderComplete) {
		return (
			<div className="min-h-screen bg-slate-50">
				<div className="max-w-2xl mx-auto px-4 py-20">
					<div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
						<div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
							<svg
								className="w-10 h-10 text-green-600"
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
						</div>
						<h1 className="text-2xl font-bold text-slate-900 mb-2">
							Commande confirmée !
						</h1>
						<p className="text-slate-500 mb-6">
							Votre commande{' '}
							<span className="font-semibold text-slate-700">
								#{orderComplete.orderNumber}
							</span>{' '}
							a été créée avec succès.
						</p>

						<div className="bg-slate-50 rounded-xl p-6 mb-6">
							<p className="text-sm text-slate-600 mb-4">
								Pour finaliser votre commande, contactez-nous via WhatsApp. Vous
								recevrez vos licences par email après paiement.
							</p>
							<p className="text-lg font-bold text-slate-900">
								Total : {formatPrice(orderComplete.totalAmount)}
							</p>
						</div>

						<div className="space-y-3">
							{orderComplete.whatsappUrl && (
								<a
									href={orderComplete.whatsappUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="w-full flex items-center justify-center gap-2 py-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20"
								>
									<svg
										className="w-5 h-5"
										fill="currentColor"
										viewBox="0 0 24 24"
									>
										<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
									</svg>
									Finaliser sur WhatsApp
								</a>
							)}
							<Link
								href="/"
								className="w-full flex items-center justify-center gap-2 py-3 border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-all"
							>
								Continuer mes achats
							</Link>
						</div>
					</div>
				</div>
			</div>
		);
	}

	// Empty cart redirect
	if (!cart || cart.items.length === 0) {
		return (
			<div className="min-h-screen bg-slate-50">
				<div className="max-w-2xl mx-auto px-4 py-20">
					<div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
						<div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-100 flex items-center justify-center">
							<svg
								className="w-10 h-10 text-slate-400"
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
						<p className="text-slate-500 mb-6">
							Ajoutez des produits pour passer commande
						</p>
						<Link
							href="/categories"
							className="inline-flex items-center gap-2 px-6 py-3 bg-[#E63946] text-white font-semibold rounded-xl hover:bg-[#d32f3c] transition-all"
						>
							Parcourir le catalogue
						</Link>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-slate-50">
			{/* Header */}
			<header className="bg-white border-b border-slate-200">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
					<div className="flex items-center justify-between">
						<Link
							href="/cart"
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
							Retour au panier
						</Link>
						<h1 className="text-lg font-bold text-slate-900">
							Finaliser la commande
						</h1>
						<div className="w-20" />
					</div>
				</div>
			</header>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="grid lg:grid-cols-2 gap-8">
					{/* Form */}
					<div className="bg-white rounded-2xl border border-slate-200 p-6">
						<h2 className="text-lg font-bold text-slate-900 mb-6">
							Vos informations
						</h2>

						<form onSubmit={handleSubmit} className="space-y-5">
							{/* Name */}
							<div>
								<label className="block text-sm font-medium text-slate-700 mb-2">
									Nom complet <span className="text-red-500">*</span>
								</label>
								<input
									type="text"
									value={formData.customerName}
									onChange={(e) =>
										handleFieldChange('customerName', e.target.value)
									}
									placeholder="Votre nom"
									className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none transition-colors ${
										errors.customerName
											? 'border-red-300 focus:border-red-500'
											: 'border-slate-200 focus:border-[#1B75BC]'
									}`}
								/>
								{errors.customerName && (
									<p className="text-sm text-red-500 mt-1">
										{errors.customerName}
									</p>
								)}
							</div>

							{/* Phone */}
							<div>
								<label className="block text-sm font-medium text-slate-700 mb-2">
									Téléphone <span className="text-red-500">*</span>
								</label>
								<input
									type="tel"
									value={formData.customerPhone}
									onChange={(e) =>
										handleFieldChange('customerPhone', e.target.value)
									}
									placeholder="+225 XX XX XX XX XX"
									className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none transition-colors ${
										errors.customerPhone
											? 'border-red-300 focus:border-red-500'
											: 'border-slate-200 focus:border-[#1B75BC]'
									}`}
								/>
								{errors.customerPhone && (
									<p className="text-sm text-red-500 mt-1">
										{errors.customerPhone}
									</p>
								)}
							</div>

							{/* Email */}
							<div>
								<label className="block text-sm font-medium text-slate-700 mb-2">
									Email (optionnel)
								</label>
								<input
									type="email"
									value={formData.customerEmail}
									onChange={(e) =>
										handleFieldChange('customerEmail', e.target.value)
									}
									placeholder="votre@email.com"
									className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none transition-colors ${
										errors.customerEmail
											? 'border-red-300 focus:border-red-500'
											: 'border-slate-200 focus:border-[#1B75BC]'
									}`}
								/>
								{errors.customerEmail && (
									<p className="text-sm text-red-500 mt-1">
										{errors.customerEmail}
									</p>
								)}
								<p className="text-xs text-slate-500 mt-1">
									Vous recevrez vos licences à cette adresse après paiement
								</p>
							</div>

							{/* Payment info */}
							<div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
								<div className="flex items-start gap-3">
									<svg
										className="w-5 h-5 text-amber-600 mt-0.5"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
									<div>
										<p className="text-sm font-medium text-amber-800">
											Mode de paiement
										</p>
										<p className="text-xs text-amber-700 mt-1">
											Après validation, vous serez redirigé vers WhatsApp pour
											finaliser le paiement par Wave, Orange Money ou MTN.
										</p>
									</div>
								</div>
							</div>

							{/* Submit */}
							<button
								type="submit"
								disabled={isSubmitting}
								className="w-full flex items-center justify-center gap-2 py-4 bg-[#E63946] hover:bg-[#d32f3c] text-white font-bold rounded-xl transition-all shadow-lg shadow-red-500/20 disabled:opacity-60"
							>
								{isSubmitting ? (
									<>
										<svg
											className="w-5 h-5 animate-spin"
											fill="none"
											viewBox="0 0 24 24"
										>
											<circle
												className="opacity-25"
												cx="12"
												cy="12"
												r="10"
												stroke="currentColor"
												strokeWidth="4"
											/>
											<path
												className="opacity-75"
												fill="currentColor"
												d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
											/>
										</svg>
										Traitement en cours...
									</>
								) : (
									<>
										Confirmer la commande
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
												d="M5 13l4 4L19 7"
											/>
										</svg>
									</>
								)}
							</button>
						</form>
					</div>

					{/* Order summary */}
					<div>
						<div className="bg-white rounded-2xl border border-slate-200 p-6 sticky top-6">
							<h2 className="text-lg font-bold text-slate-900 mb-5">
								Récapitulatif
							</h2>

							{/* Items */}
							<div className="space-y-4 pb-5 border-b border-slate-100">
								{cart.items.map((item) => {
									const price =
										typeof item.price === 'string'
											? parseFloat(item.price)
											: item.price;
									return (
										<div key={item.id} className="flex gap-4">
											<div className="relative w-16 h-16 rounded-lg overflow-hidden bg-slate-100 shrink-0">
												<Image
													src={item.product.image || '/images/placeholder.jpg'}
													alt={item.product.name}
													fill
													className="object-cover"
												/>
											</div>
											<div className="flex-1 min-w-0">
												<h3 className="font-medium text-slate-900 text-sm line-clamp-1">
													{item.product.name}
												</h3>
												<p className="text-xs text-slate-500 mt-0.5">
													Quantité : {item.quantity}
												</p>
											</div>
											<p className="font-semibold text-slate-900 text-sm shrink-0">
												{formatPrice(price * item.quantity)}
											</p>
										</div>
									);
								})}
							</div>

							{/* Totals */}
							<div className="space-y-3 py-5 border-b border-slate-100">
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

							{/* Trust badges */}
							<div className="space-y-3">
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
		</div>
	);
};

export default CheckoutPage;
