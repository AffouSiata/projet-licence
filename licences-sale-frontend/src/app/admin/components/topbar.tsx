'use client';

import { Bell, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { User } from '~/app/auth/login/lib';
import { getActiveTitle } from './nav';

interface TopbarProps {
	user: User;
}

export const Topbar = ({ user }: TopbarProps) => {
	const pathname = usePathname();
	const title = getActiveTitle(pathname);

	const initials = user.name
		.split(' ')
		.map((n) => n[0])
		.join('')
		.substring(0, 2)
		.toUpperCase();

	return (
		<header className="sticky top-0 z-30 h-16 bg-white/85 backdrop-blur border-b border-gray-200/70">
			<div className="h-full px-8 flex items-center justify-between">
				{/* Fil d'ariane + titre */}
				<div>
					<div className="flex items-center gap-1.5 text-xs text-gray-400">
						<span>Admin</span>
						<span>/</span>
						<span className="text-[#2E86AB] font-medium">{title}</span>
					</div>
					<h2 className="text-lg font-bold text-gray-900 leading-tight tracking-tight">
						{title}
					</h2>
				</div>

				{/* Actions */}
				<div className="flex items-center gap-2">
					<Link
						href="/"
						target="_blank"
						className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 hover:text-[#1D73B3] hover:bg-gray-100 rounded-lg transition-colors"
					>
						<ExternalLink size={16} />
						Voir le site
					</Link>

					<button
						type="button"
						aria-label="Notifications"
						className="relative w-10 h-10 rounded-lg flex items-center justify-center text-gray-500 hover:text-[#1D73B3] hover:bg-gray-100 transition-colors"
					>
						<Bell size={19} />
						<span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-[#E63946] ring-2 ring-white" />
					</button>

					<div className="w-px h-8 bg-gray-200 mx-1" />

					<div className="flex items-center gap-3 pl-1">
						<div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1D73B3] to-[#2E86AB] flex items-center justify-center text-white text-sm font-bold">
							{initials}
						</div>
						<div className="hidden md:block leading-tight">
							<p className="text-sm font-semibold text-gray-800">{user.name}</p>
							<p className="text-xs text-gray-400">
								{user.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Administrateur'}
							</p>
						</div>
					</div>
				</div>
			</div>
		</header>
	);
};
