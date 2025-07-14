import React from "react";
import { useUserStore } from "../stores/useUserStore";

const UserProfile = () => {
	const { user } = useUserStore();

	if (!user) return <p>Yükleniyor...</p>;

	return (
		<div className="bg-gray-800 text-white rounded-xl shadow-md p-6 max-w-md mx-auto mt-10">
			<h2 className="text-2xl font-semibold mb-4">Profil Bilgileri</h2>
			<p><span className="font-semibold">İsim:</span> {user.username}</p>
			<p><span className="font-semibold">E-posta:</span> {user.email}</p>
			<p><span className="font-semibold">Rol:</span> {user.role}</p>
		</div>
	);
};

export default UserProfile;
