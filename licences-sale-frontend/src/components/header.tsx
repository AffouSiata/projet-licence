'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useCart } from './cart-provider';
import { useFavorites } from './favorites-provider';
import { NAV_CATEGORIES } from './header/nav-categories';

type Language = 'fr' | 'en';
type Currency = 'XOF' | 'EUR' | 'USD';

const LANG_STORAGE_KEY = 'preferred_language';
const CURRENCY_STORAGE_KEY = 'preferred_currency';

const CURRENCY_LABELS: Record<Currency, string> = {
	XOF: 'XOF (FCFA)',
	EUR: 'EUR (€)',
	USD: 'USD ($)',
};

interface User {
	id: string;
	name: string;
	email: string;
	role: 'CLIENT' | 'ADMIN' | 'SUPER_ADMIN';
}

const HeaderMobileMenu = dynamic(
	() => import('./header/header-mobile-menu').then((m) => m.HeaderMobileMenu),
	{ ssr: false },
);

export const Header = () => {
	const { itemCount } = useCart();
	const { favoritesCount } = useFavorites();
	const [mobileOpen, setMobileOpen] = useState(false);
	const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState('');
	const [language, setLanguage] = useState<Language>('fr');
	const [currency, setCurrency] = useState<Currency>('XOF');
	const [langDropdownOpen, setLangDropdownOpen] = useState(false);
	const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
	const [user, setUser] = useState<User | null>(null);
	const [userDropdownOpen, setUserDropdownOpen] = useState(false);
	const langDropdownRef = useRef<HTMLDivElement>(null);
	const currencyDropdownRef = useRef<HTMLDivElement>(null);

	// Charger les préférences depuis localStorage au montage
	useEffect(() => {
		const storedLang = localStorage.getItem(LANG_STORAGE_KEY);
		if (storedLang === 'fr' || storedLang === 'en') {
			setLanguage(storedLang);
		}
		const storedCurrency = localStorage.getItem(CURRENCY_STORAGE_KEY);
		if (storedCurrency === 'XOF' || storedCurrency === 'EUR' || storedCurrency === 'USD') {
			setCurrency(storedCurrency);
		}
	}, []);

	const selectLanguage = (next: Language) => {
		setLanguage(next);
		localStorage.setItem(LANG_STORAGE_KEY, next);
		setLangDropdownOpen(false);
	};

	const selectCurrency = (next: Currency) => {
		setCurrency(next);
		localStorage.setItem(CURRENCY_STORAGE_KEY, next);
		setCurrencyDropdownOpen(false);
	};

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			const target = e.target as Node;
			if (langDropdownRef.current && !langDropdownRef.current.contains(target)) {
				setLangDropdownOpen(false);
			}
			if (currencyDropdownRef.current && !currencyDropdownRef.current.contains(target)) {
				setCurrencyDropdownOpen(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	// Vérifier si l'utilisateur est connecté (via BFF Next.js qui lit le cookie httpOnly)
	useEffect(() => {
		const checkAuth = async () => {
			try {
				const response = await fetch('/api/auth/me');
				if (response.ok) {
					const userData = await response.json();
					setUser(userData);
				}
			} catch {
				setUser(null);
			}
		};
		checkAuth();
	}, []);

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (searchQuery.trim()) {
			window.location.href = `/products?q=${encodeURIComponent(searchQuery.trim())}`;
		}
	};

	return (
		<header className="sticky top-0 z-50">
			{/* Top bar - Brand blue with animated background */}
			<div className="hidden sm:block relative">
				{/* Animated gradient background (clipped on its own so dropdowns can escape) */}
				<div className="absolute inset-0 overflow-hidden pointer-events-none">
					<div className="absolute inset-0 bg-gradient-to-r from-[#1D73B3] via-[#2488C4] to-[#1D73B3] bg-[length:200%_100%] animate-[gradient_6s_ease-in-out_infinite]" />
					<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_4s_ease-in-out_infinite]" />
				</div>

				<div className="max-w-[1400px] mx-auto px-12 lg:px-16 xl:px-20 flex items-center justify-between h-[40px] relative z-10">
					{/* Left - Contact info */}
					<div className="flex items-center gap-6">
						<a href="tel:+22507788885862" className="flex items-center gap-2 text-white/90 text-[13px] hover:text-white transition-all duration-300 group">
							<svg className="w-4 h-4 group-hover:animate-[wiggle_0.5s_ease-in-out]" fill="currentColor" viewBox="0 0 24 24">
								<path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
							</svg>
							+225 07 78 88 85 62
						</a>
						<a href="mailto:sam_building@outlook.fr" className="flex items-center gap-2 text-white/90 text-[13px] hover:text-white transition-all duration-300 group">
							<svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
								<path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0l-9.75 6.093L2.25 6.75" />
							</svg>
							sam_building@outlook.fr
						</a>
					</div>

					{/* Center - Delivery message with subtle animation */}
					<div className="hidden lg:flex items-center gap-3 text-white text-[13px]">
						<span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.6)]" />
						<span className="animate-[fadeInOut_3s_ease-in-out_infinite]">
							Livraison instantanée par email • Support 24/7
						</span>
						<span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.6)]" />
					</div>

					{/* Right - Language & Currency */}
					<div className="flex items-center gap-4">
						{/* Language Dropdown */}
						<div
							ref={langDropdownRef}
							className="relative"
							onMouseEnter={() => { setLangDropdownOpen(true); setCurrencyDropdownOpen(false); }}
							onMouseLeave={() => setLangDropdownOpen(false)}
						>
							<button
								type="button"
								onClick={() => { setLangDropdownOpen((v) => !v); setCurrencyDropdownOpen(false); }}
								aria-expanded={langDropdownOpen}
								aria-haspopup="menu"
								className="flex items-center gap-1.5 text-white text-[13px] hover:text-white/80 transition-colors py-2"
							>
								<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
									<path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
								</svg>
								{language === 'fr' ? 'Français' : 'English'}
								<svg className={`w-3 h-3 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
									<path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
								</svg>
							</button>
							{langDropdownOpen && (
								<div className="absolute top-full right-0 pt-1 z-[100]">
									<div className="bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden min-w-[130px]">
										<button
											type="button"
											onClick={() => selectLanguage('fr')}
											role="menuitem"
											className={`w-full px-4 py-2.5 text-left text-[13px] hover:bg-gray-50 transition-colors flex items-center gap-2 ${language === 'fr' ? 'text-[#1D73B3] font-semibold bg-blue-50' : 'text-gray-700'}`}
										>
											🇫🇷 Français
										</button>
										<button
											type="button"
											onClick={() => selectLanguage('en')}
											role="menuitem"
											className={`w-full px-4 py-2.5 text-left text-[13px] hover:bg-gray-50 transition-colors flex items-center gap-2 ${language === 'en' ? 'text-[#1D73B3] font-semibold bg-blue-50' : 'text-gray-700'}`}
										>
											🇬🇧 English
										</button>
									</div>
								</div>
							)}
						</div>

						{/* Currency Dropdown */}
						<div
							ref={currencyDropdownRef}
							className="relative"
							onMouseEnter={() => { setCurrencyDropdownOpen(true); setLangDropdownOpen(false); }}
							onMouseLeave={() => setCurrencyDropdownOpen(false)}
						>
							<button
								type="button"
								onClick={() => { setCurrencyDropdownOpen((v) => !v); setLangDropdownOpen(false); }}
								aria-expanded={currencyDropdownOpen}
								aria-haspopup="menu"
								className="flex items-center gap-1.5 text-white text-[13px] hover:text-white/80 transition-colors py-2"
							>
								{CURRENCY_LABELS[currency]}
								<svg className={`w-3 h-3 transition-transform ${currencyDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
									<path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
								</svg>
							</button>
							{currencyDropdownOpen && (
								<div className="absolute top-full right-0 pt-1 z-[100]">
									<div role="menu" className="bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden min-w-[130px]">
										{(['XOF', 'EUR', 'USD'] as Currency[]).map((c) => (
											<button
												key={c}
												type="button"
												role="menuitem"
												onClick={() => selectCurrency(c)}
												className={`w-full px-4 py-2.5 text-left text-[13px] hover:bg-gray-50 transition-colors ${currency === c ? 'text-[#1D73B3] font-semibold bg-blue-50' : 'text-gray-700'}`}
											>
												{CURRENCY_LABELS[c]}
											</button>
										))}
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Main header - White */}
			<div className="bg-white border-b border-gray-100">
				<div className="max-w-[1400px] mx-auto px-12 lg:px-16 xl:px-20">
					<div className="flex items-center justify-between h-[90px] gap-8">
						{/* Logo */}
						<Link href="/" className="relative w-[180px] h-[90px] shrink-0">
							<Image src="/logo.jpeg" alt="License Sale" fill className="object-contain" priority />
						</Link>

						{/* Search bar - centered */}
						<form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-[600px] mx-auto">
							<div className="flex w-full items-center relative">
								<input
									type="text"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									placeholder="Recherchez vos logiciels préférés..."
									className="w-full h-[48px] pl-5 pr-14 bg-[#F0F7FA] rounded-full text-[14px] text-gray-700 placeholder:text-gray-400 border-2 border-[#F0F7FA] focus:border-[#2E86AB] focus:bg-white focus:outline-none transition-all"
								/>
								<button
									type="submit"
									className="absolute right-1.5 w-[40px] h-[40px] bg-[#2E86AB] hover:bg-[#236A8A] text-white rounded-full flex items-center justify-center transition-colors"
								>
									<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
										<path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
									</svg>
								</button>
							</div>
						</form>

						{/* Right actions */}
						<div className="hidden lg:flex items-center gap-6 shrink-0">
							{/* Account */}
							{user ? (
								<div
									className="relative"
									onMouseEnter={() => setUserDropdownOpen(true)}
									onMouseLeave={() => setUserDropdownOpen(false)}
								>
									<button type="button" className="flex items-center gap-3 group">
										<div className="w-[45px] h-[45px] rounded-full bg-gradient-to-br from-[#1D73B3] to-[#3B9DE8] flex items-center justify-center text-white font-bold text-lg">
											{user.name.charAt(0).toUpperCase()}
										</div>
										<div className="text-left">
											<div className="text-[11px] text-gray-400 font-medium">Mon Compte</div>
											<div className="text-[14px] font-semibold text-[#2E86AB] flex items-center gap-1">
												{user.name.split(' ')[0]}
												<svg className={`w-3 h-3 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
													<path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
												</svg>
											</div>
										</div>
									</button>
									{userDropdownOpen && (
										<div className="absolute top-full right-0 pt-2 z-[100]">
											<div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden min-w-[200px]">
												<div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
													<p className="font-semibold text-gray-800">{user.name}</p>
													<p className="text-xs text-gray-500">{user.email}</p>
												</div>
												<div className="py-2">
													<Link href="/compte" className="block px-4 py-2.5 text-[13px] text-gray-700 hover:bg-blue-50 hover:text-[#1D73B3] transition-colors">
														<span className="flex items-center gap-2">
															<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
																<path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
															</svg>
															Tableau de bord
														</span>
													</Link>
													<Link href="/compte/commandes" className="block px-4 py-2.5 text-[13px] text-gray-700 hover:bg-blue-50 hover:text-[#1D73B3] transition-colors">
														<span className="flex items-center gap-2">
															<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
																<path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
															</svg>
															Mes commandes
														</span>
													</Link>
													<Link href="/compte/licences" className="block px-4 py-2.5 text-[13px] text-gray-700 hover:bg-blue-50 hover:text-[#1D73B3] transition-colors">
														<span className="flex items-center gap-2">
															<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
																<path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
															</svg>
															Mes licences
														</span>
													</Link>
													{(user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') && (
														<Link href="/admin" className="block px-4 py-2.5 text-[13px] text-gray-700 hover:bg-blue-50 hover:text-[#1D73B3] transition-colors">
															<span className="flex items-center gap-2">
																<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
																	<path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
																</svg>
																Administration
															</span>
														</Link>
													)}
												</div>
												<div className="border-t border-gray-100 py-2">
													<Link href="/api/auth/logout" className="block px-4 py-2.5 text-[13px] text-red-600 hover:bg-red-50 transition-colors">
														<span className="flex items-center gap-2">
															<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
																<path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
															</svg>
															Déconnexion
														</span>
													</Link>
												</div>
											</div>
										</div>
									)}
								</div>
							) : (
								<Link href="/auth/login" className="flex items-center gap-3 group">
									<div className="w-[45px] h-[45px] rounded-full bg-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-[#2E86AB] group-hover:text-white transition-colors">
										<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
											<path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
										</svg>
									</div>
									<div className="text-left">
										<div className="text-[11px] text-gray-400 font-medium">Mon Compte</div>
										<div className="text-[14px] font-semibold text-[#2E86AB]">Connexion</div>
									</div>
								</Link>
							)}

							{/* Favorites */}
							<Link href="/compte/favoris" className="relative text-gray-400 hover:text-[#E63946] transition-colors">
								<svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
									<path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
								</svg>
								{favoritesCount > 0 && (
									<span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#E63946] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
										{favoritesCount}
									</span>
								)}
							</Link>

							{/* Cart */}
							<Link href="/cart" className="relative text-gray-400 hover:text-[#1B75BC] transition-colors">
								<svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
									<path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121 0 2.002-.881 2.002-2.003V6.75H5.625m1.875 7.5L6.106 5.272M7.5 14.25L5.106 5.272" />
								</svg>
								{itemCount > 0 && (
									<span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#E63946] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
										{itemCount}
									</span>
								)}
							</Link>
						</div>

						{/* Mobile menu button */}
						<div className="lg:hidden flex items-center gap-2 ml-auto">
							<Link href="/compte/favoris" className="relative p-2 text-gray-500">
								<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
									<path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
								</svg>
								{favoritesCount > 0 && (
									<span className="absolute top-0 right-0 min-w-[16px] h-[16px] px-1 bg-[#E63946] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
										{favoritesCount}
									</span>
								)}
							</Link>
							<Link href="/cart" className="relative p-2 text-gray-500">
								<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
									<path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121 0 2.002-.881 2.002-2.003V6.75H5.625m1.875 7.5L6.106 5.272M7.5 14.25L5.106 5.272" />
								</svg>
								{itemCount > 0 && (
									<span className="absolute top-0 right-0 min-w-[16px] h-[16px] px-1 bg-[#E63946] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
										{itemCount}
									</span>
								)}
							</Link>
							<button
								type="button"
								onClick={() => setMobileOpen(!mobileOpen)}
								className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
							>
								{mobileOpen ? (
									<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
									</svg>
								) : (
									<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
									</svg>
								)}
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Category navigation - White with border */}
			<div className="bg-white border-b border-gray-200 hidden lg:block">
				<div className="max-w-[1400px] mx-auto px-12 lg:px-16 xl:px-20">
					<nav className="flex items-center justify-between">
						{/* Categories */}
						<div className="flex items-center">
							{NAV_CATEGORIES.map((cat) => (
								<div
									key={cat.slug}
									className="relative"
									onMouseEnter={() => setActiveDropdown(cat.slug)}
									onMouseLeave={() => setActiveDropdown(null)}
								>
									<Link
										href={`/categories/${cat.slug}`}
										className={`group flex items-center gap-1.5 px-4 py-4 text-[13px] font-semibold tracking-wide transition-colors ${
											activeDropdown === cat.slug
												? 'text-[#2E86AB]'
												: 'text-[#1B3A5F] hover:text-[#2E86AB]'
										}`}
									>
										{cat.label}
										<svg
											className={`w-3 h-3 transition-transform duration-200 ${
												activeDropdown === cat.slug ? 'rotate-180' : ''
											}`}
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
											strokeWidth={2.5}
										>
											<path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
										</svg>
									</Link>

									{/* Dropdown */}
									{activeDropdown === cat.slug && (
										<div className="absolute top-full left-0 pt-0 z-50">
											<div className="bg-white rounded-lg shadow-xl min-w-[220px] overflow-hidden border border-gray-100">
												<div className="py-2">
													{cat.subcategories.map((sub) => (
														<Link
															key={sub.slug}
															href={`/products?q=${encodeURIComponent(sub.name)}`}
															className="block px-4 py-2.5 text-[13px] text-gray-600 hover:text-[#2E86AB] hover:bg-[#F0F7FA] transition-all"
														>
															{sub.name}
														</Link>
													))}
												</div>
												<div className="border-t border-gray-100 px-4 py-2.5 bg-gray-50">
													<Link
														href={`/categories/${cat.slug}`}
														className="text-[13px] font-semibold text-[#2E86AB] hover:text-[#E63946] transition-colors flex items-center gap-1"
													>
														Tout voir
														<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
															<path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
														</svg>
													</Link>
												</div>
											</div>
										</div>
									)}
								</div>
							))}
						</div>

						{/* Right links */}
						<div className="flex items-center gap-6">
							<Link href="/about" className="text-[13px] font-semibold text-[#1B3A5F] hover:text-[#2E86AB] transition-colors">
								À propos
							</Link>
							<Link href="/contact" className="text-[13px] font-semibold text-[#1B3A5F] hover:text-[#2E86AB] transition-colors">
								Contact
							</Link>
							<Link href="/faq" className="text-[13px] font-semibold text-[#1B3A5F] hover:text-[#2E86AB] transition-colors">
								FAQ
							</Link>
						</div>
					</nav>
				</div>
			</div>

			{/* Mobile menu (lazy-loaded au premier ouverture) */}
			{mobileOpen && (
				<HeaderMobileMenu user={user} onClose={() => setMobileOpen(false)} />
			)}
		</header>
	);
};
