// Vercel serverless function
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "../backend/routes/auth.route.js";
import productRoutes from "../backend/routes/product.route.js";
import cartRoutes from "../backend/routes/cart.route.js";
import couponRoutes from "../backend/routes/coupon.route.js";
import paymentRoutes from "../backend/routes/payment.route.js";
import analyticsRoutes from "../backend/routes/analytics.route.js";
import usersRoutes from "../backend/routes/users.route.js";

import { connectDB } from "../backend/lib/db.js";

const app = express();

// CORS ayarı - Vercel production URL'lerini ekle
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174", 
    "http://localhost:5175",
    "http://localhost:5176",
    "http://localhost:5177",
    "http://localhost:5178",
    "https://your-app-name.vercel.app", // Vercel URL'nizi buraya ekleyin
    "https://*.vercel.app" // Tüm Vercel subdomain'leri
  ],
  credentials: true
}));

// Middleware'ler
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

// API rotaları
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/users", usersRoutes);

// Veritabanı bağlantısı
connectDB();

// Vercel serverless function export
export default app; 