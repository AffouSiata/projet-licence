'use client';

import { LogOut, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logoutAction } from '~/app/auth/actions';
import type { User } from '~/app/auth/login/lib';
import { NAV_BOTTOM, NAV_MAIN } from './nav';

interface SidebarProps {
	user: User;
}

export const Sidebar = ({ user }: SidebarProps) => {
	const pathname = usePathname();

	const isActive = (href: string) =>
		href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);

	const initials = user.name
		.split(' ')
		.map((n) => n[0])
		.join('')
		.substring(0, 2)
		.toUpperCase();

	const linkClass = (href: string) =>
		`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
			isActive(href)
				? 'bg-gradient-to-r from-[#1D73B3] to-[#2E86AB] text-white shadow-lg shadow-[#1D73B3]/30'
				: 'text-slate-300 hover:bg-white/5 hover:text-white'
		}`;

	return (
		<aside className="h-screen w-64 fixed left-0 top-0 flex flex-col bg-gradient-to-b from-[#0F2A43] to-[#16395A] text-white">
			{/* Logo */}
			<div className="px-5 py-5 border-b border-white/10">
				<Link href="/admin" className="flex items-center gap-3">
					<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1D73B3] to-[#2E86AB] flex items-center justify-center shadow-lg shadow-[#1D73B3]/30">
						<ShieldCheck size={22} className="text-white" />
					</div>
					<div>
						<h1 className="text-[15px] font-bold leading-tight">
							Licences Sale
						</h1>
						<p className="text-[11px] text-slate-400 tracking-wide">
							Administration
						</p>
					</div>
				</Link>
			</div>

			{/* Navigation principale */}
			<nav className="flex-1 overflow-y-auto px-3 py-5">
				<p className="px-3 mb-2 text-[10px] font-semibold tracking-[0.18em] text-slate-500 uppercase">
					Menu
				</p>
				<div className="space-y-1">
					{NAV_MAIN.map((item) => {
						const Icon = item.icon;
						return (
							<Link
								key={item.href}
								href={item.href}
								className={linkClass(item.href)}
							>
								{isActive(item.href) && (
									<span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-white/80" />
								)}
								<Icon size={18} />
								<span>{item.name}</span>
							</Link>
						);
					})}
				</div>
			</nav>

			{/* Bas : paramètres + déconnexion */}
			<div className="px-3 py-3 border-t border-white/10 space-y-1">
				{NAV_BOTTOM.map((item) => {
					const Icon = item.icon;
					return (
						<Link
							key={item.href}
							href={item.href}
							className={linkClass(item.href)}
						>
							<Icon size={18} />
							<span>{item.name}</span>
						</Link>
					);
				})}
				<button
					type="button"
					onClick={() => logoutAction()}
					className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-[#E63946]/15 hover:text-[#ff6b76] transition-all"
				>
					<LogOut size={18} />
					<span>Déconnexion</span>
				</button>
			</div>

			{/* Utilisateur */}
			<div className="px-4 py-4 border-t border-white/10">
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2E86AB] to-[#54B4E6] flex items-center justify-center text-sm font-bold shadow-inner">
						{initials}
					</div>
					<div className="flex-1 min-w-0">
						<p className="text-sm font-semibold truncate">{user.name}</p>
						<p className="text-[11px] text-slate-400 truncate">{user.email}</p>
					</div>
				</div>
			</div>
		</aside>
	);
};
