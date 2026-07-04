import { toast } from 'sonner';

// Extrait un message lisible d'une erreur de validation next-safe-action
// (gère les deux formats possibles : aplati et imbriqué).
const firstValidationMessage = (
	ve: Record<string, unknown> | undefined,
): string | null => {
	if (!ve) return null;
	const flat = ve as {
		formErrors?: string[];
		fieldErrors?: Record<string, string[]>;
	};
	if (flat.formErrors?.length) return flat.formErrors[0];
	if (flat.fieldErrors) {
		for (const key of Object.keys(flat.fieldErrors)) {
			const arr = flat.fieldErrors[key];
			if (arr?.length) return arr[0];
		}
	}
	for (const key of Object.keys(ve)) {
		const node = ve[key] as { _errors?: string[] } | undefined;
		if (node?._errors?.length) return node._errors[0];
	}
	return null;
};

/**
 * Handler `onError` partagé pour les formulaires next-safe-action.
 *
 * Sans lui, un formulaire invalide (ex : description trop courte) ou une
 * erreur serveur échouaient en silence — l'utilisateur croyait que
 * « l'ajout ne passe pas ». On affiche désormais un message clair.
 */
export const handleActionError = ({
	error,
}: {
	error?: {
		serverError?: string;
		validationErrors?: Record<string, unknown>;
	};
}) => {
	if (error?.serverError) {
		toast.error(error.serverError);
		return;
	}
	const msg = firstValidationMessage(error?.validationErrors);
	toast.error(msg ?? 'Veuillez vérifier les champs du formulaire.');
};
