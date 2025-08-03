import { useState } from 'react'
import ProductCard from './ProductCard'

const ProductGrid = ({ searchQuery = '', showTitle = false }) => {
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Sample product data
  const products = [
    {
      _id: "product-1",
      id: 1,
      name: "Wireless Headphones",
      price: 99.99,
      category: "electronics",
      sku: "WH-001",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
      images: [{ url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop", alt: "Wireless Headphones" }],
      rating: 4.5,
      description: "Premium wireless headphones with noise cancellation",
      inventory: { stock: 50, lowStockThreshold: 10, trackInventory: true },
      status: "active"
    },
    {
      _id: "product-2",
      id: 2,
      name: "Smart Watch",
      price: 199.99,
      category: "electronics",
      sku: "SW-002",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
      images: [{ url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop", alt: "Smart Watch" }],
      rating: 4.8,
      description: "Advanced smartwatch with health monitoring",
      inventory: { stock: 25, lowStockThreshold: 5, trackInventory: true },
      status: "active"
    },
    {
      _id: "product-3",
      id: 3,
      name: "Designer Backpack",
      price: 79.99,
      category: "fashion",
      sku: "BP-003",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
      images: [{ url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop", alt: "Designer Backpack" }],
      rating: 4.3,
      description: "Stylish and functional designer backpack",
      inventory: { stock: 30, lowStockThreshold: 5, trackInventory: true },
      status: "active"
    },
    {
      _id: "product-4",
      id: 4,
      name: "Coffee Maker",
      price: 149.99,
      category: "home",
      sku: "CM-004",
      image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop",
      images: [{ url: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop", alt: "Coffee Maker" }],
      rating: 4.6,
      description: "Professional-grade coffee maker for home use",
      inventory: { stock: 15, lowStockThreshold: 3, trackInventory: true },
      status: "active"
    },
    {
      _id: "product-5",
      id: 5,
      name: "Running Shoes",
      price: 129.99,
      category: "sports",
      sku: "RS-005",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
      images: [{ url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop", alt: "Running Shoes" }],
      rating: 4.7,
      description: "Comfortable running shoes for all terrains",
      inventory: { stock: 40, lowStockThreshold: 8, trackInventory: true },
      status: "active"
    },
    {
      _id: "product-6",
      id: 6,
      name: "Smartphone",
      price: 699.99,
      category: "electronics",
      sku: "SP-006",
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop",
      images: [{ url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop", alt: "Smartphone" }],
      rating: 4.9,
      description: "Latest smartphone with advanced camera system",
      inventory: { stock: 20, lowStockThreshold: 5, trackInventory: true },
      status: "active"
    },
    {
      _id: "product-7",
      id: 7,
      name: "Yoga Mat",
      price: 39.99,
      category: "sports",
      sku: "YM-007",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop",
      images: [{ url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop", alt: "Yoga Mat" }],
      rating: 4.4,
      description: "Premium yoga mat for comfortable practice",
      inventory: { stock: 60, lowStockThreshold: 10, trackInventory: true },
      status: "active"
    },
    {
      _id: "product-8",
      id: 8,
      name: "Desk Lamp",
      price: 59.99,
      category: "home",
      sku: "DL-008",
      image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop",
      images: [{ url: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop", alt: "Desk Lamp" }],
      rating: 4.2,
      description: "Modern LED desk lamp with adjustable brightness",
      inventory: { stock: 35, lowStockThreshold: 7, trackInventory: true },
      status: "active"
    }
  ]

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
                key={product.id}
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
