const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      phone
    });

    await user.save();

    // Generate JWT token
    const token = user.generateAuthToken();

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      data: {
        user: userResponse,
        token
      },
      message: 'User registered successfully'
    });
  } catch (error) {
    console.error('Register error:', error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = user.generateAuthToken();

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      success: true,
      data: {
        user: userResponse,
        token
      },
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    console.log('👤 Get current user request:', req.user.id);

    // Use direct MongoDB operations to avoid Mongoose buffering issues
    const mongoose = require('mongoose');
    const db = mongoose.connection.db;

    if (!db) {
      throw new Error('Database connection not available');
    }

    // Get user with populated cart and wishlist
    const userAggregation = await db.collection('users').aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(req.user.id) } },
      {
        $lookup: {
          from: 'products',
          localField: 'cart.product',
          foreignField: '_id',
          as: 'cartProducts'
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: 'wishlist',
          foreignField: '_id',
          as: 'wishlistProducts'
        }
      },
      {
        $addFields: {
          cart: {
            $map: {
              input: '$cart',
              as: 'cartItem',
              in: {
                product: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: '$cartProducts',
                        cond: { $eq: ['$$this._id', '$$cartItem.product'] }
                      }
                    },
                    0
                  ]
                },
                quantity: '$$cartItem.quantity',
                addedAt: '$$cartItem.addedAt'
              }
            }
          },
          wishlist: '$wishlistProducts'
        }
      },
      {
        $project: {
          cartProducts: 0,
          wishlistProducts: 0,
          password: 0
        }
      }
    ]).toArray();

    const user = userAggregation[0];

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Filter out cart items with null products
    if (user.cart) {
      user.cart = user.cart.filter(item => item.product);
    }

    console.log('✅ User data retrieved successfully');

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('❌ Get current user error:', error.message);
    console.error('📋 Stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user data: ' + error.message
    });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
  try {
    const allowedUpdates = ['firstName', 'lastName', 'phone', 'avatar', 'preferences'];
    const updates = {};

    // Filter allowed updates
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: user,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Update profile error:', error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while updating profile'
    });
  }
});

// @route   PUT /api/auth/change-password
// @desc    Change user password
// @access  Private
router.put('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new password'
      });
    }

    // Get user with password
    const user = await User.findById(req.user.id).select('+password');

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while changing password'
    });
  }
});

// @route   POST /api/auth/cart
// @desc    Add item to cart
// @access  Private
router.post('/cart', auth, async (req, res) => {
  try {
    console.log('📦 Add to cart request:', { userId: req.user.id, body: req.body });

    const { productId, quantity = 1 } = req.body;

    // Use direct MongoDB operations to avoid Mongoose buffering issues
    const mongoose = require('mongoose');
    const db = mongoose.connection.db;

    if (!db) {
      throw new Error('Database connection not available');
    }

    // Get user with direct MongoDB query
    const user = await db.collection('users').findOne({
      _id: new mongoose.Types.ObjectId(req.user.id)
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Initialize cart if it doesn't exist
    if (!user.cart) {
      user.cart = [];
    }

    // Check if item already in cart
    const existingItemIndex = user.cart.findIndex(
      item => item.product.toString() === productId
    );

    if (existingItemIndex !== -1) {
      // Update existing item quantity
      user.cart[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      user.cart.push({
        product: new mongoose.Types.ObjectId(productId),
        quantity: quantity,
        addedAt: new Date()
      });
    }

    // Update user in database
    await db.collection('users').updateOne(
      { _id: new mongoose.Types.ObjectId(req.user.id) },
      {
        $set: {
          cart: user.cart,
          updatedAt: new Date()
        }
      }
    );

    // Get updated cart with product details
    const updatedUser = await db.collection('users').aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(req.user.id) } },
      { $unwind: { path: '$cart', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'products',
          localField: 'cart.product',
          foreignField: '_id',
          as: 'cart.productDetails'
        }
      },
      {
        $addFields: {
          'cart.product': { $arrayElemAt: ['$cart.productDetails', 0] }
        }
      },
      { $group: {
        _id: '$_id',
        cart: { $push: '$cart' }
      }}
    ]).toArray();

    const cartData = updatedUser[0]?.cart?.filter(item => item.product) || [];

    console.log('✅ Cart updated successfully:', cartData.length, 'items');

    res.json({
      success: true,
      data: cartData,
      message: 'Item added to cart'
    });
  } catch (error) {
    console.error('❌ Add to cart error:', error.message);
    console.error('📋 Stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Server error while adding to cart: ' + error.message
    });
  }
});

// @route   DELETE /api/auth/cart/:productId
// @desc    Remove item from cart
// @access  Private
router.delete('/cart/:productId', auth, async (req, res) => {
  try {
    console.log('🗑️ Remove from cart request:', { userId: req.user.id, productId: req.params.productId });

    // Use direct MongoDB operations
    const mongoose = require('mongoose');
    const db = mongoose.connection.db;

    if (!db) {
      throw new Error('Database connection not available');
    }

    // Get user
    const user = await db.collection('users').findOne({
      _id: new mongoose.Types.ObjectId(req.user.id)
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Filter out the item to remove
    const updatedCart = (user.cart || []).filter(
      item => item.product.toString() !== req.params.productId
    );

    // Update user in database
    await db.collection('users').updateOne(
      { _id: new mongoose.Types.ObjectId(req.user.id) },
      {
        $set: {
          cart: updatedCart,
          updatedAt: new Date()
        }
      }
    );

    // Get updated cart with product details
    const updatedUser = await db.collection('users').aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(req.user.id) } },
      { $unwind: { path: '$cart', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'products',
          localField: 'cart.product',
          foreignField: '_id',
          as: 'cart.productDetails'
        }
      },
      {
        $addFields: {
          'cart.product': { $arrayElemAt: ['$cart.productDetails', 0] }
        }
      },
      { $group: {
        _id: '$_id',
        cart: { $push: '$cart' }
      }}
    ]).toArray();

    const cartData = updatedUser[0]?.cart?.filter(item => item.product) || [];

    console.log('✅ Item removed from cart successfully:', cartData.length, 'items remaining');

    res.json({
      success: true,
      data: cartData,
      message: 'Item removed from cart'
    });
  } catch (error) {
    console.error('❌ Remove from cart error:', error.message);
    console.error('📋 Stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Server error while removing from cart: ' + error.message
    });
  }
});

module.exports = router;
