import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	Logger,
} from '@nestjs/common';
import { UTApi } from 'uploadthing/server';

export interface UploadResult {
	url: string;
	key: string;
	name: string;
	size: number;
}

@Injectable()
export class UploadService {
	private readonly utapi: UTApi;
	private readonly logger = new Logger(UploadService.name);

	constructor() {
		// UTApi utilise automatiquement la variable d'environnement UPLOADTHING_TOKEN
		this.utapi = new UTApi();
	}

	/**
	 * Upload un fichier vers UploadThing
	 */
	async uploadFile(file: Express.Multer.File): Promise<UploadResult> {
		if (!file) {
			throw new BadRequestException('Aucun fichier fourni');
		}

		try {
			// Convertir le Buffer en Uint8Array pour compatibilité avec Blob
			const uint8Array = new Uint8Array(file.buffer);
			const blob = new Blob([uint8Array], { type: file.mimetype });

			// Créer un File object
			const uploadFile = new File([blob], file.originalname, {
				type: file.mimetype,
			});

			const response = await this.utapi.uploadFiles([uploadFile]);

			if (!response[0]?.data) {
				this.logger.error('Upload failed', response[0]?.error);
				throw new InternalServerErrorException(
					`Échec de l'upload: ${response[0]?.error?.message || 'Erreur inconnue'}`,
				);
			}

			const { ufsUrl, key, name, size } = response[0].data;

			return {
				url: ufsUrl,
				key,
				name,
				size,
			};
		} catch (error) {
			this.logger.error("Erreur lors de l'upload", error);
			if (
				error instanceof BadRequestException ||
				error instanceof InternalServerErrorException
			) {
				throw error;
			}
			throw new InternalServerErrorException(
				"Erreur lors de l'upload du fichier",
			);
		}
	}

	/**
	 * Upload plusieurs fichiers vers UploadThing
	 */
	async uploadFiles(files: Express.Multer.File[]): Promise<UploadResult[]> {
		if (!files || files.length === 0) {
			return [];
		}

		try {
			// Convertir les fichiers Multer en File objects
			const uploadFiles = files.map((file) => {
				const uint8Array = new Uint8Array(file.buffer);
				const blob = new Blob([uint8Array], { type: file.mimetype });
				return new File([blob], file.originalname, { type: file.mimetype });
			});

			const responses = await this.utapi.uploadFiles(uploadFiles);

			const results: UploadResult[] = [];
			const errors: string[] = [];

			for (const response of responses) {
				if (response.data) {
					results.push({
						url: response.data.ufsUrl,
						key: response.data.key,
						name: response.data.name,
						size: response.data.size,
					});
				} else if (response.error) {
					errors.push(response.error.message);
				}
			}

			if (errors.length > 0 && results.length === 0) {
				throw new InternalServerErrorException(
					`Échec de l'upload: ${errors.join(', ')}`,
				);
			}

			return results;
		} catch (error) {
			this.logger.error("Erreur lors de l'upload multiple", error);
			if (
				error instanceof BadRequestException ||
				error instanceof InternalServerErrorException
			) {
				throw error;
			}
			throw new InternalServerErrorException(
				"Erreur lors de l'upload des fichiers",
			);
		}
	}

	/**
	 * Supprimer un fichier de UploadThing par sa clé
	 */
	async deleteFile(key: string): Promise<boolean> {
		try {
			const result = await this.utapi.deleteFiles([key]);
			return result.success;
		} catch (error) {
			this.logger.error(
				`Erreur lors de la suppression du fichier ${key}`,
				error,
			);
			return false;
		}
	}

	/**
	 * Supprimer plusieurs fichiers de UploadThing
	 */
	async deleteFiles(keys: string[]): Promise<boolean> {
		if (!keys || keys.length === 0) {
			return true;
		}

		try {
			const result = await this.utapi.deleteFiles(keys);
			return result.success;
		} catch (error) {
			this.logger.error('Erreur lors de la suppression des fichiers', error);
			return false;
		}
	}

	/**
	 * Extraire la clé d'un fichier à partir de son URL UploadThing
	 */
	extractKeyFromUrl(url: string): string | null {
		try {
			// Les URLs UploadThing ont généralement le format:
			// https://utfs.io/f/{key} ou https://ufs.sh/f/{key}
			const urlObj = new URL(url);
			const pathParts = urlObj.pathname.split('/');
			// La clé est généralement le dernier segment
			return pathParts[pathParts.length - 1] || null;
		} catch {
			return null;
		}
	}
}
