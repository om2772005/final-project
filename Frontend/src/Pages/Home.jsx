import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ProductCard from "../Components/Productcard";
import { ShoppingBag, Sparkles } from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.7, ease: "easeOut" },
  }),
};

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [error, setError] = useState(null);

  const categories = [
    {
      title: "Men",
      image:
        "https://images.unsplash.com/photo-1600180758890-6b94519a8ba6?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Women",
      image:
        "https://hips.hearstapps.com/hmg-prod/images/single-women-happier-than-men-675ac891b545d.jpg?crop=0.670xw:1.00xh;0.247xw,0&resize=640:*",
    },
    {
      title: "Kids",
      image:
        "https://images.unsplash.com/photo-1627639679638-8485316a4b21?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Accessories",
      image:
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80",
    },
  ];

  // Fetch featured products
  useEffect(() => {
    fetch("http://localhost:3000/featured")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) setFeaturedProducts(data);
      })
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 text-gray-900">
     {/* Hero Section */}
<section className="relative overflow-hidden text-white py-24 px-6 md:px-16">
  {/* 🎥 Background Video */}
  <video
    className="absolute inset-0 w-full h-full object-cover"
    src="/bg.mov"
    autoPlay
    loop
    muted
    playsInline
  />

  {/* 🟣 Gradient Overlay */}
  <div className="absolute inset-0 bg-gradient-to-r from-indigo-800/80 via-purple-700/70 to-pink-600/80" />

  {/* 🟡 Texture Overlay (optional subtle effect) */}
  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diamond-upholstery.png')] opacity-10" />

  {/* Content */}
  <motion.div
    initial="hidden"
    animate="visible"
    variants={fadeIn}
    className="relative text-center max-w-3xl mx-auto z-10"
  >
    <h1 className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight">
      Discover Your <span className="text-yellow-300">Style</span>
    </h1>
    <p className="text-lg md:text-xl mb-8 opacity-90">
      Unleash the latest fashion & accessories designed for trendsetters like you.
    </p>
    <Link
      to="/shop"
      className="inline-flex items-center gap-2 px-8 py-3 text-lg font-semibold bg-white text-indigo-700 rounded-full shadow-lg hover:bg-gray-100 transition-all transform hover:scale-105"
    >
      <ShoppingBag size={22} /> Start Shopping
    </Link>
  </motion.div>
</section>


      {/* Categories Section */}
      <section className="py-16 px-6 md:px-16">
        <motion.h2
          className="text-4xl font-bold mb-12 text-center text-black"
          initial="hidden"
          animate="visible"
          custom={0}
          variants={fadeIn}
        >
          Shop by <span className="text-indigo-600">Category</span>
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.title}
              className="relative overflow-hidden rounded-3xl shadow-lg group cursor-pointer"
              initial="hidden"
              animate="visible"
              custom={i + 1}
              variants={fadeIn}
            >
              <img
                src={cat.image}
                alt={cat.title}
                className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                <h3 className="text-white text-2xl font-semibold">{cat.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 px-6 md:px-16 rounded-t-3xl shadow-inner">
        <motion.h2
          className="text-4xl font-bold mb-12 text-center text-white inline-block px-4 py-2"
          initial="hidden"
          animate="visible"
          custom={0}
          variants={fadeIn}
        >
          <Sparkles className="inline-block text-yellow-400 mr-2" />
          <span className="text-black">Featured</span> <span className="text-yellow-400">Products</span>
        </motion.h2>

        {error && (
          <p className="text-red-500 text-center mb-4">⚠️ {error}</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {featuredProducts.length > 0 ? (
            featuredProducts.map((product, i) => (
             <div className="p-[2px] rounded-3xl bg-gradient-to-br from-yellow-500 via-pink-500 to-indigo-600 hover:scale-[1.02] transition-transform duration-300 shadow-xl">
                <div className="bg-gray-900/80 backdrop-blur-xl rounded-3xl p-4">
                  <ProductCard product={product} />
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-200 text-lg">
              No featured products available.
            </p>
          )}
        </div>

        <div className="mt-12 flex justify-center">
          <Link
            to="/shop"
            className="px-8 py-3 bg-yellow-400 text-gray-900 rounded-full text-lg font-semibold hover:bg-yellow-500 transition-all transform hover:scale-105"
          >
            View All Products
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-16 py-8 bg-gray-900 text-gray-400 text-center">
        <p>© {new Date().getFullYear()} TrendyCart. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
