import { notFound } from 'next/navigation';
import { Footer } from '~/components/footer';
import { Header } from '~/components/header';
import { getProductBySlug, getProducts } from '~/lib/products';
import ProductDetailClient from './components/product-detail-client';

export const revalidate = 60;

interface PageProps {
	params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
	const { slug } = await params;

	let product;
	try {
		product = await getProductBySlug(slug);
	} catch {
		notFound();
	}

	// Récupérer les produits similaires (même catégorie)
	let relatedProducts: typeof product[] = [];
	try {
		const related = await getProducts({
			categoryId: product.categoryId,
			limit: 4,
		});
		relatedProducts = related.items.filter((p) => p.id !== product.id).slice(0, 3);
	} catch {
		// Ignorer les erreurs pour les produits similaires
	}

	return (
		<>
			<Header />
			<ProductDetailClient product={product} relatedProducts={relatedProducts} />
			<Footer />
		</>
	);
}
