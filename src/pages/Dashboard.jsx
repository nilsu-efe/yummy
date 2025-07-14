import { useEffect } from "react";
import { useUserStore } from "../stores/useUserStore";

function Dashboard() {
  const { user, checkAuth, checkingAuth } = useUserStore();

  useEffect(() => {
    if (!user) checkAuth();
  }, [user, checkAuth]);

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex justify-center items-center text-white">
        <p>Profil yükleniyor...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex justify-center items-center text-white">
        <p>Kullanıcı bilgileri alınamadı.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-10 px-4 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6 text-center text-emerald-400">Profil Sayfanız</h1>
      <div className="max-w-md mx-auto bg-gray-800 p-6 rounded-lg shadow-lg space-y-4">
        <div>
          <span className="font-semibold">Ad Soyad:</span>{" "}
          <span>{user.name || "Belirtilmemiş"}</span>
        </div>
        <div>
          <span className="font-semibold">Email:</span>{" "}
          <span>{user.email || "Belirtilmemiş"}</span>
        </div>
        <div>
          <span className="font-semibold">Rol:</span>{" "}
          <span>{user.role || "Belirtilmemiş"}</span>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
