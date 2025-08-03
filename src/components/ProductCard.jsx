import { StarIcon } from '@heroicons/react/24/solid'
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline'
import ResponsiveImage from './ResponsiveImage'

const ProductCard = ({ product, onAddToCart }) => {
  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <StarIcon key={i} className="h-4 w-4 text-yellow-400" />
      )
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <StarOutlineIcon className="h-4 w-4 text-yellow-400" />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <StarIcon className="h-4 w-4 text-yellow-400" />
          </div>
        </div>
      )
    }

    const remainingStars = 5 - Math.ceil(rating)
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <StarOutlineIcon key={`empty-${i}`} className="h-4 w-4 text-gray-300" />
      )
    }

    return stars
  }

  return (
    <div className="product-card group">
      <div className="relative overflow-hidden rounded-t-xl">
        <ResponsiveImage
          src={product.image}
          alt={product.name}
          className="product-image"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          loading="lazy"
        />
        <div className="product-overlay">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
            <span className="text-sm font-medium text-gray-900">Quick View</span>
          </div>
        </div>
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
            <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
        </div>
      </div>
      
      <div className="p-6 bg-gradient-to-b from-white to-gray-50/50">
        <div className="mb-3">
          <span className="badge badge-primary text-xs">
            {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-700 transition-colors duration-300">
          {product.name}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center mb-4">
          <div className="flex items-center space-x-1">
            {renderStars(product.rating)}
          </div>
          <span className="ml-2 text-sm text-gray-500 font-medium">
            ({product.rating})
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-gradient">
              ${product.price}
            </span>
            <span className="text-xs text-gray-500">Free shipping</span>
          </div>

          <button
            onClick={() => onAddToCart(product)}
            className="btn-primary text-sm px-6 py-2.5 shadow-lg hover:shadow-glow transform hover:-translate-y-1 transition-all duration-300 group-hover:animate-glow"
          >
            <span className="flex items-center space-x-2">
              <span>Add to Cart</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
