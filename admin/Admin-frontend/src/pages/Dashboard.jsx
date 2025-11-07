// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Package, Users, ShoppingCart } from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState({
    products: 0,
    users: 0,
    orders: 0,
  });

  const [recentProducts, setRecentProducts] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);

  useEffect(() => {
    async function fetchData() {
      // 🔹 Total products + recent 10
      const prodRes = await fetch("http://localhost:3000/view"); // apna backend URL
      const allProducts = await prodRes.json();
      setStats((prev) => ({ ...prev, products: allProducts.length })); // total count
      setRecentProducts(allProducts.slice(-10).reverse()); // last 10 products

      // 🔹 Total users
      const userRes = await fetch("/api/users"); // yahan bhi tumhara backend endpoint
      const users = await userRes.json();
      setStats((prev) => ({ ...prev, users: users.length }));
      setRecentUsers(users.slice(-5).reverse()); // last 5 users

      // 🔹 Total orders
      const orderRes = await fetch("/api/orders");
      const orders = await orderRes.json();
      setStats((prev) => ({ ...prev, orders: orders.length }));
    }
    fetchData();
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.6 },
    }),
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-purple-500 to-indigo-600 bg-clip-text text-transparent">
        Dashboard Overview 🚀
      </h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[
          { title: "Total Products", value: stats.products, icon: Package, color: "from-pink-500 to-rose-500" },
          { title: "Total Users", value: stats.users, icon: Users, color: "from-green-500 to-emerald-500" },
          { title: "Total Orders", value: stats.orders, icon: ShoppingCart, color: "from-blue-500 to-indigo-500" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="bg-white shadow-lg rounded-2xl p-6 flex items-center gap-4 hover:shadow-2xl transition-all"
          >
            <div
              className={`p-4 rounded-xl bg-gradient-to-r ${stat.color} text-white shadow-md`}
            >
              <stat.icon size={28} />
            </div>
            <div>
              <h3 className="text-lg font-semibold">{stat.title}</h3>
              <p className="text-3xl font-bold">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>
{/* Recent Activity */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Recent Products */}
  <motion.div
    variants={cardVariants}
    initial="hidden"
    animate="visible"
    className="bg-white shadow-lg rounded-2xl p-6"
  >
    <h3 className="text-xl font-bold mb-4">🛍️ Recent Products </h3>

    {/* Card Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {recentProducts.map((p) => (
        <div
          key={p._id}
          className="border rounded-xl shadow-md p-4 hover:shadow-lg transition bg-gray-50"
        >
          {/* Product Image */}
          {p.image && (
            <img
              src={p.image}
              alt={p.title}
              className="w-full h-32 object-cover rounded-lg mb-3"
            />
          )}

          {/* Product Info */}
          <h4 className="font-semibold text-lg">{p.title}</h4>
          <p className="text-gray-600 text-sm mb-2">
            {p.description?.slice(0, 50)}...
          </p>

          {/* Price + Date */}
          <div className="flex justify-between items-center">
            <span className="text-indigo-600 font-bold">₹{p.price}</span>
            {p.createdAt && (
              <span className="text-xs text-gray-500">
                {new Date(p.createdAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  </motion.div>

  {/* Recent Users (unchanged) */}
  <motion.div
    variants={cardVariants}
    initial="hidden"
    animate="visible"
    className="bg-white shadow-lg rounded-2xl p-6"
  >
    <h3 className="text-xl font-bold mb-4">👤 Recent Users</h3>
    <ul className="space-y-3">
      {recentUsers.map((u) => (
        <li
          key={u._id}
          className="flex justify-between items-center border-b pb-2"
        >
          <span className="font-medium">{u.name}</span>
          <span className="text-gray-600">{u.email}</span>
        </li>
      ))}
    </ul>
  </motion.div>
</div>

    </div>
  );
}
