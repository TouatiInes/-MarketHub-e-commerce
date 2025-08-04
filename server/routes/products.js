const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// @route   GET /api/products
// @desc    Get all products with filtering, sorting, and pagination
// @access  Public
router.get('/', async (req, res) => {
  try {
    console.log('📊 Products route called with query:', req.query);

    const {
      page = 1,
      limit = 12,
      category,
      search,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      featured,
      inStock
    } = req.query;

    // Use direct MongoDB connection to avoid Mongoose issues
    const mongoose = require('mongoose');
    const db = mongoose.connection.db;

    if (!db) {
      throw new Error('Database connection not available');
    }

    // Build query
    const query = { status: 'active' };

    // Category filter
    if (category && category !== 'all') {
      query.category = category;
    }

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Featured filter
    if (featured === 'true') {
      query.featured = true;
    }

    // In stock filter
    if (inStock === 'true') {
      query['inventory.stock'] = { $gt: 0 };
    }

    console.log('📋 Query:', query);

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination using direct MongoDB
    const products = await db.collection('products')
      .find(query)
      .sort(sortOptions)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .toArray();

    // Get total count for pagination
    const total = await db.collection('products').countDocuments(query);

    console.log('✅ Found products:', products.length, 'Total:', total);

    res.json({
      success: true,
      data: products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('❌ Get products error:', error.message);
    console.error('📋 Stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching products: ' + error.message
    });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('createdBy', 'firstName lastName')
      .populate('reviews.user', 'firstName lastName avatar');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Increment view count
    product.viewCount += 1;
    await product.save();

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Get product error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while fetching product'
    });
  }
});

// @route   POST /api/products
// @desc    Create new product
// @access  Private/Admin
router.post('/', [auth, admin], async (req, res) => {
  try {
    const {
      name,
      description,
      shortDescription,
      price,
      originalPrice,
      category,
      subcategory,
      brand,
      sku,
      images,
      specifications,
      variants,
      inventory,
      shipping,
      tags,
      featured,
      status
    } = req.body;

    // Validate required fields
    if (!name || !description || !price || !category || !sku) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, description, price, category, sku'
      });
    }

    // Helper function to generate unique SKU
    const generateUniqueSku = async (baseSku) => {
      const db = mongoose.connection.db;
      let uniqueSku = baseSku.toUpperCase().trim();
      let counter = 1;

      while (await db.collection('products').findOne({ sku: uniqueSku })) {
        uniqueSku = `${baseSku.toUpperCase().trim()}-${counter.toString().padStart(3, '0')}`;
        counter++;
        if (counter > 999) {
          throw new Error('Unable to generate unique SKU');
        }
      }
      return uniqueSku;
    };

    // Get database connection
    const mongoose = require('mongoose');
    const db = mongoose.connection.db;

    if (!db) {
      throw new Error('Database connection not available');
    }

    // Generate unique SKU if needed
    let finalSku;
    try {
      finalSku = await generateUniqueSku(sku);
      if (finalSku !== sku.toUpperCase().trim()) {
        console.log(`📝 Generated unique SKU: ${finalSku} (original: ${sku})`);
      }
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Unable to generate unique SKU. Please try a different SKU.'
      });
    }

    // Validate price
    if (price <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Price must be greater than 0'
      });
    }

    // Validate original price if provided
    if (originalPrice && originalPrice <= price) {
      return res.status(400).json({
        success: false,
        message: 'Original price must be greater than current price'
      });
    }

    // Helper function to generate unique slug
    const generateUniqueSlug = async (name) => {
      const baseSlug = name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');

      let uniqueSlug = baseSlug;
      let counter = 1;

      while (await db.collection('products').findOne({ 'seo.slug': uniqueSlug })) {
        uniqueSlug = `${baseSlug}-${counter}`;
        counter++;
        if (counter > 999) {
          throw new Error('Unable to generate unique slug');
        }
      }
      return uniqueSlug;
    };

    // Generate unique slug
    let finalSlug;
    try {
      finalSlug = await generateUniqueSlug(name);
      if (finalSlug !== name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '')) {
        console.log(`📝 Generated unique slug: ${finalSlug}`);
      }
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Unable to generate unique slug. Please try a different product name.'
      });
    }

    // Create product data
    const productData = {
      name: name.trim(),
      description: description.trim(),
      shortDescription: shortDescription?.trim(),
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      category: category.toLowerCase(),
      subcategory: subcategory?.trim(),
      brand: brand?.trim(),
      sku: finalSku,
      images: images || [],
      specifications: specifications || [],
      variants: variants || [],
      inventory: {
        stock: inventory?.stock || 0,
        lowStockThreshold: inventory?.lowStockThreshold || 10,
        trackInventory: inventory?.trackInventory !== false
      },
      shipping: shipping || {},
      seo: {
        slug: finalSlug
      },
      rating: {
        average: 0,
        count: 0
      },
      tags: tags ? tags.map(tag => tag.toLowerCase().trim()) : [],
      featured: featured === true,
      status: status || 'active',
      salesCount: 0,
      viewCount: 0,
      createdBy: req.user.id,
      reviews: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Insert product using direct MongoDB
    const result = await db.collection('products').insertOne(productData);

    // Get the created product
    const product = await db.collection('products').findOne({ _id: result.insertedId });

    console.log('✅ Product created successfully:', product.name);

    res.status(201).json({
      success: true,
      data: product,
      message: 'Product created successfully'
    });
  } catch (error) {
    console.error('❌ Create product error:', error.message);
    console.error('📋 Stack:', error.stack);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Product with this SKU or slug already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while creating product: ' + error.message
    });
  }
});

