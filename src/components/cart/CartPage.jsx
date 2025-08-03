import { useState } from 'react';
import { TrashIcon, MinusIcon, PlusIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { useCart } from '../../contexts/CartContext';

const CartPage = ({ onNavigate }) => {
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotals,
    isLoading
  } = useCart();

  const [updatingItems, setUpdatingItems] = useState(new Set());
  const { subtotal, tax, shipping, total, itemCount } = getCartTotals();

  const handleQuantityChange = async (productId, newQuantity) => {
    setUpdatingItems(prev => new Set(prev).add(productId));
    
    try {
      if (newQuantity < 1) {
        await removeFromCart(productId);
      } else {
        await updateQuantity(productId, newQuantity);
      }
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const handleRemoveItem = async (productId) => {
    setUpdatingItems(prev => new Set(prev).add(productId));
    
    try {
      await removeFromCart(productId);
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const handleClearCart = async () => {
    if (confirm('Are you sure you want to clear your entire cart?')) {
      await clearCart();
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <ShoppingBagIcon className="mx-auto h-24 w-24 text-gray-300" />
            <h2 className="mt-6 text-3xl font-bold text-gray-900">Your cart is empty</h2>
            <p className="mt-4 text-lg text-gray-600">
              Looks like you haven't added anything to your cart yet.
            </p>
            <div className="mt-8">
              <button
                onClick={() => onNavigate('home')}
                className="btn-primary"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-2">
            {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
          {/* Cart Items */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-lg shadow-sm">
              {/* Clear Cart Button */}
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">Cart Items</h2>
                <button
                  onClick={handleClearCart}
                  disabled={isLoading}
                  className="text-sm text-red-600 hover:text-red-500 disabled:opacity-50"
                >
                  Clear All
                </button>
              </div>

              {/* Items List */}
              <div className="divide-y divide-gray-200">
                {items.map((item) => {
                  const isUpdating = updatingItems.has(item.product._id);
                  
                  return (
                    <div key={`${item.product._id}-${item.variant?.id || 'default'}`} className="p-6">
                      <div className="flex items-start space-x-4">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <img
                            src={item.product.primaryImage?.url || item.product.images?.[0]?.url || 'https://via.placeholder.com/120'}
                            alt={item.product.name}
                            className="h-24 w-24 rounded-lg object-cover"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-medium text-gray-900 line-clamp-2">
                            {item.product.name}
                          </h3>
                          
                          <p className="mt-1 text-sm text-gray-500">
                            SKU: {item.product.sku}
                          </p>

                          {item.variant && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {Object.entries(item.variant).map(([key, value]) => (
                                <span
                                  key={key}
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                                >
                                  {key}: {value}
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="mt-4 flex items-center justify-between">
                            {/* Quantity Controls */}
                            <div className="flex items-center space-x-3">
                              <span className="text-sm text-gray-600">Quantity:</span>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                                  disabled={isUpdating || isLoading}
                                  className="p-1 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                                >
                                  <MinusIcon className="h-4 w-4" />
                                </button>
                                <span className="font-medium w-12 text-center">
                                  {isUpdating ? '...' : item.quantity}
                                </span>
                                <button
                                  onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                                  disabled={isUpdating || isLoading}
                                  className="p-1 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                                >
                                  <PlusIcon className="h-4 w-4" />
                                </button>
                              </div>
                            </div>

                            {/* Remove Button */}
                            <button
                              onClick={() => handleRemoveItem(item.product._id)}
                              disabled={isUpdating || isLoading}
                              className="text-red-600 hover:text-red-500 disabled:opacity-50"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="flex flex-col items-end">
                          <p className="text-lg font-medium text-gray-900">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-500">
                            ${item.product.price} each
                          </p>
                          {item.product.originalPrice && item.product.originalPrice > item.product.price && (
                            <p className="text-sm text-gray-400 line-through">
                              ${item.product.originalPrice} each
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="mt-8 lg:mt-0 lg:col-span-5">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal ({itemCount} items)</span>
                  <span className="font-medium">${subtotal}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">${tax}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Shipping {shipping === 0 && <span className="text-green-600">(Free!)</span>}
                  </span>
                  <span className="font-medium">${shipping}</span>
                </div>

                {shipping > 0 && (
                  <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg">
                    💡 Add ${(50 - subtotal).toFixed(2)} more to qualify for free shipping!
                  </div>
                )}

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-lg font-medium">
                    <span>Total</span>
                    <span>${total}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <button
                  className="w-full btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : 'Proceed to Checkout'}
                </button>

                <button
                  onClick={() => onNavigate('home')}
                  className="w-full btn-outline"
                >
                  Continue Shopping
                </button>
              </div>

              {/* Security Badge */}
              <div className="mt-6 text-center">
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span>Secure checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
