import Image from 'next/image';

export const LogoCard = () => {
	return (
		<div className="bg-white rounded-2xl shadow-xl p-6 max-w-xs">
			<div className="flex items-center justify-center">
				<Image
					src="/logo.jpeg"
					alt="License Sale"
					width={280}
					height={160}
					className="object-contain"
					priority
				/>
			</div>
		</div>
	);
};
