export default function HomeLoading() {
	return (
		<main className="min-h-screen bg-slate-50">
			<div className="h-20 bg-white border-b border-slate-200" />

			<div className="animate-pulse">
				<div className="h-[420px] bg-slate-200" />

				<div className="max-w-7xl mx-auto px-4 py-12">
					<div className="h-8 bg-slate-200 rounded w-64 mb-8" />
					<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
						{Array.from({ length: 8 }).map((_, i) => (
							<div key={i} className="h-40 bg-slate-200 rounded-xl" />
						))}
					</div>
				</div>

				<div className="max-w-7xl mx-auto px-4 py-12">
					<div className="h-8 bg-slate-200 rounded w-64 mb-8" />
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
						{Array.from({ length: 8 }).map((_, i) => (
							<div key={i} className="h-80 bg-slate-200 rounded-xl" />
						))}
					</div>
				</div>
			</div>
		</main>
	);
}
