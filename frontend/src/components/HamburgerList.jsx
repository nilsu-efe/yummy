import React, { useEffect, useState } from "react";

const HamburgerList = () => {
	const [products, setProducts] = useState([]);

	useEffect(() => {
		const fetchHamburgers = async () => {
			const res = await fetch("/api/products/hamburger");
			const data = await res.json();
			setProducts(data.products);
		};

		fetchHamburgers();
	}, []);

	return (
		<div>
			<h2>Hamburger Ürünleri</h2>
			<div className="grid grid-cols-2 gap-4">
				{products.map((product) => (
					<div key={product._id} className="p-4 border rounded">
						<img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
						<h3 className="text-xl font-bold">{product.name}</h3>
						<p>{product.description}</p>
						<p className="text-green-600 font-semibold">{product.price} TL</p>
					</div>
				))}
			</div>
		</div>
	);
};

export default HamburgerList;
