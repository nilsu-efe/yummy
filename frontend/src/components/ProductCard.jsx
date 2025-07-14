import toast from "react-hot-toast";
import { ShoppingCart, Heart } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
import { useFavoriteStore } from "../stores/useFavoriteStore";

const ProductCard = ({ product }) => {
	const { user } = useUserStore();
	const { addToCart } = useCartStore();
	const { favorites, addFavorite, removeFavorite } = useFavoriteStore();

	const isFavorited = favorites.some((p) => p._id === product._id);

	const handleAddToCart = () => {
		if (!user) {
			toast.error("Lütfen sepete ürün eklemek için giriş yapın", { id: "login" });
			return;
		} else {
			addToCart(product);
			toast.success("Ürün sepete eklendi");
		}
	};

	// Backend'e favori ekle/çıkar isteği atan fonksiyon
	const toggleFavoriteInDB = async () => {
		if (!user) {
			toast.error("Lütfen giriş yapın");
			return;
		}

		try {
			const res = await fetch("/api/auth/favorites/toggle", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${user.token}`, // token'ın doğru şekilde burada olması lazım
				},
				body: JSON.stringify({ productId: product._id }),
			});

			const data = await res.json();

			if (!res.ok) {
				throw new Error(data.message || "Favori işlemi başarısız");
			}

			// Local store'u backend'e göre güncelle
			if (data.favorites.includes(product._id)) {
				addFavorite(product);
				toast.success("Favorilere eklendi");
			} else {
				removeFavorite(product._id);
				toast.success("Favorilerden çıkarıldı");
			}
		} catch (err) {
			toast.error(err.message);
		}
	};

	return (
		<div className='flex w-full relative flex-col overflow-hidden rounded-lg border border-gray-700 shadow-lg'>
			<div className='relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl'>
				<img className='object-cover w-full' src={product.image} alt={product.name} />
				<div className='absolute inset-0 bg-black bg-opacity-20' />

				{/* Favori butonu */}
				<button
					className='absolute top-2 right-2 p-1 bg-white rounded-full text-red-500'
					onClick={toggleFavoriteInDB} // buraya fonksiyonu bağladık
				>
					<Heart
						size={20}
						fill={isFavorited ? "red" : "none"}
						stroke={isFavorited ? "red" : "currentColor"}
					/>
				</button>
			</div>

			<div className='mt-4 px-5 pb-5'>
				<h5 className='text-xl font-semibold tracking-tight text-white'>{product.name}</h5>
				<div className='mt-2 mb-5 flex items-center justify-between'>
					<p>
						<span className='text-3xl font-bold text-emerald-400'>{product.price}₺</span>
					</p>
				</div>
				<button
					className='flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-center text-sm font-medium
					 text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300'
					onClick={handleAddToCart}
				>
					<ShoppingCart size={22} className='mr-2' />
					Sepete Ekle
				</button>
			</div>
		</div>
	);
};

export default ProductCard;
