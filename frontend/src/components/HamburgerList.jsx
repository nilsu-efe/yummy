import { useEffect, useState } from "react";

const Hamburger = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchHamburgers = async () => {
      try {
        const res = await fetch("/api/products/hamburger");
        const data = await res.json();
        setProducts(data.products);
      } catch (err) {
        console.error("Ürünler alınamadı:", err);
      }
    };

    fetchHamburgers();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Hamburger Çeşitleri</h2>
      <div className="grid grid-cols-2 gap-4">
        {products.map((p) => (
          <div key={p._id} className="border p-4 rounded bg-white text-black">
            <img src={p.image} alt={p.name} className="w-full h-40 object-cover mb-2" />
            <h3 className="text-lg font-semibold">{p.name}</h3>
            <p>{p.description}</p>
            <p className="text-green-600 font-bold mt-2">{p.price}₺</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hamburger;
