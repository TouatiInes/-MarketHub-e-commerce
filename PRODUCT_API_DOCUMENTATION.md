# 🛍️ Product Management API Documentation

This document provides comprehensive documentation for the MarketHub Product Management API endpoints.

## 📋 Table of Contents

1. [Authentication](#authentication)
2. [Product Endpoints](#product-endpoints)
3. [Request/Response Examples](#request-response-examples)
4. [Error Handling](#error-handling)
5. [Frontend Integration](#frontend-integration)

## 🔐 Authentication

All product management endpoints require authentication. Admin-only endpoints require admin role.

### Headers Required:
```javascript
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <jwt_token>"
}
```

## 🛍️ Product Endpoints

### 1. Get All Products
**GET** `/api/products`

**Access:** Public  
**Description:** Retrieve products with filtering, sorting, and pagination

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 12)
- `category` (string): Filter by category
- `search` (string): Search in name, description, tags
- `minPrice` (number): Minimum price filter
- `maxPrice` (number): Maximum price filter
- `sortBy` (string): Sort field (default: 'createdAt')
- `sortOrder` (string): 'asc' or 'desc' (default: 'desc')
- `featured` (boolean): Filter featured products
- `inStock` (boolean): Filter products in stock

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "product_id",
      "name": "Product Name",
      "description": "Product description",
      "price": 99.99,
      "category": "electronics",
      "images": [...],
      "inventory": {...},
      "rating": {...}
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 100,
    "pages": 9
  }
}
```

### 2. Get Single Product
**GET** `/api/products/:id`

**Access:** Public  
**Description:** Get detailed product information

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "product_id",
    "name": "Product Name",
    "description": "Detailed description",
    "shortDescription": "Brief summary",
    "price": 99.99,
    "originalPrice": 129.99,
    "category": "electronics",
    "subcategory": "smartphones",
    "brand": "TechBrand",
    "sku": "TECH-001",
    "images": [
      {
        "url": "https://example.com/image.jpg",
        "alt": "Product image",
        "isPrimary": true
      }
    ],
    "specifications": [
      {
        "name": "Color",
        "value": "Black"
      }
    ],
    "variants": [
      {
        "name": "Size",
        "options": ["S", "M", "L"]
      }
    ],
    "inventory": {
      "stock": 50,
      "lowStockThreshold": 10,
      "trackInventory": true
    },
    "shipping": {
      "weight": 0.5,
      "freeShipping": true,
      "shippingCost": 0
    },
    "reviews": [...],
    "rating": {
      "average": 4.5,
      "count": 25
    },
    "tags": ["electronics", "smartphone"],
    "featured": true,
    "status": "active",
    "createdBy": "admin_user_id",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 3. Create Product
**POST** `/api/products`

**Access:** Admin Only  
**Description:** Create a new product

**Request Body:**
```json
{
  "name": "New Product",
  "description": "Product description",
  "shortDescription": "Brief summary",
  "price": 99.99,
  "originalPrice": 129.99,
  "category": "electronics",
  "subcategory": "smartphones",
  "brand": "TechBrand",
  "sku": "TECH-002",
  "images": [
    {
      "url": "https://example.com/image.jpg",
      "alt": "Product image",
      "isPrimary": true
    }
  ],
  "specifications": [
    {
      "name": "Color",
      "value": "Blue"
    }
  ],
  "variants": [
    {
      "name": "Size",
      "options": ["S", "M", "L"]
    }
  ],
  "inventory": {
    "stock": 100,
    "lowStockThreshold": 10,
    "trackInventory": true
  },
  "shipping": {
    "weight": 0.5,
    "freeShipping": false,
    "shippingCost": 9.99
  },
  "tags": ["electronics", "new"],
  "featured": false,
  "status": "active"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "new_product_id",
    // ... full product object
  },
  "message": "Product created successfully"
}
```

### 4. Update Product
**PUT** `/api/products/:id`

**Access:** Admin Only  
**Description:** Update existing product (partial updates supported)

**Request Body:** Same as create, but all fields are optional

### 5. Delete Product
**DELETE** `/api/products/:id`

**Access:** Admin Only  
**Description:** Delete a product

**Response:**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

### 6. Update Product Status
**PATCH** `/api/products/:id/status`

**Access:** Admin Only  
**Description:** Update product status

**Request Body:**
```json
{
  "status": "active" // "active", "inactive", or "discontinued"
}
```

### 7. Update Product Inventory
**PATCH** `/api/products/:id/inventory`

**Access:** Admin Only  
**Description:** Update product inventory

**Request Body:**
```json
{
  "stock": 75,
  "lowStockThreshold": 5,
  "trackInventory": true
}
```

### 8. Toggle Featured Status
**PATCH** `/api/products/:id/featured`

**Access:** Admin Only  
**Description:** Toggle product featured status

**Response:**
```json
{
  "success": true,
  "data": {
    // ... updated product
  },
  "message": "Product added to featured products"
}
```

### 9. Bulk Create Products
**POST** `/api/products/bulk`

**Access:** Admin Only  
**Description:** Create multiple products at once (max 100)

**Request Body:**
```json
{
  "products": [
    {
      "name": "Product 1",
      "description": "Description 1",
      // ... product data
    },
    {
      "name": "Product 2",
      "description": "Description 2",
      // ... product data
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "created": [
      {
        "index": 0,
        "product": { /* product object */ }
      }
    ],
    "errors": [
      {
        "index": 1,
        "error": "Validation error message",
        "product": { /* failed product data */ }
      }
    ]
  },
  "message": "Bulk operation completed. Created: 1, Errors: 1"
}
```

### 10. Bulk Delete Products
**DELETE** `/api/products/bulk`

**Access:** Admin Only  
**Description:** Delete multiple products

**Request Body:**
```json
{
  "productIds": ["id1", "id2", "id3"]
}
```

### 11. Add Product Review
**POST** `/api/products/:id/reviews`

**Access:** Authenticated Users  
**Description:** Add a review to a product

**Request Body:**
```json
{
  "rating": 5,
  "comment": "Great product!"
}
```

## 🔧 Frontend Integration

### Using the Product Service

```javascript
import { productService } from '../services/productService';

// Get products with filters
const products = await productService.getProducts({
  category: 'electronics',
  search: 'smartphone',
  page: 1,
  limit: 12
});

// Create a product (admin only)
const newProduct = await productService.createProduct({
  name: 'New Product',
  description: 'Product description',
  price: 99.99,
  category: 'electronics',
  sku: 'PROD-001'
});

// Update product status
await productService.updateProductStatus(productId, 'inactive');

// Toggle featured status
await productService.toggleProductFeatured(productId);
```

### Admin Components

1. **ProductManagement**: Complete admin interface for managing products
2. **ProductForm**: Modal form for creating/editing products
3. **ApiTester**: Testing interface for API endpoints

### Usage in App:

```javascript
// Add to your routing
case 'admin':
  return <ProductManagement />
case 'admin-api-test':
  return <ApiTester />
```

## ❌ Error Handling

### Common Error Responses:

**400 Bad Request:**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": ["Product name is required", "Price must be greater than 0"]
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "No token provided, authorization denied"
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "message": "Access denied. Admin privileges required."
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "Product not found"
}
```

**500 Server Error:**
```json
{
  "success": false,
  "message": "Server error while creating product"
}
```

## 🧪 Testing

### Using the API Tester Component:

1. Login as admin user
2. Navigate to admin panel
3. Use the API Tester to run automated tests
4. View results and verify functionality

### Manual Testing with curl:

```bash
# Get products
curl -X GET "http://localhost:3001/api/products?category=electronics&limit=5"

# Create product (requires admin token)
curl -X POST "http://localhost:3001/api/products" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "name": "Test Product",
    "description": "Test description",
    "price": 99.99,
    "category": "electronics",
    "sku": "TEST-001"
  }'
```

## 🔒 Security Features

1. **JWT Authentication**: All admin endpoints require valid JWT tokens
2. **Role-based Access**: Admin-only endpoints check user role
3. **Input Validation**: Server-side validation for all inputs
4. **Rate Limiting**: API rate limiting to prevent abuse
5. **Error Sanitization**: No sensitive data in error responses

## 📊 Performance Optimizations

1. **Database Indexing**: Optimized indexes for fast queries
2. **Pagination**: Efficient pagination for large datasets
3. **Field Selection**: Selective field population
4. **Caching Ready**: Structure supports Redis caching
5. **Bulk Operations**: Efficient bulk create/delete operations

The Product Management API provides a complete solution for managing an e-commerce product catalog with enterprise-level features and security! 🎉
