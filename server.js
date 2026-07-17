require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();

// ==========================================================
// 1. Global Middleware (Enhanced Security Controls)
// ==========================================================
app.use(cors({
  // Allows fallback to Vite dev portal or your deployed URL
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================================================
// 2. Database Connection Infrastructure
// ==========================================================
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/gym-reviews-simple';

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('🎯 Connected to MongoDB successfully.'))
  .catch((err) => {
    console.error('❌ Database connection error:', err.message);
    process.exit(1); // Exit process immediately if database is unreachable
  });

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected.');
});

// ==========================================================
// 3. Routing Rules Matrix
// ==========================================================
app.use('/api/reviews', reviewRoutes);

// System Telemetry Monitoring Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    success: true, 
    status: 'Operational',
    dbState: mongoose.connection.readyState 
  });
});

// ==========================================================
// 4. Global Error Catchment Interceptor
// ==========================================================
app.use((err, req, res, next) => {
  console.error('🔥 Server Intercepted Error:', err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong inside the telemetry system runtime.',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// ==========================================================
// 5. App Runtime Bootstrap Execution
// ==========================================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 FitReview API engine successfully operating on port ${PORT}`));