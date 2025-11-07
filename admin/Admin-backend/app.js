import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import Product from "./models/Product.js";
import connectDB from "./Config/db.js";
import SiteInfo from "./models/Info.js";
import cors from "cors";
import user from "./models/user.js";
import cloudinary from "./Config/cloudinary.js";

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDB();

// Multer storage config for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "products", // Cloudinary folder
      resource_type: "auto", // auto detect (image/video/pdf)
      public_id: Date.now() + "-" + file.originalname.split(".")[0],
    };
  },
});

const upload = multer({ storage });

// Add Product
app.post(
  "/add",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  async (req, res) => {
    try {
      const {
        title,
        price,
        discountPrice,
        description,
        inStock,
        featured,
        hotDeals,
        newProduct,
        category,
      } = req.body;

      const coverImage = req.files["coverImage"]
        ? req.files["coverImage"][0].path // ✅ Cloudinary URL
        : null;

      const images = req.files["images"]
        ? req.files["images"].map((file) => file.path) // ✅ Cloudinary URLs
        : [];

      const product = new Product({
        title,
        coverImage,
        images,
        price,
        discountPrice,
        description,
        inStock: inStock === "true",
        featured: featured === "true",
        hotDeals: hotDeals === "true",
        newProduct: newProduct === "true",
        category,
      });

      await product.save();
      res.status(201).json({ message: "✅ Product added", product });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server Error" });
    }
  }
);



app.get("/view", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
});
app.put("/editproducts/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // 👈 return updated doc
    );
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: "Error updating product" });
  }
});

app.delete("/delete/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "🗑️ Product deleted" });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
});
app.get("/site-info", async (req, res) => {
  try {
    let info = await SiteInfo.findOne();
    if (!info) {
      // If no info exists, create a default document
      info = await SiteInfo.create({
        siteName: "My Site",
        categories: [],
        contactEmail: "",
        contactPhone: "",
        address: "",
        socialLinks: {},
        about: "",
        policies: [],
      });
    }
    res.status(200).json(info);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching site info" });
  }
});

// PUT /api/site-info -> Update site info (admin)
app.put("/site-info", async (req, res) => {
  try {
    const info = await SiteInfo.findOne();
    if (!info) return res.status(404).json({ message: "Site info not found" });

    Object.assign(info, req.body); // Merge updates
    await info.save();
    res.status(200).json(info);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error updating site info" });
  }
});
app.get("/users", async (req, res) => {
  try {
    const users = await user.find()
      .populate("cart.product", "title price discountPrice")
      .populate("pendingOrders.items.productId", "title price discountPrice")
      .populate("deliveredOrders.items.productId", "title price discountPrice");

    const formatted = users.map((u) => ({
      _id: u._id,
      name: u.name,
      email: u.email,
      createdAt: u.createdAt,
      
      // 🛒 Cart
      cart: u.cart.map((c) => ({
        id: c._id,
        name: c.product?.title || "Unknown",
        price: c.product?.discountPrice || c.product?.price || 0,
        qty: c.quantity,
      })),

      // ⏳ Pending Orders
      pendingOrders: u.pendingOrders.map((order) => ({
        orderId: order._id.toString(),
        date: new Date(order.orderedAt || order.createdAt || Date.now()).toLocaleDateString(),
        products: order.items.map((p) => ({
          name: p.productId?.title || "Unknown",
          price: p.productId?.discountPrice || p.productId?.price || 0,
          qty: p.quantity,
        })),
      })),

      // ✅ Delivered Orders
      previousOrders: u.deliveredOrders.map((order) => ({
        orderId: order._id.toString(),
        date: new Date(order.deliveredAt || order.createdAt || Date.now()).toLocaleDateString(),
        products: order.items.map((p) => ({
          name: p.productId?.title || "Unknown",
          price: p.productId?.discountPrice || p.productId?.price || 0,
          qty: p.quantity,
        })),
      })),
    }));

    res.json(formatted);
    console.log("✅ Users fetched successfully:", formatted);
  } catch (err) {
    console.error("❌ Error fetching users:", err);
    res.status(500).json({ message: "Server error while fetching users" });
  }
});


app.listen(3000)


