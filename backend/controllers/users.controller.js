import User from "../models/user.model.js";

export const getUser = async (req, res) => {
  try {
    const userId = req.user._id; // user objesinden ID alınıyor
    const user = await User.findById(userId).select("-password"); // şifreyi göndermiyoruz

    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }

    res.json(user);
  } catch (error) {
    console.error("getUser hatası:", error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, email } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }

    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();

    res.json({ message: "Kullanıcı bilgileri güncellendi", user });
  } catch (error) {
    console.error("updateUser hatası:", error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

// Favori ürünleri getir
export const getFavoriteProducts = async (req, res) => {
  try {
    console.log("🔍 getFavoriteProducts çağrıldı");
    const userId = req.user._id;
    console.log("👤 User ID:", userId);
    
    const user = await User.findById(userId).populate({
      path: 'favorites',
      select: 'name description price image category stock isFeatured'
    });
    
    if (!user) {
      console.log("❌ Kullanıcı bulunamadı");
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }
    
    console.log("✅ Favori ürünler:", user.favorites);
    res.json({ favorites: user.favorites || [] });
  } catch (error) {
    console.error("❌ getFavoriteProducts hatası:", error);
    res.status(500).json({ message: "Favori ürünler alınamadı" });
  }
};

// Favori ürün ekle
export const addFavoriteProduct = async (req, res) => {
  try {
    console.log("🔍 addFavoriteProduct çağrıldı");
    const userId = req.user._id;
    const { productId } = req.params; // URL parametresinden al
    
    console.log("👤 User ID:", userId);
    console.log("📦 Product ID:", productId);

    if (!productId) {
      console.log("❌ Product ID eksik");
      return res.status(400).json({ message: "Ürün ID'si gerekli" });
    }

    const user = await User.findById(userId);

    if (!user) {
      console.log("❌ Kullanıcı bulunamadı");
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }

    console.log("✅ Kullanıcı bulundu:", user.name);
    console.log("💖 Mevcut favoriler:", user.favorites);

    // Ürün zaten favorilerde mi kontrol et
    if (user.favorites && user.favorites.some(id => id.toString() === productId)) {
      console.log("⚠️ Ürün zaten favorilerde");
      return res.status(400).json({ message: "Ürün zaten favorilerde" });
    }

    // Favori ürünü ekle
    if (!user.favorites) {
      user.favorites = [];
    }
    user.favorites.push(productId);
    await user.save();

    console.log("✅ Favori eklendi. Yeni favoriler:", user.favorites);

    res.json({ message: "Ürün favorilere eklendi", favorites: user.favorites });
  } catch (error) {
    console.error("❌ addFavoriteProduct hatası:", error);
    res.status(500).json({ message: "Sunucu hatası", error: error.message });
  }
};

// Favori ürün çıkar
export const removeFavoriteProduct = async (req, res) => {
  try {
    console.log("🔍 removeFavoriteProduct çağrıldı");
    const userId = req.user._id;
    const { productId } = req.params; // URL parametresinden al

    console.log("👤 User ID:", userId);
    console.log("📦 Product ID:", productId);

    const user = await User.findById(userId);

    if (!user) {
      console.log("❌ Kullanıcı bulunamadı");
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }

    console.log("✅ Kullanıcı bulundu:", user.name);
    console.log("💖 Mevcut favoriler:", user.favorites);

    // Favori ürünü çıkar
    if (user.favorites) {
      const initialLength = user.favorites.length;
      user.favorites = user.favorites.filter(id => id.toString() !== productId);
      
      if (user.favorites.length === initialLength) {
        console.log("⚠️ Ürün favorilerde bulunamadı");
        return res.status(404).json({ message: "Ürün favorilerde bulunamadı" });
      }
      
      await user.save();
      console.log("✅ Favori çıkarıldı. Yeni favoriler:", user.favorites);
    }

    res.json({ message: "Ürün favorilerden çıkarıldı", favorites: user.favorites });
  } catch (error) {
    console.error("❌ removeFavoriteProduct hatası:", error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};
