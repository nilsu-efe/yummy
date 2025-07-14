import express from "express";
import {
	login,
	logout,
	signup,
	refreshToken,
	getProfile,
	updateUser, // updateUser fonksiyonunu import et
} from "../controllers/auth.controller.js"; 
import { protectRoute } from "../middleware/auth.middleware.js";
import User from "../models/user.model.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);
router.get("/profile", protectRoute, getProfile);

// Profil güncelleme endpoint'i (PUT /profile)
router.put("/profile", protectRoute, updateUser);

// ✅ FAVORİ ÜRÜN EKLE/KALDIR (TOGGLE)
router.post("/favorites/toggle", protectRoute, async (req, res) => {
	try {
		const userId = req.user.id;
		const { productId } = req.body;

		const user = await User.findById(userId);

		if (!user) {
			return res.status(404).json({ message: "Kullanıcı bulunamadı" });
		}

		const isFavorited = user.favorites.includes(productId);

		if (isFavorited) {
			user.favorites.pull(productId); // favoriden çıkar
		} else {
			user.favorites.push(productId); // favoriye ekle
		}

		await user.save();

		res.status(200).json({
			message: isFavorited ? "Favoriden çıkarıldı" : "Favorilere eklendi",
			favorites: user.favorites,
		});
	} catch (error) {
		console.error("Favori güncelleme hatası:", error);
		res.status(500).json({ message: "Sunucu hatası" });
	}
});

export default router;
