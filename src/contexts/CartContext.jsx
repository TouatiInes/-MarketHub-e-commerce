import { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { authService } from '../services/authService';

// Initial cart state
const initialState = {
  items: [],
  isLoading: false,
  error: null,
  isOpen: false
};

// Action types
const CART_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_ITEMS: 'SET_ITEMS',
  ADD_ITEM: 'ADD_ITEM',
  UPDATE_ITEM: 'UPDATE_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  CLEAR_CART: 'CLEAR_CART',
  TOGGLE_CART: 'TOGGLE_CART',
  OPEN_CART: 'OPEN_CART',
  CLOSE_CART: 'CLOSE_CART'
};

// Cart reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
        error: null
      };

    case CART_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case CART_ACTIONS.SET_ITEMS:
      return {
        ...state,
        items: action.payload,
        isLoading: false,
        error: null
      };

    case CART_ACTIONS.ADD_ITEM:
      const existingItemIndex = state.items.findIndex(
        item => item.product._id === action.payload.product._id
      );

      if (existingItemIndex >= 0) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += action.payload.quantity;
        return {
          ...state,
          items: updatedItems
        };
      } else {
        return {
          ...state,
          items: [...state.items, action.payload]
        };
      }

    case CART_ACTIONS.UPDATE_ITEM:
      return {
        ...state,
        items: state.items.map(item =>
          item.product._id === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };

    case CART_ACTIONS.REMOVE_ITEM:
      return {
        ...state,
        items: state.items.filter(item => item.product._id !== action.payload)
      };

    case CART_ACTIONS.CLEAR_CART:
      return {
        ...state,
        items: []
      };

    case CART_ACTIONS.TOGGLE_CART:
      return {
        ...state,
        isOpen: !state.isOpen
      };

    case CART_ACTIONS.OPEN_CART:
      return {
        ...state,
        isOpen: true
      };

    case CART_ACTIONS.CLOSE_CART:
      return {
        ...state,
        isOpen: false
      };

    default:
      return state;
  }
};

// Create context
const CartContext = createContext();

// Cart provider component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { user, isAuthenticated } = useAuth();

  // Load cart from localStorage for guests or from user data for authenticated users
  useEffect(() => {
    if (isAuthenticated && user) {
      // Load cart from user data
      if (user.cart && user.cart.length > 0) {
        dispatch({ type: CART_ACTIONS.SET_ITEMS, payload: user.cart });
      }
    } else {
      // Load cart from localStorage for guests
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          const cartItems = JSON.parse(savedCart);
          dispatch({ type: CART_ACTIONS.SET_ITEMS, payload: cartItems });
        } catch (error) {
          console.error('Error loading cart from localStorage:', error);
        }
      }
    }
  }, [isAuthenticated, user]);

  // Save cart to localStorage for guests
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('cart', JSON.stringify(state.items));
    }
  }, [state.items, isAuthenticated]);

  // Add item to cart
  const addToCart = async (product, quantity = 1, variant = null) => {
    try {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });

      const cartItem = {
        product,
        quantity,
        variant,
        addedAt: new Date().toISOString()
      };

      if (isAuthenticated) {
        // Add to server cart
        await authService.addToCart(product._id, quantity);
        dispatch({ type: CART_ACTIONS.ADD_ITEM, payload: cartItem });
      } else {
        // Add to local cart
        dispatch({ type: CART_ACTIONS.ADD_ITEM, payload: cartItem });
      }

      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: false });
      return { success: true };
    } catch (error) {
      dispatch({ type: CART_ACTIONS.SET_ERROR, payload: error.message });
      return { success: false, error: error.message };
    }
  };

  // Update item quantity
  const updateQuantity = async (productId, quantity) => {
    try {
      if (quantity <= 0) {
        return removeFromCart(productId);
      }

      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });

      if (isAuthenticated) {
        // Update on server
        await authService.updateCartQuantity(productId, quantity);
      }

      dispatch({ 
        type: CART_ACTIONS.UPDATE_ITEM, 
        payload: { productId, quantity } 
      });

      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: false });
      return { success: true };
    } catch (error) {
      dispatch({ type: CART_ACTIONS.SET_ERROR, payload: error.message });
      return { success: false, error: error.message };
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId) => {
    try {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });

      if (isAuthenticated) {
        // Remove from server cart
        await authService.removeFromCart(productId);
      }

      dispatch({ type: CART_ACTIONS.REMOVE_ITEM, payload: productId });
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: false });
      return { success: true };
    } catch (error) {
      dispatch({ type: CART_ACTIONS.SET_ERROR, payload: error.message });
      return { success: false, error: error.message };
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    try {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });

      if (isAuthenticated) {
        // Clear server cart
        await authService.clearCart();
      }

      dispatch({ type: CART_ACTIONS.CLEAR_CART });
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: false });
      return { success: true };
    } catch (error) {
      dispatch({ type: CART_ACTIONS.SET_ERROR, payload: error.message });
      return { success: false, error: error.message };
    }
  };

  // Cart UI controls
  const openCart = () => dispatch({ type: CART_ACTIONS.OPEN_CART });
  const closeCart = () => dispatch({ type: CART_ACTIONS.CLOSE_CART });
  const toggleCart = () => dispatch({ type: CART_ACTIONS.TOGGLE_CART });

  // Clear error
  const clearError = () => dispatch({ type: CART_ACTIONS.SET_ERROR, payload: null });

  // Calculate cart totals
  const getCartTotals = () => {
    const subtotal = state.items.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);

    const itemCount = state.items.reduce((total, item) => {
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
  };

  // Check if product is in cart
  const isInCart = (productId) => {
    return state.items.some(item => item.product._id === productId);
  };

  // Get item quantity in cart
  const getItemQuantity = (productId) => {
    const item = state.items.find(item => item.product._id === productId);
    return item ? item.quantity : 0;
  };

  const value = {
    ...state,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    openCart,
    closeCart,
    toggleCart,
    clearError,
    getCartTotals,
    isInCart,
    getItemQuantity
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
