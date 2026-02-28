const NotificationsPage = () => {
	return (
		<div className="p-8">
			<div className="flex items-center justify-between mb-8">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
					<p className="text-gray-600 mt-2">
						Envoyez et gérez les notifications de votre plateforme
					</p>
				</div>
				<button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
					+ Créer une notification
				</button>
			</div>

			<div className="bg-white rounded-xl shadow-sm border border-gray-100">
				<div className="p-6">
					<div className="text-center py-12 text-gray-500">
						<svg
							className="w-16 h-16 mx-auto mb-4 text-gray-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
							/>
						</svg>
						<p className="text-lg font-medium mb-2">
							Gestion des notifications
						</p>
						<p className="text-sm">
							La liste des notifications sera affichée ici prochainement
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default NotificationsPage;
