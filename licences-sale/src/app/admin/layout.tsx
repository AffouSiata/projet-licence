import { requireAdmin } from '~/lib/session';
import { Sidebar } from './components/sidebar';

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
	const user = await requireAdmin();

	return (
		<div className="flex h-screen bg-gray-50">
			<Sidebar user={user} />
			<main className="flex-1 ml-64 overflow-y-auto">{children}</main>
		</div>
	);
};

export default AdminLayout;
