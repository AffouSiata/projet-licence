import type { LucideIcon } from 'lucide-react';

interface ComingSoonProps {
	icon: LucideIcon;
	title: string;
	description: string;
}

export const ComingSoon = ({
	icon: Icon,
	title,
	description,
}: ComingSoonProps) => (
	<div className="flex flex-col items-center justify-center text-center py-20 px-6">
		<div className="w-16 h-16 rounded-2xl bg-[#1D73B3]/10 flex items-center justify-center mb-5">
			<Icon size={30} className="text-[#1D73B3]" />
		</div>
		<h3 className="text-lg font-bold text-gray-800 mb-1.5">{title}</h3>
		<p className="text-sm text-gray-500 max-w-sm">{description}</p>
		<span className="mt-5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold ring-1 ring-amber-200">
			Bientôt disponible
		</span>
	</div>
);
