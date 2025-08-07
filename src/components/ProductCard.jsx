import { StarIcon } from '@heroicons/react/24/solid'
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline'
import ResponsiveImage from './ResponsiveImage'
import AddToCartButton from './cart/AddToCartButton'
import WishlistButton from './wishlist/WishlistButton'


const ProductCard = ({ product }) => {
  // Debug product rating and image structure
  console.log('🎯 ProductCard debug:', {
    productName: product.name,
    rating: product.rating,
    ratingType: typeof product.rating,
    image: product.image,
    images: product.images,
    imageType: typeof product.image,
    imagesArray: Array.isArray(product.images),
    imagesLength: product.images ? product.images.length : 'undefined'
  });

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
          src={
            product.images && product.images.length > 0
              ? (product.images.find(img => img.isPrimary)?.url || product.images[0].url)
              : '/placeholder.png'
          }
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
          <WishlistButton
            product={product}
            className="bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white"
          />
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
            {renderStars(
              typeof product.rating === 'object' && product.rating?.average !== undefined
                ? product.rating.average
                : typeof product.rating === 'number'
                  ? product.rating
                  : 0
            )}
          </div>
          <span className="ml-2 text-sm text-gray-500 font-medium">
            ({
              typeof product.rating === 'object' && product.rating?.average !== undefined
                ? product.rating.average
                : typeof product.rating === 'number'
                  ? product.rating
                  : 0
            })
            {product.rating?.count && (
              <span className="text-xs"> • {product.rating.count} reviews</span>
            )}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-gradient">
              ${product.price}
            </span>
            <span className="text-xs text-gray-500">Free shipping</span>
          </div>

          <AddToCartButton
            product={product}
            size="sm"
            className="shadow-lg hover:shadow-glow transform hover:-translate-y-1 transition-all duration-300 group-hover:animate-glow"
          />
        </div>
      </div>
    </div>
  )
}

export default ProductCard
