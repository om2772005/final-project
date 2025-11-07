import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch("http://localhost:3000/cart", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch cart");
        const data = await res.json();
        setCartItems(data);
      } catch (err) {
        console.error("Error fetching cart:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      const res = await fetch(`http://localhost:3000/cart/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });
      if (!res.ok) throw new Error("Failed to update quantity");
      const updatedCart = await res.json();
      setCartItems(updatedCart);
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const res = await fetch(`http://localhost:3000/cart/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) throw new Error("Failed to remove item");
      setCartItems((prev) =>
        prev.filter((item) => item.product._id !== productId)
      );
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  const total = cartItems.reduce(
    (sum, item) =>
      sum +
      (item.product.discountPrice || item.product.price) * item.quantity,
    0
  );

  const handleCheckout = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setShowSuccess(true);
    }, 1500);
  };
  const handleshoworders = () => {
    setShowSuccess(false);
    window.location.href = "/orders";
  }

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-xl text-gray-600 animate-pulse">Loading cart...</div>
      </div>
    );

  if (cartItems.length === 0)
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <img
          src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png"
          alt="Empty cart"
          className="w-40 opacity-70 mb-6"
        />
        <h2 className="text-2xl font-semibold text-gray-600 mb-4">
          Your cart is empty 😔
        </h2>
        <Link
          to="/"
          className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full hover:scale-105 transition-transform duration-300"
        >
          Continue Shopping
        </Link>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
      <div className="max-w-5xl mx-auto py-10 px-4">
        <h1 className="text-4xl font-bold mb-10 text-gray-800 text-center">
          Your Shopping Cart
        </h1>

        <div className="space-y-6">
          {cartItems.map((item, i) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col sm:flex-row items-center bg-white border rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-5"
            >
              <img
                src={item.product.coverImage}
                alt={item.product.title}
                className="w-32 h-32 object-cover rounded-xl"
              />
              <div className="flex-1 sm:ml-6 mt-4 sm:mt-0 text-center sm:text-left">
                <h2 className="text-xl font-semibold text-gray-800">
                  {item.product.title}
                </h2>
                <p className="text-gray-500">{item.product.category}</p>
                <p className="text-lg font-semibold text-indigo-600 mt-1">
                  ₹
                  {item.product.discountPrice
                    ? item.product.discountPrice
                    : item.product.price}
                </p>

                <div className="flex items-center justify-center sm:justify-start gap-4 mt-3">
                  <button
                    onClick={() =>
                      updateQuantity(item.product._id, item.quantity - 1)
                    }
                    className="w-8 h-8 flex items-center justify-center bg-gray-200 text-gray-700 rounded-full text-lg hover:bg-gray-300"
                  >
                    –
                  </button>
                  <span className="text-lg font-medium">{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateQuantity(item.product._id, item.quantity + 1)
                    }
                    className="w-8 h-8 flex items-center justify-center bg-gray-200 text-gray-700 rounded-full text-lg hover:bg-gray-300"
                  >
                    +
                  </button>

                  <button
                    onClick={() => removeFromCart(item.product._id)}
                    className="ml-4 text-red-500 font-semibold hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <p className="text-xl font-bold text-gray-800 mt-4 sm:mt-0">
                ₹
                {(item.product.discountPrice || item.product.price) *
                  item.quantity}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Floating Total Section */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t shadow-lg py-4 px-6 flex justify-between items-center">
        <p className="text-2xl font-bold text-gray-800">
          Total: <span className="text-indigo-600">₹{total}</span>
        </p>

        <button
          onClick={handleCheckout}
          disabled={processing}
          className={`px-8 py-3 rounded-full font-semibold transition-transform duration-300 shadow-md ${
            processing
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:scale-105"
          }`}
        >
          {processing ? "Processing Payment..." : "Proceed to Checkout"}
        </button>
      </div>

      {/* ✅ Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-2xl p-10 text-center shadow-2xl w-[90%] sm:w-[400px]"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/190/190411.png"
                alt="success"
                className="w-20 mx-auto mb-4"
              />
              <h2 className="text-2xl font-bold text-emerald-600 mb-2">
                Order Successful 🎉
              </h2>
              <p className="text-gray-600 mb-6">
                Your order has been placed successfully.  
                Thank you for shopping with us!
              </p>
              <button
                onClick={handleshoworders}
                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full hover:scale-105 transition-transform duration-300"
              >
                Show Orders
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
