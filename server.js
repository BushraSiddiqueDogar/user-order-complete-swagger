const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/databese');
const { createDefaultAdmin } = require('./utils/createDefaultAdmin');
const setupSwagger = require('./swagger');

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to DB
connectDB();

// Create default admin
createDefaultAdmin();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Setup
setupSwagger(app);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// 404
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
  });
});

app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
  console.log(` Swagger docs available at http://localhost:${PORT}/api-docs`);
});

module.exports = app;
