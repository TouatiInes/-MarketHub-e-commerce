# 🗄️ MongoDB Setup Guide for MarketHub

This guide will help you set up MongoDB for your MarketHub e-commerce application.

## 📋 Prerequisites

- Node.js 16+ installed
- Git installed
- Internet connection

## 🚀 Option 1: MongoDB Atlas (Cloud - Recommended)

### Step 1: Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Click "Try Free" and create an account
3. Verify your email address

### Step 2: Create a Cluster
1. Choose "Build a Database"
2. Select "M0 Sandbox" (Free tier)
3. Choose your preferred cloud provider and region
4. Name your cluster (e.g., "markethub-cluster")
5. Click "Create Cluster"

### Step 3: Create Database User
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `markethub-admin`
5. Password: Generate a secure password
6. Database User Privileges: "Read and write to any database"
7. Click "Add User"

### Step 4: Configure Network Access
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Choose "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### Step 5: Get Connection String
1. Go to "Database" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password

### Step 6: Update Environment Variables
Update your `.env` file:
```env
MONGODB_URI=mongodb+srv://markethub-admin:<password>@markethub-cluster.xxxxx.mongodb.net/markethub
```

## 🖥️ Option 2: Local MongoDB Installation

### Windows Installation
1. Download MongoDB Community Server from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. Run the installer and follow the setup wizard
3. Choose "Complete" installation
4. Install MongoDB as a service
5. Install MongoDB Compass (GUI tool)

### macOS Installation
```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb/brew/mongodb-community
```

### Linux (Ubuntu) Installation
```bash
# Import MongoDB public GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Create list file for MongoDB
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Update package database
sudo apt-get update

# Install MongoDB
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Local Environment Variables
Update your `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/markethub
```

## 🌱 Database Seeding

After setting up MongoDB, seed your database with sample data:

```bash
# Navigate to server directory
cd server

# Install dependencies (if not already done)
npm install

# Seed the database
npm run seed
```

This will create:
- 1 Admin user: `admin@markethub.com` / `admin123`
- 5 Regular users: `user1@example.com` / `password123` (etc.)
- 6 Product categories
- 6 Sample products

## 🚀 Starting the Server

### Development Mode
```bash
# In the server directory
npm run dev
```

### Production Mode
```bash
# In the server directory
npm start
```

The server will start on `http://localhost:5000`

## 📊 Database Schema Overview

### Collections Created:
- **users** - User accounts and authentication
- **products** - Product catalog with images, pricing, inventory
- **orders** - Customer orders and order history
- **categories** - Product categories and subcategories

### Key Features:
- **Authentication** - JWT-based user authentication
- **Authorization** - Role-based access control (user/admin)
- **Product Management** - Full CRUD operations for products
- **Order Management** - Complete order lifecycle
- **Cart & Wishlist** - User shopping cart and wishlist functionality
- **Reviews & Ratings** - Product reviews and rating system
- **Search & Filtering** - Advanced product search and filtering

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Products
- `GET /api/products` - Get all products (with filtering)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/status` - Update order status (admin only)

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (admin only)
- `PUT /api/categories/:id` - Update category (admin only)
- `DELETE /api/categories/:id` - Delete category (admin only)

## 🧪 Testing the API

### Using curl:
```bash
# Test server health
curl http://localhost:5000/health

# Register a new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"john@example.com","password":"password123"}'

# Get all products
curl http://localhost:5000/api/products
```

### Using Postman:
1. Import the API endpoints
2. Set base URL to `http://localhost:5000`
3. For protected routes, add Authorization header: `Bearer <your-jwt-token>`

## 🔒 Security Features

- **Password Hashing** - bcryptjs with salt rounds
- **JWT Authentication** - Secure token-based authentication
- **Rate Limiting** - API rate limiting to prevent abuse
- **CORS Protection** - Cross-origin resource sharing configuration
- **Helmet Security** - Security headers and protection
- **Input Validation** - Mongoose schema validation
- **Error Handling** - Comprehensive error handling middleware

## 📈 Performance Optimizations

- **Database Indexing** - Optimized indexes for fast queries
- **Pagination** - Efficient pagination for large datasets
- **Population** - Selective field population to reduce data transfer
- **Caching** - Ready for Redis caching implementation
- **Connection Pooling** - MongoDB connection pooling

## 🚨 Troubleshooting

### Common Issues:

1. **Connection Failed**
   - Check MongoDB service is running
   - Verify connection string in `.env`
   - Check network access (for Atlas)

2. **Authentication Error**
   - Verify database user credentials
   - Check IP whitelist (for Atlas)

3. **Seeding Fails**
   - Ensure database is empty before seeding
   - Check all required environment variables

4. **Server Won't Start**
   - Check if port 5000 is available
   - Verify all dependencies are installed
   - Check `.env` file configuration

### Getting Help:
- Check server logs for detailed error messages
- Verify MongoDB connection in MongoDB Compass
- Test API endpoints with Postman or curl

## ✅ Verification Checklist

- [ ] MongoDB is installed and running
- [ ] Database connection string is configured
- [ ] Environment variables are set
- [ ] Server dependencies are installed
- [ ] Database is seeded with sample data
- [ ] Server starts without errors
- [ ] API endpoints respond correctly
- [ ] Frontend can connect to backend

Your MarketHub database is now ready for development! 🎉
