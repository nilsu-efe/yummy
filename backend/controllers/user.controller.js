import User from "../models/user.model.js";
import Product from "../models/product.model.js";

// Favori ürünleri getir
export const getFavorites = async (req, res) => {
	try {
		const user = await User.findById(req.user.userId).populate('favorites');
		res.json({ favorites: user.favorites });
	} catch (error) {
		console.log("❌ Error in getFavorites controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// Favori ürün ekle
export const addToFavorites = async (req, res) => {
	try {
		const { productId } = req.body;
		
		if (!productId) {
			return res.status(400).json({ message: "Product ID is required" });
		}

		// Ürünün var olup olmadığını kontrol et
		const product = await Product.findById(productId);
		if (!product) {
			return res.status(404).json({ message: "Product not found" });
		}

		const user = await User.findById(req.user.userId);
		
		// Ürün zaten favorilerde mi kontrol et
		if (user.favorites.includes(productId)) {
			return res.status(400).json({ message: "Product already in favorites" });
		}

		// Favorilere ekle
		user.favorites.push(productId);
		await user.save();

		// Güncellenmiş favori listesini döndür
		const updatedUser = await User.findById(req.user.userId).populate('favorites');
		res.json({ favorites: updatedUser.favorites });
	} catch (error) {
		console.log("❌ Error in addToFavorites controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// Favori ürün çıkar
export const removeFromFavorites = async (req, res) => {
	try {
		const { productId } = req.params;
		
		const user = await User.findById(req.user.userId);
		
		// Ürün favorilerde mi kontrol et
		if (!user.favorites.includes(productId)) {
			return res.status(400).json({ message: "Product not in favorites" });
		}

		// Favorilerden çıkar
		user.favorites = user.favorites.filter(id => id.toString() !== productId);
		await user.save();

		// Güncellenmiş favori listesini döndür
		const updatedUser = await User.findById(req.user.userId).populate('favorites');
		res.json({ favorites: updatedUser.favorites });
	} catch (error) {
		console.log("❌ Error in removeFromFavorites controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
}; 