import { create } from "zustand";

export const useFavoriteStore = create((set) => ({
  favorites: [],
  addFavorite: (product) =>
    set((state) => {
      if (!state.favorites.find((p) => p._id === product._id)) {
        return { favorites: [...state.favorites, product] };
      }
      return state;
    }),
  removeFavorite: (productId) =>
    set((state) => ({
      favorites: state.favorites.filter((p) => p._id !== productId),
    })),
}));
