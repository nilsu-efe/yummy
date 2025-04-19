import { useEffect } from "react";
import CategoryItem from "../components/CategoryItem";
import { useProductStore } from "../stores/useProductStore";
import FeaturedProducts from "../components/FeaturedProducts";

const categories = [
	{ href: "/pizza", name: "pizza", imageUrl: "/pizza.jpg" },
	{ href: "/makarna", name: "makarna", imageUrl: "/makarna.jpg" },
	{ href: "/hamburger", name: "hamburger", imageUrl: "/hamburger.jpg" },
	{ href: "/mantı", name: "mantı", imageUrl: "/mantı.jpg" },
	{ href: "/pide", name: "pide", imageUrl: "/pide.jpg" },
	{ href: "/wrap", name: "wrap", imageUrl: "/wrap.jpg" },
	{ href: "/salata", name: "salata", imageUrl: "/salata.jpg" },
];


const HomePage = () => {
	const { fetchFeaturedProducts, products, isLoading } = useProductStore();

	useEffect(() => {
		fetchFeaturedProducts();
	}, [fetchFeaturedProducts]);

	return (
		<div className='relative min-h-screen text-white overflow-hidden'>
			<div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
				<h1 className='text-center text-5xl sm:text-6xl font-bold text-emerald-400 mb-4'>
					Lezzetin Tadını Çıkarın
				</h1>

				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
					{categories.map((category) => (
						<CategoryItem category={category} key={category.name} />
					))}
				</div>

				{!isLoading && products.length > 0 && <FeaturedProducts featuredProducts={products} />}
			</div>
		</div>
	);
};
export default HomePage;
