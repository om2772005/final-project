import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PlusCircle, X, Trash } from "lucide-react";

export default function AddProduct() {
  const [product, setProduct] = useState({
    title: "",
    category: "", // selected category
    coverImage: null,
    images: [],
    price: "",
    discountPrice: "",
    description: "",
    inStock: true,
    featured: false,
    hotDeals: false,
    newProduct: false,
  });

  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  // Fetch categories from SiteInfo
  useEffect(() => {
    fetch("http://localhost:3000/site-info")
      .then((res) => res.json())
      .then((data) => {
        if (data.categories) setCategories(data.categories);
      })
      .catch((err) => console.error(err));
  }, []);

  // File handlers
  const handleFileChange = (e, isCover = false) => {
    const files = Array.from(e.target.files);
    if (isCover) setProduct({ ...product, coverImage: files[0] });
    else setProduct({ ...product, images: [...product.images, ...files] });
  };

  const removeImage = (index) => {
    setProduct({
      ...product,
      images: product.images.filter((_, i) => i !== index),
    });
  };

  // Add product
  const addProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(product).forEach(([key, value]) => {
      if (key === "images" && Array.isArray(value)) {
        value.forEach((img) => formData.append("images", img));
      } else if (key === "coverImage" && value) {
        formData.append("coverImage", value);
      } else {
        formData.append(key, value);
      }
    });

    const res = await fetch("http://localhost:3000/add", { method: "POST", body: formData });
    if (res.ok) navigate("/view-products");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-3xl mx-auto mt-10"
    >
      <div className="bg-gradient-to-br from-zinc-900 via-gray-800 to-black shadow-2xl rounded-2xl p-8 text-white border border-gray-700">
        <h2 className="text-3xl font-extrabold mb-6 flex items-center gap-2">
          <PlusCircle className="text-green-400" /> Add New Product
        </h2>

        <form onSubmit={addProduct} className="space-y-5">
          {/* Title */}
          <input
            type="text"
            value={product.title}
            onChange={(e) => setProduct({ ...product, title: e.target.value })}
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-green-500 outline-none"
            placeholder="Product Title"
            required
          />

          {/* Category Dropdown */}
          <div>
            <label className="block font-semibold mb-2">Category</label>
            <select
              value={product.category}
              onChange={(e) => setProduct({ ...product, category: e.target.value })}
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-green-500 outline-none"
              required
            >
              <option value="" disabled>Select a category</option>
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Cover Image Upload */}
          <div>
            <label className="block font-semibold mb-2">Cover Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, true)}
              className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-600 file:text-white hover:file:bg-green-500"
            />
            {product.coverImage && (
              <img
                src={URL.createObjectURL(product.coverImage)}
                alt="Cover"
                className="mt-3 h-32 rounded-lg object-cover border border-gray-700"
              />
            )}
          </div>

          {/* Multiple Images */}
          <div>
            <label className="block font-semibold mb-2">Additional Images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleFileChange(e, false)}
              className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-600 file:text-white hover:file:bg-green-500"
            />
            <div className="flex gap-3 mt-4 overflow-x-auto">
              {product.images.map((img, i) => (
                <div key={i} className="relative w-24 h-24 border border-gray-700 rounded-lg">
                  <img src={URL.createObjectURL(img)} alt={`Image-${i}`} className="w-full h-full object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 bg-black/70 p-1 rounded-full text-red-400 hover:text-red-600"
                  >
                    <Trash size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Price Section */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              value={product.price}
              onChange={(e) => setProduct({ ...product, price: e.target.value })}
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="Price"
              required
            />
            <input
              type="number"
              value={product.discountPrice}
              onChange={(e) => setProduct({ ...product, discountPrice: e.target.value })}
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="Discount Price"
            />
          </div>

          {/* Description */}
          <textarea
            value={product.description}
            onChange={(e) => setProduct({ ...product, description: e.target.value })}
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-green-500 outline-none"
            placeholder="Description"
            rows={4}
          />

          {/* Boolean Toggles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
            {["inStock", "featured", "hotDeals", "newProduct"].map((key) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer bg-gray-800 rounded-lg px-3 py-2 border border-gray-700 hover:border-green-500 transition">
                <input
                  type="checkbox"
                  checked={product[key]}
                  onChange={(e) => setProduct({ ...product, [key]: e.target.checked })}
                  className="accent-green-500"
                />
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </label>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => navigate("/products")}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 transition font-medium"
            >
              <X size={18} /> Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-green-600 hover:bg-green-500 transition font-semibold shadow-lg shadow-green-500/20"
            >
              <PlusCircle size={18} /> Add Product
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
