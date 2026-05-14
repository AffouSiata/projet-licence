export default function ProductDetailLoading() {
	return (
		<div className="min-h-screen bg-slate-50">
			<div className="max-w-7xl mx-auto px-4 py-8">
				<div className="animate-pulse">
					<div className="h-4 bg-slate-200 rounded w-64 mb-6" />
					<div className="grid lg:grid-cols-2 gap-10">
						<div className="aspect-square bg-slate-200 rounded-2xl" />
						<div className="space-y-4">
							<div className="h-10 bg-slate-200 rounded w-3/4" />
							<div className="h-6 bg-slate-200 rounded w-1/3" />
							<div className="h-24 bg-slate-200 rounded" />
							<div className="h-12 bg-slate-200 rounded w-1/2" />
							<div className="h-14 bg-slate-200 rounded" />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
