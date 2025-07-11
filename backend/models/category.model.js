import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true, // Kategori adları benzersiz olmalı
            trim: true,
            lowercase: true, // Kategorileri küçük harfle saklamak iyi bir pratiktir
        },
        description: {
            type: String,
            default: "",
        },
        // İsteğe bağlı olarak ikon, resim gibi alanlar eklenebilir
    },
    { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);

export default Category;