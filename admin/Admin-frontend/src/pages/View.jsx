import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ViewProducts() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    discountPrice: "",
    inStock: true,
    featured: false,
    hotDeals: false,
    newProduct: false,
  });

  // 🟢 Fetch products
  useEffect(() => {
    fetch("http://localhost:3000/view")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  // 🔴 Delete product
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:3000/delete/${id}`, {
        method: "DELETE",
      });
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  // ✏️ Edit button -> open modal
  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      description: product.description,
      price: product.price,
      discountPrice: product.discountPrice,
      inStock: product.inStock,
      featured: product.featured,
      hotDeals: product.hotDeals,
      newProduct: product.newProduct,
    });
  };

  // 🔄 Input change in modal
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // ✅ Save updated product
  const handleSave = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/editproducts/${editingProduct._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      const updated = await res.json();

      setProducts(products.map((p) => (p._id === updated._id ? updated : p)));
      setEditingProduct(null); // close modal
    } catch (err) {
      console.error("Error updating product:", err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">📦 All Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* 🟢 Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl p-6 w-96 shadow-lg">
            <h2 className="text-xl font-bold mb-4">✏️ Edit Product</h2>

            {/* Text fields */}
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Title"
              className="w-full border p-2 mb-2 rounded"
            />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              className="w-full border p-2 mb-2 rounded"
            />
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Price"
              className="w-full border p-2 mb-2 rounded"
            />
            <input
              type="number"
              name="discountPrice"
              value={formData.discountPrice}
              onChange={handleChange}
              placeholder="Discount Price"
              className="w-full border p-2 mb-2 rounded"
            />

            {/* Boolean toggles */}
            <div className="space-y-2 mb-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="inStock"
                  checked={formData.inStock}
                  onChange={handleChange}
                />
                In Stock
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                />
                Featured
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="hotDeals"
                  checked={formData.hotDeals}
                  onChange={handleChange}
                />
                Hot Deal
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="newProduct"
                  checked={formData.newProduct}
                  onChange={handleChange}
                />
                New Product
              </label>
            </div>

            {/* Modal actions */}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditingProduct(null)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              >
                Save ✅
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 🔥 Product Card with image slider + arrows
function ProductCard({ product, onEdit, onDelete }) {
  const images = [product.coverImage, ...(product.images || [])];
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="border rounded-xl shadow-md p-4 bg-white hover:shadow-xl transition relative">
      {/* Image Slider */}
      <div className="relative w-full h-48 mb-3">
        <img
  src={images[currentIndex]}
  alt={`product-${currentIndex}`}
  className="w-full h-48 object-contain rounded-lg bg-gray-100"
/>

        {/* Arrows (show only if multiple images) */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto mb-3">
          {images.map((img, idx) => (
           <img
  key={idx}
  src={img}
  alt={`thumb-${idx}`}
  onClick={() => setCurrentIndex(idx)}
  className={`h-16 w-16 object-contain bg-gray-100 rounded-md cursor-pointer border ${
    currentIndex === idx ? "border-blue-500" : "border-gray-300"
  }`}
/>

          ))}
        </div>
      )}

      {/* Product Info */}
      <h3 className="text-lg font-semibold">{product.title}</h3>
      {product.category && (
        <h2 className="text-l semibold text-blue-800">
          Category: {product.category}
        </h2>
      )}
      <p className="text-gray-600 mb-2">{product.description}</p>

      {/* Price */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex flex-col">
          {product.discountPrice > 0 ? (
            <>
              <span className="text-gray-500 line-through text-sm">
                ₹{product.price}
              </span>
              <span className="text-green-600 font-bold text-lg">
                ₹{product.discountPrice}
              </span>
            </>
          ) : (
            <span className="text-green-600 font-bold text-lg">
              ₹{product.price}
            </span>
          )}
        </div>

        {product.discountPrice > 0 && (
          <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded text-sm">
            {Math.round(
              ((product.price - product.discountPrice) / product.price) * 100
            )}
            % OFF
          </span>
        )}
      </div>

      {/* Stock & Tags */}
      <p
        className={`${
          product.inStock ? "text-green-600" : "text-red-600"
        } font-medium`}
      >
        {product.inStock ? "✅ In Stock" : "❌ Out of Stock"}
      </p>
      {product.featured && <p className="text-pink-600 font-medium">⚡Featured</p>}
      {product.hotDeals && <p className="text-red-600 font-medium">🔥Hot deal</p>}
      {product.newProduct && <p className="text-blue-600 font-medium">🛒New</p>}
      {product.brand && (
        <p className="text-sm text-gray-500">Brand: {product.brand}</p>
      )}

      {/* Buttons */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => onEdit(product)}
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg"
        >
          ✏️ Edit
        </button>
        <button
          onClick={() => onDelete(product._id)}
          className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"
        >
          🗑 Delete
        </button>
      </div>
    </div>
  );
}
