
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    default: 0
  },
  currency: {
    type: String,
    default: 'ETB'
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: ['Electronics', 'Fashion', 'Home & Living', 'Gadgets', 'Wellness']
  },
  image: {
    type: String,
    required: [true, 'Product image URL is required']
  },
  rating: {
    type: Number,
    default: 4.5
  },
  tags: {
    type: [String],
    default: []
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Optional: tracks who added the product
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Create an index for faster searching
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

const Product = mongoose.model('Product', productSchema);
export default Product;
