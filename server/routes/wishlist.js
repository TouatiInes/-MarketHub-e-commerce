const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Product = require('../models/Product');

// @route   GET /api/wishlist
// @desc    Get user's wishlist
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('wishlist.product');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      wishlist: user.wishlist || [],
      message: 'Wishlist retrieved successfully'
    });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while retrieving wishlist' 
    });
  }
});

// @route   POST /api/wishlist/add
// @desc    Add item to wishlist
// @access  Private
router.post('/add', auth, async (req, res) => {
  try {
    const { productId } = req.body;

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

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Check if item already exists in wishlist
    const existingItem = user.wishlist.find(
      item => item.product.toString() === productId
    );

    if (existingItem) {
      return res.status(400).json({ 
        success: false, 
        message: 'Item already in wishlist' 
      });
    }

    // Add new item to wishlist
    user.wishlist.push({
      product: productId,
      addedAt: new Date()
    });

    await user.save();
    await user.populate('wishlist.product');

    res.json({
      success: true,
      wishlist: user.wishlist,
      message: 'Item added to wishlist successfully'
    });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while adding to wishlist' 
    });
  }
});

// @route   DELETE /api/wishlist/remove/:productId
// @desc    Remove item from wishlist
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

    const itemIndex = user.wishlist.findIndex(
      item => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        message: 'Item not found in wishlist' 
      });
    }

    user.wishlist.splice(itemIndex, 1);
    await user.save();
    await user.populate('wishlist.product');

    res.json({
      success: true,
      wishlist: user.wishlist,
      message: 'Item removed from wishlist successfully'
    });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while removing from wishlist' 
    });
  }
});

// @route   DELETE /api/wishlist/clear
// @desc    Clear entire wishlist
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

    user.wishlist = [];
    await user.save();

    res.json({
      success: true,
      wishlist: [],
      message: 'Wishlist cleared successfully'
    });
  } catch (error) {
    console.error('Clear wishlist error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while clearing wishlist' 
    });
  }
});

// @route   GET /api/wishlist/count
// @desc    Get wishlist item count
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

    const itemCount = user.wishlist.length;

    res.json({
      success: true,
      count: itemCount,
      message: 'Wishlist count retrieved successfully'
    });
  } catch (error) {
    console.error('Get wishlist count error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while getting wishlist count' 
    });
  }
});

// @route   POST /api/wishlist/move-to-cart/:productId
// @desc    Move item from wishlist to cart
// @access  Private
router.post('/move-to-cart/:productId', auth, async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity = 1 } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Check if item exists in wishlist
    const wishlistItemIndex = user.wishlist.findIndex(
      item => item.product.toString() === productId
    );

    if (wishlistItemIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        message: 'Item not found in wishlist' 
      });
    }

    // Check if product exists and has stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }

    if (product.inventory && product.inventory.stock < quantity) {
      return res.status(400).json({ 
        success: false, 
        message: 'Insufficient stock available' 
      });
    }

    // Add to cart
    const existingCartItemIndex = user.cart.findIndex(
      item => item.product.toString() === productId
    );

    if (existingCartItemIndex > -1) {
      user.cart[existingCartItemIndex].quantity += parseInt(quantity);
    } else {
      user.cart.push({
        product: productId,
        quantity: parseInt(quantity),
        addedAt: new Date()
      });
    }

    // Remove from wishlist
    user.wishlist.splice(wishlistItemIndex, 1);

    await user.save();
    await user.populate(['cart.product', 'wishlist.product']);

    res.json({
      success: true,
      cart: user.cart,
      wishlist: user.wishlist,
      message: 'Item moved from wishlist to cart successfully'
    });
  } catch (error) {
    console.error('Move to cart error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while moving item to cart' 
    });
  }
});

module.exports = router;
