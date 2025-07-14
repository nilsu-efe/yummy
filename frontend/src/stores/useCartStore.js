import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useCartStore = create((set, get) => ({
	cart: [],
	coupon: null,
	total: 0,
	subtotal: 0,
	isCouponApplied: false,

	getMyCoupon: async () => {
		try {
			const response = await axios.get("/coupons");
			set({ coupon: response.data });
		} catch (error) {
			console.error("Error fetching coupon:", error);
		}
	},
	applyCoupon: async (code) => {
		try {
			const response = await axios.post("/coupons/validate", { code });
			set({ coupon: response.data, isCouponApplied: true });
			get().calculateTotals();
			toast.success("Coupon applied successfully");
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to apply coupon");
		}
	},
	removeCoupon: () => {
		set({ coupon: null, isCouponApplied: false });
		get().calculateTotals();
		toast.success("Coupon removed");
	},

	getCartItems: async () => {
		try {
			console.log("🛒 getCartItems çağrıldı...");
			const res = await axios.get("/cart");
			console.log("✅ Sepet yüklendi:", res.data);
			set({ cart: res.data });
			get().calculateTotals();
		} catch (error) {
			console.error("Sepet yükleme hatası:", error);
			
			// 401 hatası normal (kullanıcı giriş yapmamış)
			if (error.response?.status === 401) {
				console.log("🔑 Kullanıcı giriş yapmamış, sepet boş");
				set({ cart: [] });
				return;
			}
			
			// Diğer hatalar için toast göster
			toast.error(error.response?.data?.message || "Sepet yüklenemedi");
			set({ cart: [] });
		}
	},
	clearCart: async () => {
		set({ cart: [], coupon: null, total: 0, subtotal: 0 });
	},
	addToCart: async (product) => {
		try {
			console.log("🛒 addToCart çağrıldı:", product._id);
			const response = await axios.post("/cart", { productId: product._id });
			console.log("✅ Ürün sepete eklendi:", response.data);
			toast.success("Ürün sepete eklendi");

			// Backend'den gelen güncel sepeti kullan
			set({ cart: response.data });
			get().calculateTotals();
		} catch (error) {
			console.error("Sepete ekleme hatası:", error);
			
			// 401 hatası için özel mesaj
			if (error.response?.status === 401) {
				toast.error("Giriş yapmanız gerekiyor");
				return;
			}
			
			toast.error(error.response?.data?.message || "Sepete ekleme başarısız");
		}
	},
	removeFromCart: async (productId) => {
		try {
			const response = await axios.delete(`/cart`, { data: { productId } });
			set({ cart: response.data });
			get().calculateTotals();
			toast.success("Ürün sepetten çıkarıldı");
		} catch (error) {
			console.error("Sepetten çıkarma hatası:", error);
			toast.error(error.response?.data?.message || "Sepetten çıkarma başarısız");
		}
	},
	updateQuantity: async (productId, quantity) => {
		try {
			if (quantity === 0) {
				get().removeFromCart(productId);
				return;
			}

			const response = await axios.put(`/cart/${productId}`, { quantity });
			set({ cart: response.data });
			get().calculateTotals();
		} catch (error) {
			console.error("Miktar güncelleme hatası:", error);
			toast.error(error.response?.data?.message || "Miktar güncelleme başarısız");
		}
	},
	calculateTotals: () => {
		const { cart, coupon } = get();
		const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
		let total = subtotal;

		if (coupon) {
			const discount = subtotal * (coupon.discountPercentage / 100);
			total = subtotal - discount;
		}

		set({ subtotal, total });
	},
}));
