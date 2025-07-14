import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
	try {
		console.log("🔒 protectRoute middleware çalışıyor...");
		console.log("🍪 Gelen cookies:", req.cookies);
		
		const accessToken = req.cookies.accessToken;
		console.log("🔑 Access token:", accessToken ? "Var" : "Yok");

		if (!accessToken) {
			console.log("❌ Access token bulunamadı");
			return res.status(401).json({ 
				message: "Unauthorized - No access token provided",
				code: "NO_TOKEN"
			});
		}

		try {
			console.log("🔍 Token doğrulanıyor...");
			const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
			console.log("✅ Token doğrulandı, decoded:", decoded);
			
			const user = await User.findById(decoded.userId).select("-password");
			console.log("👤 Kullanıcı bulundu:", user ? "Evet" : "Hayır");

			if (!user) {
				console.log("❌ Kullanıcı bulunamadı");
				return res.status(401).json({ message: "User not found" });
			}

			console.log("✅ Kullanıcı doğrulandı:", user._id);
			req.user = user;

			next();
		} catch (error) {
			console.log("💥 Token doğrulama hatası:", error.message);
			if (error.name === "TokenExpiredError") {
				console.log("⏰ Token süresi dolmuş");
				return res.status(401).json({ message: "Unauthorized - Access token expired" });
			}
			throw error;
		}
	} catch (error) {
		console.log("💥 Error in protectRoute middleware:", error.message);
		return res.status(401).json({ message: "Unauthorized - Invalid access token" });
	}
};

export const adminRoute = (req, res, next) => {
	if (req.user && req.user.role === "admin") {
		next();
	} else {
		return res.status(403).json({ message: "Access denied - Admin only" });
	}
}; 