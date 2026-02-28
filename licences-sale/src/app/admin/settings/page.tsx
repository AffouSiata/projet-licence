const SettingsPage = () => {
	return (
		<div className="p-8">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
				<p className="text-gray-600 mt-2">
					Configurez votre profil et les paramètres de la plateforme
				</p>
			</div>

			<div className="grid gap-6">
				{/* Profil administrateur */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
					<h2 className="text-xl font-semibold text-gray-900 mb-4">
						Profil administrateur
					</h2>
					<div className="text-center py-8 text-gray-500">
						<p>Configuration du profil à venir</p>
					</div>
				</div>

				{/* Paramètres généraux */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
					<h2 className="text-xl font-semibold text-gray-900 mb-4">
						Paramètres généraux
					</h2>
					<div className="text-center py-8 text-gray-500">
						<p>Configuration générale à venir</p>
					</div>
				</div>

				{/* Sécurité */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
					<h2 className="text-xl font-semibold text-gray-900 mb-4">
						Sécurité et accès
					</h2>
					<div className="text-center py-8 text-gray-500">
						<p>Paramètres de sécurité à venir</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SettingsPage;
