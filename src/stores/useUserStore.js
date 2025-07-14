import { create } from "zustand";
import { useCartStore } from "./useCartStore";

export const useUserStore = create((set) => ({
  user: null,
  loading: false,
  error: null,
  checkingAuth: true,  // başlangıçta true

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
      set({ user, loading: false, checkingAuth: false, error: null });
    } catch (error) {
      console.log("❌ Frontend signup hatası:", error);
      set({ error: error.message || "Sunucu hatası", loading: false });
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json();
        set({ error: errorData.message || "Login başarısız", loading: false });
        return;
      }

      const userData = await res.json();
      // Backend'den gelen user objesini doğru şekilde al
      const user = userData.user || userData;
      set({ user, loading: false, checkingAuth: false });
      console.log("✅ Login başarılı, user:", user);
    } catch (error) {
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
      set({ user: null, loading: false, error: null });
      
      // Sepet store'unu da temizle
      const cartStore = useCartStore.getState();
      cartStore.clearCart();
    } catch (error) {
      console.log("❌ Logout exception:", error.message);
      // Hata olsa bile state'i temizle
      set({ user: null, loading: false, error: null });
      
      // Sepet store'unu da temizle
      const cartStore = useCartStore.getState();
      cartStore.clearCart();
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

      const userData = await res.json();
      set({ user: userData, loading: false });
    } catch (error) {
      set({ error: error.message || "Sunucu hatası", loading: false });
    }
  },

  checkAuth: async () => {
    set({ checkingAuth: true, error: null });
    try {
      const res = await fetch("http://localhost:5001/api/auth/profile", {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.log("🔍 checkAuth: Token yok veya geçersiz", errorData);
        
        // Token yoksa normal bir durum, hata olarak gösterme
        if (errorData.code === "NO_TOKEN") {
          set({ user: null, checkingAuth: false, error: null });
        } else {
          set({ user: null, checkingAuth: false, error: null });
        }
        return;
      }

      const userData = await res.json();
      console.log("✅ checkAuth: Kullanıcı bulundu", userData);
      set({ user: userData, checkingAuth: false, error: null });
    } catch (error) {
      console.log("❌ checkAuth hatası:", error.message);
      set({ user: null, checkingAuth: false, error: null });
    }
  },
}));
