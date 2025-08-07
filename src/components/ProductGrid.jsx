// Product creation form
const ProductForm = ({ onAdd }) => {
  const [form, setForm] = useState({ name: '', category: '', price: '', status: 'active' })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      // Simulate API call or use productService.createProduct
      const newProduct = {
        ...form,
        price: parseFloat(form.price),
        _id: Math.random().toString(36).substr(2, 9),
      }
      await onAdd(newProduct)
      setForm({ name: '', category: '', price: '', status: 'active' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="mb-8 bg-white p-6 rounded-lg shadow-md flex flex-wrap gap-4 items-end" onSubmit={handleSubmit}>
      <input name="name" value={form.name} onChange={handleChange} placeholder="Product Name" className="input input-bordered" required />
      <input name="category" value={form.category} onChange={handleChange} placeholder="Category" className="input input-bordered" required />
      <input name="price" value={form.price} onChange={handleChange} placeholder="Price" type="number" min="0" className="input input-bordered" required />
      <select name="status" value={form.status} onChange={handleChange} className="input input-bordered">
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
        <option value="discontinued">Discontinued</option>
      </select>
      <button type="submit" className="btn-primary px-6" disabled={loading}>{loading ? 'Adding...' : 'Add Product'}</button>
    </form>
  )
}
import { useState, useEffect } from 'react'
import ProductCard from './ProductCard'
import { productService } from '../services/productService'

const ProductGrid = ({ searchQuery = '', showTitle = false }) => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAll, setShowAll] = useState(true)

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
  // Show the product table only when products exist; otherwise, show 'No products found.'
// ProductTable component
const ProductTable = ({ products, onEdit, onDelete }) => (
  <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
    <thead>
      <tr>
        <th className="px-4 py-2 border-b">Name</th>
        <th className="px-4 py-2 border-b">Category</th>
        <th className="px-4 py-2 border-b">Price</th>
        <th className="px-4 py-2 border-b">Status</th>
        <th className="px-4 py-2 border-b">Actions</th>
      </tr>
    </thead>
    <tbody>
      {products.length === 0 ? (
        <tr>
          <td colSpan={5} className="text-center py-6 text-gray-500">No products found</td>
        </tr>
      ) : (
        products.map(product => (
          <tr key={product._id || product.id} className="hover:bg-gray-50">
            <td className="px-4 py-2 border-b">{product.name}</td>
            <td className="px-4 py-2 border-b">{product.category}</td>
            <td className="px-4 py-2 border-b">${product.price}</td>
            <td className="px-4 py-2 border-b">{product.status || 'active'}</td>
            <td className="px-4 py-2 border-b flex gap-2">
              <button onClick={() => onEdit(product)} className="btn-secondary px-2 py-1 text-xs flex items-center gap-1">
                <span role="img" aria-label="edit">✏️</span> Edit
              </button>
              <button onClick={() => onDelete(product)} className="btn-danger px-2 py-1 text-xs flex items-center gap-1">
                <span role="img" aria-label="delete">🗑️</span> Delete
              </button>
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
)
  // Add product handler (for immediate update)
  const handleAddProduct = async (newProduct) => {
    setProducts(prev => [newProduct, ...prev])
  }

  // Edit product handler
  const handleEditProduct = (product) => {
    // Show edit modal or navigate to edit page
    alert(`Edit product: ${product.name}`)
  }

  // Delete product handler
  const handleDeleteProduct = async (product) => {
    if (window.confirm(`Are you sure you want to delete ${product.name}?`)) {
      // Call API to delete
      try {
        await productService.deleteProduct(product._id || product.id)
        setProducts(prev => prev.filter(p => (p._id || p.id) !== (product._id || product.id)))
      } catch (err) {
        alert('Failed to delete product')
      }
    }
  }

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'electronics', name: 'Electronics' },
    { id: 'fashion', name: 'Fashion' },
    { id: 'home', name: 'Home & Garden' },
    { id: 'sports', name: 'Sports & Fitness' }
  ]

  // Filter products by category and search query
  const filteredProducts = showAll
    ? products
    : products.filter(product => {
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
          <button
            className={`category-filter category-filter-active`}
            onClick={() => { setShowAll(true); setSelectedCategory('all'); }}
          >
            Show All Products
          </button>
          {categories.map((category, index) => (
            <button
              key={category.id}
              onClick={() => { setShowAll(false); setSelectedCategory(category.id); }}
              className={`category-filter ${
                selectedCategory === category.id && !showAll
                  ? 'category-filter-active'
                  : 'category-filter-inactive'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Product cards only, no management table or Add Product button */}
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
          <div className="mt-8 text-center text-lg text-gray-500">No products found</div>
        )}
      </div>
    </section>
  )
}

export default ProductGrid
