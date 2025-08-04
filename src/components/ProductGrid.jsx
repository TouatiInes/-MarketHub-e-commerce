import { useState, useEffect } from 'react'
import ProductCard from './ProductCard'
import { productService } from '../services/productService'

const ProductGrid = ({ searchQuery = '', showTitle = false }) => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        console.log('🔄 Fetching products from API...')

        const response = await productService.getProducts()
        console.log('✅ Products fetched successfully:', response.length, 'products')
        console.log('📦 Sample product IDs:', response.slice(0, 3).map(p => ({ name: p.name, id: p._id })))

        setProducts(response || [])
      } catch (error) {
        console.error('❌ Error fetching products:', error)
        setError('Failed to load products')
        // Fallback to empty array instead of mock data
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-white text-lg">Loading products...</div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-red-400 text-lg">{error}</div>
      </div>
    )
  }

  // Empty state
  if (products.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-white text-lg">No products found</div>
      </div>
    )
  }

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'electronics', name: 'Electronics' },
    { id: 'fashion', name: 'Fashion' },
    { id: 'home', name: 'Home & Garden' },
    { id: 'sports', name: 'Sports & Fitness' }
  ]

  // Filter products by category and search query
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    const matchesSearch = !searchQuery ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesCategory && matchesSearch
  })

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fadeInDown">
          <h2 className="text-responsive-lg font-bold text-gradient mb-4">
            {showTitle ? 'All Products' : 'Featured Products'}
          </h2>
          {searchQuery ? (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''} found for "{searchQuery}"
            </p>
          ) : (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {showTitle ? 'Browse our complete collection of premium products' : 'Discover our carefully curated selection of premium products'}
            </p>
          )}
        </div>

        {/* Enhanced Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12 animate-fadeInUp">
          {categories.map((category, index) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`category-filter ${
                selectedCategory === category.id
                  ? 'category-filter-active'
                  : 'category-filter-inactive'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Enhanced Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="product-grid">
            {filteredProducts.map((product, index) => (
              <div
                key={product._id || product.id}
                className="animate-scaleIn"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ProductCard
                  product={product}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 animate-fadeInUp">
            <div className="text-gray-400 mb-4 animate-bounce-gentle">
              <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">No products found</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {searchQuery
                ? `No products match "${searchQuery}". Try adjusting your search terms or browse our categories.`
                : 'No products match the selected category. Try selecting a different category.'
              }
            </p>
            <button
              onClick={() => setSelectedCategory('all')}
              className="btn-primary mt-6"
            >
              View All Products
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export default ProductGrid
