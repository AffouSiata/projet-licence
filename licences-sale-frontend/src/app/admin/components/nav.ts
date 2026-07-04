import {
	BadgePercent,
	Bell,
	LayoutDashboard,
	type LucideIcon,
	Package,
	Settings,
	ShoppingCart,
	Star,
	Tags,
	Users,
} from 'lucide-react';

export interface AdminNavItem {
	name: string;
	href: string;
	icon: LucideIcon;
}

export const NAV_MAIN: AdminNavItem[] = [
	{ name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
	{ name: 'Clients', href: '/admin/clients', icon: Users },
	{ name: 'Catégories', href: '/admin/categories', icon: Tags },
	{ name: 'Produits', href: '/admin/products', icon: Package },
	{ name: 'Commandes', href: '/admin/orders', icon: ShoppingCart },
	{ name: 'Avis', href: '/admin/reviews', icon: Star },
	{ name: 'Promotions', href: '/admin/promotions', icon: BadgePercent },
	{ name: 'Notifications', href: '/admin/notifications', icon: Bell },
];

export const NAV_BOTTOM: AdminNavItem[] = [
	{ name: 'Paramètres', href: '/admin/settings', icon: Settings },
];

/** Retourne le libellé de la section active à partir du pathname. */
export const getActiveTitle = (pathname: string): string => {
	const all = [...NAV_MAIN, ...NAV_BOTTOM];
	// Match le plus spécifique (href le plus long qui préfixe le pathname)
	const match = all
		.filter((item) =>
			item.href === '/admin'
				? pathname === '/admin'
				: pathname.startsWith(item.href),
		)
		.sort((a, b) => b.href.length - a.href.length)[0];
	return match?.name ?? 'Administration';
};
