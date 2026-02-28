'use client';

import { useState } from 'react';
import { CategoryFormModal } from './category-form-modal';

export const CreateCategoryButton = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);

	return (
		<>
			<button
				onClick={() => setIsModalOpen(true)}
				className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
			>
				<svg
					className="w-5 h-5"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M12 4v16m8-8H4"
					/>
				</svg>
				Ajouter une catégorie
			</button>

			<CategoryFormModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
			/>
		</>
	);
};
