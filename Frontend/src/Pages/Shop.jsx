import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Sparkles } from "lucide-react";
import ProductCard from "../Components/Productcard";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:3000/products");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:3000/categories");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const filteredProducts = products.filter((product) => {
    const productName = product?.name || product?.title || "";
    const matchesSearch = productName
      .toLowerCase()
      .includes(search.toLowerCase());
    const productCategory = product?.category?.name || product?.category || "";
    const matchesCategory =
      activeCategory === "All" || productCategory === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white pt-24 px-6 md:px-16 pb-20 overflow-hidden">
      {/* 🔮 Background Lights */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-pink-500 rounded-full blur-3xl opacity-25 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500 rounded-full blur-3xl opacity-25 animate-pulse" />
      </div>

      {/* ✨ Heading */}
      <motion.div
        className="relative text-center z-10"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="flex justify-center mb-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 backdrop-blur-md rounded-full">
            <Sparkles className="text-yellow-400 animate-pulse" size={20} />
            <span className="uppercase tracking-widest text-sm text-gray-200">
              New Arrivals
            </span>
          </div>
        </div>

        <h1 className="text-5xl font-extrabold mb-3 drop-shadow-lg">
          Explore <span className="text-yellow-400">Our Collection</span>
        </h1>
        <p className="text-gray-300 max-w-2xl mx-auto text-lg">
          Discover the latest fashion trends and timeless pieces, handpicked for
          every style.
        </p>
      </motion.div>

      {/* 🔍 Search & Filters */}
      <motion.div
        className="relative flex flex-col md:flex-row md:items-center justify-between gap-6 mt-12 z-10"
        initial="hidden"
        animate="visible"
        custom={1}
        variants={fadeIn}
      >
        {/* Search Bar */}
        <div className="relative w-full md:w-1/2">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full px-10 py-3 rounded-full bg-white/10 border border-white/20 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 backdrop-blur-lg"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
        </div>

        {/* Category Filter Buttons */}
        <div className="flex flex-wrap justify-center md:justify-end gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition backdrop-blur-lg border ${
                activeCategory === cat
                  ? "bg-yellow-400 text-gray-900 border-yellow-400 shadow-lg"
                  : "bg-white/10 text-white border-white/20 hover:bg-white/20"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </motion.div>

      {/* 🛒 Product Grid */}
      <div className="relative mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 z-10">
        {loading ? (
          <p className="col-span-full text-center text-gray-300 text-lg">
            Loading products...
          </p>
        ) : filteredProducts.length === 0 ? (
          <p className="col-span-full text-center text-gray-300 text-lg">
            No products found.
          </p>
        ) : (
          filteredProducts.map((product, i) => (
            <motion.div
              key={product._id}
              initial="hidden"
              animate="visible"
              custom={i + 2}
              variants={fadeIn}
            >
              {/* 🧊 Glass Border Glow Wrapper */}
              <div className="p-[2px] rounded-3xl bg-gradient-to-br from-yellow-500 via-pink-500 to-indigo-600 hover:scale-[1.02] transition-transform duration-300 shadow-xl">
                <div className="bg-gray-900/80 backdrop-blur-xl rounded-3xl p-4">
                  <ProductCard product={product} />
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default Shop;
