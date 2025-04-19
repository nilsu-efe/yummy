import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";

const CategoryPage = () => {
	const { category } = useParams();

	const defaultProducts = {
		pizza: [
			{
				_id: "demo-pizza",
				name: "Pizza",
				price: 59.99,
				image: "/pizza.jpg",
			},
		],
		makarna: [
			{
				_id: "demo-makarna",
				name: "Kremalı Makarna",
				price: 44.99,
				image: "/makarna.jpg",
			},
		],
		hamburger: [
			{
				_id: "demo-burger",
				name: "Dev Hamburger",
				price: 49.99,
				image: "/hamburger.jpg",
			},
		],
	};

	const [products, setProducts] = useState(
		(defaultProducts[category] || []).map((p) => ({ ...p, isFavorite: false }))
	);

	// Favori listesini localStorage'a kaydet
	const saveFavorites = (favorites) => {
		localStorage.setItem("favorites", JSON.stringify(favorites));
	};

	const handleDelete = (id) => {
		const updated = products.filter((p) => p._id !== id);
		setProducts(updated);
		saveFavorites(updated.filter((p) => p.isFavorite));
	};

	const handleAdd = () => {
		const newProduct = {
			_id: Date.now().toString(),
			name: `Yeni ${category}`,
			price: Math.floor(Math.random() * 100),
			image: `/${category}.jpg`,
			isFavorite: false,
		};
		const updated = [...products, newProduct];
		setProducts(updated);
		saveFavorites(updated.filter((p) => p.isFavorite));
	};

	const toggleFavorite = (id) => {
		const updated = products.map((p) =>
			p._id === id ? { ...p, isFavorite: !p.isFavorite } : p
		);
		setProducts(updated);

		const newFavorites = updated.filter((p) => p.isFavorite);
		saveFavorites(newFavorites);
	};

	return (
		<div className="min-h-screen bg-gray-900 text-white">
			<div className="max-w-screen-xl mx-auto px-4 py-16">
				<h1 className="text-4xl font-bold text-center text-emerald-400 mb-8">
					{category?.charAt(0).toUpperCase() + category?.slice(1)}
				</h1>

				<div className="text-center mb-10">
					<button
						onClick={handleAdd}
						className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded font-semibold transition"
					>
						+ Ürün Ekle
					</button>
				</div>

				{products.length > 0 ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{products.map((product) => (
							<div key={product._id} className="relative">
								<ProductCard product={product} />
								<button
									onClick={() => handleDelete(product._id)}
									className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-sm rounded"
								>
									Sil
								</button>
								<button
									onClick={() => toggleFavorite(product._id)}
									className="absolute bottom-2 right-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 text-sm rounded"
								>
									{product.isFavorite ? "❤️ Favori" : "🤍 Favorilere Ekle"}
								</button>
							</div>
						))}
					</div>
				) : (
					<p className="text-center text-gray-400">Bu kategori için ürün bulunamadı.</p>
				)}
			</div>
		</div>
	);
};

export default CategoryPage;
