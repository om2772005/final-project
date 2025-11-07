// models/SiteInfo.js
import mongoose from "mongoose";

// Product Schema
const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    coverImage: { type: String },
    images: [{ type: String }],
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    description: { type: String },
    inStock: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
    hotDeals: { type: Boolean, default: false },
    newProduct: { type: Boolean, default: false },
    category: { type: String, required: true }, // ✅ Simple string instead of ObjectId
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
