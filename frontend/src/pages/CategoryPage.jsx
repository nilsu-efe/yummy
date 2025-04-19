import { useParams } from "react-router-dom";

const CategoryPage = () => {
	const { category } = useParams();

	return (
		<div className="min-h-screen flex items-center justify-center text-white bg-gray-900">
			<h1 className="text-4xl font-bold">
				{category?.charAt(0).toUpperCase() + category?.slice(1)} Sayfası Açıldı 🎉
			</h1>
		</div>
	);
};

export default CategoryPage;
