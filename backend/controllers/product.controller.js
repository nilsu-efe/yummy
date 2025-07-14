import { redis } from "../lib/redis.js";
import cloudinary from "../lib/cloudinary.js";
import Product from "../models/product.model.js";
import Category from "../models/category.model.js";  // Category modelini ekledik

export const getAllProducts = async (req, res) => {
	try {
		const products = await Product.find({}).populate('category');
		res.json({ products });
	} catch (error) {
		console.log("❌ Error in getAllProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getFeaturedProducts = async (req, res) => {
	try {
		let featuredProducts = await redis.get("featured_products");
		if (featuredProducts) {
			return res.json(JSON.parse(featuredProducts));
		}

		featuredProducts = await Product.find({ isFeatured: true }).lean();

		if (!featuredProducts) {
			return res.status(404).json({ message: "No featured products found" });
		}

		await redis.set("featured_products", JSON.stringify(featuredProducts));

		res.json(featuredProducts);
	} catch (error) {
		console.log("Error in getFeaturedProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const createProduct = async (req, res) => {
	try {
		const { name, description, price, image, category } = req.body;

		// Cloudinary yapılandırması varsa kullan, yoksa direkt image URL'ini kullan
		let imageUrl = image || "";
		
		if (image && process.env.CLOUDINARY_API_KEY) {
			try {
				const cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: "products" });
				imageUrl = cloudinaryResponse?.secure_url || image;
			} catch (cloudinaryError) {
				console.log("Cloudinary hatası:", cloudinaryError.message);
				// Cloudinary hatası durumunda direkt image URL'ini kullan
				imageUrl = image;
			}
		}

		const product = await Product.create({
			name,
			description,
			price,
			image: imageUrl,
			category,
		});

		res.status(201).json(product);
	} catch (error) {
		console.log("Error in createProduct controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const updateProduct = async (req, res) => {
	try {
		const { name, description, price, image, category } = req.body;
		const productId = req.params.id;

		const product = await Product.findById(productId);
		if (!product) {
			return res.status(404).json({ message: "Product not found" });
		}

		let newImageUrl = product.image; // Mevcut resmi koru

		// Eğer yeni resim yüklendiyse
		if (image && image !== product.image) {
			// Cloudinary yapılandırması varsa kullan
			if (process.env.CLOUDINARY_API_KEY) {
				// Eski resmi Cloudinary'den sil
				if (product.image && product.image.includes('cloudinary')) {
					const publicId = product.image.split("/").pop().split(".")[0];
					try {
						await cloudinary.uploader.destroy(`products/${publicId}`);
						console.log("Eski resim Cloudinary'den silindi");
					} catch (error) {
						console.log("Eski resim silinirken hata:", error);
					}
				}

				// Yeni resmi yükle
				try {
					const cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: "products" });
					newImageUrl = cloudinaryResponse?.secure_url || image;
				} catch (cloudinaryError) {
					console.log("Cloudinary hatası:", cloudinaryError.message);
					newImageUrl = image;
				}
			} else {
				// Cloudinary yoksa direkt image URL'ini kullan
				newImageUrl = image;
			}
		}

		// Ürünü güncelle
		const updatedProduct = await Product.findByIdAndUpdate(
			productId,
			{
				name,
				description,
				price,
				image: newImageUrl,
				category,
			},
			{ new: true }
		);

		res.json(updatedProduct);
	} catch (error) {
		console.log("Error in updateProduct controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const deleteProduct = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);

		if (!product) {
			return res.status(404).json({ message: "Product not found" });
		}

		// Cloudinary yapılandırması varsa ve resim Cloudinary'de ise sil
		if (product.image && process.env.CLOUDINARY_API_KEY && product.image.includes('cloudinary')) {
			const publicId = product.image.split("/").pop().split(".")[0];
			try {
				await cloudinary.uploader.destroy(`products/${publicId}`);
				console.log("deleted image from cloudinary");
			} catch (error) {
				console.log("error deleting image from cloudinary", error);
			}
		}

		await Product.findByIdAndDelete(req.params.id);

		res.json({ message: "Product deleted successfully" });
	} catch (error) {
		console.log("Error in deleteProduct controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getRecommendedProducts = async (req, res) => {
	try {
		const products = await Product.aggregate([
			{ $sample: { size: 4 } },
			{
				$project: {
					_id: 1,
					name: 1,
					description: 1,
					image: 1,
					price: 1,
				},
			},
		]);

		res.json(products);
	} catch (error) {
		console.log("Error in getRecommendedProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getProductsByCategory = async (req, res) => {
	try {
		// Önce tanımla
		const categoryName = req.params.category;
		console.log("Gelen kategori adı:", categoryName);

		const category = await Category.findOne({ name: categoryName });
		console.log("Bulunan kategori:", category);

		if (!category) {
			return res.status(404).json({ message: "Category not found" });
		}

		const products = await Product.find({ category: category._id }).populate("category");
		console.log("Ürünler:", products);

		res.json({ products });
	} catch (error) {
		console.error("Error in getProductsByCategory:", error.message);
		res.status(500).json({ message: "Server Error" });
	}
};


export const toggleFeaturedProduct = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);
		if (product) {
			product.isFeatured = !product.isFeatured;
			const updatedProduct = await product.save();
			await updateFeaturedProductsCache();
			res.json(updatedProduct);
		} else {
			res.status(404).json({ message: "Product not found" });
		}
	} catch (error) {
		console.log("Error in toggleFeaturedProduct controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

async function updateFeaturedProductsCache() {
	try {
		const featuredProducts = await Product.find({ isFeatured: true }).lean();
		await redis.set("featured_products", JSON.stringify(featuredProducts));
	} catch (error) {
		console.log("error in update cache function");
	}
}
