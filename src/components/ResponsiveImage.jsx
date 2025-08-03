import { useState, useEffect, useRef } from 'react'

const ResponsiveImage = ({ 
  src, 
  alt, 
  className = '', 
  sizes = '100vw',
  loading = 'lazy',
  quality = 80,
  placeholder = true,
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const [currentSrc, setCurrentSrc] = useState('')
  const imgRef = useRef(null)
  const observerRef = useRef(null)

  // Generate responsive image URLs based on screen size
  const generateResponsiveSrc = (baseSrc, width) => {
    // In a real app, you'd use a service like Cloudinary or ImageKit
    // For demo purposes, we'll use the original URL with parameters
    if (baseSrc.includes('unsplash.com')) {
      return `${baseSrc}&w=${width}&q=${quality}&fm=webp&fit=crop`
    }
    return baseSrc
  }

  // Get optimal image size based on device
  const getOptimalImageSize = () => {
    const devicePixelRatio = window.devicePixelRatio || 1
    const screenWidth = window.innerWidth
    
    // Calculate optimal width based on screen size and pixel ratio
    let optimalWidth
    
    if (screenWidth <= 640) {
      optimalWidth = Math.min(640, screenWidth) * devicePixelRatio
    } else if (screenWidth <= 768) {
      optimalWidth = Math.min(768, screenWidth) * devicePixelRatio
    } else if (screenWidth <= 1024) {
      optimalWidth = Math.min(1024, screenWidth) * devicePixelRatio
    } else {
      optimalWidth = Math.min(1200, screenWidth) * devicePixelRatio
    }
    
    // Round to nearest 100 for better caching
    return Math.ceil(optimalWidth / 100) * 100
  }

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (loading === 'lazy' && imgRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsInView(true)
              observerRef.current?.unobserve(entry.target)
            }
          })
        },
        {
          rootMargin: '50px' // Start loading 50px before the image comes into view
        }
      )

      observerRef.current.observe(imgRef.current)
    } else {
      setIsInView(true)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [loading])

  // Update image source when in view or screen size changes
  useEffect(() => {
    if (isInView && src) {
      const optimalSize = getOptimalImageSize()
      const responsiveSrc = generateResponsiveSrc(src, optimalSize)
      setCurrentSrc(responsiveSrc)
    }
  }, [isInView, src])

  // Handle window resize for responsive images
  useEffect(() => {
    const handleResize = () => {
      if (isInView && src) {
        const optimalSize = getOptimalImageSize()
        const responsiveSrc = generateResponsiveSrc(src, optimalSize)
        setCurrentSrc(responsiveSrc)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isInView, src])

  const handleLoad = () => {
    setIsLoaded(true)
  }

  const handleError = () => {
    console.warn(`Failed to load image: ${currentSrc}`)
    // Fallback to original source
    if (currentSrc !== src) {
      setCurrentSrc(src)
    }
  }

  // Placeholder component
  const PlaceholderDiv = () => (
    <div 
      className={`bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse flex items-center justify-center ${className}`}
      style={{ aspectRatio: '16/9' }}
    >
      <svg 
        className="w-8 h-8 text-gray-400" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
        />
      </svg>
    </div>
  )

  return (
    <div ref={imgRef} className="relative overflow-hidden">
      {/* Placeholder */}
      {placeholder && !isLoaded && <PlaceholderDiv />}
      
      {/* Main Image */}
      {isInView && currentSrc && (
        <img
          src={currentSrc}
          alt={alt}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          onLoad={handleLoad}
          onError={handleError}
          loading={loading}
          sizes={sizes}
          {...props}
        />
      )}
      
      {/* Loading indicator */}
      {isInView && currentSrc && !isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-500"></div>
        </div>
      )}
    </div>
  )
}

// Higher-order component for automatic responsive images
export const withResponsiveImages = (Component) => {
  return (props) => {
    // Replace all img elements with ResponsiveImage components
    const enhancedProps = {
      ...props,
      children: typeof props.children === 'string' 
        ? props.children 
        : props.children // In a real implementation, you'd recursively process children
    }
    
    return <Component {...enhancedProps} />
  }
}

// Hook for responsive image utilities
export const useResponsiveImage = (src, options = {}) => {
  const [optimizedSrc, setOptimizedSrc] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    if (src) {
      const img = new Image()
      img.onload = () => {
        setIsLoading(false)
        setOptimizedSrc(src)
      }
      img.onerror = () => {
        setIsLoading(false)
        console.warn(`Failed to load image: ${src}`)
      }
      img.src = src
    }
  }, [src])
  
  return {
    src: optimizedSrc,
    isLoading,
    preload: (imageSrc) => {
      const img = new Image()
      img.src = imageSrc
    }
  }
}

export default ResponsiveImage
