'use client';

import { Plus } from 'lucide-react';
import { useState } from 'react';
import { CategoryFormModal } from './category-form-modal';

export const CreateCategoryButton = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);

	return (
		<>
			<button
				type="button"
				onClick={() => setIsModalOpen(true)}
				className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1D73B3] text-white rounded-xl font-semibold text-sm hover:bg-[#1B3A5F] transition-colors shadow-sm"
			>
				<Plus size={18} strokeWidth={2.5} />
				Créer une catégorie
			</button>

			<CategoryFormModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
			/>
		</>
	);
};
