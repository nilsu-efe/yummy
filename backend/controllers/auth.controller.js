import { redis } from "../lib/redis.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

// Token oluşturma
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "24h", // 15 dakikadan 24 saate çıkarıldı
  });

  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

// Refresh token'ı Redis'e kaydet
const storeRefreshToken = async (userId, refreshToken) => {
  await redis.set(`refresh_token:${userId}`, refreshToken, "EX", 7 * 24 * 60 * 60); // 7 gün
};

// Cookie ayarları
const setCookies = (res, accessToken, refreshToken) => {
  // Lokal geliştirme için secure:false ve sameSite:lax, prod için secure:true ve sameSite:none
  const isProd = process.env.NODE_ENV === "production";

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false, // localde false, prod'da true olacak
    sameSite: "lax", // localde lax, prod'da none olacak
    maxAge: 24 * 60 * 60 * 1000, // 24 saat (15 dakikadan artırıldı)
    domain: "localhost", // localhost için domain belirt
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 gün
    domain: "localhost", // localhost için domain belirt
  });
};

// Kayıt
export const signup = async (req, res) => {
  try {
    console.log("📝 Signup controller çalışıyor...");
    const { email, password, name } = req.body;
    console.log("📧 Email:", email);
    console.log("👤 Name:", name);
    console.log("🔒 Password length:", password?.length);

    // Gerekli alanları kontrol et
    if (!email || !password || !name) {
      console.log("❌ Eksik alanlar");
      return res.status(400).json({ message: "Tüm alanlar gerekli" });
    }

    // Email formatını kontrol et
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log("❌ Geçersiz email formatı");
      return res.status(400).json({ message: "Geçersiz email formatı" });
    }

    // Şifre uzunluğunu kontrol et
    if (password.length < 6) {
      console.log("❌ Şifre çok kısa");
      return res.status(400).json({ message: "Şifre en az 6 karakter olmalı" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log("❌ Kullanıcı zaten mevcut:", email);
      return res.status(400).json({ message: "Bu email adresi zaten kullanılıyor" });
    }

    console.log("✅ Kullanıcı oluşturuluyor...");
    const user = await User.create({ name, email, password });
    console.log("✅ Kullanıcı oluşturuldu:", user._id);

    const { accessToken, refreshToken } = generateTokens(user._id.toString());
    console.log("🔑 Token'lar oluşturuldu");
    
    await storeRefreshToken(user._id.toString(), refreshToken);
    console.log("💾 Refresh token kaydedildi");
    
    setCookies(res, accessToken, refreshToken);
    console.log("🍪 Cookie'ler ayarlandı");

    // Frontend ile uyumlu şekilde user objesini "user" anahtarı ile döndür
    const responseData = {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    };
    console.log("📤 Response gönderiliyor:", responseData);
    res.status(201).json(responseData);
  } catch (error) {
    console.log("❌ Error in signup controller:", error.message);
    res.status(500).json({ message: "Sunucu hatası: " + error.message });
  }
};

// Giriş
export const login = async (req, res) => {
  try {
    console.log("🔐 Login controller çalışıyor...");
    const { email, password } = req.body;
    console.log("📧 Email:", email);
    
    const user = await User.findOne({ email });
    console.log("👤 Kullanıcı bulundu:", user ? "Evet" : "Hayır");

    if (user && (await user.comparePassword(password))) {
      console.log("✅ Şifre doğru, token oluşturuluyor...");
      const { accessToken, refreshToken } = generateTokens(user._id.toString());
      console.log("🔑 Access token oluşturuldu");
      console.log("🔄 Refresh token oluşturuldu");
      
      await storeRefreshToken(user._id.toString(), refreshToken);
      console.log("💾 Refresh token Redis'e kaydedildi");
      
      setCookies(res, accessToken, refreshToken);
      console.log("🍪 Cookie'ler ayarlandı");

      // Frontend ile uyumlu şekilde user objesini "user" anahtarı ile döndür
      const responseData = {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        }
      };
      console.log("📤 Response gönderiliyor:", responseData);
      res.json(responseData);
    } else {
      console.log("❌ Geçersiz email veya şifre");
      res.status(400).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.log("💥 Error in login controller:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Çıkış
export const logout = async (req, res) => {
  try {
    console.log("🔐 Logout controller çalışıyor...");
    
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const userId = decoded.userId || decoded.id;

        if (userId) {
          await redis.del(`refresh_token:${userId.toString()}`);
          console.log("✅ Refresh token Redis'ten silindi");
        }
      } catch (tokenError) {
        console.log("⚠️ Refresh token doğrulanamadı:", tokenError.message);
      }
    }

    // Cookie'leri temizle - tüm olası domain ve path'leri kapsa
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      domain: "localhost",
      path: "/"
    });
    
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      domain: "localhost",
      path: "/"
    });

    console.log("✅ Cookie'ler temizlendi");
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("❌ Error in logout controller:", error.message);
    // Hata olsa bile cookie'leri temizlemeye çalış
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Refresh token yenileme
export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const userId = decoded.userId || decoded.id;
    const storedToken = await redis.get(`refresh_token:${userId.toString()}`);

    if (storedToken !== refreshToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const accessToken = jwt.sign(
      { userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "24h" } // 15 dakikadan 24 saate çıkarıldı
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000, // 24 saat
    });

    res.json({ message: "Token refreshed successfully" });
  } catch (error) {
    console.log("Error in refreshToken controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Token doğrulama middleware
export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json({ message: "Unauthorized, no token" });

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) return res.status(401).json({ message: "Unauthorized, user not found" });

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized, token invalid or expired" });
  }
};

