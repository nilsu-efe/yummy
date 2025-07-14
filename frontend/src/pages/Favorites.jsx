import { useEffect } from "react";
import { useFavoriteStore } from "../stores/useFavoriteStore";
import ProductCard from "../components/ProductCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { Heart } from "lucide-react";

const Favorites = () => {
	const { favorites, loading, fetchFavorites } = useFavoriteStore();

	useEffect(() => {
		console.log("🔍 Favorites sayfası yüklendi, favoriler getiriliyor...");
		fetchFavorites();
	}, [fetchFavorites]);

	if (loading) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<LoadingSpinner />
			</div>
		);
	}

	return (
		<div className='p-6 max-w-7xl mx-auto'>
			<div className="mb-6">
				<h2 className='text-3xl font-bold text-gray-800 mb-2'>Favori Ürünlerim</h2>
				<p className='text-gray-600'>Beğendiğiniz ürünleri burada görebilirsiniz</p>
			</div>
			
			{favorites.length === 0 ? (
				<div className="text-center py-16">
					<div className="mb-4">
						<Heart className="mx-auto text-gray-300" size={64} />
					</div>
					<h3 className="text-xl font-semibold text-gray-600 mb-2">Henüz favori ürününüz yok</h3>
					<p className='text-gray-500 mb-6'>Beğendiğiniz ürünleri favorilere ekleyerek burada görebilirsiniz.</p>
					<a 
						href="/" 
						className="inline-block bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
					>
						Ürünleri Keşfet
					</a>
				</div>
			) : (
				<div>
					<div className="mb-4">
						<p className="text-gray-600">
							<span className="font-semibold">{favorites.length}</span> favori ürününüz var
						</p>
					</div>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
						{favorites.map((product) => (
							<ProductCard key={product._id} product={product} />
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default Favorites;
