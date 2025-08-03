import { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';

// Initial wishlist state
const initialState = {
  items: [],
  isLoading: false,
  error: null
};

// Action types
const WISHLIST_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_ITEMS: 'SET_ITEMS',
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  CLEAR_WISHLIST: 'CLEAR_WISHLIST'
};

// Wishlist reducer
const wishlistReducer = (state, action) => {
  switch (action.type) {
    case WISHLIST_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
        error: null
      };

    case WISHLIST_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case WISHLIST_ACTIONS.SET_ITEMS:
      return {
        ...state,
        items: action.payload,
        isLoading: false,
        error: null
      };

    case WISHLIST_ACTIONS.ADD_ITEM:
      const existingItem = state.items.find(item => item.product._id === action.payload.product._id);
      if (existingItem) {
        return state; // Item already in wishlist
      }
      return {
        ...state,
        items: [...state.items, action.payload]
      };

    case WISHLIST_ACTIONS.REMOVE_ITEM:
      return {
        ...state,
        items: state.items.filter(item => item.product._id !== action.payload)
      };

    case WISHLIST_ACTIONS.CLEAR_WISHLIST:
      return {
        ...state,
        items: []
      };

    default:
      return state;
  }
};

// Create context
const WishlistContext = createContext();

// Wishlist provider component
export const WishlistProvider = ({ children }) => {
  const [state, dispatch] = useReducer(wishlistReducer, initialState);
  const { user, isAuthenticated } = useAuth();

  // Load wishlist from localStorage for guests or from user data for authenticated users
  useEffect(() => {
    if (isAuthenticated && user) {
      // Load wishlist from user data
      if (user.wishlist && user.wishlist.length > 0) {
        dispatch({ type: WISHLIST_ACTIONS.SET_ITEMS, payload: user.wishlist });
      }
    } else {
      // Load wishlist from localStorage for guests
      const savedWishlist = localStorage.getItem('wishlist');
      if (savedWishlist) {
        try {
          const wishlistItems = JSON.parse(savedWishlist);
          dispatch({ type: WISHLIST_ACTIONS.SET_ITEMS, payload: wishlistItems });
        } catch (error) {
          console.error('Error loading wishlist from localStorage:', error);
        }
      }
    }
  }, [isAuthenticated, user]);

  // Save wishlist to localStorage for guests
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('wishlist', JSON.stringify(state.items));
    }
  }, [state.items, isAuthenticated]);

  // Add item to wishlist
  const addToWishlist = async (product) => {
    try {
      dispatch({ type: WISHLIST_ACTIONS.SET_LOADING, payload: true });

      const wishlistItem = {
        product,
        addedAt: new Date().toISOString()
      };

      if (isAuthenticated) {
        // Add to server wishlist (would need API endpoint)
        // await authService.addToWishlist(product._id);
        dispatch({ type: WISHLIST_ACTIONS.ADD_ITEM, payload: wishlistItem });
      } else {
        // Add to local wishlist
        dispatch({ type: WISHLIST_ACTIONS.ADD_ITEM, payload: wishlistItem });
      }

      dispatch({ type: WISHLIST_ACTIONS.SET_LOADING, payload: false });
      return { success: true };
    } catch (error) {
      dispatch({ type: WISHLIST_ACTIONS.SET_ERROR, payload: error.message });
      return { success: false, error: error.message };
    }
  };

  // Remove item from wishlist
  const removeFromWishlist = async (productId) => {
    try {
      dispatch({ type: WISHLIST_ACTIONS.SET_LOADING, payload: true });

      if (isAuthenticated) {
        // Remove from server wishlist (would need API endpoint)
        // await authService.removeFromWishlist(productId);
      }

      dispatch({ type: WISHLIST_ACTIONS.REMOVE_ITEM, payload: productId });
      dispatch({ type: WISHLIST_ACTIONS.SET_LOADING, payload: false });
      return { success: true };
    } catch (error) {
      dispatch({ type: WISHLIST_ACTIONS.SET_ERROR, payload: error.message });
      return { success: false, error: error.message };
    }
  };

  // Clear entire wishlist
  const clearWishlist = async () => {
    try {
      dispatch({ type: WISHLIST_ACTIONS.SET_LOADING, payload: true });

      if (isAuthenticated) {
        // Clear server wishlist (would need API endpoint)
        // await authService.clearWishlist();
      }

      dispatch({ type: WISHLIST_ACTIONS.CLEAR_WISHLIST });
      dispatch({ type: WISHLIST_ACTIONS.SET_LOADING, payload: false });
      return { success: true };
    } catch (error) {
      dispatch({ type: WISHLIST_ACTIONS.SET_ERROR, payload: error.message });
      return { success: false, error: error.message };
    }
  };

  // Clear error
  const clearError = () => dispatch({ type: WISHLIST_ACTIONS.SET_ERROR, payload: null });

  // Check if product is in wishlist
  const isInWishlist = (productId) => {
    return state.items.some(item => item.product._id === productId);
  };

  // Get wishlist item count
  const getWishlistCount = () => {
    return state.items.length;
  };

  const value = {
    ...state,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    clearError,
    isInWishlist,
    getWishlistCount
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

// Custom hook to use wishlist context
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export default WishlistContext;
