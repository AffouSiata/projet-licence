export default function ProductsLoading() {
	return (
		<div className="min-h-screen bg-slate-50">
			<div className="max-w-7xl mx-auto px-4 py-8">
				<div className="animate-pulse">
					<div className="h-8 bg-slate-200 rounded w-48 mb-8" />
					<div className="grid lg:grid-cols-4 gap-6">
						<div className="h-96 bg-slate-200 rounded-xl" />
						<div className="lg:col-span-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
							{Array.from({ length: 6 }).map((_, i) => (
								<div key={i} className="h-80 bg-slate-200 rounded-xl" />
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
