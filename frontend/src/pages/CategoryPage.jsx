import { useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";

const CategoryPage = () => {
	const { category } = useParams();

	// Sahte test ürünü
	const sampleProduct = {
		_id: "demo-1",
		name: "Test Pizza",
		price: 59.99,
		image: "/pizza.jpg",
	};

	return (
		<div className="min-h-screen bg-gray-900 text-white">
			<div className="max-w-screen-xl mx-auto px-4 py-16">
				<h1 className="text-4xl font-bold text-center text-emerald-400 mb-10">
					{category?.charAt(0).toUpperCase() + category?.slice(1)}
				</h1>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
					<ProductCard product={sampleProduct} />
				</div>
			</div>
		</div>
	);
};

export default CategoryPage;
