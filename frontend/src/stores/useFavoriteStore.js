import { create } from "zustand";
import axios from "../lib/axios";
import toast from "react-hot-toast";

export const useFavoriteStore = create((set, get) => ({
  favorites: [],
  loading: false,

  // Favori ürünleri backend'den yükle
  fetchFavorites: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/users/favorites");
      console.log("✅ Favoriler yüklendi:", response.data);
      set({ favorites: response.data.favorites || [] });
    } catch (error) {
      console.error("❌ Favoriler yüklenemedi:", error);
      toast.error("Favoriler yüklenemedi");
    } finally {
      set({ loading: false });
    }
  },

  // Favori ürün ekle
  addFavorite: async (productId) => {
    try {
      console.log("🔍 Favori ekleniyor:", productId);
      const response = await axios.post(`/users/favorites/${productId}`);
      console.log("✅ Favori eklendi:", response.data);
      
      // Backend'den güncel favori listesini al
      await get().fetchFavorites();
      toast.success("Favorilere eklendi");
    } catch (error) {
      console.error("❌ Favori eklenemedi:", error);
      if (error.response?.data?.message === "Ürün zaten favorilerde") {
        toast.error("Bu ürün zaten favorilerinizde");
      } else {
        toast.error("Favoriye eklenemedi");
      }
    }
  },

  // Favori ürün çıkar
  removeFavorite: async (productId) => {
    try {
      console.log("🔍 Favori çıkarılıyor:", productId);
      const response = await axios.delete(`/users/favorites/${productId}`);
      console.log("✅ Favori çıkarıldı:", response.data);
      
      // Backend'den güncel favori listesini al
      await get().fetchFavorites();
      toast.success("Favorilerden çıkarıldı");
    } catch (error) {
      console.error("❌ Favori çıkarılamadı:", error);
      toast.error("Favoriden çıkarılamadı");
    }
  },

  // Ürünün favori olup olmadığını kontrol et
  isFavorite: (productId) => {
    const { favorites } = get();
    return favorites.some((fav) => fav._id === productId);
  },

  // Favori sayısını getir
  getFavoriteCount: () => {
    return get().favorites.length;
  },

  // Store'u temizle (logout için)
  clearFavorites: () => {
    set({ favorites: [], loading: false });
  },
}));
