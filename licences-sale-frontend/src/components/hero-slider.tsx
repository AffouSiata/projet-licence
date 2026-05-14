'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

const slides = [
	{
		id: 1,
		subtitle: "SYSTÈME D'EXPLOITATION",
		title: 'Windows 11',
		description:
			'Passez à la nouvelle génération avec Windows 11. Performance, sécurité et design moderne réunis.',
		cta: 'Découvrir',
		link: '/products?q=windows',
		bgImage:
			'https://images.unsplash.com/photo-1633419461186-7d40a38105ec?auto=format&fit=crop&w=2080&q=80',
	},
	{
		id: 2,
		subtitle: 'SUITE BUREAUTIQUE',
		title: 'Microsoft Office',
		description:
			"Word, Excel, PowerPoint et plus encore. Tout ce dont vous avez besoin pour être productif.",
		cta: 'Explorer',
		link: '/products?q=office',
		bgImage:
			'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=2080&q=80',
	},
	{
		id: 3,
		subtitle: 'PROTECTION & SÉCURITÉ',
		title: 'Antivirus Premium',
		description:
			'Protégez vos appareils et vos données avec les meilleures solutions antivirus du marché.',
		cta: 'Protéger',
		link: '/products?q=antivirus',
		bgImage:
			'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=2080&q=80',
	},
	{
		id: 4,
		subtitle: 'DESIGN & CRÉATION',
		title: 'Adobe & Autodesk',
		description:
			'Libérez votre créativité avec les outils professionnels de design et de conception.',
		cta: 'Créer',
		link: '/products?q=adobe',
		bgImage:
			'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=2080&q=80',
	},
];

export const HeroSlider = () => {
	const [currentSlide, setCurrentSlide] = useState(0);
	const [isAnimating, setIsAnimating] = useState(false);

	useEffect(() => {
		const timer = setInterval(() => {
			handleSlideChange((currentSlide + 1) % slides.length);
		}, 6000);
		return () => clearInterval(timer);
	}, [currentSlide]);

	const handleSlideChange = (newIndex: number) => {
		if (isAnimating) return;
		setIsAnimating(true);
		setCurrentSlide(newIndex);
		setTimeout(() => setIsAnimating(false), 500);
	};

	const nextSlide = () =>
		handleSlideChange((currentSlide + 1) % slides.length);
	const prevSlide = () =>
		handleSlideChange((currentSlide - 1 + slides.length) % slides.length);

	const slide = slides[currentSlide];

	return (
		<section className="relative overflow-hidden h-[550px] lg:h-[600px]">
			{/* Background Image */}
			<div
				className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700"
				style={{ backgroundImage: `url('${slide.bgImage}')` }}
			/>

			{/* Overlay */}
			<div className="absolute inset-0 bg-[#2E86AB]/70" />

			{/* Content - Centered */}
			<div className="relative z-10 h-full flex items-center justify-center">
				<div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
					{/* Subtitle */}
					<div
						className={`transition-all duration-500 ${isAnimating ? 'opacity-0 -translate-y-4' : 'opacity-100 translate-y-0'}`}
					>
						<span className="inline-block px-4 py-1.5 bg-[#E63946] text-white text-xs font-bold tracking-widest rounded mb-6">
							{slide.subtitle}
						</span>
					</div>

					{/* Title */}
					<h1
						className={`text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-6 leading-[1.1] transition-all duration-500 delay-100 ${isAnimating ? 'opacity-0 -translate-y-4' : 'opacity-100 translate-y-0'}`}
					>
						{slide.title}
					</h1>

					{/* Description */}
					<p
						className={`text-lg lg:text-xl text-white/80 mb-10 leading-relaxed max-w-2xl mx-auto transition-all duration-500 delay-200 ${isAnimating ? 'opacity-0 -translate-y-4' : 'opacity-100 translate-y-0'}`}
					>
						{slide.description}
					</p>

					{/* CTA Buttons */}
					<div
						className={`flex flex-wrap gap-4 justify-center transition-all duration-500 delay-300 ${isAnimating ? 'opacity-0 -translate-y-4' : 'opacity-100 translate-y-0'}`}
					>
						<Link
							href={slide.link}
							className="group inline-flex items-center gap-3 px-8 py-4 bg-[#E63946] text-white font-bold rounded-xl hover:bg-[#C42D38] transition-all duration-300 hover:scale-105 shadow-lg shadow-[#E63946]/30"
						>
							{slide.cta}
							<ArrowRight
								size={20}
								className="group-hover:translate-x-1 transition-transform"
							/>
						</Link>
						<Link
							href="/products"
							className="inline-flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-xl border border-white/30 hover:bg-white/20 transition-all duration-300"
						>
							Voir la boutique
						</Link>
					</div>
				</div>
			</div>

			{/* Navigation Arrows */}
			<button
				type="button"
				onClick={prevSlide}
				className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 z-20 border border-white/20"
				aria-label="Précédent"
			>
				<ChevronLeft size={24} className="text-white" />
			</button>
			<button
				type="button"
				onClick={nextSlide}
				className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 z-20 border border-white/20"
				aria-label="Suivant"
			>
				<ChevronRight size={24} className="text-white" />
			</button>

			{/* Slide Indicators - Centered */}
			<div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
				{slides.map((_, index) => (
					<button
						type="button"
						key={`slide-indicator-${slides[index].id}`}
						onClick={() => handleSlideChange(index)}
						className={`h-1.5 rounded-full transition-all duration-300 ${
							index === currentSlide
								? 'w-10 bg-[#E63946]'
								: 'w-6 bg-white/40 hover:bg-white/60'
						}`}
						aria-label={`Slide ${index + 1}`}
					/>
				))}
			</div>
		</section>
	);
};
