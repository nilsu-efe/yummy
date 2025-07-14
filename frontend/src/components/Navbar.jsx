import { ShoppingCart, UserPlus, LogIn, LogOut, Lock, Heart, User, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
import { useFavoriteStore } from "../stores/useFavoriteStore";
import { useEffect } from "react";

const Navbar = () => {
	const { user, logout } = useUserStore();
	const isAdmin = user?.role === "admin";
	const { cart } = useCartStore();
	const { favorites, fetchFavorites } = useFavoriteStore();

	// User state değişikliklerini debug et
	useEffect(() => {
		console.log("🔄 Navbar - User state değişti:");
		if (user) {
			console.log("   ✅ Kullanıcı giriş yapmış:");
			console.log("      📝 ID:", user._id);
			console.log("      👨‍💼 İsim:", user.name);
			console.log("      📧 Email:", user.email);
			console.log("      🔐 Rol:", user.role);
			// Kullanıcı giriş yaptığında favorileri yükle
			fetchFavorites();
		} else {
			console.log("   ❌ Kullanıcı giriş yapmamış");
		}
	}, [user, fetchFavorites]);

	const handleProfileClick = () => {
		console.log("Profil butonuna tıklandı!");
	};

	return (
		<header className='fixed top-0 left-0 w-full bg-gray-900 bg-opacity-90 backdrop-blur-md shadow-lg z-40 transition-all duration-300 border-b border-emerald-800'>
			<div className='container mx-auto px-4 py-3'>
				<div className='flex flex-wrap justify-between items-center'>
					<Link to='/' className='text-2xl font-bold text-emerald-400 items-center space-x-2 flex'>
						YUMMY
					</Link>

					<nav className='flex flex-wrap items-center gap-4'>
						<Link
							to={"/"}
							className='text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out'
						>
							Ana Sayfa
						</Link>

						{user && (
							<Link
								to={"/favorites"}
								className='relative group text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out flex items-center'
							>
								<Heart className='mr-1' size={20} />
								<span className='hidden sm:inline'>Favoriler</span>
								{favorites.length > 0 && (
									<span
										className='absolute -top-2 -left-2 bg-red-500 text-white rounded-full px-2 py-0.5 
									text-xs group-hover:bg-red-400 transition duration-300 ease-in-out'
									>
										{favorites.length}
									</span>
								)}
							</Link>
						)}

						{user && (
							<Link
								to={"/cart"}
								className='relative group text-gray-300 hover:text-emerald-400 transition duration-300 ease-in-out'
							>
								<ShoppingCart className='inline-block mr-1 group-hover:text-emerald-400' size={20} />
								<span className='hidden sm:inline'>Sepet</span>
								{cart.length > 0 && (
									<span
										className='absolute -top-2 -left-2 bg-emerald-500 text-white rounded-full px-2 py-0.5 
									text-xs group-hover:bg-emerald-400 transition duration-300 ease-in-out'
									>
										{cart.length}
									</span>
								)}
							</Link>
						)}

						{user && (
  							<Link
								to="/profile"
    							className="bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1 rounded-md font-medium
    							transition duration-300 ease-in-out flex items-center"
 							 >
    						<User className="inline-block mr-1" size={18} />
    						<span className="hidden sm:inline">Profil</span>
  							</Link>
						)}

						{isAdmin && (
							<Link
								to="/secret-dashboard"
								className="bg-purple-700 hover:bg-purple-600 text-white px-3 py-1 rounded-md font-medium
								transition duration-300 ease-in-out flex items-center"
							>
								<Settings className="inline-block mr-1" size={18} />
								<span className="hidden sm:inline">Yönetim</span>
							</Link>
						)}

						{user ? (
							<button
								className='bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 
								rounded-md flex items-center transition duration-300 ease-in-out'
								onClick={logout}
							>
								<LogOut size={18} />
								<span className='hidden sm:inline ml-2'>Çıkış</span>
							</button>
						) : (
							<>
								<Link
									to={"/signup"}
									className='bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 
									rounded-md flex items-center transition duration-300 ease-in-out'
								>
									<UserPlus className='mr-2' size={18} />
									Kayıt Ol
								</Link>
								<Link
									to={"/login"}
									className='bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 
									rounded-md flex items-center transition duration-300 ease-in-out'
								>
									<LogIn className='mr-2' size={18} />
									Giriş
								</Link>
							</>
						)}
					</nav>
				</div>
			</div>
		</header>
	);
};

export default Navbar;
