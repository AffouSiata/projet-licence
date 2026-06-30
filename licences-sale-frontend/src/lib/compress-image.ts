/**
 * Compresse et redimensionne une image côté navigateur avant l'upload.
 *
 * Objectif : réduire fortement le poids du fichier (donc le temps d'envoi
 * navigateur → Next → backend → UploadThing) tout en gardant une qualité
 * adaptée à l'affichage web.
 *
 * Robuste : en cas d'échec (format non supporté, navigateur ancien, gain
 * négatif…) on renvoie le fichier d'origine inchangé. Les GIF (animés) et
 * les non-images ne sont jamais touchés. Le backend accepte le WEBP.
 */
export const compressImage = async (
	file: File,
	{
		maxSize = 1600,
		quality = 0.85,
	}: { maxSize?: number; quality?: number } = {},
): Promise<File> => {
	if (!file.type.startsWith('image/') || file.type === 'image/gif') {
		return file;
	}

	try {
		const bitmap = await createImageBitmap(file);
		const largestSide = Math.max(bitmap.width, bitmap.height);
		const scale = Math.min(1, maxSize / largestSide);

		// Déjà petite et légère → on ne recompresse pas inutilement
		if (scale === 1 && file.size < 400 * 1024) {
			bitmap.close();
			return file;
		}

		const width = Math.round(bitmap.width * scale);
		const height = Math.round(bitmap.height * scale);

		const canvas = document.createElement('canvas');
		canvas.width = width;
		canvas.height = height;
		const ctx = canvas.getContext('2d');
		if (!ctx) {
			bitmap.close();
			return file;
		}
		ctx.drawImage(bitmap, 0, 0, width, height);
		bitmap.close();

		const blob = await new Promise<Blob | null>((resolve) => {
			canvas.toBlob(resolve, 'image/webp', quality);
		});

		// Pas de blob ou pas de gain de poids → on garde l'original
		if (!blob || blob.size >= file.size) {
			return file;
		}

		const baseName = file.name.replace(/\.[^.]+$/, '');
		return new File([blob], `${baseName}.webp`, { type: 'image/webp' });
	} catch {
		return file;
	}
};
