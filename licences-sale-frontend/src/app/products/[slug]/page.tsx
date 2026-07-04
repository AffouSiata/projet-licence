import { notFound } from 'next/navigation';
import { Footer } from '~/components/footer';
import { Header } from '~/components/header';
import { getProductBySlug, getProducts } from '~/lib/products';
import { getReviews } from '~/lib/reviews';
import type { Review } from '~/validators/reviews';
import ProductDetailClient from './components/product-detail-client';
import { ProductReviews } from './components/product-reviews';

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
	let relatedProducts: (typeof product)[] = [];
	try {
		const related = await getProducts({
			categoryId: product.categoryId,
			limit: 4,
		});
		relatedProducts = related.items
			.filter((p) => p.id !== product.id)
			.slice(0, 3);
	} catch {
		// Ignorer les erreurs pour les produits similaires
	}

	let reviews: Review[] = [];
	try {
		reviews = await getReviews({ productId: product.id, limit: 20 });
	} catch {
		// Ignorer les erreurs d'avis
	}

	return (
		<>
			<Header />
			<ProductDetailClient
				product={product}
				relatedProducts={relatedProducts}
			/>
			<ProductReviews reviews={reviews} />
			<Footer />
		</>
	);
}
