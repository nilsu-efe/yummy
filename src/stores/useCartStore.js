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
			const res = await axios.get("/cart");
			set({ cart: res.data });
			get().calculateTotals();
		} catch (error) {
			set({ cart: [] });
			toast.error(error.response.data.message || "An error occurred");
		}
	},
	clearCart: async () => {
		set({ cart: [], coupon: null, total: 0, subtotal: 0 });
	},
	addToCart: async (product) => {
		try {
			console.log("🛒 Frontend: addToCart çağrıldı", product._id);
			const res = await axios.post("/cart", { productId: product._id });
			
			console.log("✅ Backend response:", res.data);
			toast.success("Ürün sepete eklendi");

			// Backend'ten gelen güncel sepeti kullan
			set({ cart: res.data });
			get().calculateTotals();
		} catch (error) {
			console.log("❌ Frontend addToCart hatası:", error);
			toast.error(error.response?.data?.message || "Sepete ekleme başarısız");
		}
	},
	removeFromCart: async (productId) => {
		try {
			console.log("🗑️ Frontend: removeFromCart çağrıldı", productId);
			const res = await axios.delete(`/cart`, { data: { productId } });
			
			console.log("✅ Backend response:", res.data);
			set({ cart: res.data });
			get().calculateTotals();
		} catch (error) {
			console.log("❌ Frontend removeFromCart hatası:", error);
			toast.error(error.response?.data?.message || "Sepetten çıkarma başarısız");
		}
	},
	updateQuantity: async (productId, quantity) => {
		try {
			console.log("📝 Frontend: updateQuantity çağrıldı", productId, quantity);
			
			if (quantity === 0) {
				get().removeFromCart(productId);
				return;
			}

			const res = await axios.put(`/cart/${productId}`, { quantity });
			
			console.log("✅ Backend response:", res.data);
			set({ cart: res.data });
			get().calculateTotals();
		} catch (error) {
			console.log("❌ Frontend updateQuantity hatası:", error);
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
