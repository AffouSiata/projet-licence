import { getCategories, getFeaturedProducts } from '~/lib/products';
import { Header } from '~/components/header';
import { HeroSlider } from '~/components/hero-slider';
import { CategoriesGrid } from '~/components/categories-grid';
import { FeaturedProducts } from '~/components/featured-products';
import { Advantages } from '~/components/advantages';
import { Testimonials } from '~/components/testimonials';
import { NewsletterCTA } from '~/components/newsletter-cta';
import { Footer } from '~/components/footer';

export const revalidate = 60;

export default async function HomePage() {
	// Charger les données depuis l'API
	let categories: Awaited<ReturnType<typeof getCategories>>['items'] = [];
	let featuredProducts: Awaited<
		ReturnType<typeof getFeaturedProducts>
	>['items'] = [];

	try {
		const [categoriesData, productsData] = await Promise.all([
			getCategories(),
			getFeaturedProducts(8),
		]);
		categories = categoriesData.items || [];
		featuredProducts = productsData.items || [];
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
			<Testimonials />
			<NewsletterCTA />
			<Footer />
		</main>
	);
}
