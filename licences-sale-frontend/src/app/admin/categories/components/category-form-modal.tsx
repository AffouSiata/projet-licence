'use client';

import { Check, ImageIcon, Loader2, Plus, X } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { compressImage } from '~/lib/compress-image';
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

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Compresse l'image avant l'envoi pour accélérer l'upload
		const finalImage = image ? await compressImage(image) : image;

		if (isEdit && category) {
			executeUpdate({ id: category.id, name, description, image: finalImage });
		} else {
			executeCreate({ name, description, image: finalImage });
		}
	};

	const handleClose = () => {
		if (!isExecuting) {
			onClose();
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			{/* Backdrop */}
			<button
				type="button"
				aria-label="Fermer"
				onClick={handleClose}
				className="absolute inset-0 bg-black/50 backdrop-blur-sm"
			/>

			{/* Modal */}
			<div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-scale-in overflow-hidden">
				{/* Header */}
				<div className="relative px-6 py-5 bg-gradient-to-r from-[#1D73B3] to-[#2E86AB]">
					<div className="flex items-start justify-between gap-4">
						<div>
							<h2 className="text-xl font-bold text-white">
								{isEdit ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
							</h2>
							<p className="text-sm text-white/80 mt-1">
								{isEdit
									? 'Mettez à jour les informations de la catégorie'
									: 'Créez une nouvelle catégorie pour organiser vos produits'}
							</p>
						</div>
						<button
							type="button"
							onClick={handleClose}
							disabled={isExecuting}
							className="p-2 text-white/80 hover:text-white hover:bg-white/15 rounded-xl transition-all disabled:opacity-50"
						>
							<X size={20} />
						</button>
					</div>
				</div>

				<form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
					{/* Image Upload */}
					<div>
						<label
							htmlFor="category-image"
							className="block text-sm font-medium text-gray-700 mb-2"
						>
							Image {!isEdit && <span className="text-[#E63946]">*</span>}
						</label>
						<button
							type="button"
							onDragOver={handleDragOver}
							onDragLeave={handleDragLeave}
							onDrop={handleDrop}
							onClick={() => fileInputRef.current?.click()}
							className={`relative w-full cursor-pointer rounded-xl border-2 border-dashed transition-all overflow-hidden text-left ${
								isDragging
									? 'border-[#1D73B3] bg-[#1D73B3]/5'
									: imagePreview
										? 'border-gray-200 bg-[#F6F8FB]'
										: 'border-gray-300 bg-[#F6F8FB] hover:border-[#1D73B3]'
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
									<div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-3 ring-1 ring-gray-200">
										<ImageIcon size={24} className="text-gray-400" />
									</div>
									<p className="text-sm text-gray-600 mb-1">
										<span className="text-[#1D73B3] font-medium">
											Cliquez pour télécharger
										</span>{' '}
										ou glissez-déposez
									</p>
									<p className="text-xs text-gray-400">
										PNG, JPG ou WEBP (max. 5MB)
									</p>
								</div>
							)}
						</button>
						<input
							id="category-image"
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
							Nom de la catégorie <span className="text-[#E63946]">*</span>
						</label>
						<input
							id="name"
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
							disabled={isExecuting}
							className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-[#1D73B3] focus:ring-2 focus:ring-[#1D73B3]/20 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
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
							className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-[#1D73B3] focus:ring-2 focus:ring-[#1D73B3]/20 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
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
							className="flex-1 px-5 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-[#F6F8FB] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Annuler
						</button>
						<button
							type="submit"
							disabled={isExecuting}
							className="flex-1 px-5 py-3 bg-[#1D73B3] text-white rounded-xl font-medium hover:bg-[#1B3A5F] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex items-center justify-center gap-2"
						>
							{isExecuting ? (
								<>
									<Loader2 size={16} className="animate-spin" />
									<span>En cours...</span>
								</>
							) : (
								<>
									{isEdit ? <Check size={16} /> : <Plus size={16} />}
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
