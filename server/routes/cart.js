const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Product = require('../models/Product');

// @route   GET /api/cart
// @desc    Get user's cart
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('cart.product');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      cart: user.cart || [],
      message: 'Cart retrieved successfully'
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while retrieving cart' 
    });
  }
});

// @route   POST /api/cart/add
// @desc    Add item to cart
// @access  Private
router.post('/add', auth, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Product ID is required' 
      });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }

    // Check stock availability
    if (product.inventory && product.inventory.stock < quantity) {
      return res.status(400).json({ 
        success: false, 
        message: 'Insufficient stock available' 
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Check if item already exists in cart
    const existingItemIndex = user.cart.findIndex(
      item => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Update quantity if item exists
      user.cart[existingItemIndex].quantity += parseInt(quantity);
    } else {
      // Add new item to cart
      user.cart.push({
        product: productId,
        quantity: parseInt(quantity),
        addedAt: new Date()
      });
    }

    await user.save();
    await user.populate('cart.product');

    res.json({
      success: true,
      cart: user.cart,
      message: 'Item added to cart successfully'
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while adding to cart' 
    });
  }
});

// @route   PUT /api/cart/update
// @desc    Update cart item quantity
// @access  Private
router.put('/update', auth, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || quantity === undefined) {
      return res.status(400).json({ 
        success: false, 
        message: 'Product ID and quantity are required' 
      });
    }

    if (quantity < 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Quantity cannot be negative' 
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    const itemIndex = user.cart.findIndex(
      item => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        message: 'Item not found in cart' 
      });
    }

    if (quantity === 0) {
      // Remove item if quantity is 0
      user.cart.splice(itemIndex, 1);
    } else {
      // Update quantity
      user.cart[itemIndex].quantity = parseInt(quantity);
    }

    await user.save();
    await user.populate('cart.product');

    res.json({
      success: true,
      cart: user.cart,
      message: 'Cart updated successfully'
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while updating cart' 
    });
  }
});

// @route   DELETE /api/cart/remove/:productId
// @desc    Remove item from cart
// @access  Private
router.delete('/remove/:productId', auth, async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    const itemIndex = user.cart.findIndex(
      item => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        message: 'Item not found in cart' 
      });
    }

    user.cart.splice(itemIndex, 1);
    await user.save();
    await user.populate('cart.product');

    res.json({
      success: true,
      cart: user.cart,
      message: 'Item removed from cart successfully'
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while removing from cart' 
    });
  }
});

// @route   DELETE /api/cart/clear
// @desc    Clear entire cart
// @access  Private
router.delete('/clear', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    user.cart = [];
    await user.save();

    res.json({
      success: true,
      cart: [],
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while clearing cart' 
    });
  }
});

// @route   GET /api/cart/count
// @desc    Get cart item count
// @access  Private
router.get('/count', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    const itemCount = user.cart.reduce((total, item) => total + item.quantity, 0);

    res.json({
      success: true,
      count: itemCount,
      message: 'Cart count retrieved successfully'
    });
  } catch (error) {
    console.error('Get cart count error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while getting cart count' 
    });
  }
});

module.exports = router;
