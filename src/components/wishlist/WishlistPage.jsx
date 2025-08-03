import { HeartIcon, ShoppingCartIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useWishlist } from '../../contexts/WishlistContext';
import { useCart } from '../../contexts/CartContext';
import AddToCartButton from '../cart/AddToCartButton';
import WishlistButton from './WishlistButton';

const WishlistPage = ({ onNavigate }) => {
  const { items, clearWishlist, removeFromWishlist, isLoading } = useWishlist();
  const { addToCart } = useCart();

  const handleClearWishlist = async () => {
    if (confirm('Are you sure you want to clear your entire wishlist?')) {
      await clearWishlist();
    }
  };

  const handleMoveToCart = async (product) => {
    try {
      // Add to cart
      const cartResult = await addToCart(product, 1);
      if (cartResult.success) {
        // Remove from wishlist
        await removeFromWishlist(product._id);
      }
    } catch (error) {
      console.error('Move to cart error:', error);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <HeartIcon className="mx-auto h-24 w-24 text-gray-300" />
            <h2 className="mt-6 text-3xl font-bold text-gray-900">Your wishlist is empty</h2>
            <p className="mt-4 text-lg text-gray-600">
              Save items you love for later by clicking the heart icon.
            </p>
            <div className="mt-8">
              <button
                onClick={() => onNavigate('home')}
                className="btn-primary"
              >
                Start Shopping
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
          <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          <p className="text-gray-600 mt-2">
            {items.length} {items.length === 1 ? 'item' : 'items'} saved for later
          </p>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
          {/* Wishlist Items */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-lg shadow-sm">
              {/* Clear Wishlist Button */}
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">Saved Items</h2>
                <button
                  onClick={handleClearWishlist}
                  disabled={isLoading}
                  className="text-sm text-red-600 hover:text-red-500 disabled:opacity-50"
                >
                  Clear All
                </button>
              </div>

              {/* Items Grid */}
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map((item) => (
                    <div key={item.product._id} className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                      {/* Product Image */}
                      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200">
                        <img
                          src={item.product.primaryImage?.url || item.product.images?.[0]?.url || item.product.image || 'https://via.placeholder.com/300'}
                          alt={item.product.name}
                          className="h-48 w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        />
                        
                        {/* Wishlist Button Overlay */}
                        <div className="absolute top-2 right-2">
                          <WishlistButton
                            product={item.product}
                            className="bg-white rounded-full shadow-md"
                          />
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="p-4">
                        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2">
                          {item.product.name}
                        </h3>
                        
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="text-lg font-semibold text-gray-900">
                              ${item.product.price}
                            </p>
                            {item.product.originalPrice && item.product.originalPrice > item.product.price && (
                              <p className="text-sm text-gray-500 line-through">
                                ${item.product.originalPrice}
                              </p>
                            )}
                          </div>
                          
                          {/* Stock Status */}
                          <div>
                            {item.product.inventory?.stock > 0 ? (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                In Stock
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                Out of Stock
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-2">
                          <AddToCartButton
                            product={item.product}
                            className="w-full"
                            size="sm"
                            onSuccess={() => removeFromWishlist(item.product._id)}
                          />
                          
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleMoveToCart(item.product)}
                              disabled={item.product.inventory?.stock === 0}
                              className="flex-1 text-xs px-3 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              <ShoppingCartIcon className="h-4 w-4 inline mr-1" />
                              Move to Cart
                            </button>
                            
                            <button
                              onClick={() => removeFromWishlist(item.product._id)}
                              className="px-3 py-2 text-red-600 hover:text-red-700 border border-red-300 hover:bg-red-50 rounded transition-colors"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        {/* Added Date */}
                        <p className="text-xs text-gray-500 mt-3">
                          Added {new Date(item.addedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Wishlist Summary */}
          <div className="mt-8 lg:mt-0 lg:col-span-4">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Wishlist Summary</h2>

              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Items</span>
                  <span className="font-medium">{items.length}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">In Stock</span>
                  <span className="font-medium text-green-600">
                    {items.filter(item => item.product.inventory?.stock > 0).length}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Out of Stock</span>
                  <span className="font-medium text-red-600">
                    {items.filter(item => item.product.inventory?.stock === 0).length}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Value</span>
                    <span className="font-medium">
                      ${items.reduce((total, item) => total + item.product.price, 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <button
                  onClick={() => onNavigate('home')}
                  className="w-full btn-primary"
                >
                  Continue Shopping
                </button>

                <button
                  onClick={() => onNavigate('cart')}
                  className="w-full btn-outline"
                >
                  View Cart
                </button>
              </div>

              {/* Tips */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="text-sm font-medium text-blue-900 mb-2">💡 Pro Tips</h3>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>• Items in your wishlist are saved across devices</li>
                  <li>• Get notified when prices drop</li>
                  <li>• Share your wishlist with friends</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
