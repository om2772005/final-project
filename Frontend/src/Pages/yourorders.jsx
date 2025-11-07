import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function YourOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("http://localhost:3000/orders", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-xl text-gray-500 animate-pulse">
          Loading your orders...
        </p>
      </div>
    );

  if (orders.length === 0)
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <img
          src="https://cdn-icons-png.flaticon.com/512/10997/10997830.png"
          alt="No Orders"
          className="w-40 opacity-70 mb-6"
        />
        <h2 className="text-2xl font-semibold text-gray-600 mb-3">
          No orders yet 😔
        </h2>
        <p className="text-gray-500">Start shopping and place your first order!</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
          Your Orders
        </h1>

        <div className="space-y-8">
          {orders.map((order, i) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white border rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6"
            >
              <div className="flex flex-wrap justify-between items-center mb-4">
                <div>
                  <p className="text-gray-600 text-sm">
                    Order ID: <span className="font-semibold">{order._id}</span>
                  </p>
                  <p className="text-gray-600 text-sm">
                    Date:{" "}
                    <span className="font-semibold">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </p>
                </div>
                <div>
                  <span
                    className={`px-4 py-1 rounded-full text-sm font-semibold ${
                      order.status === "Delivered"
                        ? "bg-green-100 text-green-700"
                        : order.status === "Processing"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {order.status || "Processing"}
                  </span>
                </div>
              </div>

              <div className="divide-y">
                {order.items.map((item) => (
                  <div
                    key={item.product._id}
                    className="flex flex-col sm:flex-row items-center justify-between py-4"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={item.product.coverImage}
                        alt={item.product.title}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {item.product.title}
                        </h3>
                        <p className="text-gray-500 text-sm">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>

                    <p className="text-lg font-bold text-indigo-600 mt-2 sm:mt-0">
                      ₹
                      {(item.product.discountPrice || item.product.price) *
                        item.quantity}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center mt-4 pt-4 border-t">
                <p className="text-gray-600">
                  Total:{" "}
                  <span className="text-lg font-semibold text-gray-800">
                    ₹
                    {order.items.reduce(
                      (sum, item) =>
                        sum +
                        (item.product.discountPrice || item.product.price) *
                          item.quantity,
                      0
                    )}
                  </span>
                </p>
                <button className="px-5 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition">
                  View Details
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
