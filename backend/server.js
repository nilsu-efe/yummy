// ✅ .env dosyasını en başta yükle
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"; // ✅ CORS import edildi
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";
import couponRoutes from "./routes/coupon.route.js";
import paymentRoutes from "./routes/payment.route.js";
import analyticsRoutes from "./routes/analytics.route.js";

import { connectDB } from "./lib/db.js";

// ✅ ENV değişkenlerini kontrol et (debug için)
console.log("✅ ACCESS_TOKEN_SECRET:", process.env.ACCESS_TOKEN_SECRET);
console.log("✅ REFRESH_TOKEN_SECRET:", process.env.REFRESH_TOKEN_SECRET);
console.log("✅ MONGO_URI:", process.env.MONGO_URI);

// ✅ __dirname'i tanımla (ESM için)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

// ✅ CORS ayarı (frontend portuna dikkat et)
app.use(cors({
  origin: "http://localhost:5173", // Vite (frontend) adresi
  credentials: true
}));

// ✅ Middleware'ler
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

// ✅ API rotaları
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);

// ✅ Production ortamında frontend build dosyalarını serve et
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
  });
}

// ✅ Sunucuyu başlat
app.listen(PORT, () => {
	console.log(`✅ Server is running on http://localhost:${PORT}`);
	connectDB();
});
