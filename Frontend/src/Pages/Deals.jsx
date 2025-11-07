import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ProductCard from "../Components/Productcard";
import { Flame, Zap, Sparkles } from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" },
  }),
};

const Deals = () => {
  const [hotDeals, setHotDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch hot deals from backend
  useEffect(() => {
    const fetchHotDeals = async () => {
      try {
        const res = await fetch("http://localhost:3000/hotdeals", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch hot deals");
        const data = await res.json();
        setHotDeals(data);
      } catch (err) {
        console.error("Error fetching hot deals:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHotDeals();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white pt-24 px-6 md:px-16 pb-16 relative overflow-hidden">
      {/* 🔥 Floating Lights Effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-pink-500 rounded-full blur-3xl opacity-20 animate-pulse" />
        <div className="absolute top-40 right-0 w-96 h-96 bg-indigo-500 rounded-full blur-3xl opacity-20 animate-pulse" />
      </div>

      {/* Header */}
      <motion.div
        className="relative text-center z-10"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="flex justify-center mb-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/20 backdrop-blur-md">
            <Flame className="text-yellow-400 animate-pulse" size={22} />
            <span className="uppercase tracking-widest text-sm text-gray-200">
              Limited Time Offers
            </span>
          </div>
        </div>

        <h1 className="text-5xl font-extrabold mb-3 text-white drop-shadow-lg">
          Hot <span className="text-yellow-400">Deals</span>
        </h1>
        <p className="text-gray-300 max-w-xl mx-auto text-lg">
          Grab the most exciting fashion drops at unbeatable prices.
        </p>
      </motion.div>

      {/* Deals Grid */}
      <div className="relative mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 z-10">
        {loading ? (
          <motion.p
            className="col-span-full text-center text-gray-300 text-lg"
            initial="hidden"
            animate="visible"
            custom={1}
            variants={fadeIn}
          >
            Loading <Zap className="inline-block text-yellow-400 animate-spin" />{" "}
            deals...
          </motion.p>
        ) : hotDeals.length === 0 ? (
          <motion.p
            className="col-span-full text-center text-gray-300 text-lg"
            initial="hidden"
            animate="visible"
            custom={1}
            variants={fadeIn}
          >
            No hot deals right now. <Sparkles className="inline-block" />
          </motion.p>
        ) : (
          hotDeals.map((product, i) => (
            <motion.div
              key={product._id || i}
              initial="hidden"
              animate="visible"
              custom={i + 2}
              variants={fadeIn}
            >
              {/* 🔥 Glowing Border Card */}
              <div className="p-[2px] rounded-3xl bg-gradient-to-br from-yellow-500 via-pink-500 to-indigo-600 hover:scale-[1.02] transition-transform duration-300 shadow-xl">
                <div className="bg-gray-900/80 backdrop-blur-xl rounded-3xl p-4">
                  <ProductCard product={product} />
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Footer CTA */}
      <motion.div
        className="mt-16 text-center z-10"
        initial="hidden"
        animate="visible"
        custom={4}
        variants={fadeIn}
      >
        <button className="px-8 py-3 bg-yellow-400 text-gray-900 font-semibold text-lg rounded-full shadow-md hover:bg-yellow-300 transition-all transform hover:scale-105">
          View All Offers
        </button>
      </motion.div>
    </div>
  );
};

export default Deals;
