import Product from "../models/product.model.js";

export const getCartProducts = async (req, res) => {
	try {
		console.log("🛒 getCartProducts çağrıldı");
		const user = await req.user.populate('cartItems.product');
		
		console.log("👤 User cartItems:", user.cartItems);
		
		// Null değerleri filtrele ve geçerli ürünleri al
		const validCartItems = user.cartItems.filter(item => item && item.product);
		
		console.log("✅ Geçerli cartItems:", validCartItems);
		
		const cartItems = validCartItems.map(item => ({
			...item.product.toJSON(),
			quantity: item.quantity
		}));

		console.log("📤 Sepet gönderiliyor:", cartItems);
		res.json(cartItems);
	} catch (error) {
		console.log("❌ Error in getCartProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const addToCart = async (req, res) => {
	try {
		console.log("🛒 addToCart çağrıldı");
		const { productId } = req.body;
		const user = req.user;

		console.log("📦 Product ID:", productId);
		console.log("👤 User cartItems:", user.cartItems);

		// Ürünün var olup olmadığını kontrol et
		const product = await Product.findById(productId);
		if (!product) {
			console.log("❌ Ürün bulunamadı:", productId);
			return res.status(404).json({ message: "Ürün bulunamadı" });
		}

		console.log("✅ Ürün bulundu:", product.name);

		// Null değerleri temizle
		user.cartItems = user.cartItems.filter(item => item && item.product);
		console.log("🧹 Temizlenmiş cartItems:", user.cartItems);

		// Sepette zaten var mı kontrol et
		const existingItem = user.cartItems.find((item) => item.product.toString() === productId);
		
		if (existingItem) {
			// Miktarı artır
			existingItem.quantity += 1;
			console.log("➕ Miktar artırıldı:", existingItem.quantity);
		} else {
			// Yeni ürün ekle
			user.cartItems.push({
				product: productId,
				quantity: 1
			});
			console.log("🆕 Yeni ürün eklendi");
		}

		await user.save();
		console.log("💾 Kullanıcı kaydedildi");
		
		// Güncellenmiş sepeti döndür
		const updatedUser = await user.populate('cartItems.product');
		const cartItems = updatedUser.cartItems
			.filter(item => item && item.product) // Null değerleri filtrele
			.map(item => ({
				...item.product.toJSON(),
				quantity: item.quantity
			}));

		console.log("📤 Sepet gönderiliyor:", cartItems);
		res.json(cartItems);
	} catch (error) {
		console.log("❌ Error in addToCart controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const removeAllFromCart = async (req, res) => {
	try {
		const { productId } = req.body;
		const user = req.user;
		
		if (!productId) {
			// Tüm sepeti temizle
			user.cartItems = [];
		} else {
			// Belirli ürünü sepetten çıkar
			user.cartItems = user.cartItems.filter((item) => item.product.toString() !== productId);
		}
		
		await user.save();
		
		// Güncellenmiş sepeti döndür
		const updatedUser = await user.populate('cartItems.product');
		const cartItems = updatedUser.cartItems.map(item => ({
			...item.product.toJSON(),
			quantity: item.quantity
		}));

		res.json(cartItems);
	} catch (error) {
		console.log("Error in removeAllFromCart controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const updateQuantity = async (req, res) => {
	try {
		const { id: productId } = req.params;
		const { quantity } = req.body;
		const user = req.user;
		const existingItem = user.cartItems.find((item) => item.product.toString() === productId);

		if (existingItem) {
			if (quantity === 0) {
				// Miktar 0 ise ürünü sepetten çıkar
				user.cartItems = user.cartItems.filter((item) => item.product.toString() !== productId);
				await user.save();
				
				const updatedUser = await user.populate('cartItems.product');
				const cartItems = updatedUser.cartItems.map(item => ({
					...item.product.toJSON(),
					quantity: item.quantity
				}));
				
				return res.json(cartItems);
			}

			// Miktarı güncelle
			existingItem.quantity = quantity;
			await user.save();
			
			const updatedUser = await user.populate('cartItems.product');
			const cartItems = updatedUser.cartItems.map(item => ({
				...item.product.toJSON(),
				quantity: item.quantity
			}));
			
			res.json(cartItems);
		} else {
			res.status(404).json({ message: "Ürün sepette bulunamadı" });
		}
	} catch (error) {
		console.log("Error in updateQuantity controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};
