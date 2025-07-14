import express from "express";
import { 
  getUser, 
  updateUser, 
  getFavoriteProducts, 
  addFavoriteProduct, 
  removeFavoriteProduct 
} from "../controllers/users.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Kullanıcı bilgileri
router.get("/profile", protectRoute, getUser);
router.put("/profile", protectRoute, updateUser);

// Favori ürünler için endpoint'ler
router.get("/favorites", protectRoute, getFavoriteProducts);
router.post("/favorites/:productId", protectRoute, addFavoriteProduct);
router.delete("/favorites/:productId", protectRoute, removeFavoriteProduct);

export default router;
