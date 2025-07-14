import { create } from "zustand";

export const useUserStore = create((set) => ({
  user: null,
  loading: false,
  error: null,
  checkingAuth: true,  // başlangıçta true

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
      set({ user: userData, loading: false });
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
        set({ user: null, checkingAuth: false });
        return;
      }

      const userData = await res.json();
      set({ user: userData, checkingAuth: false });
    } catch (error) {
      set({ user: null, checkingAuth: false, error: error.message });
    }
  },
}));
