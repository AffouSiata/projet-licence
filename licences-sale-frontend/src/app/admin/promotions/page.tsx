const PromotionsPage = () => {
	return (
		<div className="p-8">
			<div className="flex items-center justify-between mb-8">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Promotions</h1>
					<p className="text-gray-600 mt-2">
						Créez et gérez vos codes promo et réductions
					</p>
				</div>
				<button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
					+ Créer une promotion
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
								d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
							/>
						</svg>
						<p className="text-lg font-medium mb-2">Gestion des promotions</p>
						<p className="text-sm">
							La liste des promotions sera affichée ici prochainement
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PromotionsPage;
