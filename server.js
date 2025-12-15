import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register routes BEFORE database connection
app.use('/api/users', userRoutes);

// Error handling middleware - must be AFTER routes
app.use((err, req, res, next) => {
  console.error('=== ERROR CAUGHT ===');
  console.error('Message:', err.message);
  console.error('Stack:', err.stack);
  console.error('===================');
  res.status(500).json({ 
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

mongoose.set('bufferCommands', false);

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('MongoDB Atlas connected');

    const PORT = process.env.PORT || 8070;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

startServer();