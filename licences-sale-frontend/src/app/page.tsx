import { Advantages } from '~/components/advantages';
import { CategoriesGrid } from '~/components/categories-grid';
import { FeaturedProducts } from '~/components/featured-products';
import { Footer } from '~/components/footer';
import { Header } from '~/components/header';
import { HeroSlider } from '~/components/hero-slider';
import { NewsletterCTA } from '~/components/newsletter-cta';
import { Testimonials } from '~/components/testimonials';
import { TrustSection } from '~/components/trust-section';
import { getCategories, getFeaturedProducts } from '~/lib/products';
import { getReviews } from '~/lib/reviews';
import type { Review } from '~/validators/reviews';

export const revalidate = 60;

export default async function HomePage() {
	// Charger les données depuis l'API
	let categories: Awaited<ReturnType<typeof getCategories>>['items'] = [];
	let featuredProducts: Awaited<
		ReturnType<typeof getFeaturedProducts>
	>['items'] = [];
	let reviews: Review[] = [];

	try {
		const [categoriesData, productsData, reviewsData] = await Promise.all([
			getCategories(),
			getFeaturedProducts(8),
			getReviews({ limit: 6 }).catch(() => []),
		]);
		categories = categoriesData.items || [];
		featuredProducts = productsData.items || [];
		reviews = reviewsData;
	} catch (error) {
		console.error('Error loading homepage data:', error);
	}

	return (
		<main className="min-h-screen">
			<Header />
			<HeroSlider />
			<CategoriesGrid categories={categories} />
			<FeaturedProducts products={featuredProducts} />
			<Advantages />
			{reviews.length > 0 ? (
				<Testimonials reviews={reviews} />
			) : (
				<TrustSection />
			)}
			<NewsletterCTA />
			<Footer />
		</main>
	);
}
