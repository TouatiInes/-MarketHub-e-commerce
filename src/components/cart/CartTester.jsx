import { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import AddToCartButton from './AddToCartButton';

const CartTester = () => {
  const { 
    items, 
    addToCart, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    getCartTotals,
    openCart,
    isLoading,
    error 
  } = useCart();
  
  const { user, isAuthenticated } = useAuth();
  const [testResults, setTestResults] = useState([]);

  // Sample test products
  const testProducts = [
    {
      _id: 'test-product-1',
      name: 'Test Wireless Headphones',
      price: 99.99,
      originalPrice: 129.99,
      category: 'electronics',
      sku: 'TEST-WH-001',
      images: [{ url: 'https://via.placeholder.com/300x300/7916ff/ffffff?text=Headphones', alt: 'Test Headphones' }],
      inventory: { stock: 50, lowStockThreshold: 10, trackInventory: true },
      status: 'active'
    },
    {
      _id: 'test-product-2',
      name: 'Test Smart Watch',
      price: 199.99,
      category: 'electronics',
      sku: 'TEST-SW-002',
      images: [{ url: 'https://via.placeholder.com/300x300/7916ff/ffffff?text=Watch', alt: 'Test Watch' }],
      inventory: { stock: 25, lowStockThreshold: 5, trackInventory: true },
      status: 'active'
    },
    {
      _id: 'test-product-3',
      name: 'Test Designer Backpack',
      price: 79.99,
      category: 'fashion',
      sku: 'TEST-BP-003',
      images: [{ url: 'https://via.placeholder.com/300x300/7916ff/ffffff?text=Backpack', alt: 'Test Backpack' }],
      inventory: { stock: 0, lowStockThreshold: 5, trackInventory: true },
      status: 'active'
    }
  ];

  const addTestResult = (test, success, message) => {
    const result = {
      id: Date.now(),
      test,
      success,
      message,
      timestamp: new Date().toLocaleTimeString()
    };
    setTestResults(prev => [result, ...prev]);
  };

  const testAddToCart = async (product, quantity = 1) => {
    try {
      const result = await addToCart(product, quantity);
      if (result.success) {
        addTestResult(`Add ${product.name}`, true, `Added ${quantity} item(s) to cart`);
      } else {
        addTestResult(`Add ${product.name}`, false, result.error);
      }
    } catch (error) {
      addTestResult(`Add ${product.name}`, false, error.message);
    }
  };

  const testUpdateQuantity = async (productId, quantity) => {
    try {
      const result = await updateQuantity(productId, quantity);
      if (result.success) {
        addTestResult('Update Quantity', true, `Updated quantity to ${quantity}`);
      } else {
        addTestResult('Update Quantity', false, result.error);
      }
    } catch (error) {
      addTestResult('Update Quantity', false, error.message);
    }
  };

  const testRemoveFromCart = async (productId) => {
    try {
      const result = await removeFromCart(productId);
      if (result.success) {
        addTestResult('Remove Item', true, 'Item removed from cart');
      } else {
        addTestResult('Remove Item', false, result.error);
      }
    } catch (error) {
      addTestResult('Remove Item', false, error.message);
    }
  };

  const testClearCart = async () => {
    try {
      const result = await clearCart();
      if (result.success) {
        addTestResult('Clear Cart', true, 'Cart cleared successfully');
      } else {
        addTestResult('Clear Cart', false, result.error);
      }
    } catch (error) {
      addTestResult('Clear Cart', false, error.message);
    }
  };

  const runAllTests = async () => {
    setTestResults([]);
    
    // Test adding items
    await testAddToCart(testProducts[0], 2);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await testAddToCart(testProducts[1], 1);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Test updating quantity
    await testUpdateQuantity(testProducts[0]._id, 3);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Test adding out of stock item
    await testAddToCart(testProducts[2], 1);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Test removing item
    await testRemoveFromCart(testProducts[1]._id);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Test clearing cart
    await testClearCart();
  };

  const { subtotal, tax, shipping, total, itemCount } = getCartTotals();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart Tester</h1>
          <p className="text-gray-600 mt-2">Test cart functionality and integration</p>
          
          {/* User Status */}
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm">
              <strong>User Status:</strong> {isAuthenticated ? `Logged in as ${user?.firstName} ${user?.lastName}` : 'Guest user'}
            </p>
            <p className="text-sm">
              <strong>Cart Storage:</strong> {isAuthenticated ? 'Server-side (Database)' : 'Client-side (LocalStorage)'}
            </p>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Test Products */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Test Products</h2>
            
            <div className="space-y-4">
              {testProducts.map((product) => (
                <div key={product._id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start space-x-4">
                    <img
                      src={product.images[0].url}
                      alt={product.name}
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{product.name}</h3>
                      <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                      <p className="text-lg font-semibold text-gray-900">${product.price}</p>
                      {product.originalPrice && (
                        <p className="text-sm text-gray-400 line-through">${product.originalPrice}</p>
                      )}
                      <p className="text-sm text-gray-600">
                        Stock: {product.inventory.stock} 
                        {product.inventory.stock === 0 && <span className="text-red-600 ml-1">(Out of Stock)</span>}
                      </p>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <AddToCartButton
                        product={product}
                        size="sm"
                        onSuccess={(result) => addTestResult(`Add ${product.name}`, true, 'Added via button')}
                        onError={(error) => addTestResult(`Add ${product.name}`, false, error)}
                      />
                      <button
                        onClick={() => testAddToCart(product, 2)}
                        disabled={isLoading}
                        className="text-xs px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                      >
                        Add 2x
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Test Controls */}
            <div className="mt-6 space-y-3">
              <button
                onClick={runAllTests}
                disabled={isLoading}
                className="w-full btn-primary disabled:opacity-50"
              >
                {isLoading ? 'Running Tests...' : 'Run All Tests'}
              </button>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => openCart()}
                  className="btn-outline"
                >
                  Open Cart Sidebar
                </button>
                <button
                  onClick={() => setTestResults([])}
                  className="btn-ghost text-red-600"
                >
                  Clear Results
                </button>
              </div>
            </div>
          </div>

          {/* Cart Status & Test Results */}
          <div className="space-y-6">
            {/* Current Cart Status */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Cart Status</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Items in Cart:</span>
                  <span className="font-medium">{itemCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">${subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax:</span>
                  <span className="font-medium">${tax}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="font-medium">${shipping}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span>${total}</span>
                  </div>
                </div>
              </div>

              {/* Cart Items */}
              {items.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-medium text-gray-900 mb-3">Cart Items:</h3>
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div key={item.product._id} className="flex justify-between items-center text-sm">
                        <span>{item.product.name}</span>
                        <div className="flex items-center space-x-2">
                          <span>Qty: {item.quantity}</span>
                          <button
                            onClick={() => testUpdateQuantity(item.product._id, item.quantity + 1)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            +
                          </button>
                          <button
                            onClick={() => testUpdateQuantity(item.product._id, item.quantity - 1)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            -
                          </button>
                          <button
                            onClick={() => testRemoveFromCart(item.product._id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Test Results */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Results</h2>
              
              {testResults.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No tests run yet</p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {testResults.map((result) => (
                    <div
                      key={result.id}
                      className={`p-3 rounded-lg border ${
                        result.success 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`font-medium ${
                          result.success ? 'text-green-800' : 'text-red-800'
                        }`}>
                          {result.success ? '✅' : '❌'} {result.test}
                        </span>
                        <span className="text-xs text-gray-500">{result.timestamp}</span>
                      </div>
                      <p className={`text-sm mt-1 ${
                        result.success ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {result.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartTester;
