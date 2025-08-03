import { useEffect } from 'react';
import { XMarkIcon, MinusIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useCart } from '../../contexts/CartContext';

const CartSidebarSimple = () => {
  const {
    isOpen,
    closeCart,
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotals,
    isLoading
  } = useCart();

  const { subtotal, tax, shipping, total, itemCount } = getCartTotals();

  // Handle escape key to close cart
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        closeCart();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, closeCart]);

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) {
      await removeFromCart(productId);
    } else {
      await updateQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = async (productId) => {
    await removeFromCart(productId);
  };

  const handleClearCart = async () => {
    if (confirm('Are you sure you want to clear your cart?')) {
      await clearCart();
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeCart();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
        onClick={handleBackdropClick}
      />

      {/* Sidebar */}
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className={`w-screen max-w-md transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
            {/* Header */}
            <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
              <div className="flex items-start justify-between">
                <h2 className="text-lg font-medium text-gray-900">
                  Shopping Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})
                </h2>
                <div className="ml-3 flex h-7 items-center">
                  <button
                    type="button"
                    className="relative -m-2 p-2 text-gray-400 hover:text-gray-500 transition-colors"
                    onClick={closeCart}
                  >
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Close panel</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
              </div>

              {/* Cart Items */}
              <div className="mt-8">
                <div className="flow-root">
                  {items.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-gray-400 mb-4">
                        <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </div>
                      <p className="text-gray-500">Your cart is empty</p>
                      <button
                        onClick={closeCart}
                        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-accent-600 hover:bg-accent-700 transition-colors"
                      >
                        Continue Shopping
                      </button>
                    </div>
                  ) : (
                    <ul role="list" className="-my-6 divide-y divide-gray-200">
                      {items.map((item) => (
                        <li key={`${item.product._id}-${item.variant?.id || 'default'}`} className="flex py-6">
                          <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                            <img
                              src={item.product.primaryImage?.url || item.product.images?.[0]?.url || 'https://via.placeholder.com/96'}
                              alt={item.product.name}
                              className="h-full w-full object-cover object-center"
                            />
                          </div>

                          <div className="ml-4 flex flex-1 flex-col">
                            <div>
                              <div className="flex justify-between text-base font-medium text-gray-900">
                                <h3>
                                  <span className="line-clamp-2">{item.product.name}</span>
                                </h3>
                                <p className="ml-4">${(item.product.price * item.quantity).toFixed(2)}</p>
                              </div>
                              <p className="mt-1 text-sm text-gray-500">
                                ${item.product.price} each
                              </p>
                              {item.variant && (
                                <p className="mt-1 text-sm text-gray-500">
                                  {Object.entries(item.variant).map(([key, value]) => (
                                    <span key={key} className="mr-2">
                                      {key}: {value}
                                    </span>
                                  ))}
                                </p>
                              )}
                            </div>
                            <div className="flex flex-1 items-end justify-between text-sm">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                                  disabled={isLoading}
                                  className="p-1 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                                >
                                  <MinusIcon className="h-4 w-4" />
                                </button>
                                <span className="font-medium w-8 text-center">{item.quantity}</span>
                                <button
                                  onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                                  disabled={isLoading}
                                  className="p-1 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                                >
                                  <PlusIcon className="h-4 w-4" />
                                </button>
                              </div>

                              <div className="flex">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveItem(item.product._id)}
                                  disabled={isLoading}
                                  className="font-medium text-red-600 hover:text-red-500 disabled:opacity-50 transition-colors"
                                >
                                  <TrashIcon className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            {/* Footer with totals and checkout */}
            {items.length > 0 && (
              <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                {/* Cart Totals */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">${tax}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Shipping {shipping === 0 && <span className="text-green-600">(Free!)</span>}
                    </span>
                    <span className="font-medium">${shipping}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2">
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <span>Total</span>
                      <span>${total}</span>
                    </div>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-gray-500 text-center">
                      Add ${(50 - subtotal).toFixed(2)} more for free shipping!
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="mt-6 space-y-3">
                  <button
                    className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-accent-600 hover:bg-accent-700 disabled:opacity-50 transition-colors"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Processing...' : 'Checkout'}
                  </button>
                  <button
                    onClick={closeCart}
                    className="w-full inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    Continue Shopping
                  </button>
                  <button
                    onClick={handleClearCart}
                    disabled={isLoading}
                    className="w-full text-sm text-red-600 hover:text-red-500 disabled:opacity-50 transition-colors"
                  >
                    Clear Cart
                  </button>
                </div>

                <p className="mt-6 text-center text-sm text-gray-500">
                  or{' '}
                  <button
                    type="button"
                    className="font-medium text-accent-600 hover:text-accent-500 transition-colors"
                    onClick={closeCart}
                  >
                    Continue Shopping
                    <span aria-hidden="true"> &rarr;</span>
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSidebarSimple;
