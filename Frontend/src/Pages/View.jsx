import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ViewProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:3000/view/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 text-xl">
        Loading...
      </div>
    );
  }

  const imageList =
    product.images && product.images.length > 0
      ? [product.coverImage, ...product.images]
      : [product.coverImage];

  const handlePrev = () =>
    setCurrentImage((prev) => (prev === 0 ? imageList.length - 1 : prev - 1));

  const handleNext = () =>
    setCurrentImage((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      const res = await fetch("http://localhost:3000/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: product._id, quantity: 1 }),
      });
      const data = await res.json();
      if (res.ok) alert("✅ Added to cart!");
      else alert("❌ Failed: " + data.error);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white py-12 px-6 md:px-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Left: Image Section */}
        <div className="relative flex flex-col items-center">
          <div className="relative w-full h-[500px] rounded-3xl overflow-hidden shadow-2xl border border-gray-700 bg-gradient-to-tr from-gray-800/70 to-gray-900/70 backdrop-blur-md">
          <img
  src={imageList[currentImage]}
  alt={product.title}
  className="h-full w-full object-contain bg-gray-100 transition-transform duration-700"
/>

            {imageList.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/40 hover:bg-indigo-600 p-3 rounded-full shadow-lg transition"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/40 hover:bg-indigo-600 p-3 rounded-full shadow-lg transition"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3 mt-5">
            {imageList.map((img, idx) => (
             <img
  key={idx}
  src={img}
  alt={`thumb-${idx}`}
  onClick={() => setCurrentImage(idx)}
  className={`w-20 h-20 object-contain bg-gray-100 rounded-xl cursor-pointer transition-all border-2 ${
    currentImage === idx
      ? "border-indigo-500 shadow-lg scale-105"
      : "border-gray-700"
  }`}
/>

            ))}
          </div>
        </div>

        {/* Right: Product Details */}
        <div className="flex flex-col justify-start gap-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-yellow-400">
            {product.title}
          </h1>
          <p className="text-gray-400 text-lg">{product.category}</p>

          {/* Price */}
          <div className="flex items-center gap-4 text-2xl font-bold">
            <span className="text-indigo-400">
              ₹{product.discountPrice || product.price}
            </span>
            {product.discountPrice && (
              <span className="line-through text-gray-500">
                ₹{product.price}
              </span>
            )}
          </div>

          {/* Stock */}
          <p
            className={`text-lg font-medium ${
              product.inStock ? "text-green-400" : "text-red-500"
            }`}
          >
            {product.inStock ? "In Stock" : "Out of Stock"}
          </p>

          {/* Description */}
          <p className="text-gray-300 leading-relaxed">
            {product.description || "No description available."}
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4 mt-4">
            <button
              onClick={handleAddToCart}
              className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-pink-500 text-gray-900 font-semibold rounded-full shadow-lg hover:scale-105 transition transform"
            >
              Add to Cart
            </button>
            <button className="px-6 py-3 border border-gray-600 rounded-full hover:bg-gray-700 transition">
              Buy Now
            </button>
          </div>

          {/* Extra: Tags / Badges */}
          <div className="flex gap-3 mt-4 flex-wrap">
            {product.newProduct && (
              <span className="px-3 py-1 bg-indigo-600 text-white rounded-full shadow">
                New
              </span>
            )}
            {product.inStock || (
              <span className="px-3 py-1 bg-red-600 text-white rounded-full shadow">
                Out of Stock
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
