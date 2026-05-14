import type { Metadata } from 'next';
import { Inter, Geist_Mono } from 'next/font/google';
import { Toaster } from 'sonner';
import { CartProvider } from '~/components/cart-provider';
import { FavoritesProvider } from '~/components/favorites-provider';
import './globals.css';

const inter = Inter({
	variable: '--font-inter',
	subsets: ['latin'],
	display: 'swap',
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Licences Sale - Vente de licences logicielles',
	description: 'Plateforme de vente de licences logicielles professionnelles',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="fr">
			<body
				className={`${inter.variable} ${geistMono.variable} antialiased font-sans`}
			>
				<FavoritesProvider>
					<CartProvider>
						{children}
					</CartProvider>
				</FavoritesProvider>
				<Toaster position="top-right" richColors />
			</body>
		</html>
	);
}
