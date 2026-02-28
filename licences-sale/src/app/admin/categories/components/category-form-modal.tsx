'use client';

import { useAction } from 'next-safe-action/hooks';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import type { Category } from '~/validators/categories';
import { createCategoryAction, updateCategoryAction } from '../actions';

interface CategoryFormModalProps {
	isOpen: boolean;
	onClose: () => void;
	category?: Category;
}

export const CategoryFormModal = ({
	isOpen,
	onClose,
	category,
}: CategoryFormModalProps) => {
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [image, setImage] = useState<File | null>(null);

	const isEdit = !!category;

	useEffect(() => {
		if (category) {
			setName(category.name);
			setDescription(category.description || '');
			setImage(null);
		} else {
			setName('');
			setDescription('');
			setImage(null);
		}
	}, [category]);

	const { execute: executeCreate, isExecuting: isCreating } = useAction(
		createCategoryAction,
		{
			onSuccess: ({ data }) => {
				if (data?.success) {
					toast.success('Catégorie créée avec succès');
					onClose();
					setName('');
					setDescription('');
					setImage(null);
				} else if (data?.error) {
					toast.error(data.error);
				}
			},
		},
	);

	const { execute: executeUpdate, isExecuting: isUpdating } = useAction(
		updateCategoryAction,
		{
			onSuccess: ({ data }) => {
				if (data?.success) {
					toast.success('Catégorie modifiée avec succès');
					onClose();
				} else if (data?.error) {
					toast.error(data.error);
				}
			},
		},
	);

	const isExecuting = isCreating || isUpdating;

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (isEdit && category) {
			executeUpdate({ id: category.id, name, description, image });
		} else {
			executeCreate({ name, description, image });
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
			<div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
				<div className="p-6 border-b border-gray-200">
					<h2 className="text-2xl font-bold text-gray-900">
						{isEdit ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
					</h2>
				</div>

				<form onSubmit={handleSubmit} className="p-6 space-y-4">
					<div>
						<label
							htmlFor="name"
							className="block text-sm font-medium text-gray-700 mb-2"
						>
							Nom de la catégorie <span className="text-red-500">*</span>
						</label>
						<input
							id="name"
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
							disabled={isExecuting}
							className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none disabled:bg-gray-100"
							placeholder="Ex: Logiciels Microsoft"
						/>
					</div>

					<div>
						<label
							htmlFor="description"
							className="block text-sm font-medium text-gray-700 mb-2"
						>
							Description
						</label>
						<textarea
							id="description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							disabled={isExecuting}
							rows={4}
							maxLength={500}
							className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none disabled:bg-gray-100 resize-none"
							placeholder="Description de la catégorie..."
						/>
						<p className="text-xs text-gray-500 mt-1">
							{description.length}/500 caractères
						</p>
					</div>

					<div>
						<label
							htmlFor="image"
							className="block text-sm font-medium text-gray-700 mb-2"
						>
							Image <span className="text-red-500">*</span>
						</label>
						<input
							id="image"
							type="file"
							accept="image/*"
							disabled={isExecuting}
							required={!isEdit}
							onChange={(e) => setImage(e.target.files?.[0] ?? null)}
							className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 disabled:opacity-50"
						/>
						{image?.name && (
							<p className="text-xs text-gray-500 mt-1">{image.name}</p>
						)}
					</div>

					<div className="flex gap-3 pt-4">
						<button
							type="button"
							onClick={onClose}
							disabled={isExecuting}
							className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
						>
							Annuler
						</button>
						<button
							type="submit"
							disabled={isExecuting}
							className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
						>
							{isExecuting ? 'En cours...' : isEdit ? 'Modifier' : 'Créer'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};
