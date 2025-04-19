import { useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";

const CategoryPage = () => {
	const { category } = useParams();

	// Kategoriye göre sahte ürün bilgisi
	const demoProducts = {
		pizza: {
			_id: "demo-pizza",
			name: "Lezzetli Pizza",
			price: 59.99,
			image: "/pizza.jpg",
		},
		makarna: {
			_id: "demo-makarna",
			name: "Kremalı Makarna",
			price: 44.99,
			image: "/makarna.jpg",
		},
		hamburger: {
			_id: "demo-burger",
			name: "Dev Hamburger",
			price: 49.99,
			image: "/hamburger.jpg",
		},
	};

	// Elde edilen kategoriye uygun ürün (bulunamazsa undefined)
	const product = demoProducts[category];

	return (
		<div className="min-h-screen bg-gray-900 text-white">
			<div className="max-w-screen-xl mx-auto px-4 py-16">
				<h1 className="text-4xl font-bold text-center text-emerald-400 mb-10">
					{category?.charAt(0).toUpperCase() + category?.slice(1)}
				</h1>

				{product ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						<ProductCard product={product} />
					</div>
				) : (
					<p className="text-center text-gray-400">Bu kategori için ürün bulunamadı.</p>
				)}
			</div>
		</div>
	);
};

export default CategoryPage;
