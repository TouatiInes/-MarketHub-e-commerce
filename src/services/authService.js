const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:9876/api';

class AuthService {
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

  // Register new user
  async register(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const result = await this.handleResponse(response);
      return result;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  // Login user
  async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const result = await this.handleResponse(response);
      return result;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Get current user
  async getCurrentUser() {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      const result = await this.handleResponse(response);
      return result;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  }

  // Update user profile
  async updateProfile(profileData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(profileData)
      });

      const result = await this.handleResponse(response);
      return result;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  // Change password
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const result = await this.handleResponse(response);
      return result;
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  }

  // Add item to cart
  async addToCart(productId, quantity = 1) {
    try {
      console.log('🛒 Frontend addToCart called with:', {
        productId,
        productIdType: typeof productId,
        productIdLength: productId ? productId.length : 'undefined',
        productIdString: productId ? productId.toString() : 'undefined',
        quantity
      });

      const response = await fetch(`${API_BASE_URL}/auth/cart`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ productId, quantity })
      });

      const result = await this.handleResponse(response);
      return result;
    } catch (error) {
      console.error('Add to cart error:', error);
      throw error;
    }
  }

  // Remove item from cart
  async removeFromCart(productId) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/cart/${productId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      const result = await this.handleResponse(response);
      return result;
    } catch (error) {
      console.error('Remove from cart error:', error);
      throw error;
    }
  }

  // Update cart item quantity
  async updateCartQuantity(productId, quantity) {
    try {
      // Remove item first, then add with new quantity
      await this.removeFromCart(productId);
      return await this.addToCart(productId, quantity);
    } catch (error) {
      console.error('Update cart quantity error:', error);
      throw error;
    }
  }

  // Clear entire cart
  async clearCart() {
    try {
      const user = await this.getCurrentUser();
      const cartItems = user.cart || [];
      
      // Remove all items from cart
      for (const item of cartItems) {
        await this.removeFromCart(item.product._id || item.product);
      }
      
      return [];
    } catch (error) {
      console.error('Clear cart error:', error);
      throw error;
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      // Check if token is expired
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      if (payload.exp < currentTime) {
        localStorage.removeItem('token');
        return false;
      }
      
      return true;
    } catch (error) {
      localStorage.removeItem('token');
      return false;
    }
  }

  // Get user role from token
  getUserRole() {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role;
    } catch (error) {
      return null;
    }
  }

  // Check if user is admin
  isAdmin() {
    return this.getUserRole() === 'admin';
  }

  // Logout user
  logout() {
    localStorage.removeItem('token');
  }
}

export const authService = new AuthService();
