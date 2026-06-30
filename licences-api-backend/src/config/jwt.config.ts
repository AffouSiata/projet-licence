import { registerAs } from '@nestjs/config';

/**
 * Récupère une variable d'environnement obligatoire.
 * Fait échouer le démarrage si elle est absente : aucun secret ne doit avoir
 * de valeur par défaut codée en dur (sinon un token signé avec un secret connu
 * serait forgeable).
 */
const requiredEnv = (name: string): string => {
	const value = process.env[name];
	if (!value) {
		throw new Error(
			`Variable d'environnement manquante: ${name}. Définissez-la dans .env — aucune valeur par défaut n'est autorisée pour un secret.`,
		);
	}
	return value;
};

export default registerAs('jwt', () => ({
	secret: requiredEnv('JWT_SECRET'),
	expiresIn: process.env.JWT_EXPIRES_IN || '15m',
	refreshSecret: requiredEnv('JWT_REFRESH_SECRET'),
	refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
}));
