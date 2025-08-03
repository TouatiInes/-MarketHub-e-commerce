import { useState } from 'react';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { useWishlist } from '../../contexts/WishlistContext';

const WishlistButton = ({ 
  product, 
  className = '',
  size = 'md',
  showText = false,
  onSuccess = null,
  onError = null
}) => {
  const { addToWishlist, removeFromWishlist, isInWishlist, isLoading } = useWishlist();
  const [isProcessing, setIsProcessing] = useState(false);

  const isProductInWishlist = isInWishlist(product._id);

  const handleToggleWishlist = async () => {
    if (isLoading || isProcessing) return;

    setIsProcessing(true);
    
    try {
      let result;
      if (isProductInWishlist) {
        result = await removeFromWishlist(product._id);
      } else {
        result = await addToWishlist(product);
      }
      
      if (result.success) {
        if (onSuccess) {
          onSuccess(result, isProductInWishlist ? 'removed' : 'added');
        }
      } else {
        if (onError) {
          onError(result.error);
        }
      }
    } catch (error) {
      console.error('Wishlist toggle error:', error);
      if (onError) {
        onError(error.message);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Size variants
  const sizeClasses = {
    sm: 'p-1',
    md: 'p-2',
    lg: 'p-3',
    xl: 'p-4'
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
    xl: 'h-7 w-7'
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  };

  return (
    <button
      onClick={handleToggleWishlist}
      disabled={isLoading || isProcessing}
      className={`
        ${sizeClasses[size]}
        ${className}
        ${isProductInWishlist 
          ? 'text-red-500 hover:text-red-600' 
          : 'text-gray-400 hover:text-red-500'
        }
        transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed
        ${showText ? 'flex items-center space-x-2' : ''}
      `}
      title={isProductInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      {isProcessing ? (
        <div className={`animate-spin rounded-full border-2 border-current border-t-transparent ${iconSizes[size]}`}></div>
      ) : (
        <>
          {isProductInWishlist ? (
            <HeartIconSolid className={iconSizes[size]} />
          ) : (
            <HeartIcon className={iconSizes[size]} />
          )}
          {showText && (
            <span className={textSizes[size]}>
              {isProductInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </span>
          )}
        </>
      )}
    </button>
  );
};

export default WishlistButton;
