import User from "../models/user.model.js";

export const getUser = async (req, res) => {
  try {
    const userId = req.user.id; // token’dan kullanıcı ID alınıyor
    const user = await User.findById(userId).select("-password"); // şifreyi göndermiyoruz

    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }

    res.json(user);
  } catch (error) {
    console.error("getUser hatası:", error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }

    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();

    res.json({ message: "Kullanıcı bilgileri güncellendi", user });
  } catch (error) {
    console.error("updateUser hatası:", error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};
