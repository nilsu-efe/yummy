import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Upload, Loader, Image as ImageIcon } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";
import axios from "../lib/axios";

const CreateProductForm = () => {
	const [newProduct, setNewProduct] = useState({
		name: "",
		description: "",
		price: "",
		category: "",
		image: "",
	});
	const [categories, setCategories] = useState([]);
	const [categorySearch, setCategorySearch] = useState("");
	const { createProduct, loading } = useProductStore();

	useEffect(() => {
		// Kategori listesini API'den çek
		axios.get("/products/categories").then(res => {
			setCategories(res.data);
		});
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await createProduct(newProduct);
			setNewProduct({ name: "", description: "", price: "", category: "", image: "" });
		} catch {
			console.log("error creating a product");
		}
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setNewProduct({ ...newProduct, image: reader.result });
			};
			reader.readAsDataURL(file); // base64
		}
	};

	// Aranabilir kategori listesi
	const filteredCategories = categories.filter(cat =>
		cat && cat.name && cat.name.toLowerCase().includes(categorySearch.toLowerCase())
	);

	return (
		<motion.div
			className='bg-gray-800 shadow-lg rounded-lg p-8 mb-8 max-w-2xl mx-auto'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8 }}
		>
			<div className="text-center mb-8">
				<h2 className='text-3xl font-bold text-emerald-300 mb-2'>Yeni Ürün Oluştur</h2>
				<p className="text-gray-400">Menünüze yeni ürünler ekleyin</p>
			</div>
			<form onSubmit={handleSubmit} className='space-y-6'>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<label htmlFor='name' className='block text-sm font-medium text-gray-300 mb-2'>Ürün Adı *</label>
						<input
							type='text'
							id='name'
							name='name'
							value={newProduct.name}
							onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
							placeholder="Örn: Margherita Pizza"
							className='w-full bg-gray-700 border border-gray-600 rounded-lg shadow-sm py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200'
							required
						/>
					</div>
					<div>
						<label htmlFor='price' className='block text-sm font-medium text-gray-300 mb-2'>Fiyat (₺) *</label>
						<input
							type='number'
							id='price'
							name='price'
							value={newProduct.price}
							onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
							step='0.01'
							min="0"
							placeholder="0.00"
							className='w-full bg-gray-700 border border-gray-600 rounded-lg shadow-sm py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200'
							required
						/>
					</div>
				</div>
				<div>
					<label htmlFor='category' className='block text-sm font-medium text-gray-300 mb-2'>Kategori *</label>
					<input
						type="text"
						placeholder="Kategori ara..."
						value={categorySearch}
						onChange={e => setCategorySearch(e.target.value)}
						className="w-full mb-2 bg-gray-700 border border-gray-600 rounded-lg shadow-sm py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
					/>
					<select
						id='category'
						name='category'
						value={newProduct.category}
						onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
						className='w-full bg-gray-700 border border-gray-600 rounded-lg shadow-sm py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200'
						required
					>
						<option value=''>Kategori seçin</option>
						{filteredCategories.map((cat) => (
							<option key={cat._id} value={cat._id}>
								{cat.name ? cat.name.charAt(0).toUpperCase() + cat.name.slice(1) : 'İsimsiz Kategori'}
							</option>
						))}
					</select>
				</div>
				<div>
					<label htmlFor='description' className='block text-sm font-medium text-gray-300 mb-2'>Açıklama *</label>
					<textarea
						id='description'
						name='description'
						value={newProduct.description}
						onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
						rows='4'
						placeholder="Ürünün detaylı açıklamasını yazın..."
						className='w-full bg-gray-700 border border-gray-600 rounded-lg shadow-sm py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 resize-none'
						required
					/>
				</div>
				<div>
					<label className='block text-sm font-medium text-gray-300 mb-2'>Ürün Görseli *</label>
					<div className="space-y-4">
						<div className='flex items-center space-x-4'>
							<input 
								type='file' 
								id='image' 
								className='sr-only' 
								accept='image/*' 
								onChange={handleImageChange} 
							/>
							<label
								htmlFor='image'
								className='cursor-pointer bg-gray-700 py-3 px-4 border border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-200 flex items-center'
							>
								<Upload className='h-5 w-5 mr-2' />
								Görsel Yükle
							</label>
							{newProduct.image && (
								<span className='text-sm text-emerald-400 flex items-center'>
									<ImageIcon className='h-4 w-4 mr-1' />
									Görsel yüklendi
								</span>
							)}
						</div>
						{newProduct.image && (
							<div className="mt-4">
								<img 
									src={newProduct.image} 
									alt="Önizleme" 
									className="w-32 h-32 object-cover rounded-lg border border-gray-600"
								/>
							</div>
						)}
					</div>
				</div>
				<div className="pt-4">
					<button
						type='submit'
						className='w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200'
						disabled={loading}
					>
						{loading ? (
							<>
								<Loader className='mr-2 h-5 w-5 animate-spin' aria-hidden='true' />
								Oluşturuluyor...
							</>
						) : (
							<>
								<PlusCircle className='mr-2 h-5 w-5' />
								Ürün Oluştur
							</>
						)}
					</button>
				</div>
			</form>
		</motion.div>
	);
};
export default CreateProductForm;
