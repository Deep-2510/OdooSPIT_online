const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const receiptRoutes = require('./routes/receiptRoutes');
const deliveryRoutes = require('./routes/deliveryRoutes');
const transferRoutes = require('./routes/transferRoutes');
const adjustmentRoutes = require('./routes/adjustmentRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const warehouseRoutes = require('./routes/warehouseRoutes');

// Import middleware
const { corsMiddleware, requestLogger } = require('./middleware/commonMiddleware');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();

// Environment variables
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/inventory-system';

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err);
    process.exit(1);
  });

// Middleware
app.use(corsMiddleware);
app.use(requestLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/receipts', receiptRoutes);
app.use('/api/deliveries', deliveryRoutes);
app.use('/api/transfers', transferRoutes);
app.use('/api/adjustments', adjustmentRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/warehouses', warehouseRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use(notFound);

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Database: ${MONGODB_URI}`);
});

module.exports = app;
