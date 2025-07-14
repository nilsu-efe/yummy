import React, { useEffect } from "react";
import { useUserStore } from "../stores/useUserStore";

const Profile = () => {
  const { user, checkAuth } = useUserStore();

  useEffect(() => {
    console.log("Current user:", user);
    if (!user) {
      checkAuth();  // Kullanıcı bilgisi yoksa backend’den çekmek için çağırıyoruz
    }
  }, [user, checkAuth]);

  if (!user) return <p>Yükleniyor...</p>;

  return (
    <div>
      <h2>Profil Bilgileri</h2>
      <p>İsim: {user.name}</p>
      <p>Email: {user.email}</p>
    </div>
  );
};

export default Profile;
