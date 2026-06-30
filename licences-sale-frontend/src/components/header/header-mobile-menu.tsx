'use client';

import Link from 'next/link';
import { useState } from 'react';
import { NAV_CATEGORIES } from './nav-categories';

interface User {
	id: string;
	name: string;
	email: string;
	role: 'CLIENT' | 'ADMIN' | 'SUPER_ADMIN';
}

interface Props {
	user: User | null;
	onClose: () => void;
}

export const HeaderMobileMenu = ({ user, onClose }: Props) => {
	const [searchQuery, setSearchQuery] = useState('');
	const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (searchQuery.trim()) {
			window.location.href = `/recherche?q=${encodeURIComponent(searchQuery.trim())}`;
		}
	};

	return (
		<div className="lg:hidden bg-white border-t border-gray-100 shadow-xl max-h-[80vh] overflow-y-auto">
			<div className="p-4 space-y-3">
				{/* Mobile search */}
				<form onSubmit={handleSearch} className="flex items-center">
					<div className="flex-1 relative">
						<input
							type="text"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							placeholder="Rechercher..."
							className="w-full h-11 pl-4 pr-12 bg-[#F0F7FA] rounded-full text-[14px] border-0 focus:ring-2 focus:ring-[#2E86AB] focus:outline-none transition-all"
						/>
						<button
							type="submit"
							className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 bg-[#2E86AB] text-white rounded-full flex items-center justify-center"
						>
							<svg
								className="w-4 h-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								strokeWidth={2.5}
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
								/>
							</svg>
						</button>
					</div>
				</form>

				{/* Categories accordion */}
				<div className="space-y-1">
					{NAV_CATEGORIES.map((cat) => (
						<div
							key={cat.slug}
							className="border-b border-gray-100 last:border-b-0"
						>
							<button
								type="button"
								onClick={() =>
									setMobileAccordion(
										mobileAccordion === cat.slug ? null : cat.slug,
									)
								}
								className="w-full flex items-center justify-between px-2 py-3 text-[14px] font-semibold text-[#1B3A5F]"
							>
								<span>{cat.label}</span>
								<svg
									className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${mobileAccordion === cat.slug ? 'rotate-180' : ''}`}
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									strokeWidth={2}
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M19.5 8.25l-7.5 7.5-7.5-7.5"
									/>
								</svg>
							</button>
							{mobileAccordion === cat.slug && (
								<div className="pb-2 pl-2">
									{cat.subcategories.map((sub) => (
										<Link
											key={sub.slug}
											href={`/categories/${cat.slug}?filter=${sub.slug}`}
											className="block px-4 py-2 text-[13px] text-gray-600 hover:text-[#2E86AB] rounded-lg"
											onClick={onClose}
										>
											{sub.name}
										</Link>
									))}
								</div>
							)}
						</div>
					))}
				</div>

				{/* Bottom links */}
				<div className="pt-3 border-t border-gray-100 space-y-1">
					<Link
						href="/about"
						className="block px-2 py-2.5 text-[14px] font-medium text-[#1B3A5F] hover:text-[#2E86AB]"
						onClick={onClose}
					>
						À propos
					</Link>
					<Link
						href="/contact"
						className="block px-2 py-2.5 text-[14px] font-medium text-[#1B3A5F] hover:text-[#2E86AB]"
						onClick={onClose}
					>
						Contact
					</Link>
					<Link
						href="/faq"
						className="block px-2 py-2.5 text-[14px] font-medium text-[#1B3A5F] hover:text-[#2E86AB]"
						onClick={onClose}
					>
						FAQ
					</Link>
				</div>

				{/* Auth button */}
				<div className="pt-3 border-t border-gray-100">
					{user ? (
						<div className="space-y-2">
							<div className="flex items-center gap-3 px-2 py-2">
								<div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1D73B3] to-[#3B9DE8] flex items-center justify-center text-white font-bold">
									{user.name.charAt(0).toUpperCase()}
								</div>
								<div>
									<p className="font-semibold text-gray-800">{user.name}</p>
									<p className="text-xs text-gray-500">{user.email}</p>
								</div>
							</div>
							{!(user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') && (
								<Link
									href="/compte"
									className="flex items-center justify-center gap-2 w-full py-3 text-[14px] font-semibold text-white bg-[#2E86AB] hover:bg-[#236A8A] rounded-full transition-colors"
									onClick={onClose}
								>
									Mon compte
								</Link>
							)}
							{(user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') && (
								<Link
									href="/admin"
									className="flex items-center justify-center gap-2 w-full py-3 text-[14px] font-semibold text-[#2E86AB] bg-blue-50 hover:bg-blue-100 rounded-full transition-colors"
									onClick={onClose}
								>
									Administration
								</Link>
							)}
							<Link
								href="/api/auth/logout"
								className="flex items-center justify-center gap-2 w-full py-3 text-[14px] font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-full transition-colors"
								onClick={onClose}
							>
								Déconnexion
							</Link>
						</div>
					) : (
						<Link
							href="/auth/login"
							className="flex items-center justify-center gap-2 w-full py-3 text-[14px] font-semibold text-white bg-[#2E86AB] hover:bg-[#236A8A] rounded-full transition-colors"
							onClick={onClose}
						>
							<svg
								className="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
								/>
							</svg>
							Connexion
						</Link>
					)}
				</div>
			</div>
		</div>
	);
};

export default HeaderMobileMenu;
