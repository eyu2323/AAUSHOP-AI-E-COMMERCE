
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './db.js';
import userroute from './userroute.js';
import productroute from './productroute.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors()); 
app.use(express.json()); 

// Routes
app.use('/api/users', userroute);
app.use('/api/products', productroute);

// Base Route
app.get('/', (req, res) => {
  res.send('AauShop MongoDB API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
