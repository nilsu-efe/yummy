import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";

export const useProductStore = create((set) => ({
	products: [],
	loading: false,

	setProducts: (products) => set({ products }),
	createProduct: async (productData) => {
		set({ loading: true });
		try {
			const res = await axios.post("/products", productData);
			set((prevState) => ({
				products: [...prevState.products, res.data],
				loading: false,
			}));
			toast.success("Ürün başarıyla oluşturuldu!");
		} catch (error) {
			toast.error(error.response?.data?.error || "Ürün oluşturulurken hata oluştu");
			set({ loading: false });
		}
	},
	updateProduct: async (productId, productData) => {
		set({ loading: true });
		try {
			const res = await axios.put(`/products/${productId}`, productData);
			set((prevState) => ({
				products: prevState.products.map((product) =>
					product._id === productId ? res.data : product
				),
				loading: false,
			}));
			toast.success("Ürün başarıyla güncellendi!");
		} catch (error) {
			toast.error(error.response?.data?.error || "Ürün güncellenirken hata oluştu");
			set({ loading: false });
		}
	},
	fetchAllProducts: async () => {
		set({ loading: true });
		try {
			const response = await axios.get("/products");
			set({ products: response.data.products, loading: false });
		} catch (error) {
			set({ error: "Failed to fetch products", loading: false });
			toast.error(error.response?.data?.error || "Ürünler yüklenirken hata oluştu");
		}
	},
	fetchProductsByCategory: async (category) => {
		set({ loading: true });
		try {
			const response = await axios.get(`/products/category/${category}`);
			set({ products: response.data.products, loading: false });
		} catch (error) {
			set({ error: "Failed to fetch products", loading: false });
			toast.error(error.response?.data?.error || "Ürünler yüklenirken hata oluştu");
		}
	},
	deleteProduct: async (productId) => {
		set({ loading: true });
		try {
			await axios.delete(`/products/${productId}`);
			set((prevProducts) => ({
				products: prevProducts.products.filter((product) => product._id !== productId),
				loading: false,
			}));
			toast.success("Ürün başarıyla silindi!");
		} catch (error) {
			set({ loading: false });
			toast.error(error.response?.data?.error || "Ürün silinirken hata oluştu");
		}
	},
	toggleFeaturedProduct: async (productId) => {
		set({ loading: true });
		try {
			const response = await axios.patch(`/products/${productId}`);
			// this will update the isFeatured prop of the product
			set((prevProducts) => ({
				products: prevProducts.products.map((product) =>
					product._id === productId ? { ...product, isFeatured: response.data.isFeatured } : product
				),
				loading: false,
			}));
			toast.success(response.data.isFeatured ? "Ürün öne çıkan olarak ayarlandı!" : "Ürün öne çıkan listesinden kaldırıldı!");
		} catch (error) {
			set({ loading: false });
			toast.error(error.response?.data?.error || "Ürün güncellenirken hata oluştu");
		}
	},
	fetchFeaturedProducts: async () => {
		set({ loading: true });
		try {
			const response = await axios.get("/products/featured");
			set({ products: response.data, loading: false });
		} catch (error) {
			set({ error: "Failed to fetch products", loading: false });
			console.log("Error fetching featured products:", error);
		}
	},
}));
