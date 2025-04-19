import { useEffect, useState } from "react";
import { useProductStore } from "../stores/useProductStore";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import ProductCard from "../components/ProductCard";

const CategoryPage = () => {
	const { fetchProductsByCategory, products } = useProductStore();
	const { category } = useParams();

	// Local ürün listesi (başlangıçta backend'den gelenler + eklenen sahte ürünler)
	const [localProducts, setLocalProducts] = useState([]);

	useEffect(() => {
		fetchProductsByCategory(category);
		setLocalProducts([
			{
				_id: "sample123",
				name: "Örnek Pizza",
				price: 59.99,
				image: "/pizza.jpg",
			},
		]);
	}, [fetchProductsByCategory, category]);

	// Ürün Ekleme Fonksiyonu
	const addFakeProduct = () => {
		const newProduct = {
			_id: Date.now().toString(),
			name: `Yeni Ürün ${localProducts.length + 1}`,
			price: 49.99,
			image: "/salata.jpg",
		};
		setLocalProducts((prev) => [...prev, newProduct]);
	};

	return (
		<div className='min-h-screen'>
			<div className='relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
				<motion.h1
					className='text-center text-4xl sm:text-5xl font-bold text-emerald-400 mb-8'
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
				>
					{category.charAt(0).toUpperCase() + category.slice(1)}
				</motion.h1>

				{/* Ürün Ekle Butonu */}
				<div className='text-center mb-8'>
					<button
						onClick={addFakeProduct}
						className='bg-emerald-500 hover:bg-emerald-600 transition px-5 py-2 rounded text-white font-semibold'
					>
						+ Ürün Ekle
					</button>
				</div>

				<motion.div
					className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.2 }}
				>
					{localProducts.length === 0 && (
						<h2 className='text-3xl font-semibold text-gray-300 text-center col-span-full'>
							No products found
						</h2>
					)}

					{localProducts.map((product) => (
						<ProductCard key={product._id} product={product} />
					))}
				</motion.div>
			</div>
		</div>
	);
};

export default CategoryPage;
