import type { Metadata } from 'next';
import { getCategories } from '~/lib/products';
import type { Category } from '~/validators/categories';
import { CategoriesClient } from './components/categories-client';

export const metadata: Metadata = {
	title: 'Nos catégories de licences logicielles | Licences Sale',
	description:
		'Parcourez nos catégories de licences logicielles officielles : Office, Windows, antivirus, Adobe, Autodesk, Windows Server et plus.',
};

const CategoriesPage = async () => {
	let categories: Category[] = [];

	try {
		const data = await getCategories();
		categories = data.items ?? [];
	} catch (error) {
		console.error('Erreur lors du chargement des catégories:', error);
	}

	return <CategoriesClient categories={categories} />;
};

export default CategoriesPage;
