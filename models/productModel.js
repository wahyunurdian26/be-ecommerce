import mongoose from "mongoose";
const { Schema } = mongoose;

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, "Nama product Harus diisi"],
    unique: [true, "Nama sudah di gunakan silakan buat yang lain"],
  },
  price: {
    type: Number,
    required: [true, "Harga Product Harus diisi"],
  },
  description: {
    type: String,
    required: [true, "Description product Harus diisi"],
  },
  image: {
    type: String,
    default: "null",
  },
  category: {
    type: String,
    required: [true, "Category product Harus diisi"],
    enum: ["sepatu", "kemeja", "baju", "celana"],
  },
  stock: {
    type: Number,
    default: 0,
  },
});

const Product = mongoose.model("Product", productSchema);

export default Product;
