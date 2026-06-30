import { redirect } from 'next/navigation';
import { requireSession } from '~/lib/session';

/**
 * Espace client : réservé aux comptes CLIENT.
 * Un administrateur (ADMIN / SUPER_ADMIN) est redirigé vers son back-office.
 */
const CompteLayout = async ({ children }: { children: React.ReactNode }) => {
	const user = await requireSession();

	if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
		redirect('/admin');
	}

	return <>{children}</>;
};

export default CompteLayout;
