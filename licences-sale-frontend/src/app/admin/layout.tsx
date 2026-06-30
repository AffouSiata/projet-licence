import { requireAdmin } from '~/lib/session';
import { Sidebar } from './components/sidebar';
import { Topbar } from './components/topbar';

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
	const user = await requireAdmin();

	return (
		<div className="min-h-screen bg-[#F6F8FB]">
			<Sidebar user={user} />
			<div className="ml-64 flex flex-col min-h-screen">
				<Topbar user={user} />
				<main className="flex-1">{children}</main>
			</div>
		</div>
	);
};

export default AdminLayout;
