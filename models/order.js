const mongoose = require('mongoose');
const Counter = require('./Counter');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  orderNumber: {
    type: Number,
    unique: true,
    required: true
  },
  items: [{
    productName: {
      type: String,
      required: [true, 'Product name is required']
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1']
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative']
    }
  }],
  totalAmount: {
    type: Number,
    required: true,
    min: [0, 'Total amount cannot be negative']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'debit_card', 'paypal', 'cash_on_delivery'],
    required: [true, 'Payment method is required']
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  orderDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// ✅ Use `pre('validate')` instead of `pre('save')`
orderSchema.pre('validate', async function (next) {
  if (this.isNew && !this.orderNumber) {
    try {
      const counter = await Counter.findOneAndUpdate(
        { name: 'order' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      this.orderNumber = counter.seq;
    } catch (err) {
      return next(err);
    }
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
