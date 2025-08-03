import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { productService } from '../../services/productService';

const ApiTester = () => {
  const { user } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Check if user is admin
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  const addResult = (test, success, data, error = null) => {
    const result = {
      id: Date.now(),
      test,
      success,
      data,
      error,
      timestamp: new Date().toLocaleTimeString()
    };
    setResults(prev => [result, ...prev]);
  };

  const testGetProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getProducts({ limit: 5 });
      addResult('GET /api/products', true, `Found ${data.data?.length || 0} products`);
    } catch (error) {
      addResult('GET /api/products', false, null, error.message);
    } finally {
      setLoading(false);
    }
  };

  const testCreateProduct = async () => {
    try {
      setLoading(true);
      const testProduct = {
        name: `Test Product ${Date.now()}`,
        description: 'This is a test product created by the API tester',
        shortDescription: 'Test product for API testing',
        price: 99.99,
        originalPrice: 129.99,
        category: 'electronics',
        brand: 'TestBrand',
        sku: `TEST-${Date.now()}`,
        images: [{
          url: 'https://via.placeholder.com/300x300/7916ff/ffffff?text=Test+Product',
          alt: 'Test Product Image',
          isPrimary: true
        }],
        inventory: {
          stock: 100,
          lowStockThreshold: 10,
          trackInventory: true
        },
        tags: ['test', 'api', 'demo'],
        featured: false,
        status: 'active'
      };

      const data = await productService.createProduct(testProduct);
      addResult('POST /api/products', true, `Created product: ${data.name} (ID: ${data._id})`);
    } catch (error) {
      addResult('POST /api/products', false, null, error.message);
    } finally {
      setLoading(false);
    }
  };

  const testUpdateProduct = async () => {
    try {
      setLoading(true);
      // First get a product to update
      const products = await productService.getProducts({ limit: 1 });
      if (!products.data || products.data.length === 0) {
        addResult('PUT /api/products/:id', false, null, 'No products found to update');
        return;
      }

      const product = products.data[0];
      const updateData = {
        name: `${product.name} (Updated)`,
        price: product.price + 10
      };

      const data = await productService.updateProduct(product._id, updateData);
      addResult('PUT /api/products/:id', true, `Updated product: ${data.name}`);
    } catch (error) {
      addResult('PUT /api/products/:id', false, null, error.message);
    } finally {
      setLoading(false);
    }
  };

  const testUpdateStatus = async () => {
    try {
      setLoading(true);
      // First get a product to update
      const products = await productService.getProducts({ limit: 1 });
      if (!products.data || products.data.length === 0) {
        addResult('PATCH /api/products/:id/status', false, null, 'No products found to update');
        return;
      }

      const product = products.data[0];
      const newStatus = product.status === 'active' ? 'inactive' : 'active';
      
      const data = await productService.updateProductStatus(product._id, newStatus);
      addResult('PATCH /api/products/:id/status', true, `Updated status to: ${newStatus}`);
    } catch (error) {
      addResult('PATCH /api/products/:id/status', false, null, error.message);
    } finally {
      setLoading(false);
    }
  };

  const testToggleFeatured = async () => {
    try {
      setLoading(true);
      // First get a product to update
      const products = await productService.getProducts({ limit: 1 });
      if (!products.data || products.data.length === 0) {
        addResult('PATCH /api/products/:id/featured', false, null, 'No products found to update');
        return;
      }

      const product = products.data[0];
      const data = await productService.toggleProductFeatured(product._id);
      addResult('PATCH /api/products/:id/featured', true, `Toggled featured status`);
    } catch (error) {
      addResult('PATCH /api/products/:id/featured', false, null, error.message);
    } finally {
      setLoading(false);
    }
  };

  const testSearchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.searchProducts('test', { category: 'electronics' });
      addResult('GET /api/products (search)', true, `Found ${data.data?.length || 0} products matching "test"`);
    } catch (error) {
      addResult('GET /api/products (search)', false, null, error.message);
    } finally {
      setLoading(false);
    }
  };

  const testGetFeaturedProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getFeaturedProducts(5);
      addResult('GET /api/products (featured)', true, `Found ${data.data?.length || 0} featured products`);
    } catch (error) {
      addResult('GET /api/products (featured)', false, null, error.message);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setResults([]);
  };

  const runAllTests = async () => {
    setResults([]);
    await testGetProducts();
    await new Promise(resolve => setTimeout(resolve, 500));
    await testCreateProduct();
    await new Promise(resolve => setTimeout(resolve, 500));
    await testUpdateProduct();
    await new Promise(resolve => setTimeout(resolve, 500));
    await testUpdateStatus();
    await new Promise(resolve => setTimeout(resolve, 500));
    await testToggleFeatured();
    await new Promise(resolve => setTimeout(resolve, 500));
    await testSearchProducts();
    await new Promise(resolve => setTimeout(resolve, 500));
    await testGetFeaturedProducts();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Product API Tester</h1>
          <p className="text-gray-600 mt-2">Test product management API endpoints</p>
        </div>

        {/* Test Controls */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <button
              onClick={testGetProducts}
              disabled={loading}
              className="btn-primary disabled:opacity-50"
            >
              Get Products
            </button>
            <button
              onClick={testCreateProduct}
              disabled={loading}
              className="btn-primary disabled:opacity-50"
            >
              Create Product
            </button>
            <button
              onClick={testUpdateProduct}
              disabled={loading}
              className="btn-primary disabled:opacity-50"
            >
              Update Product
            </button>
            <button
              onClick={testUpdateStatus}
              disabled={loading}
              className="btn-primary disabled:opacity-50"
            >
              Update Status
            </button>
            <button
              onClick={testToggleFeatured}
              disabled={loading}
              className="btn-primary disabled:opacity-50"
            >
              Toggle Featured
            </button>
            <button
              onClick={testSearchProducts}
              disabled={loading}
              className="btn-primary disabled:opacity-50"
            >
              Search Products
            </button>
            <button
              onClick={testGetFeaturedProducts}
              disabled={loading}
              className="btn-primary disabled:opacity-50"
            >
              Get Featured
            </button>
            <button
              onClick={runAllTests}
              disabled={loading}
              className="btn-secondary disabled:opacity-50"
            >
              Run All Tests
            </button>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {loading && (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-accent-500 mr-2"></div>
                  Running test...
                </div>
              )}
            </div>
            <button
              onClick={clearResults}
              className="btn-ghost text-red-600"
            >
              Clear Results
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Test Results</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {results.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No tests run yet. Click a test button to start.
              </div>
            ) : (
              results.map((result) => (
                <div key={result.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          result.success 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {result.success ? 'SUCCESS' : 'FAILED'}
                        </span>
                        <span className="font-medium text-gray-900">{result.test}</span>
                        <span className="text-sm text-gray-500">{result.timestamp}</span>
                      </div>
                      
                      {result.data && (
                        <div className="mt-2 text-sm text-gray-700">
                          {result.data}
                        </div>
                      )}
                      
                      {result.error && (
                        <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                          Error: {result.error}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiTester;
