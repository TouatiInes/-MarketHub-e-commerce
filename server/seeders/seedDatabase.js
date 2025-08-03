const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

// Import models
const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Order = require('../models/Order');

// Connect to database
const connectDB = require('../config/database');

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    console.log('🗑️ Clearing existing data...');
    await User.deleteMany({});
    await Product.deleteMany({});
    await Category.deleteMany({});
    await Order.deleteMany({});

    // Create admin user
    console.log('👤 Creating admin user...');
    const adminUser = new User({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@markethub.com',
      password: 'admin123',
      role: 'admin',
      isEmailVerified: true
    });
    await adminUser.save();

    // Create regular users
    console.log('👥 Creating regular users...');
    const users = [];
    for (let i = 1; i <= 5; i++) {
      const user = new User({
        firstName: `User${i}`,
        lastName: `Test`,
        email: `user${i}@example.com`,
        password: 'password123',
        phone: `+1555000000${i}`,
        isEmailVerified: true
      });
      await user.save();
      users.push(user);
    }

    // Create categories
    console.log('📂 Creating categories...');
    const categories = [
      {
        name: 'Electronics',
        description: 'Latest electronic devices and gadgets',
        icon: '📱',
        isFeatured: true,
        sortOrder: 1
      },
      {
        name: 'Fashion',
        description: 'Trendy clothing and accessories',
        icon: '👕',
        isFeatured: true,
        sortOrder: 2
      },
      {
        name: 'Home',
        description: 'Home decor and furniture',
        icon: '🏠',
        isFeatured: true,
        sortOrder: 3
      },
      {
        name: 'Sports',
        description: 'Sports equipment and fitness gear',
        icon: '⚽',
        isFeatured: true,
        sortOrder: 4
      },
      {
        name: 'Books',
        description: 'Books and educational materials',
        icon: '📚',
        sortOrder: 5
      },
      {
        name: 'Beauty',
        description: 'Beauty and personal care products',
        icon: '💄',
        sortOrder: 6
      }
    ];

    for (const categoryData of categories) {
      const category = new Category(categoryData);
      await category.save();
    }

    // Create products
    console.log('🛍️ Creating products...');
    const products = [
      // Electronics
      {
        name: 'Wireless Bluetooth Headphones',
        description: 'Premium quality wireless headphones with noise cancellation and 30-hour battery life.',
        shortDescription: 'Premium wireless headphones with noise cancellation',
        price: 199.99,
        originalPrice: 249.99,
        category: 'electronics',
        brand: 'AudioTech',
        sku: 'AT-WH-001',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
            alt: 'Wireless Bluetooth Headphones',
            isPrimary: true
          }
        ],
        inventory: { stock: 50 },
        featured: true,
        tags: ['wireless', 'bluetooth', 'headphones', 'audio'],
        createdBy: adminUser._id
      },
      {
        name: 'Smart Watch Series 5',
        description: 'Advanced smartwatch with health monitoring, GPS, and 7-day battery life.',
        shortDescription: 'Advanced smartwatch with health monitoring',
        price: 299.99,
        originalPrice: 399.99,
        category: 'electronics',
        brand: 'TechWear',
        sku: 'TW-SW-005',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
            alt: 'Smart Watch Series 5',
            isPrimary: true
          }
        ],
        inventory: { stock: 30 },
        featured: true,
        tags: ['smartwatch', 'fitness', 'health', 'gps'],
        createdBy: adminUser._id
      },
      // Fashion
      {
        name: 'Premium Cotton T-Shirt',
        description: 'Comfortable and stylish cotton t-shirt perfect for casual wear.',
        shortDescription: 'Comfortable cotton t-shirt for casual wear',
        price: 29.99,
        originalPrice: 39.99,
        category: 'fashion',
        brand: 'StyleCo',
        sku: 'SC-TS-001',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
            alt: 'Premium Cotton T-Shirt',
            isPrimary: true
          }
        ],
        variants: [
          {
            name: 'Color',
            options: ['Black', 'White', 'Navy', 'Gray']
          },
          {
            name: 'Size',
            options: ['S', 'M', 'L', 'XL', 'XXL']
          }
        ],
        inventory: { stock: 100 },
        tags: ['t-shirt', 'cotton', 'casual', 'comfortable'],
        createdBy: adminUser._id
      },
      {
        name: 'Designer Jeans',
        description: 'High-quality denim jeans with modern fit and premium finish.',
        shortDescription: 'High-quality denim jeans with modern fit',
        price: 89.99,
        originalPrice: 120.00,
        category: 'fashion',
        brand: 'DenimCraft',
        sku: 'DC-JN-001',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500',
            alt: 'Designer Jeans',
            isPrimary: true
          }
        ],
        variants: [
          {
            name: 'Size',
            options: ['28', '30', '32', '34', '36', '38']
          },
          {
            name: 'Color',
            options: ['Dark Blue', 'Light Blue', 'Black']
          }
        ],
        inventory: { stock: 75 },
        featured: true,
        tags: ['jeans', 'denim', 'fashion', 'designer'],
        createdBy: adminUser._id
      },
      // Home
      {
        name: 'Modern Coffee Table',
        description: 'Elegant modern coffee table perfect for contemporary living rooms.',
        shortDescription: 'Elegant modern coffee table for living rooms',
        price: 299.99,
        category: 'home',
        brand: 'HomeCraft',
        sku: 'HC-CT-001',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500',
            alt: 'Modern Coffee Table',
            isPrimary: true
          }
        ],
        shipping: {
          weight: 25,
          dimensions: { length: 120, width: 60, height: 45 },
          freeShipping: true
        },
        inventory: { stock: 20 },
        tags: ['furniture', 'coffee table', 'modern', 'living room'],
        createdBy: adminUser._id
      },
      // Sports
      {
        name: 'Professional Basketball',
        description: 'Official size basketball perfect for indoor and outdoor play.',
        shortDescription: 'Official size basketball for indoor/outdoor play',
        price: 49.99,
        category: 'sports',
        brand: 'SportsPro',
        sku: 'SP-BB-001',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500',
            alt: 'Professional Basketball',
            isPrimary: true
          }
        ],
        inventory: { stock: 60 },
        tags: ['basketball', 'sports', 'outdoor', 'professional'],
        createdBy: adminUser._id
      }
    ];

    for (const productData of products) {
      const product = new Product(productData);
      await product.save();
    }

    console.log('✅ Database seeded successfully!');
    console.log('📊 Created:');
    console.log(`   - 1 Admin user (admin@markethub.com / admin123)`);
    console.log(`   - 5 Regular users (user1@example.com / password123, etc.)`);
    console.log(`   - 6 Categories`);
    console.log(`   - 6 Products`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeder
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
