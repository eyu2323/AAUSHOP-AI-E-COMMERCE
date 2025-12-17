
import User from './user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists in the database' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      cart: [] 
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id)
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check for hardcoded admin first for convenience
    if (email === 'eyuzeed26@gmail.com' && password === '12345') {
       let user = await User.findOne({ email }).select('+password');
       if (!user) {
          // Auto-create admin if it doesn't exist
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash('12345', salt);
          user = await User.create({
            username: 'System Admin',
            email: 'eyuzeed26@gmail.com',
            password: hashedPassword,
            cart: []
          });
       }
       return res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        cart: user.cart,
        token: generateToken(user._id)
      });
    }

    const user = await User.findOne({ email }).select('+password');

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        cart: user.cart,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// New method for Admin Dashboard
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
    expiresIn: '30d',
  });
};
