
import express from 'express';
import { registerUser, loginUser, getUsers } from './userController.js';
import { getCart, updateCart } from './cartController.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Private/Admin routes
router.get('/', getUsers); // Admin access to all user docs
router.get('/cart', getCart);
router.post('/cart', updateCart);

export default router;
