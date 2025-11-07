const express = require('express')
const app = express();
const mongoose = require('mongoose')
const cors = require('cors')
const connectDB = require('./config/mongo');
const User = require('./models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// Sirf ek lightweight schema (fields optional bhi chalenge)
const productSchema = new mongoose.Schema({}, { strict: false });
// strict: false = MongoDB me jo bhi fields hain wo sab fetch ho jayenge

const Product = mongoose.model("Product", productSchema, "products");

connectDB()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors({
  origin: 'http://localhost:5173',  
  credentials: true                
}));

const JWT_SECRET = 'sss';

app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: 'Email already exists' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Create JWT token
    const token = jwt.sign({ id: newUser._id, email: newUser.email }, JWT_SECRET, {
      expiresIn: '7d', // adjust as needed
    });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ error: 'Invalid email or password' });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ error: 'Invalid email or password' });

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.get("/featured", async (req, res) => {
  try {
    const featured = await Product.find({ featured: true });
    res.json(featured);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});
app.get("/hotdeals", async (req, res) => {
  try {
    const hotdeals = await Product.find({ hotDeals: true });
    res.json(hotdeals);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});
app.get("/view/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
});
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

app.get("/categories", async (req, res) => {
  try {
    const siteInfo = await mongoose.connection.db
      .collection("siteinfos") // 👈 tumhari MongoDB me collection ka actual naam (lowercase plural by default)
      .findOne({});

    if (!siteInfo || !siteInfo.categories) {
      return res.status(404).json({ error: "No categories found" });
    }

    res.json(["All", ...siteInfo.categories]);
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});
const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ error: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = user; // user attach kar rahe
    next();
  } catch (err) {
    res.status(401).json({ error: "Token is not valid" });
  }
};
app.post("/cart/add", authMiddleware, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const user = req.user;

    const quantityNum = parseInt(quantity) || 1;

    // ensure productId is string
    const existingItem = user.cart.find(
      (item) => item.product && item.product.toString() === productId.toString()
    );

    if (existingItem) {
      // agar already cart me hai, quantity badhao
      existingItem.quantity += quantityNum;
    } else {
      // agar nahi hai, new item push karo
      user.cart.push({ product: productId, quantity: quantityNum });
    }

    await user.save();
    res.json({ success: true, cart: user.cart });
  } catch (err) {
    console.error("Error adding to cart:", err);
    res.status(500).json({ error: "Failed to add to cart" });
  }
});


app.get("/cart", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("cart.product");
    const cart = user.cart
      .filter(item => item.product)
      .map(item => ({ quantity: item.quantity, product: item.product }));

    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
});
// ✅ Update cart quantity (PUT)
app.put("/cart/:productId", authMiddleware, async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const user = req.user;

    if (quantity < 1) {
      return res.status(400).json({ error: "Quantity must be at least 1" });
    }

    const item = user.cart.find(
      (item) => item.product && item.product.toString() === productId.toString()
    );

    if (!item) {
      return res.status(404).json({ error: "Product not found in cart" });
    }

    item.quantity = quantity;

    await user.save();

    // Return updated cart with product details populated
    const updatedUser = await User.findById(user._id).populate("cart.product");
    const updatedCart = updatedUser.cart
      .filter(item => item.product)
      .map(item => ({ quantity: item.quantity, product: item.product }));

    res.json(updatedCart);
  } catch (err) {
    console.error("Error updating cart:", err);
    res.status(500).json({ error: "Failed to update cart" });
  }
});


// ✅ Remove product from cart (DELETE)
app.delete("/cart/:productId", authMiddleware, async (req, res) => {
  try {
    const { productId } = req.params;
    const user = req.user;

    // Filter out the product
    user.cart = user.cart.filter(
      (item) => item.product && item.product.toString() !== productId.toString()
    );

    await user.save();
    res.json({ success: true, message: "Item removed from cart" });
  } catch (err) {
    console.error("Error removing from cart:", err);
    res.status(500).json({ error: "Failed to remove from cart" });
  }
});






app.get('/',function(req,res){
    res.send("working");
})
app.listen(3000)