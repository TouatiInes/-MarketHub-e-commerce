const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ProductService {
  // Get auth headers with token
  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  // Handle API responses
  async handleResponse(response) {
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    
    return data.data || data;
  }

  // Get all products with filtering and pagination
  async getProducts(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      // Add all parameters to query string
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
          queryParams.append(key, params[key]);
        }
      });

      // Add cache busting parameter
      queryParams.append('_t', Date.now());

      const response = await fetch(`${API_BASE_URL}/products?${queryParams}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
        cache: 'no-cache' // Prevent browser caching
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Get products error:', error);
      throw error;
    }
  }

  // Get single product by ID
  async getProduct(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Get product error:', error);
      throw error;
    }
  }

  // Create new product (Admin only)
  async createProduct(productData) {
    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(productData)
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Create product error:', error);
      throw error;
    }
  }

  // Update product (Admin only)
  async updateProduct(id, productData) {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(productData)
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Update product error:', error);
      throw error;
    }
  }

  // Delete product (Admin only)
  async deleteProduct(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Delete product error:', error);
      throw error;
    }
  }

  // Update product status (Admin only)
  async updateProductStatus(id, status) {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}/status`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ status })
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Update product status error:', error);
      throw error;
    }
  }

  // Update product inventory (Admin only)
  async updateProductInventory(id, inventoryData) {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}/inventory`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(inventoryData)
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Update product inventory error:', error);
      throw error;
    }
  }

  // Toggle product featured status (Admin only)
  async toggleProductFeatured(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}/featured`, {
        method: 'PATCH',
        headers: this.getAuthHeaders()
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Toggle product featured error:', error);
      throw error;
    }
  }

  // Create multiple products (Admin only)
  async createBulkProducts(products) {
    try {
      const response = await fetch(`${API_BASE_URL}/products/bulk`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ products })
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Bulk create products error:', error);
      throw error;
    }
  }

  // Delete multiple products (Admin only)
  async deleteBulkProducts(productIds) {
    try {
      const response = await fetch(`${API_BASE_URL}/products/bulk`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ productIds })
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Bulk delete products error:', error);
      throw error;
    }
  }

  // Add product review
  async addProductReview(id, reviewData) {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}/reviews`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(reviewData)
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Add product review error:', error);
      throw error;
    }
  }

  // Search products
  async searchProducts(query, filters = {}) {
    try {
      const params = {
        search: query,
        ...filters
      };

      return await this.getProducts(params);
    } catch (error) {
      console.error('Search products error:', error);
      throw error;
    }
  }

  // Get products by category
  async getProductsByCategory(category, params = {}) {
    try {
      const searchParams = {
        category,
        ...params
      };

      return await this.getProducts(searchParams);
    } catch (error) {
      console.error('Get products by category error:', error);
      throw error;
    }
  }

  // Get featured products
  async getFeaturedProducts(limit = 12) {
    try {
      const params = {
        featured: 'true',
        limit
      };

      return await this.getProducts(params);
    } catch (error) {
      console.error('Get featured products error:', error);
      throw error;
    }
  }

  // Get low stock products (Admin only)
  async getLowStockProducts() {
    try {
      const response = await fetch(`${API_BASE_URL}/products?lowStock=true`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Get low stock products error:', error);
      throw error;
    }
  }

  // Validate product data
  validateProductData(productData) {
    const errors = [];

    if (!productData.name || productData.name.trim().length === 0) {
      errors.push('Product name is required');
    }

    if (!productData.description || productData.description.trim().length === 0) {
      errors.push('Product description is required');
    }

    if (!productData.price || productData.price <= 0) {
      errors.push('Valid price is required');
    }

    if (!productData.category || productData.category.trim().length === 0) {
      errors.push('Product category is required');
    }

    if (!productData.sku || productData.sku.trim().length === 0) {
      errors.push('Product SKU is required');
    }

    if (productData.originalPrice && productData.originalPrice <= productData.price) {
      errors.push('Original price must be greater than current price');
    }

    return errors;
  }
}

export const productService = new ProductService();
