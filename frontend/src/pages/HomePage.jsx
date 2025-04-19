import { useEffect, useState } from "react";
import CategoryItem from "../components/CategoryItem";
import { useProductStore } from "../stores/useProductStore";
import FeaturedProducts from "../components/FeaturedProducts";
import ProductCard from "../components/ProductCard";

const categories = [
	{ href: "/category/pizza", name: "pizza", imageUrl: "/pizza.jpg" },
	{ href: "/category/makarna", name: "makarna", imageUrl: "/makarna.jpg" },
	{ href: "/category/hamburger", name: "hamburger", imageUrl: "/hamburger.jpg" },
	{ href: "/category/mantı", name: "mantı", imageUrl: "/mantı.jpg" },
	{ href: "/category/pide", name: "pide", imageUrl: "/pide.jpg" },
	{ href: "/category/wrap", name: "wrap", imageUrl: "/wrap.jpg" },
	{ href: "/category/salata", name: "salata", imageUrl: "/salata.jpg" },
];

const HomePage = () => {
	const { fetchFeaturedProducts, products, isLoading } = useProductStore();
	const [favorites, setFavorites] = useState([]);

	useEffect(() => {
		fetchFeaturedProducts();

		const stored = localStorage.getItem("favorites");
		if (stored) {
			setFavorites(JSON.parse(stored));
		}
	}, [fetchFeaturedProducts]);

	return (
		<div className='relative min-h-screen text-white overflow-hidden'>
			<div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
				<h1 className='text-center text-5xl sm:text-6xl font-bold text-emerald-400 mb-4'>
					Lezzetin Tadını Çıkarın
				</h1>

				{/* Kategoriler */}
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
					{categories.map((category) => (
						<CategoryItem category={category} key={category.name} />
					))}
				</div>

				{/* Favorilerim */}
				{favorites.length > 0 && (
					<div className="mt-16">
						<h2 className="text-3xl font-semibold text-emerald-300 mb-6">❤️ Favorilerim</h2>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{favorites.map((product) => (
								<ProductCard key={product._id} product={product} />
							))}
						</div>
					</div>
				)}

				{/* Öne çıkan ürünler */}
				{!isLoading && products.length > 0 && (
					<FeaturedProducts featuredProducts={products} />
				)}
			</div>
		</div>
	);
};

export default HomePage;
