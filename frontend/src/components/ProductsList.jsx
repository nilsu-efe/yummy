import { motion } from "framer-motion";
import { Trash, Star, Edit, Eye } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";
import { useState, useEffect } from "react";
import EditProductForm from "./EditProductForm";

const ProductsList = () => {
	const { deleteProduct, toggleFeaturedProduct, products, fetchAllProducts, loading } = useProductStore();
	const [selectedProduct, setSelectedProduct] = useState(null);
	const [showEditModal, setShowEditModal] = useState(false);

	useEffect(() => {
		fetchAllProducts();
	}, [fetchAllProducts]);

	const handleEdit = (product) => {
		setSelectedProduct(product);
		setShowEditModal(true);
	};

	const handleDelete = async (productId) => {
		if (window.confirm("Bu ürünü silmek istediğinizden emin misiniz?")) {
			await deleteProduct(productId);
		}
	};

	const handleUpdate = () => {
		fetchAllProducts();
	};

	if (loading) {
		return (
			<div className="text-center py-12">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto"></div>
				<p className="text-gray-400 mt-4">Ürünler yükleniyor...</p>
			</div>
		);
	}

	return (
		<>
			<motion.div
				className='bg-gray-800 shadow-lg rounded-lg overflow-hidden max-w-6xl mx-auto'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8 }}
			>
				<div className="p-6 border-b border-gray-700">
					<h2 className="text-2xl font-semibold text-emerald-300 mb-2">Ürün Yönetimi</h2>
					<p className="text-gray-400">Tüm ürünleri görüntüleyin, düzenleyin ve yönetin</p>
				</div>

				<div className="overflow-x-auto">
					<table className='min-w-full divide-y divide-gray-700'>
						<thead className='bg-gray-700'>
							<tr>
								<th
									scope='col'
									className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
								>
									Ürün
								</th>
								<th
									scope='col'
									className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
								>
									Fiyat
								</th>
								<th
									scope='col'
									className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
								>
									Kategori
								</th>
								<th
									scope='col'
									className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
								>
									Öne Çıkan
								</th>
								<th
									scope='col'
									className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
								>
									İşlemler
								</th>
							</tr>
						</thead>

						<tbody className='bg-gray-800 divide-y divide-gray-700'>
							{products && products.length > 0 ? products.map((product) => (
								<tr key={product._id} className='hover:bg-gray-700 transition-colors duration-200'>
									<td className='px-6 py-4 whitespace-nowrap'>
										<div className='flex items-center'>
											<div className='flex-shrink-0 h-12 w-12'>
												<img
													className='h-12 w-12 rounded-lg object-cover'
													src={product.image}
													alt={product.name}
												/>
											</div>
											<div className='ml-4'>
												<div className='text-sm font-medium text-white'>{product.name}</div>
												<div className='text-sm text-gray-400 truncate max-w-xs'>{product.description}</div>
											</div>
										</div>
									</td>
									<td className='px-6 py-4 whitespace-nowrap'>
										<div className='text-sm text-emerald-400 font-semibold'>
											₺{product.price ? product.price.toFixed(2) : '0.00'}
										</div>
									</td>
									<td className='px-6 py-4 whitespace-nowrap'>
										<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-300'>
											{product.category?.name || product.category}
										</span>
									</td>
									<td className='px-6 py-4 whitespace-nowrap'>
										<button
											onClick={() => toggleFeaturedProduct(product._id)}
											className={`p-2 rounded-full transition-colors duration-200 ${
												product.isFeatured 
													? "bg-yellow-400 text-gray-900 hover:bg-yellow-500" 
													: "bg-gray-600 text-gray-300 hover:bg-gray-500"
											}`}
											title={product.isFeatured ? "Öne çıkan ürünü kaldır" : "Öne çıkan ürün yap"}
										>
											<Star className='h-4 w-4' />
										</button>
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
										<div className="flex space-x-2">
											<button
												onClick={() => handleEdit(product)}
												className='text-blue-400 hover:text-blue-300 p-1 rounded transition-colors duration-200'
												title="Düzenle"
											>
												<Edit className='h-4 w-4' />
											</button>
											<button
												onClick={() => handleDelete(product._id)}
												className='text-red-400 hover:text-red-300 p-1 rounded transition-colors duration-200'
												title="Sil"
											>
												<Trash className='h-4 w-4' />
											</button>
										</div>
									</td>
								</tr>
							)) : null}
						</tbody>
					</table>
				</div>

				{(!products || products.length === 0) && (
					<div className="text-center py-12">
						<Eye className="h-12 w-12 text-gray-500 mx-auto mb-4" />
						<h3 className="text-lg font-medium text-gray-400 mb-2">Henüz ürün yok</h3>
						<p className="text-gray-500">İlk ürününüzü oluşturmak için "Ürün Oluştur" sekmesine gidin.</p>
					</div>
				)}
			</motion.div>

			{/* Edit Modal */}
			{showEditModal && (
				<EditProductForm
					product={selectedProduct}
					onClose={() => {
						setShowEditModal(false);
						setSelectedProduct(null);
					}}
					onUpdate={handleUpdate}
				/>
			)}
		</>
	);
};
export default ProductsList;
