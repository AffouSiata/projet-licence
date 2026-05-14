'use client';

import { useAction } from 'next-safe-action/hooks';
import { useEffect, useRef, useState } from 'react';
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
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [isDragging, setIsDragging] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const isEdit = !!category;

	useEffect(() => {
		if (category) {
			setName(category.name);
			setDescription(category.description || '');
			setImage(null);
			setImagePreview(category.image || null);
		} else {
			setName('');
			setDescription('');
			setImage(null);
			setImagePreview(null);
		}
	}, [category]);

	const handleImageChange = (file: File | null) => {
		setImage(file);
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		} else {
			setImagePreview(category?.image || null);
		}
	};

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(true);
	};

	const handleDragLeave = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);
		const file = e.dataTransfer.files[0];
		if (file && file.type.startsWith('image/')) {
			handleImageChange(file);
		}
	};

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
					setImagePreview(null);
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

	const handleClose = () => {
		if (!isExecuting) {
			onClose();
		}
	};

	if (!isOpen) return null;

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center p-4"
			onClick={handleClose}
		>
			{/* Backdrop */}
			<div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" />

			{/* Modal */}
			<div
				className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-scale-in overflow-hidden"
				onClick={(e) => e.stopPropagation()}
			>
				{/* Header */}
				<div className="relative px-6 pt-6 pb-4">
					<div className="flex items-start justify-between">
						<div>
							<h2 className="text-xl font-bold text-gray-900">
								{isEdit ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
							</h2>
							<p className="text-sm text-gray-500 mt-1">
								{isEdit
									? 'Mettez à jour les informations de la catégorie'
									: 'Créez une nouvelle catégorie pour organiser vos produits'}
							</p>
						</div>
						<button
							onClick={handleClose}
							disabled={isExecuting}
							className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all disabled:opacity-50"
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
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</div>
				</div>

				<form onSubmit={handleSubmit} className="px-6 pb-6 space-y-5">
					{/* Image Upload */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Image {!isEdit && <span className="text-red-500">*</span>}
						</label>
						<div
							onDragOver={handleDragOver}
							onDragLeave={handleDragLeave}
							onDrop={handleDrop}
							onClick={() => fileInputRef.current?.click()}
							className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-all overflow-hidden ${
								isDragging
									? 'border-blue-500 bg-blue-50'
									: imagePreview
										? 'border-gray-200 bg-gray-50'
										: 'border-gray-300 bg-gray-50 hover:border-gray-400'
							}`}
						>
							{imagePreview ? (
								<div className="relative aspect-video">
									<img
										src={imagePreview}
										alt="Preview"
										className="w-full h-full object-cover"
									/>
									<div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
										<span className="text-white text-sm font-medium">
											Cliquez pour changer
										</span>
									</div>
								</div>
							) : (
								<div className="py-8 text-center">
									<div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
										<svg
											className="w-6 h-6 text-gray-400"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
											/>
										</svg>
									</div>
									<p className="text-sm text-gray-600 mb-1">
										<span className="text-blue-600 font-medium">
											Cliquez pour télécharger
										</span>{' '}
										ou glissez-déposez
									</p>
									<p className="text-xs text-gray-400">
										PNG, JPG ou WEBP (max. 5MB)
									</p>
								</div>
							)}
						</div>
						<input
							ref={fileInputRef}
							type="file"
							accept="image/*"
							disabled={isExecuting}
							required={!isEdit}
							onChange={(e) => handleImageChange(e.target.files?.[0] ?? null)}
							className="hidden"
						/>
					</div>

					{/* Name Input */}
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
							className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
							placeholder="Ex: Logiciels Microsoft"
						/>
					</div>

					{/* Description */}
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
							rows={3}
							maxLength={500}
							className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
							placeholder="Décrivez brièvement cette catégorie..."
						/>
						<div className="flex items-center justify-between mt-1.5">
							<p className="text-xs text-gray-400">
								Une bonne description aide à mieux organiser vos produits
							</p>
							<span
								className={`text-xs ${description.length > 450 ? 'text-amber-500' : 'text-gray-400'}`}
							>
								{description.length}/500
							</span>
						</div>
					</div>

					{/* Actions */}
					<div className="flex gap-3 pt-2">
						<button
							type="button"
							onClick={handleClose}
							disabled={isExecuting}
							className="flex-1 px-5 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Annuler
						</button>
						<button
							type="submit"
							disabled={isExecuting}
							className="flex-1 px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
						>
							{isExecuting ? (
								<>
									<svg
										className="w-4 h-4 animate-spin"
										fill="none"
										viewBox="0 0 24 24"
									>
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"
										/>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										/>
									</svg>
									<span>En cours...</span>
								</>
							) : (
								<>
									<svg
										className="w-4 h-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d={isEdit ? 'M5 13l4 4L19 7' : 'M12 4v16m8-8H4'}
										/>
									</svg>
									<span>{isEdit ? 'Enregistrer' : 'Créer la catégorie'}</span>
								</>
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};
