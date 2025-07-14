import { create } from "zustand";

export const useUserStore = create((set) => ({
  user: null,
  loading: false,
  error: null,
  checkingAuth: true, // Başlangıçta auth kontrolü var

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include", // cookie gönderimi için önemli
      });

      if (!res.ok) {
        const errorData = await res.json();
        set({ error: errorData.message || "Login başarısız", loading: false });
        return;
      }

      const data = await res.json();
      set({ user: data.user, loading: false }); // user objesini ayıklıyoruz
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

      if (!res.ok) {
        const errorData = await res.json();
        set({ error: errorData.message || "Logout başarısız", loading: false });
        return;
      }

      set({ user: null, loading: false });
    } catch (error) {
      set({ error: error.message || "Sunucu hatası", loading: false });
    }
  },

  fetchProfile: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("http://localhost:5001/api/users/profile", {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json();
        set({ error: errorData.message || "Profil alınamadı", loading: false });
        return;
      }

      const data = await res.json();
      set({ user: data.user, loading: false });
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
    set({ checkingAuth: true });
    try {
      const res = await fetch("http://localhost:5001/api/users/profile", {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        set({ user: null, checkingAuth: false });
        return;
      }

      const data = await res.json();
      set({ user: data.user, checkingAuth: false });
    } catch (error) {
      set({ user: null, checkingAuth: false });
    }
  },
}));
