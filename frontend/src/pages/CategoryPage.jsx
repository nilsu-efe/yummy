import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";

const CategoryPage = () => {
	const { category } = useParams();

	const defaultProducts = {
		pizza: [
			{ _id: "pizza1", name: "Pizza", price: 59.99, image: "/pizza.jpg" },
		],
		makarna: [
			{ _id: "makarna1", name: "Kremalı Makarna", price: 44.99, image: "/makarna.jpg" },
		],
		hamburger: [
			{ _id: "burger1", name: "Dev Hamburger", price: 49.99, image: "/hamburger.jpg" },
		],
		mantı: [
			{ _id: "manti1", name: "Kayseri Mantısı", price: 39.99, image: "/mantı.jpg" },
		],
		pide: [
			{ _id: "pide1", name: "Kıymalı Pide", price: 42.99, image: "/pide.jpg" },
		],
		salata: [
			{ _id: "salata1", name: "Mevsim Salata", price: 24.99, image: "/salata.jpg" },
		],
		wrap: [
			{ _id: "wrap1", name: "Tavuklu Wrap", price: 34.99, image: "/wrap.jpg" },
		],
	};

	const [products, setProducts] = useState([]);

	// ✅ useEffect ile ürünleri ve favorileri yüklüyoruz
	useEffect(() => {
		const items = defaultProducts[category] || [];
		const stored = JSON.parse(localStorage.getItem("favorites") || "[]");

		const updated = items.map((p) => ({
			...p,
			isFavorite: stored.some((fav) => fav._id === p._id),
		}));

		setProducts(updated);
	}, [category]);

	const handleAdd = () => {
		const newProduct = {
			_id: Date.now().toString(),
			name: `Yeni ${category}`,
			price: Math.floor(Math.random() * 100),
			image: `/${category}.jpg`,
			isFavorite: false,
		};
		setProducts((prev) => [...prev, newProduct]);
	};

	const handleDelete = (id) => {
		const updated = products.filter((p) => p._id !== id);
		setProducts(updated);

		const stored = JSON.parse(localStorage.getItem("favorites") || "[]");
		const newFavorites = stored.filter((item) => item._id !== id);
		localStorage.setItem("favorites", JSON.stringify(newFavorites));
	};

	const toggleFavorite = (id) => {
		const updated = products.map((p) =>
			p._id === id ? { ...p, isFavorite: !p.isFavorite } : p
		);
		setProducts(updated);

		const toggled = updated.find((p) => p._id === id);
		const stored = JSON.parse(localStorage.getItem("favorites") || "[]");

		let newFavorites;
		if (toggled.isFavorite) {
			const alreadyExists = stored.some((item) => item._id === toggled._id);
			newFavorites = alreadyExists ? stored : [...stored, toggled];
		} else {
			newFavorites = stored.filter((item) => item._id !== toggled._id);
		}

		localStorage.setItem("favorites", JSON.stringify(newFavorites));
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