// @route   PUT /api/products/:id
// @desc    Update product
// @access  Private/Admin
router.put('/:id', [auth, admin], async (req, res) => {
  try {
    const productId = req.params.id;

    // Check if product exists
    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const {
      name,
      description,
      shortDescription,
      price,
      originalPrice,
      category,
      subcategory,
      brand,
      sku,
      images,
      specifications,
      variants,
      inventory,
      shipping,
      tags,
      featured,
      status
    } = req.body;

    // Prepare update data
    const updateData = {};

    // Update basic fields if provided
    if (name !== undefined) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (shortDescription !== undefined) updateData.shortDescription = shortDescription?.trim();
    if (category !== undefined) updateData.category = category.toLowerCase();
    if (subcategory !== undefined) updateData.subcategory = subcategory?.trim();
    if (brand !== undefined) updateData.brand = brand?.trim();
    if (tags !== undefined) updateData.tags = tags.map(tag => tag.toLowerCase().trim());
    if (featured !== undefined) updateData.featured = featured === true;
    if (status !== undefined) updateData.status = status;

    // Validate and update price
    if (price !== undefined) {
      if (price <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Price must be greater than 0'
        });
      }
      updateData.price = Number(price);
    }

    // Validate and update original price
    if (originalPrice !== undefined) {
      const currentPrice = price !== undefined ? Number(price) : existingProduct.price;
      if (originalPrice && originalPrice <= currentPrice) {
        return res.status(400).json({
          success: false,
          message: 'Original price must be greater than current price'
        });
      }
      updateData.originalPrice = originalPrice ? Number(originalPrice) : undefined;
    }

    // Update SKU if provided (check for duplicates)
    if (sku !== undefined) {
      const skuUpper = sku.toUpperCase().trim();
      if (skuUpper !== existingProduct.sku) {
        const existingSku = await Product.findOne({ sku: skuUpper, _id: { $ne: productId } });
        if (existingSku) {
          return res.status(400).json({
            success: false,
            message: 'Product with this SKU already exists'
          });
        }
        updateData.sku = skuUpper;
      }
    }

    // Update complex fields
    if (images !== undefined) updateData.images = images;
    if (specifications !== undefined) updateData.specifications = specifications;
    if (variants !== undefined) updateData.variants = variants;
    if (shipping !== undefined) updateData.shipping = { ...existingProduct.shipping, ...shipping };

    // Update inventory
    if (inventory !== undefined) {
      updateData.inventory = {
        stock: inventory.stock !== undefined ? inventory.stock : existingProduct.inventory.stock,
        lowStockThreshold: inventory.lowStockThreshold !== undefined ? inventory.lowStockThreshold : existingProduct.inventory.lowStockThreshold,
        trackInventory: inventory.trackInventory !== undefined ? inventory.trackInventory : existingProduct.inventory.trackInventory
      };
    }

    // Perform the update
    const product = await Product.findByIdAndUpdate(
      productId,
      updateData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'firstName lastName email');

    res.json({
      success: true,
      data: product,
      message: 'Product updated successfully'
    });
  } catch (error) {
    console.error('Update product error:', error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Product with this SKU already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while updating product'
    });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete product
