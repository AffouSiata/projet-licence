'use server';

import { AuthenticationError, api } from '~/lib/api';

interface OrderInput {
	customerName: string;
	customerEmail?: string;
	customerPhone: string;
}

interface OrderResponse {
	id: string;
	orderNumber: string;
	whatsappUrl: string;
	totalAmount: string | number;
}

interface ActionResult {
	success: boolean;
	order?: OrderResponse;
	error?: string;
	fieldErrors?: Record<string, string>;
}

interface ZodIssue {
	path: (string | number)[];
	message: string;
}

/**
 * Transforme les erreurs de validation Zod du backend
 * (`{ message: 'Validation failed', errors: ZodIssue[] }`) en une map
 * `{ champ: message }` exploitable par le formulaire. Le nom du champ est le
 * dernier segment de `path` (ex. ['customerPhone'] -> 'customerPhone').
 */
const mapFieldErrors = (
	errors: unknown,
): Record<string, string> | undefined => {
	if (!Array.isArray(errors)) return undefined;
	const fieldErrors: Record<string, string> = {};
	for (const issue of errors as ZodIssue[]) {
		const path = issue?.path;
		const field = Array.isArray(path) ? path[path.length - 1] : undefined;
		// On garde le premier message rencontré par champ.
		if (field != null && !(String(field) in fieldErrors)) {
			fieldErrors[String(field)] = issue.message;
		}
	}
	return Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined;
};

/**
 * Crée une commande via le backend. Côté serveur, on lit automatiquement le
 * cookie `auth_token` (httpOnly) et le cookie `sessionId` du panier dans
 * `~/lib/api.ts` — donc si le visiteur est connecté, la commande sera liée
 * à son compte (userId), sinon c'est un guest checkout anonyme.
 */
export const createOrderAction = async (
	input: OrderInput,
): Promise<ActionResult> => {
	try {
		const order = await api.post<OrderResponse>('/orders', {
			customerName: input.customerName,
			customerEmail: input.customerEmail || undefined,
			customerPhone: input.customerPhone,
		});
		return { success: true, order };
	} catch (error) {
		if (error instanceof AuthenticationError) {
			return { success: false, error: 'Session expirée, reconnectez-vous' };
		}
		// biome-ignore lint/suspicious/noExplicitAny: erreur axios non typée
		const err = error as any;
		const data = err.response?.data;
		return {
			success: false,
			error:
				data?.message ||
				err.message ||
				'Erreur lors de la création de la commande',
			fieldErrors: mapFieldErrors(data?.errors),
		};
	}
};
