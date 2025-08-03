# 📡 MarketHub API Documentation

## Base URL
- **Development**: `http://localhost:9876/api`
- **Production**: `https://your-api-domain.vercel.app/api`

## Authentication
Most endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Response Format
All API responses follow this format:
```json
{
  "success": true,
  "data": {},
  "message": "Success message"
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```

## 🔐 Authentication Endpoints

### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "jwt_token_here"
  },
  "message": "User registered successfully"
}
```

### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

## 🛒 Cart Endpoints

### Get Cart
```http
GET /api/cart
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "cart": [
    {
      "product": {
        "_id": "product_id",
        "name": "Product Name",
        "price": 29.99,
        "image": "image_url"
      },
      "quantity": 2,
      "addedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "message": "Cart retrieved successfully"
}
```

### Add to Cart
```http
POST /api/cart/add
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "product_id",
  "quantity": 1
}
```

### Update Cart Item
```http
PUT /api/cart/update
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "product_id",
  "quantity": 3
}
```

### Remove from Cart
```http
DELETE /api/cart/remove/:productId
Authorization: Bearer <token>
```

### Clear Cart
```http
DELETE /api/cart/clear
Authorization: Bearer <token>
```

### Get Cart Count
```http
GET /api/cart/count
Authorization: Bearer <token>
```

## ❤️ Wishlist Endpoints

### Get Wishlist
```http
GET /api/wishlist
Authorization: Bearer <token>
```

### Add to Wishlist
```http
POST /api/wishlist/add
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "product_id"
}
```

### Remove from Wishlist
```http
DELETE /api/wishlist/remove/:productId
Authorization: Bearer <token>
```

### Move to Cart
```http
POST /api/wishlist/move-to-cart/:productId
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 1
}
```

## 🛍️ Product Endpoints

### Get All Products
```http
GET /api/products?page=1&limit=10&category=electronics&search=phone
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `category`: Filter by category
- `search`: Search in name and description
- `minPrice`: Minimum price filter
- `maxPrice`: Maximum price filter
- `sort`: Sort by (price, name, createdAt)
- `order`: Sort order (asc, desc)

### Get Single Product
```http
GET /api/products/:id
```

### Create Product (Admin)
```http
POST /api/products
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "Product Name",
  "description": "Product description",
  "price": 29.99,
  "originalPrice": 39.99,
  "category": "electronics",
  "sku": "PROD-001",
  "images": [
    {
      "url": "image_url",
      "alt": "Image description"
    }
  ],
  "inventory": {
    "stock": 100,
    "lowStockThreshold": 10,
    "trackInventory": true
  },
  "specifications": {
    "color": "Black",
    "size": "Medium"
  }
}
```

## 📦 Order Endpoints

### Get User Orders
```http
GET /api/orders
Authorization: Bearer <token>
```

### Create Order
```http
POST /api/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [
    {
      "product": "product_id",
      "quantity": 2,
      "price": 29.99
    }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "paymentMethod": "credit_card"
}
```

## 👥 User Management (Admin)

### Get All Users
```http
GET /api/users
Authorization: Bearer <admin-token>
```

### Update User
```http
PUT /api/users/:id
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "role": "admin",
  "isEmailVerified": true
}
```

## 🏷️ Category Endpoints

### Get Categories
```http
GET /api/categories
```

### Create Category (Admin)
```http
POST /api/categories
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "Electronics",
  "description": "Electronic devices and gadgets",
  "image": "category_image_url"
}
```

## 🔍 Health Check

### Server Health
```http
GET /health
```

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600,
  "environment": "production"
}
```

## 📊 Error Codes

| Code | Description |
|------|-------------|
| 200  | Success |
| 201  | Created |
| 400  | Bad Request |
| 401  | Unauthorized |
| 403  | Forbidden |
| 404  | Not Found |
| 409  | Conflict |
| 422  | Validation Error |
| 429  | Too Many Requests |
| 500  | Internal Server Error |

## 🔒 Rate Limiting

- **Limit**: 100 requests per 15 minutes per IP
- **Headers**: 
  - `X-RateLimit-Limit`: Request limit
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Reset time

## 🧪 Testing Examples

### Using cURL

```bash
# Register user
curl -X POST http://localhost:9876/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"john@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:9876/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Get products
curl http://localhost:9876/api/products

# Add to cart (replace TOKEN with actual JWT)
curl -X POST http://localhost:9876/api/cart/add \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"productId":"PRODUCT_ID","quantity":1}'
```

### Using JavaScript (Frontend)

```javascript
// Login
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'password123'
  })
});

const { data } = await loginResponse.json();
const token = data.token;

// Add to cart
const cartResponse = await fetch('/api/cart/add', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    productId: 'product_id',
    quantity: 1
  })
});
```

---

**For more information, visit the [GitHub Repository](https://github.com/TouatiInes/-MarketHub-e-commerce)**