// @access  Private/Admin
router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting product'
    });
  }
});

// @route   POST /api/products/:id/reviews
// @desc    Add product review
// @access  Private
router.post('/:id/reviews', auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user already reviewed this product
    const existingReview = product.reviews.find(
      review => review.user.toString() === req.user.id
    );

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product'
      });
    }

    const review = {
      user: req.user.id,
      name: `${req.user.firstName} ${req.user.lastName}`,
      rating: Number(rating),
      comment
    };

    product.reviews.push(review);
    product.updateRating();
    await product.save();

    res.status(201).json({
      success: true,
      message: 'Review added successfully'
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding review'
    });
  }
});

// @route   PATCH /api/products/:id/status
// @desc    Update product status (active/inactive/discontinued)
// @access  Private/Admin
router.patch('/:id/status', [auth, admin], async (req, res) => {
  try {
    const { status } = req.body;

    if (!['active', 'inactive', 'discontinued'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be: active, inactive, or discontinued'
      });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product,
      message: `Product status updated to ${status}`
    });
  } catch (error) {
    console.error('Update product status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating product status'
    });
  }
});

// @route   PATCH /api/products/:id/inventory
// @desc    Update product inventory
// @access  Private/Admin
router.patch('/:id/inventory', [auth, admin], async (req, res) => {
  try {
    const { stock, lowStockThreshold, trackInventory } = req.body;

    const updateData = {};
    if (stock !== undefined) updateData['inventory.stock'] = Number(stock);
    if (lowStockThreshold !== undefined) updateData['inventory.lowStockThreshold'] = Number(lowStockThreshold);
    if (trackInventory !== undefined) updateData['inventory.trackInventory'] = Boolean(trackInventory);

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product,
      message: 'Product inventory updated successfully'
    });
  } catch (error) {
    console.error('Update product inventory error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating product inventory'
    });
  }
});

// @route   PATCH /api/products/:id/featured
// @desc    Toggle product featured status
// @access  Private/Admin
router.patch('/:id/featured', [auth, admin], async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    product.featured = !product.featured;
    await product.save();

    res.json({
      success: true,
      data: product,
      message: `Product ${product.featured ? 'added to' : 'removed from'} featured products`
    });
  } catch (error) {
    console.error('Toggle featured error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating featured status'
    });
  }
});

// @route   POST /api/products/bulk
// @desc    Create multiple products
// @access  Private/Admin
router.post('/bulk', [auth, admin], async (req, res) => {
  try {
    const { products } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Products array is required and must not be empty'
      });
    }

    if (products.length > 100) {
      return res.status(400).json({
        success: false,
        message: 'Cannot create more than 100 products at once'
      });
    }

    const results = {
      created: [],
      errors: []
    };

    for (let i = 0; i < products.length; i++) {
      try {
        const productData = {
          ...products[i],
          createdBy: req.user.id
        };

        const product = new Product(productData);
        await product.save();
        results.created.push({
          index: i,
          product: product
        });
      } catch (error) {
        results.errors.push({
          index: i,
          error: error.message,
          product: products[i]
        });
      }
    }

    res.status(201).json({
      success: true,
      data: results,
      message: `Bulk operation completed. Created: ${results.created.length}, Errors: ${results.errors.length}`
    });
  } catch (error) {
    console.error('Bulk create error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during bulk product creation'
    });
  }
});

// @route   DELETE /api/products/bulk
// @desc    Delete multiple products
// @access  Private/Admin
router.delete('/bulk', [auth, admin], async (req, res) => {
  try {
    const { productIds } = req.body;

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Product IDs array is required and must not be empty'
      });
    }

    const result = await Product.deleteMany({
      _id: { $in: productIds }
    });

    res.json({
      success: true,
      data: {
        deletedCount: result.deletedCount,
        requestedCount: productIds.length
      },
      message: `${result.deletedCount} products deleted successfully`
    });
  } catch (error) {
    console.error('Bulk delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during bulk product deletion'
    });
  }
});

module.exports = router;
