'use client';

import { Plus } from 'lucide-react';
import { useState } from 'react';
import { ProductFormModal } from './product-form-modal';

interface CategoryOption {
	id: string;
	name: string;
}

interface CreateProductButtonProps {
	categories: CategoryOption[];
}

export const CreateProductButton = ({
	categories,
}: CreateProductButtonProps) => {
	const [isModalOpen, setIsModalOpen] = useState(false);

	return (
		<>
			<button
				type="button"
				onClick={() => setIsModalOpen(true)}
				className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1D73B3] text-white rounded-xl text-sm font-semibold shadow-sm hover:bg-[#2E86AB] transition-colors"
			>
				<Plus size={18} />
				Ajouter un produit
			</button>

			<ProductFormModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				categories={categories}
			/>
		</>
	);
};
