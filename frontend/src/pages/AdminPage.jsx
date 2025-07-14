import { BarChart, PlusCircle, ShoppingBasket } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import AnalyticsTab from "../components/AnalyticsTab";
import CreateProductForm from "../components/CreateProductForm";
import ProductsList from "../components/ProductsList";
import { useProductStore } from "../stores/useProductStore";

const tabs = [
	{ id: "create", label: "Ürün Oluştur", icon: PlusCircle },
	{ id: "products", label: "Ürünler", icon: ShoppingBasket },
	{ id: "analytics", label: "Analitik", icon: BarChart },
];

const AdminPage = () => {
	const [activeTab, setActiveTab] = useState("create");
	const { fetchAllProducts } = useProductStore();

	useEffect(() => {
		fetchAllProducts();
	}, [fetchAllProducts]);

	return (
		<div className='min-h-screen relative overflow-hidden'>
			<div className='relative z-10 container mx-auto px-4 py-16'>
				<motion.div
					className='text-center mb-12'
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
				>
					<h1 className='text-4xl font-bold mb-4 text-emerald-400'>
						Yönetici Paneli
					</h1>
					<p className="text-gray-400 text-lg">
						Restoranınızı yönetin ve menünüzü güncelleyin
					</p>
				</motion.div>

				<motion.div 
					className='flex justify-center mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.2 }}
				>
					{tabs.map((tab) => (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id)}
							className={`flex items-center px-6 py-3 mx-2 rounded-lg transition-all duration-200 font-medium ${
								activeTab === tab.id
									? "bg-emerald-600 text-white shadow-lg transform scale-105"
									: "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:transform hover:scale-105"
							}`}
						>
							<tab.icon className='mr-2 h-5 w-5' />
							{tab.label}
						</button>
					))}
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.4 }}
				>
					{activeTab === "create" && <CreateProductForm />}
					{activeTab === "products" && <ProductsList />}
					{activeTab === "analytics" && <AnalyticsTab />}
				</motion.div>
			</div>
		</div>
	);
};
export default AdminPage;
