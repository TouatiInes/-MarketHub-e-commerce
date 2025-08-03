# 🖥️ MarketHub Server API

A robust Node.js/Express backend API for the MarketHub e-commerce platform with MongoDB integration.

## 🚀 Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (User/Admin)
- Password hashing with bcrypt
- Protected routes middleware

### 🛒 E-commerce Functionality
- **Products**: CRUD operations with search and filtering
- **Cart**: Add, update, remove items with persistence
- **Wishlist**: Save favorite products
- **Orders**: Order management and tracking
- **Categories**: Product categorization
- **Users**: User profile management

### 🔒 Security Features
- Helmet.js for security headers
- CORS configuration
- Rate limiting
- Input validation and sanitization
- MongoDB injection protection

### 📊 Additional Features
- Health check endpoint
- Error handling middleware
- Request logging with Morgan
- Environment-based configuration

## 🛠️ Installation

### Prerequisites
- Node.js 16+
- MongoDB (local or Atlas)
- npm or yarn

### Setup
```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit environment variables
nano .env

# Start development server
npm run dev

# Or start production server
npm start
```

## ⚙️ Environment Variables

```env
# Server Configuration
NODE_ENV=development
PORT=9876

# Database
MONGODB_URI=mongodb://localhost:27017/markethub

# JWT
JWT_SECRET=your-super-secure-jwt-secret-key
JWT_EXPIRE=7d

# Client
CLIENT_URL=http://localhost:5173

# Security
BCRYPT_ROUNDS=12
```

## 📡 API Endpoints

### Authentication
```
POST   /api/auth/register     - Register new user
POST   /api/auth/login        - User login
GET    /api/auth/me           - Get current user
PUT    /api/auth/profile      - Update profile
```

### Products
```
GET    /api/products          - Get all products
GET    /api/products/:id      - Get single product
POST   /api/products          - Create product (Admin)
PUT    /api/products/:id      - Update product (Admin)
DELETE /api/products/:id      - Delete product (Admin)
```

### Cart
```
GET    /api/cart              - Get user cart
POST   /api/cart/add          - Add item to cart
PUT    /api/cart/update       - Update cart item
DELETE /api/cart/remove/:id   - Remove cart item
DELETE /api/cart/clear        - Clear entire cart
GET    /api/cart/count        - Get cart item count
```

### Wishlist
```
GET    /api/wishlist          - Get user wishlist
POST   /api/wishlist/add      - Add item to wishlist
DELETE /api/wishlist/remove/:id - Remove wishlist item
DELETE /api/wishlist/clear    - Clear entire wishlist
GET    /api/wishlist/count    - Get wishlist count
POST   /api/wishlist/move-to-cart/:id - Move to cart
```

### Orders
```
GET    /api/orders            - Get user orders
POST   /api/orders            - Create new order
GET    /api/orders/:id        - Get single order
PUT    /api/orders/:id        - Update order status (Admin)
```

### Users (Admin)
```
GET    /api/users             - Get all users
GET    /api/users/:id         - Get single user
PUT    /api/users/:id         - Update user
DELETE /api/users/:id         - Delete user
```

### Categories
```
GET    /api/categories        - Get all categories
POST   /api/categories        - Create category (Admin)
PUT    /api/categories/:id    - Update category (Admin)
DELETE /api/categories/:id    - Delete category (Admin)
```

### Health Check
```
GET    /health                - Server health status
```

## 🗄️ Database Models

### User Model
```javascript
{
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  avatar: String,
  role: ['user', 'admin'],
  addresses: [AddressSchema],
  cart: [CartItemSchema],
  wishlist: [WishlistItemSchema],
  preferences: Object,
  timestamps: true
}
```

### Product Model
```javascript
{
  name: String,
  description: String,
  price: Number,
  originalPrice: Number,
  category: String,
  sku: String,
  images: [ImageSchema],
  inventory: {
    stock: Number,
    lowStockThreshold: Number,
    trackInventory: Boolean
  },
  specifications: Object,
  rating: Number,
  reviews: [ReviewSchema],
  status: ['active', 'inactive'],
  timestamps: true
}
```

## 🚀 Deployment

### Vercel Deployment
1. Create `vercel.json` in server directory
2. Set environment variables in Vercel dashboard
3. Deploy with `vercel --prod`

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/markethub
JWT_SECRET=your-production-secret
CLIENT_URL=https://your-frontend.vercel.app
```

### Docker Deployment (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 9876
CMD ["npm", "start"]
```

## 🧪 Testing

### Manual Testing
```bash
# Test server health
curl http://localhost:9876/health

# Test authentication
curl -X POST http://localhost:9876/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@markethub.com","password":"admin123"}'
```

### API Testing Tools
- Use Postman collection (if available)
- Built-in API tester at `/cart-test` (frontend)
- Thunder Client (VS Code extension)

## 📊 Performance

### Optimizations
- MongoDB indexing for faster queries
- Connection pooling
- Gzip compression
- Static file caching
- Rate limiting to prevent abuse

### Monitoring
- Health check endpoint for uptime monitoring
- Error logging and tracking
- Performance metrics collection

## 🔧 Development

### Scripts
```bash
npm start          # Production server
npm run dev        # Development with nodemon
npm run seed       # Seed database with sample data
```

### Code Structure
```
server/
├── config/         # Database configuration
├── middleware/     # Express middleware
├── models/         # MongoDB models
├── routes/         # API route handlers
├── seeders/        # Database seeders
├── .env.example    # Environment template
├── server.js       # Main server file
└── package.json    # Dependencies
```

## 🚨 Troubleshooting

### Common Issues

#### Database Connection
```bash
# Check MongoDB connection
node test-connection.js

# Verify environment variables
echo $MONGODB_URI
```

#### Authentication Issues
```bash
# Verify JWT secret is set
echo $JWT_SECRET

# Check user exists in database
mongo markethub --eval "db.users.find()"
```

#### CORS Issues
```bash
# Verify CLIENT_URL matches frontend
echo $CLIENT_URL

# Check CORS configuration in server.js
```

## 📞 Support

- 📧 Email: support@markethub.com
- 🐛 Issues: [GitHub Issues](https://github.com/TouatiInes/-MarketHub-e-commerce/issues)
- 📖 Docs: [API Documentation](./API_DOCS.md)

---

**Built with Node.js, Express, and MongoDB** 🚀
