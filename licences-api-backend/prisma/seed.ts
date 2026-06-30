import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Pool } from 'pg';

/**
 * Seed de la base : garantit l'existence d'un compte administrateur.
 *
 * Idempotent (upsert) : peut être relancé sans risque. Les identifiants sont
 * configurables via variables d'environnement, avec des valeurs par défaut.
 *
 * Lancement :
 *   bun run db:seed         (ou : npx prisma db seed)
 *
 * Personnalisation :
 *   SEED_ADMIN_EMAIL=... SEED_ADMIN_PASSWORD=... bun run db:seed
 */

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
	throw new Error(
		'DATABASE_URL manquant : définissez-le dans .env avant de lancer le seed.',
	);
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL ?? 'licence@admin.com';
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? 'LicenceAdmin33';
const ADMIN_NAME = process.env.SEED_ADMIN_NAME ?? 'Licence Admin';

async function main() {
	// Même algorithme/coût que le backend (auth.service)
	const password = await bcrypt.hash(ADMIN_PASSWORD, 10);

	const admin = await prisma.admin.upsert({
		where: { email: ADMIN_EMAIL },
		// Relancer le seed remet le compte dans un état admin connu
		update: {
			password,
			name: ADMIN_NAME,
			role: 'SUPER_ADMIN',
			isActive: true,
		},
		create: {
			email: ADMIN_EMAIL,
			password,
			name: ADMIN_NAME,
			role: 'SUPER_ADMIN',
			isActive: true,
		},
	});

	console.log(`✅ Admin prêt : ${admin.email} (${admin.role})`);
}

main()
	.catch((error) => {
		console.error('❌ Seed échoué :', error);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
		await pool.end();
	});
