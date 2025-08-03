import { useState } from 'react';
import { ShoppingCartIcon, CheckIcon } from '@heroicons/react/24/outline';
import { useCart } from '../../contexts/CartContext';

const AddToCartButton = ({ 
  product, 
  quantity = 1, 
  variant = null,
  className = '',
  size = 'md',
  showIcon = true,
  disabled = false,
  onSuccess = null,
  onError = null
}) => {
  const { addToCart, isLoading, isInCart, openCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const isProductInCart = isInCart(product._id);

  const handleAddToCart = async () => {
    if (disabled || isLoading || isAdding) return;

    setIsAdding(true);
    
    try {
      const result = await addToCart(product, quantity, variant);
      
      if (result.success) {
        setJustAdded(true);
        setTimeout(() => setJustAdded(false), 2000);
        
        if (onSuccess) {
          onSuccess(result);
        }
      } else {
        if (onError) {
          onError(result.error);
        }
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      if (onError) {
        onError(error.message);
      }
    } finally {
      setIsAdding(false);
    }
  };

  const handleViewCart = () => {
    openCart();
  };

  // Size variants
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
    xl: 'h-7 w-7'
  };

  // Check if product is out of stock
  const isOutOfStock = product.inventory?.stock === 0 || product.status !== 'active';

  if (isOutOfStock) {
    return (
      <button
        disabled
        className={`
          ${sizeClasses[size]}
          ${className}
          bg-gray-100 text-gray-400 cursor-not-allowed
          border border-gray-200 rounded-lg font-medium
          flex items-center justify-center space-x-2
        `}
      >
        <span>Out of Stock</span>
      </button>
    );
  }

  if (justAdded) {
    return (
      <button
        onClick={handleViewCart}
        className={`
          ${sizeClasses[size]}
          ${className}
          bg-green-500 hover:bg-green-600 text-white
          border border-green-500 rounded-lg font-medium transition-colors
          flex items-center justify-center space-x-2
        `}
      >
        {showIcon && <CheckIcon className={iconSizes[size]} />}
        <span>Added to Cart!</span>
      </button>
    );
  }

  if (isProductInCart) {
    return (
      <button
        onClick={handleViewCart}
        className={`
          ${sizeClasses[size]}
          ${className}
          bg-accent-100 hover:bg-accent-200 text-accent-700
          border border-accent-300 rounded-lg font-medium transition-colors
          flex items-center justify-center space-x-2
        `}
      >
        {showIcon && <ShoppingCartIcon className={iconSizes[size]} />}
        <span>View in Cart</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={disabled || isLoading || isAdding}
      className={`
        ${sizeClasses[size]}
        ${className}
        bg-accent-600 hover:bg-accent-700 disabled:bg-gray-300 
        text-white disabled:text-gray-500
        border border-accent-600 disabled:border-gray-300 
        rounded-lg font-medium transition-colors
        flex items-center justify-center space-x-2
        disabled:cursor-not-allowed
      `}
    >
      {isAdding ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span>Adding...</span>
        </>
      ) : (
        <>
          {showIcon && <ShoppingCartIcon className={iconSizes[size]} />}
          <span>Add to Cart</span>
        </>
      )}
    </button>
  );
};

export default AddToCartButton;
