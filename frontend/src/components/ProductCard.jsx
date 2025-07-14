import toast from "react-hot-toast";
import { ShoppingCart, Heart } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
import { useFavoriteStore } from "../stores/useFavoriteStore";

const ProductCard = ({ product }) => {
	const { user } = useUserStore();
	const { addToCart } = useCartStore();
	const { favorites, addFavorite, removeFavorite, isFavorite } = useFavoriteStore();

	const isFavorited = isFavorite(product._id);

	// Resim URL'sini kontrol et ve fallback ekle
	const imageUrl = product.image || "https://via.placeholder.com/300x200?text=Resim+Yok";

	const handleImageError = (e) => {
		e.target.src = "https://via.placeholder.com/300x200?text=Resim+Yok";
	};

	const handleAddToCart = () => {
		if (!user) {
			toast.error("Sepete eklemek için giriş yapmalısınız");
			return;
		}
		addToCart(product);
	};

	return (
		<div className="bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-md p-4 flex flex-col justify-between h-full hover:shadow-lg transition-shadow border border-gray-700/50">
			<div className="relative flex-1 flex items-center justify-center">
				<img
					src={imageUrl}
					alt={product.name}
					className="w-full h-40 object-cover rounded-md"
					onError={handleImageError}
				/>
				<button
					className={`absolute top-2 right-2 text-red-500 bg-white rounded-full p-1 shadow hover:scale-110 transition-transform ${isFavorited ? "" : "opacity-50"}`}
					onClick={() =>
						isFavorited ? removeFavorite(product._id) : addFavorite(product._id)
					}
				>
					<Heart fill={isFavorited ? "#ef4444" : "none"} />
				</button>
			</div>
			<div className="mt-4 flex flex-col flex-1">
				<h3 className="text-lg font-semibold mb-2 text-white">{product.name}</h3>
				<p className="text-gray-300 flex-1 text-sm">{product.description}</p>
				<div className="flex items-center justify-between mt-4">
					<span className="text-green-600 font-bold text-lg">₺{product.price}</span>
					<button
						className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center transition-colors"
						onClick={handleAddToCart}
					>
						<ShoppingCart className="mr-2" size={18} /> Sepete Ekle
					</button>
				</div>
			</div>
		</div>
	);
};

export default ProductCard;
