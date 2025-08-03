const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api';

class CartService {
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

  // Add item to cart
  async addToCart(productId, quantity = 1) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/cart`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ productId, quantity })
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Add to cart error:', error);
      throw error;
    }
  }

  // Update cart item quantity
  async updateCartQuantity(productId, quantity) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/cart/${productId}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ quantity })
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Update cart quantity error:', error);
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

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Remove from cart error:', error);
      throw error;
    }
  }

  // Clear entire cart
  async clearCart() {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/cart`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Clear cart error:', error);
      throw error;
    }
  }

  // Get cart items
  async getCart() {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/cart`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Get cart error:', error);
      throw error;
    }
  }

  // Calculate cart totals
  calculateTotals(items) {
    const subtotal = items.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);

    const itemCount = items.reduce((total, item) => {
      return total + item.quantity;
    }, 0);

    const tax = subtotal * 0.08; // 8% tax
    const shipping = subtotal > 50 ? 0 : 9.99; // Free shipping over $50
    const total = subtotal + tax + shipping;

    return {
      subtotal: Number(subtotal.toFixed(2)),
      tax: Number(tax.toFixed(2)),
      shipping: Number(shipping.toFixed(2)),
      total: Number(total.toFixed(2)),
      itemCount
    };
  }

  // Validate cart item
  validateCartItem(product, quantity = 1) {
    const errors = [];

    if (!product || !product._id) {
      errors.push('Invalid product');
    }

    if (!quantity || quantity < 1) {
      errors.push('Quantity must be at least 1');
    }

    if (product.inventory?.stock !== undefined && quantity > product.inventory.stock) {
      errors.push(`Only ${product.inventory.stock} items available in stock`);
    }

    if (product.status !== 'active') {
      errors.push('Product is not available');
    }

    return errors;
  }

  // Format cart item for display
  formatCartItem(item) {
    return {
      id: item.product._id,
      name: item.product.name,
      price: item.product.price,
      originalPrice: item.product.originalPrice,
      quantity: item.quantity,
      image: item.product.primaryImage?.url || item.product.images?.[0]?.url,
      sku: item.product.sku,
      category: item.product.category,
      inStock: item.product.inventory?.stock > 0,
      maxQuantity: item.product.inventory?.stock || 999,
      variant: item.variant,
      subtotal: Number((item.product.price * item.quantity).toFixed(2))
    };
  }

  // Merge guest cart with user cart
  async mergeGuestCart(guestCartItems) {
    try {
      const mergePromises = guestCartItems.map(item => 
        this.addToCart(item.product._id, item.quantity)
      );

      await Promise.all(mergePromises);
      
      // Clear guest cart from localStorage
      localStorage.removeItem('cart');
      
      return true;
    } catch (error) {
      console.error('Merge guest cart error:', error);
      throw error;
    }
  }

  // Get shipping options
  getShippingOptions(subtotal) {
    const options = [
      {
        id: 'standard',
        name: 'Standard Shipping',
        price: subtotal > 50 ? 0 : 9.99,
        estimatedDays: '5-7 business days',
        description: subtotal > 50 ? 'Free shipping on orders over $50' : 'Standard delivery'
      },
      {
        id: 'express',
        name: 'Express Shipping',
        price: 19.99,
        estimatedDays: '2-3 business days',
        description: 'Faster delivery'
      },
      {
        id: 'overnight',
        name: 'Overnight Shipping',
        price: 39.99,
        estimatedDays: '1 business day',
        description: 'Next day delivery'
      }
    ];

    return options;
  }

  // Apply discount code
  async applyDiscount(code, cartTotal) {
    // Mock discount codes for demo
    const discountCodes = {
      'SAVE10': { type: 'percentage', value: 10, minOrder: 50 },
      'WELCOME20': { type: 'percentage', value: 20, minOrder: 100 },
      'FLAT5': { type: 'fixed', value: 5, minOrder: 25 }
    };

    const discount = discountCodes[code.toUpperCase()];
    
    if (!discount) {
      throw new Error('Invalid discount code');
    }

    if (cartTotal < discount.minOrder) {
      throw new Error(`Minimum order of $${discount.minOrder} required for this discount`);
    }

    let discountAmount = 0;
    if (discount.type === 'percentage') {
      discountAmount = (cartTotal * discount.value) / 100;
    } else {
      discountAmount = discount.value;
    }

    return {
      code: code.toUpperCase(),
      type: discount.type,
      value: discount.value,
      amount: Number(discountAmount.toFixed(2)),
      description: discount.type === 'percentage' 
        ? `${discount.value}% off` 
        : `$${discount.value} off`
    };
  }
}

export const cartService = new CartService();
