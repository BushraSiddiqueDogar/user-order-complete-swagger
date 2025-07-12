const Order = require('../models/order');
const User = require('../models/User');
const { sendOrderConfirmationEmail } = require('../utils/emailService');

// Create new order (User only - for their own orders)
const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    // Fallback to dummy user if req.user is undefined
    let user = req.user;

    if (!user) {
      user = await User.findOne({ email: 'user@example.com' });

      if (!user) {
        user = await User.create({
          name: 'Test User',
          email: 'user@example.com',
          password: 'user1234',
          role: 'user',
          phone: '0000000000',
          address: {
            street: '123 Main St',
            city: 'Test City',
            state: 'TS',
            zipCode: '12345',
            country: 'Testland'
          }
        });
      }
    }

    // Validate items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Items must be a non-empty array'
      });
    }

    for (const item of items) {
      if (!item.productName || item.quantity < 1 || item.price < 0) {
        return res.status(400).json({
          success: false,
          message: 'Each item must have a valid productName, quantity ≥ 1, and price ≥ 0'
        });
      }
    }

    // Calculate total amount
    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const order = new Order({
      user: user._id,
      items,
      totalAmount,
      shippingAddress,
      paymentMethod
    });

    await order.save();
    await order.populate('user', 'name email');

    // Send confirmation email
    try {
      await sendOrderConfirmationEmail(user.email, user.name, order);
    } catch (emailError) {
      console.log('Order confirmation email failed:', emailError.message);
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get all orders (Admin can see all, User can see only their own)
const getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (status) filter.status = status;

    if (req.user && req.user.role !== 'admin') {
      filter.user = req.user._id;
    }

    const skip = (page - 1) * limit;

    const orders = await Order.find(filter)
      .populate('user', 'name email')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const totalOrders = await Order.countDocuments(filter);

    res.json({
      success: true,
      data: orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalOrders / limit),
        totalOrders,
        hasNext: page * limit < totalOrders,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get order by ID
const getOrderById = async (req, res) => {
  try {
    const filter = { _id: req.params.id };

    if (req.user && req.user.role !== 'admin') {
      filter.user = req.user._id;
    }

    const order = await Order.findOne(filter).populate('user', 'name email phone');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Cancel order
const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const filter = { _id: id };

    if (req.user && req.user.role !== 'admin') {
      filter.user = req.user._id;
    }

    const order = await Order.findOne(filter);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.status !== 'pending' && order.status !== 'confirmed') {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled at this stage'
      });
    }

    order.status = 'cancelled';
    await order.save();
    await order.populate('user', 'name email');

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Delete order
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  cancelOrder,
  deleteOrder
};
