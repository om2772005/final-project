// src/pages/Orders.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Truck, Search } from "lucide-react";

export default function Orders() {
  const [orders, setOrders] = useState({ pending: [], delivered: [] });
  const [searchPending, setSearchPending] = useState("");
  const [searchDelivered, setSearchDelivered] = useState("");

  // Dummy data for demo
  useEffect(() => {
    const dummyOrders = [
      {
        _id: "ORD101",
        userName: "Amit Kumar",
        userEmail: "amit@example.com",
        productTitle: "Smartphone X1",
        quantity: 1,
        totalPrice: 14999,
        delivered: false,
      },
      {
        _id: "ORD102",
        userName: "Priya Sharma",
        userEmail: "priya@example.com",
        productTitle: "Wireless Earbuds",
        quantity: 2,
        totalPrice: 3999,
        delivered: false,
      },
      {
        _id: "ORD103",
        userName: "Ravi Singh",
        userEmail: "ravi@example.com",
        productTitle: "Gaming Laptop",
        quantity: 1,
        totalPrice: 79999,
        delivered: true,
      },
    ];

    setOrders({
      pending: dummyOrders.filter((o) => !o.delivered),
      delivered: dummyOrders.filter((o) => o.delivered),
    });
  }, []);

  // Mark as delivered (move from pending -> delivered)
  const markAsDelivered = (orderId) => {
    const order = orders.pending.find((o) => o._id === orderId);
    if (!order) return;

    setOrders((prev) => ({
      pending: prev.pending.filter((o) => o._id !== orderId),
      delivered: [...prev.delivered, { ...order, delivered: true }],
    }));
  };

  // Search filters
  const filteredPending = orders.pending.filter(
    (o) =>
      o._id.toLowerCase().includes(searchPending.toLowerCase()) ||
      o.userName.toLowerCase().includes(searchPending.toLowerCase())
  );

  const filteredDelivered = orders.delivered.filter(
    (o) =>
      o._id.toLowerCase().includes(searchDelivered.toLowerCase()) ||
      o.userName.toLowerCase().includes(searchDelivered.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-5xl mx-auto mt-10 space-y-8"
    >
      {/* Pending Orders */}
      <section className="bg-gradient-to-br from-zinc-900 via-gray-800 to-black p-6 rounded-2xl border border-gray-700 shadow-2xl">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-yellow-400">
          <Truck /> Pending Orders
        </h2>

        {/* Search Bar */}
        <div className="flex items-center gap-2 mb-4 bg-gray-800 rounded-lg px-3 py-2 border border-gray-700">
          <Search className="text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by Order ID or Name"
            value={searchPending}
            onChange={(e) => setSearchPending(e.target.value)}
            className="w-full bg-transparent outline-none text-white placeholder-gray-400"
          />
        </div>

        {filteredPending.length === 0 ? (
          <p className="text-gray-400">No pending orders.</p>
        ) : (
          <div className="text-white space-y-4">
            {filteredPending.map((order) => (
              <div
                key={order._id}
                className="p-4 bg-gray-800 rounded-xl border border-gray-700"
              >
                <p className=" font-semibold">Order ID: {order._id}</p>
                <p>User: {order.userName}</p>
                <p>Email: {order.userEmail}</p>
                <p>Product: {order.productTitle}</p>
                <p>Quantity: {order.quantity}</p>
                <p>Total: ₹{order.totalPrice}</p>
                <button
                  onClick={() => markAsDelivered(order._id)}
                  className="mt-3 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500 transition font-semibold shadow-md flex items-center gap-2"
                >
                  <CheckCircle size={18} /> Mark as Delivered
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Delivered Orders */}
      <section className="bg-gradient-to-br from-zinc-900 via-gray-800 to-black p-6 rounded-2xl border border-gray-700 shadow-2xl">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-green-400">
          <CheckCircle /> Delivered Orders
        </h2>

        {/* Search Bar */}
        <div className="flex items-center gap-2 mb-4 bg-gray-800 rounded-lg px-3 py-2 border border-gray-700">
          <Search className="text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by Order ID or Name"
            value={searchDelivered}
            onChange={(e) => setSearchDelivered(e.target.value)}
            className="w-full bg-transparent outline-none text-white placeholder-gray-400"
          />
        </div>

        {filteredDelivered.length === 0 ? (
          <p className="text-gray-400">No delivered orders yet.</p>
        ) : (
          <div className="text-white space-y-4">
            {filteredDelivered.map((order) => (
              <div
                key={order._id}
                className="p-4 bg-gray-800 rounded-xl border border-gray-700"
              >
                <p className="font-semibold">Order ID: {order._id}</p>
                <p>User: {order.userName}</p>
                <p>Email: {order.userEmail}</p>
                <p>Product: {order.productTitle}</p>
                <p>Quantity: {order.quantity}</p>
                <p>Total: ₹{order.totalPrice}</p>
                <p className="text-green-400 mt-2">✔ Delivered</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </motion.div>
  );
}
