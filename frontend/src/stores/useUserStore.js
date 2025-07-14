import { create } from "zustand";

export const useUserStore = create((set, get) => ({
  user: null,
  loading: false,
  error: null,
  checkingAuth: true, // Başlangıçta auth kontrolü var
  hasCheckedAuth: false, // Auth kontrolünün yapılıp yapılmadığını takip et

  // Error state'ini temizle
  clearError: () => set({ error: null }),

  signup: async (formData) => {
    set({ loading: true, error: null });
    try {
      console.log("📝 Frontend: signup çağrıldı", formData);
      
      // Şifre kontrolü
      if (formData.password !== formData.confirmPassword) {
        set({ error: "Şifreler eşleşmiyor", loading: false });
        return;
      }

      const res = await fetch("http://localhost:5001/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: formData.name, 
          email: formData.email, 
          password: formData.password 
        }),
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json();
        set({ error: errorData.message || "Kayıt başarısız", loading: false });
        return;
      }

      const userData = await res.json();
      console.log("✅ Signup başarılı:", userData);
      
      // Backend'den gelen user objesini doğru şekilde al
      const user = userData.user || userData;
      set({ user, loading: false, checkingAuth: false, error: null, hasCheckedAuth: true });
    } catch (error) {
      console.log("❌ Frontend signup hatası:", error);
      set({ error: error.message || "Sunucu hatası", loading: false });
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      console.log("🔐 Login başlatılıyor:", { email });
      
      const res = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include", // cookie gönderimi için önemli
      });

      console.log("📡 Login response status:", res.status);
      console.log("📡 Login response headers:", Object.fromEntries(res.headers.entries()));

      if (!res.ok) {
        const errorData = await res.json();
        console.log("❌ Login başarısız:", errorData);
        set({ error: errorData.message || "Login başarısız", loading: false });
        return;
      }

      const data = await res.json();
      console.log("✅ Login başarılı, response data:", data);
      
      // User bilgilerini detaylı yazdır
      const userData = data.user || data;
      console.log("👤 Giriş yapan kullanıcı bilgileri:");
      console.log("   📝 ID:", userData._id);
      console.log("   👨‍💼 İsim:", userData.name);
      console.log("   📧 Email:", userData.email);
      console.log("   🔐 Rol:", userData.role);
      console.log("   📅 Giriş zamanı:", new Date().toLocaleString('tr-TR'));
      console.log("   🔍 Tam user objesi:", JSON.stringify(userData, null, 2));
      
      // Cookie'leri kontrol et
      const cookies = document.cookie;
      console.log("🍪 Login sonrası cookies:", cookies);
      
      set({ user: userData, loading: false, hasCheckedAuth: true, error: null }); // user objesini ayıklıyoruz
      
      // State güncellemesi sonrası tekrar kontrol
      console.log("🔄 User state güncellendi, yeni state:", get().user);
    } catch (error) {
      console.log("💥 Login hatası:", error);
      set({ error: error.message || "Sunucu hatası", loading: false });
    }
  },

  logout: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("http://localhost:5001/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      // Logout işlemi başarılı olsun veya olmasın, state'i temizle
      if (res.ok) {
        console.log("✅ Logout başarılı");
      } else {
        const errorData = await res.json();
        console.log("⚠️ Logout hatası:", errorData.message);
      }

      // Her durumda state'i temizle
      set({ user: null, loading: false, error: null, hasCheckedAuth: false });
    } catch (error) {
      console.log("❌ Logout exception:", error.message);
      // Hata olsa bile state'i temizle
      set({ user: null, loading: false, error: null, hasCheckedAuth: false });
    }
  },

  fetchProfile: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("http://localhost:5001/api/auth/profile", {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json();
        set({ error: errorData.message || "Profil alınamadı", loading: false });
        return;
      }

      const data = await res.json();
      set({ user: data, loading: false });
    } catch (error) {
      set({ error: error.message || "Sunucu hatası", loading: false });
    }
  },

  refreshToken: async () => {
    try {
      const res = await fetch("http://localhost:5001/api/auth/refresh-token", {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json();
        set({ error: errorData.message || "Token yenilenemedi" });
        return false;
      }

      return true;
    } catch (error) {
      set({ error: error.message || "Sunucu hatası" });
      return false;
    }
  },

  checkAuth: async () => {
    const state = get();
    
    // Eğer zaten auth kontrolü yapılmışsa tekrar yapma
    if (state.hasCheckedAuth && !state.checkingAuth) {
      console.log("🔍 Auth kontrolü zaten yapılmış, tekrar yapılmıyor");
      return;
    }
    
    set({ checkingAuth: true, error: null });
    try {
      console.log("🔍 checkAuth çağırıldı...");
      
      // Cookie'leri kontrol et
      const cookies = document.cookie;
      console.log("🍪 Mevcut cookies:", cookies);
      
      // Access token'ı kontrol et
      const accessToken = cookies.split(';').find(cookie => cookie.trim().startsWith('accessToken='));
      console.log("🔑 Access token cookie:", accessToken);
      
      // Token yoksa direkt olarak user null yap, API çağırma
      if (!accessToken) {
        console.log("🔑 Access token yok, kullanıcı giriş yapmamış");
        set({ user: null, checkingAuth: false, hasCheckedAuth: true, error: null });
        return;
      }
      
      const res = await fetch("http://localhost:5001/api/auth/profile", {
        method: "GET",
        credentials: "include",
      });

      console.log("📡 checkAuth response status:", res.status);
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: "Unknown error" }));
        console.log("❌ checkAuth başarısız, error data:", errorData);
        
        // Token geçersizse veya yoksa, bu normal bir durum - error set etme
        if (errorData.code === "NO_TOKEN" || errorData.message?.includes("No access token")) {
          console.log("🔑 Token geçersiz veya yok - normal durum");
          set({ user: null, checkingAuth: false, hasCheckedAuth: true, error: null });
        } else {
          // Gerçek bir hata varsa error set et
          set({ user: null, checkingAuth: false, hasCheckedAuth: true, error: errorData.message });
        }
        return;
      }

      const data = await res.json();
      console.log("✅ checkAuth başarılı, user data:", data);
      
      // User bilgilerini detaylı yazdır
      console.log("👤 Profil bilgileri yüklendi:");
      console.log("   📝 ID:", data._id);
      console.log("   👨‍💼 İsim:", data.name);
      console.log("   📧 Email:", data.email);
      console.log("   🔐 Rol:", data.role);
      console.log("   📅 Yükleme zamanı:", new Date().toLocaleString('tr-TR'));
      
      set({ user: data, checkingAuth: false, hasCheckedAuth: true, error: null });
    } catch (error) {
      console.log("💥 checkAuth hata:", error);
      // Network hatası gibi durumlarda da error set etme
      set({ user: null, checkingAuth: false, hasCheckedAuth: true, error: null });
    }
  },

  updateProfile: async (profileData) => {
    set({ loading: true, error: null });
    try {
      console.log("🔄 updateProfile başlatılıyor:", profileData);
      
      const res = await fetch("http://localhost:5001/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
        credentials: "include",
      });

      console.log("📡 updateProfile response status:", res.status);

      if (!res.ok) {
        const errorData = await res.json();
        console.log("❌ updateProfile başarısız:", errorData);
        set({ error: errorData.message || "Profil güncelleme başarısız", loading: false });
        throw new Error(errorData.message || "Profil güncelleme başarısız");
      }

      const data = await res.json();
      console.log("✅ updateProfile başarılı:", data);
      
      // User bilgilerini güncelle
      set({ user: data.user, loading: false });
      
      // User bilgilerini detaylı yazdır
      console.log("👤 Güncellenmiş profil bilgileri:");
      console.log("   📝 ID:", data.user._id);
      console.log("   👨‍💼 İsim:", data.user.name);
      console.log("   📧 Email:", data.user.email);
      console.log("   📱 Telefon:", data.user.phone);
      console.log("   🏠 Adres:", data.user.address);
      console.log("   📅 Doğum Tarihi:", data.user.birthDate);
      console.log("   👤 Cinsiyet:", data.user.gender);
      console.log("   🔐 Rol:", data.user.role);
      console.log("   📅 Güncelleme zamanı:", new Date().toLocaleString('tr-TR'));
      
      return true;
    } catch (error) {
      console.log("💥 updateProfile hatası:", error.message);
      set({ error: error.message, loading: false });
      throw error;
    }
  },
}));