// Profil
export const getProfile = async (req, res) => {
  try {
    console.log("👤 getProfile controller çalışıyor...");
    console.log("📊 req.user:", req.user);
    
    // req.user protectRoute middleware tarafından ayarlanmalı
    if (!req.user) {
      console.log("❌ req.user bulunamadı");
      return res.status(401).json({ message: "User not found in request" });
    }
    
    console.log("✅ Profil bilgileri gönderiliyor:", req.user);
    res.json(req.user);
  } catch (error) {
    console.log("💥 Error in getProfile controller:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Profil güncelleme
export const updateUser = async (req, res) => {
  try {
    console.log("🔄 updateUser controller çalışıyor...");
    console.log("📝 Gelen veriler:", req.body);
    
    const userId = req.user._id;
    const { 
      name, 
      email, 
      phone, 
      address, 
      birthDate, 
      gender,
      role,
      currentPassword,
      newPassword 
    } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      console.log("❌ Kullanıcı bulunamadı");
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }

    // Şifre değişikliği kontrolü
    if (currentPassword && newPassword) {
      const isPasswordValid = await user.comparePassword(currentPassword);
      if (!isPasswordValid) {
        console.log("❌ Mevcut şifre yanlış");
        return res.status(400).json({ message: "Mevcut şifre yanlış" });
      }
      user.password = newPassword;
      console.log("✅ Şifre güncellendi");
    }

    // Temel bilgiler
    if (name && name.trim() !== "") {
      user.name = name.trim();
    }

    // Telefon
    if (phone !== undefined) {
      user.phone = phone.trim();
    }

    // Adres bilgileri
    if (address) {
      if (address.street !== undefined) user.address.street = address.street.trim();
      if (address.city !== undefined) user.address.city = address.city.trim();
      if (address.state !== undefined) user.address.state = address.state.trim();
      if (address.country !== undefined) user.address.country = address.country.trim();
      if (address.postalCode !== undefined) user.address.postalCode = address.postalCode.trim();
    }

    // Doğum tarihi
    if (birthDate) {
      user.birthDate = new Date(birthDate);
    }

    // Cinsiyet
    if (gender && ["male", "female", "other"].includes(gender)) {
      user.gender = gender;
    }

    // Rol güncelleme (sadece admin kullanıcılar için)
    if (role && ["customer", "admin"].includes(role)) {
      user.role = role;
    }

    await user.save();
    console.log("✅ Kullanıcı bilgileri kaydedildi");

    // Güncellenmiş kullanıcı bilgilerini döndür (şifre hariç)
    const updatedUser = await User.findById(userId).select("-password");
    
    res.json({
      message: "Kullanıcı bilgileri başarıyla güncellendi",
      user: updatedUser
    });
  } catch (error) {
    console.error("💥 updateUser hatası:", error);
    res.status(500).json({ message: "Sunucu hatası", error: error.message });
  }
};
