import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Upload, Loader, Image as ImageIcon, X } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";

const categories = ["hamburger", "pizza", "salata", "wrap", "makarna", "pide", "mantı"];

const EditProductForm = ({ product, onClose, onUpdate }) => {
	const [editProduct, setEditProduct] = useState({
		name: "",
		description: "",
		price: "",
		category: "",
		image: "",
	});

	const { updateProduct, loading } = useProductStore();

	useEffect(() => {
		if (product) {
			setEditProduct({
				name: product.name || "",
				description: product.description || "",
				price: product.price || "",
				category: product.category || "",
				image: product.image || "",
			});
		}
	}, [product]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await updateProduct(product._id, editProduct);
			onUpdate();
			onClose();
		} catch (error) {
			console.log("error updating product:", error);
		}
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();

			reader.onloadend = () => {
				setEditProduct({ ...editProduct, image: reader.result });
			};

			reader.readAsDataURL(file);
		}
	};

	if (!product) return null;

	return (
		<motion.div
			className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
		>
			<motion.div
				className="bg-gray-800 rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
				initial={{ scale: 0.9, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				exit={{ scale: 0.9, opacity: 0 }}
			>
				<div className="flex justify-between items-center mb-6">
					<h3 className="text-2xl font-semibold text-emerald-300">Ürün Düzenle</h3>
					<button
						onClick={onClose}
						className="text-gray-400 hover:text-white transition-colors duration-200"
					>
						<X className="h-6 w-6" />
					</button>
				</div>

				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<label htmlFor="edit-name" className="block text-sm font-medium text-gray-300 mb-2">
								Ürün Adı *
							</label>
							<input
								type="text"
								id="edit-name"
								value={editProduct.name}
								onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
								className="w-full bg-gray-700 border border-gray-600 rounded-lg shadow-sm py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200"
								required
							/>
						</div>

						<div>
							<label htmlFor="edit-price" className="block text-sm font-medium text-gray-300 mb-2">
								Fiyat (₺) *
							</label>
							<input
								type="number"
								id="edit-price"
								value={editProduct.price}
								onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })}
								step="0.01"
								min="0"
								className="w-full bg-gray-700 border border-gray-600 rounded-lg shadow-sm py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200"
								required
							/>
						</div>
					</div>

					<div>
						<label htmlFor="edit-category" className="block text-sm font-medium text-gray-300 mb-2">
							Kategori *
						</label>
						<select
							id="edit-category"
							value={editProduct.category}
							onChange={(e) => setEditProduct({ ...editProduct, category: e.target.value })}
							className="w-full bg-gray-700 border border-gray-600 rounded-lg shadow-sm py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200"
							required
						>
							<option value="">Kategori seçin</option>
							{categories.map((category) => (
								<option key={category} value={category}>
									{category.charAt(0).toUpperCase() + category.slice(1)}
								</option>
							))}
						</select>
					</div>

					<div>
						<label htmlFor="edit-description" className="block text-sm font-medium text-gray-300 mb-2">
							Açıklama *
						</label>
						<textarea
							id="edit-description"
							value={editProduct.description}
							onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
							rows="4"
							className="w-full bg-gray-700 border border-gray-600 rounded-lg shadow-sm py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 resize-none"
							required
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-300 mb-2">
							Ürün Görseli
						</label>
						<div className="space-y-4">
							<div className="flex items-center space-x-4">
								<input
									type="file"
									id="edit-image"
									className="sr-only"
									accept="image/*"
									onChange={handleImageChange}
								/>
								<label
									htmlFor="edit-image"
									className="cursor-pointer bg-gray-700 py-3 px-4 border border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-200 flex items-center"
								>
									<Upload className="h-5 w-5 mr-2" />
									Yeni Görsel Yükle
								</label>
							</div>

							{editProduct.image && (
								<div className="flex items-center space-x-4">
									<img
										src={editProduct.image}
										alt="Önizleme"
										className="w-32 h-32 object-cover rounded-lg border border-gray-600"
									/>
									<div>
										<p className="text-sm text-emerald-400 flex items-center">
											<ImageIcon className="h-4 w-4 mr-1" />
											Görsel yüklendi
										</p>
									</div>
								</div>
							)}
						</div>
					</div>

					<div className="flex justify-end space-x-3 pt-4">
						<button
							type="button"
							onClick={onClose}
							className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors duration-200"
						>
							İptal
						</button>
						<button
							type="submit"
							className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
							disabled={loading}
						>
							{loading ? (
								<>
									<Loader className="mr-2 h-5 w-5 animate-spin" />
									Güncelleniyor...
								</>
							) : (
								<>
									<Save className="mr-2 h-5 w-5" />
									Güncelle
								</>
							)}
						</button>
					</div>
				</form>
			</motion.div>
		</motion.div>
	);
};

export default EditProductForm; 