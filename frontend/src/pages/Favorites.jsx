import { useFavoriteStore } from "../stores/useFavoriteStore";
import ProductCard from "../components/ProductCard";

const Favorites = () => {
	const { favorites } = useFavoriteStore();

	return (
		<div className='p-6'>
			<h2 className='text-2xl font-bold mb-4'>Favori Ürünlerim</h2>
			{favorites.length === 0 ? (
				<p className='text-gray-400'>Henüz favori ürün eklenmemiş.</p>
			) : (
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
					{favorites.map((product) => (
						<ProductCard key={product._id} product={product} />
					))}
				</div>
			)}
		</div>
	);
};

export default Favorites;
