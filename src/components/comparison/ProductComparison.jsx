import { useState } from 'react';
import { XMarkIcon, PlusIcon, CheckIcon } from '@heroicons/react/24/outline';
import AddToCartButton from '../cart/AddToCartButton';
import WishlistButton from '../wishlist/WishlistButton';


const ProductComparison = ({ onNavigate }) => {
  const [compareProducts, setCompareProducts] = useState([]);
  const [availableProducts] = useState([
    {
      _id: "product-1",
      name: "Wireless Headphones Pro",
      price: 199.99,
      originalPrice: 249.99,
      category: "electronics",
      sku: "WH-PRO-001",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
      images: [{ url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop", alt: "Wireless Headphones Pro" }],
      rating: 4.8,
      description: "Premium wireless headphones with active noise cancellation",
      inventory: { stock: 50, lowStockThreshold: 10, trackInventory: true },
      status: "active",
      specifications: {
        "Battery Life": "30 hours",
        "Noise Cancellation": "Active",
        "Connectivity": "Bluetooth 5.0",
        "Weight": "250g",
        "Warranty": "2 years",
        "Water Resistance": "IPX4"
      }
    },
    {
      _id: "product-2",
      name: "Wireless Headphones Basic",
      price: 99.99,
      category: "electronics",
      sku: "WH-BASIC-002",
      image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop",
      images: [{ url: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop", alt: "Wireless Headphones Basic" }],
      rating: 4.2,
      description: "Affordable wireless headphones with good sound quality",
      inventory: { stock: 75, lowStockThreshold: 15, trackInventory: true },
      status: "active",
      specifications: {
        "Battery Life": "20 hours",
        "Noise Cancellation": "Passive",
        "Connectivity": "Bluetooth 4.2",
        "Weight": "200g",
        "Warranty": "1 year",
        "Water Resistance": "None"
      }
    },
    {
      _id: "product-3",
      name: "Gaming Headset Elite",
      price: 159.99,
      category: "electronics",
      sku: "GH-ELITE-003",
      image: "https://images.unsplash.com/photo-1599669454699-248893623440?w=400&h=400&fit=crop",
      images: [{ url: "https://images.unsplash.com/photo-1599669454699-248893623440?w=400&h=400&fit=crop", alt: "Gaming Headset Elite" }],
      rating: 4.6,
      description: "Professional gaming headset with surround sound",
      inventory: { stock: 30, lowStockThreshold: 5, trackInventory: true },
      status: "active",
      specifications: {
        "Battery Life": "15 hours",
        "Noise Cancellation": "None",
        "Connectivity": "Wired + Wireless",
        "Weight": "320g",
        "Warranty": "2 years",
        "Water Resistance": "None"
      }
    }
  ]);

  const addToComparison = (product) => {
    if (compareProducts.length >= 3) {
      alert('You can compare up to 3 products at a time');
      return;
    }
    
    if (compareProducts.find(p => p._id === product._id)) {
      alert('Product is already in comparison');
      return;
    }

    setCompareProducts([...compareProducts, product]);
  };

  const removeFromComparison = (productId) => {
    setCompareProducts(compareProducts.filter(p => p._id !== productId));
  };

  const clearComparison = () => {
    setCompareProducts([]);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <svg key="half" className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
          <defs>
            <linearGradient id="half">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <path fill="url(#half)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg key={`empty-${i}`} className="w-4 h-4 text-gray-300 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    return stars;
  };

  const allSpecKeys = [...new Set(compareProducts.flatMap(product => Object.keys(product.specifications || {})))];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Product Comparison</h1>
          <p className="text-gray-600 mt-2">Compare up to 3 products side by side</p>
        </div>

        {/* Available Products */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {availableProducts.map((product) => (
              <div key={product._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-2">{product.name}</h3>
                  <div className="flex items-center mb-2">
                    <div className="flex">{renderStars(product.rating)}</div>
                    <span className="ml-2 text-sm text-gray-600">({product.rating})</span>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-lg font-semibold text-gray-900">${product.price}</span>
                      {product.originalPrice && (
                        <span className="ml-2 text-sm text-gray-500 line-through">${product.originalPrice}</span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => addToComparison(product)}
                    disabled={compareProducts.find(p => p._id === product._id) || compareProducts.length >= 3}
                    className="w-full btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {compareProducts.find(p => p._id === product._id) ? 'Added to Compare' : 'Add to Compare'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Table */}
        {compareProducts.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                Comparison ({compareProducts.length}/3)
              </h2>
              <button
                onClick={clearComparison}
                className="text-red-600 hover:text-red-700 text-sm"
              >
                Clear All
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 w-48">
                      Feature
                    </th>
                    {compareProducts.map((product) => (
                      <th key={product._id} className="px-6 py-4 text-center min-w-64">
                        <div className="relative">
                          <button
                            onClick={() => removeFromComparison(product._id)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-24 h-24 object-cover rounded-lg mx-auto mb-3"
                          />
                          <h3 className="font-medium text-gray-900 text-sm mb-2">{product.name}</h3>
                          <div className="flex justify-center mb-2">
                            {renderStars(product.rating)}
                          </div>
                          <div className="text-lg font-semibold text-gray-900 mb-3">
                            ${product.price}
                            {product.originalPrice && (
                              <div className="text-sm text-gray-500 line-through">${product.originalPrice}</div>
                            )}
                          </div>
                          <div className="space-y-2">
                            <AddToCartButton product={product} size="sm" className="w-full" />
                            <div className="flex justify-center">
                              <WishlistButton product={product} showText={false} />
                            </div>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {/* Basic Info Rows */}
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Category</td>
                    {compareProducts.map((product) => (
                      <td key={product._id} className="px-6 py-4 text-sm text-gray-700 text-center capitalize">
                        {product.category}
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">SKU</td>
                    {compareProducts.map((product) => (
                      <td key={product._id} className="px-6 py-4 text-sm text-gray-700 text-center">
                        {product.sku}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Stock</td>
                    {compareProducts.map((product) => (
                      <td key={product._id} className="px-6 py-4 text-sm text-center">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          product.inventory.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {product.inventory.stock > 0 ? `${product.inventory.stock} in stock` : 'Out of stock'}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Specifications */}
                  {allSpecKeys.map((specKey, index) => (
                    <tr key={specKey} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{specKey}</td>
                      {compareProducts.map((product) => (
                        <td key={product._id} className="px-6 py-4 text-sm text-gray-700 text-center">
                          {product.specifications?.[specKey] || (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {compareProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-gray-500">Select products above to start comparing</p>
          </div>
        )}

        {/* Back to Products */}
        <div className="mt-8 text-center">
          <button
            onClick={() => onNavigate('products')}
            className="btn-outline"
          >
            Back to Products
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductComparison;
