const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,

  cart: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: Number,
      addedAt: { type: Date, default: Date.now }
    }
  ],

  pendingOrders: [
    {
      orderId: mongoose.Schema.Types.ObjectId,
      items: [
        {
          productId: mongoose.Schema.Types.ObjectId,
          quantity: Number
        }
      ],
      orderedAt: { type: Date, default: Date.now }
    }
  ],

  deliveredOrders: [
    {
      orderId: mongoose.Schema.Types.ObjectId,
      items: [
        {
          productId: mongoose.Schema.Types.ObjectId,
          quantity: Number
        }
      ],
      deliveredAt: { type: Date, default: Date.now }
    }
  ]
});


module.exports = mongoose.model('User', userSchema);
