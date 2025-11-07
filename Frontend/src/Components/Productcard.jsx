import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ProductCard = ({ product, i, fadeIn }) => {
  const navigate = useNavigate();

  // Merge coverImage + images[]
  const imageList =
    product.images && product.images.length > 0
      ? [product.coverImage, ...product.images.map(img => img.url || img)]
      : [product.coverImage];

  const [currentImage, setCurrentImage] = useState(0);

  const handlePrev = () => {
    setCurrentImage(prev => (prev === 0 ? imageList.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentImage(prev => (prev === imageList.length - 1 ? 0 : prev + 1));
  };

  return (
    <motion.div
      key={product._id}
      className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl overflow-hidden shadow-lg hover:shadow-yellow-400/30 transition-all duration-500 hover:-translate-y-2 cursor-pointer"
      initial="hidden"
      animate="visible"
      custom={i}
      variants={fadeIn}
      onClick={() => navigate(`/product/${product._id}`)}
    >
      {/* Image Slider */}
      <div className="relative w-full h-64 overflow-hidden group rounded-t-3xl">
        <img
          src={imageList[currentImage]}
          alt={product.title}
          className="h-full w-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Arrows */}
        {imageList.length > 1 && (
          <>
            <button
              onClick={e => { e.stopPropagation(); handlePrev(); }}
              className="absolute top-1/2 left-3 -translate-y-1/2 z-10 bg-white/20 hover:bg-yellow-400/80 text-white hover:text-gray-900 p-2 rounded-full border border-white/30 backdrop-blur-md transition"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={e => { e.stopPropagation(); handleNext(); }}
              className="absolute top-1/2 right-3 -translate-y-1/2 z-10 bg-white/20 hover:bg-yellow-400/80 text-white hover:text-gray-900 p-2 rounded-full border border-white/30 backdrop-blur-md transition"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}

        {/* New Badge */}
        {product.newProduct && (
          <span className="absolute top-3 right-3 bg-yellow-400 text-gray-900 text-xs font-semibold px-3 py-1 rounded-full shadow">
            New
          </span>
        )}
      </div>

      {/* Product Details */}
      <div className="p-5 text-white">
        <h3 className="text-lg font-semibold mb-1">{product.title}</h3>
        <p className="text-gray-300 text-sm mb-2">{product.category}</p>

        <div className="flex items-center gap-3 mb-3">
          <p className="text-yellow-400 font-bold text-xl">
            ₹{product.discountPrice || product.price}
          </p>
          {product.discountPrice && (
            <p className="line-through text-gray-400 text-sm">₹{product.price}</p>
          )}
        </div>

        <p
          className={`text-sm font-medium mb-4 ${
            product.inStock ? "text-green-400" : "text-red-400"
          }`}
        >
          {product.inStock ? "In Stock" : "Out of Stock"}
        </p>
      </div>

      {/* Glow Border */}
      <div className="absolute inset-0 rounded-3xl border border-transparent group-hover:border-yellow-400/60 transition-all duration-500"></div>
    </motion.div>
  );
};

export default ProductCard;
