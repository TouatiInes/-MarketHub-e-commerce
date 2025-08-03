import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import {
  ShoppingCartIcon,
  HeartIcon,
  UserIcon,
  CogIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  DevicePhoneMobileIcon,
  GlobeAltIcon,
  BoltIcon,
  StarIcon
} from '@heroicons/react/24/outline';

const FeatureShowcase = ({ onNavigate }) => {
  const { user, isAuthenticated } = useAuth();
  const { getCartTotals } = useCart();
  const { getWishlistCount } = useWishlist();
  const [activeFeature, setActiveFeature] = useState(null);

  const { itemCount: cartCount } = getCartTotals();
  const wishlistCount = getWishlistCount();

  const features = [
    {
      id: 'shopping-cart',
      title: 'Advanced Shopping Cart',
      description: 'Full-featured shopping cart with persistent storage, real-time calculations, and seamless checkout experience.',
      icon: ShoppingCartIcon,
      color: 'bg-blue-500',
      stats: `${cartCount} items in cart`,
      action: () => onNavigate('cart'),
      actionText: 'View Cart',
      highlights: [
        'Persistent cart across sessions',
        'Real-time price calculations',
        'Guest and user cart sync',
        'Quantity management',
        'Free shipping calculator'
      ]
    },
    {
      id: 'wishlist',
      title: 'Smart Wishlist',
      description: 'Save products for later with intelligent wishlist management and easy cart integration.',
      icon: HeartIcon,
      color: 'bg-red-500',
      stats: `${wishlistCount} items saved`,
      action: () => onNavigate('wishlist'),
      actionText: 'View Wishlist',
      highlights: [
        'Cross-device synchronization',
        'One-click move to cart',
        'Price drop notifications',
        'Share wishlist with friends',
        'Unlimited storage'
      ]
    },
    {
      id: 'authentication',
      title: 'Secure Authentication',
      description: 'JWT-based authentication system with role-based access control and secure user management.',
      icon: UserIcon,
      color: 'bg-green-500',
      stats: isAuthenticated ? `Logged in as ${user?.firstName}` : 'Guest user',
      action: () => onNavigate(isAuthenticated ? 'profile' : 'login'),
      actionText: isAuthenticated ? 'View Profile' : 'Sign In',
      highlights: [
        'JWT token authentication',
        'Role-based permissions',
        'Secure password hashing',
        'Session management',
        'Profile customization'
      ]
    },
    {
      id: 'admin-panel',
      title: 'Admin Management',
      description: 'Comprehensive admin panel for product management, user administration, and system monitoring.',
      icon: CogIcon,
      color: 'bg-purple-500',
      stats: user?.role === 'admin' ? 'Admin access' : 'User access',
      action: () => onNavigate(user?.role === 'admin' ? 'admin' : 'login'),
      actionText: user?.role === 'admin' ? 'Admin Panel' : 'Login as Admin',
      highlights: [
        'Product CRUD operations',
        'Bulk product management',
        'User role management',
        'Sales analytics',
        'System monitoring'
      ]
    },
    {
      id: 'api-testing',
      title: 'API Testing Suite',
      description: 'Built-in API testing tools for developers to test and validate all system endpoints.',
      icon: ChartBarIcon,
      color: 'bg-yellow-500',
      stats: 'Development tools',
      action: () => onNavigate('cart-test'),
      actionText: 'Test APIs',
      highlights: [
        'Automated test suites',
        'Real-time API monitoring',
        'Error handling validation',
        'Performance testing',
        'Documentation generation'
      ]
    },
    {
      id: 'security',
      title: 'Enterprise Security',
      description: 'Bank-level security with encryption, input validation, and protection against common vulnerabilities.',
      icon: ShieldCheckIcon,
      color: 'bg-indigo-500',
      stats: 'Secure & Protected',
      action: null,
      actionText: 'Learn More',
      highlights: [
        'Data encryption at rest',
        'SQL injection protection',
        'XSS prevention',
        'CSRF protection',
        'Rate limiting'
      ]
    },
    {
      id: 'responsive',
      title: 'Mobile-First Design',
      description: 'Fully responsive design that works perfectly on all devices from mobile to desktop.',
      icon: DevicePhoneMobileIcon,
      color: 'bg-pink-500',
      stats: 'All devices supported',
      action: null,
      actionText: 'Test Responsive',
      highlights: [
        'Mobile-first approach',
        'Touch-friendly controls',
        'Adaptive layouts',
        'Fast loading times',
        'Offline capabilities'
      ]
    },
    {
      id: 'performance',
      title: 'High Performance',
      description: 'Optimized for speed with lazy loading, caching, and efficient state management.',
      icon: BoltIcon,
      color: 'bg-orange-500',
      stats: 'Lightning fast',
      action: null,
      actionText: 'Performance Metrics',
      highlights: [
        'Lazy image loading',
        'Component optimization',
        'Efficient state updates',
        'Minimal bundle size',
        'CDN integration'
      ]
    }
  ];

  const demoCredentials = [
    { role: 'Admin', email: 'admin@markethub.com', password: 'admin123' },
    { role: 'User', email: 'user@markethub.com', password: 'user123' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            MarketHub Feature Showcase
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore the comprehensive e-commerce platform with advanced features, 
            secure authentication, and professional-grade functionality.
          </p>
        </div>

        {/* Demo Credentials */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-12">
          <h2 className="text-lg font-semibold text-blue-900 mb-4">🔑 Demo Credentials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {demoCredentials.map((cred, index) => (
              <div key={index} className="bg-white rounded-lg p-4 border border-blue-200">
                <h3 className="font-medium text-blue-900 mb-2">{cred.role} Account</h3>
                <p className="text-sm text-blue-700">
                  <strong>Email:</strong> {cred.email}<br />
                  <strong>Password:</strong> {cred.password}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={feature.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className={`${feature.color} p-3 rounded-lg`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                      <p className="text-sm text-gray-500">{feature.stats}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  
                  {/* Highlights */}
                  <div className="mb-4">
                    <button
                      onClick={() => setActiveFeature(activeFeature === feature.id ? null : feature.id)}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      {activeFeature === feature.id ? 'Hide Details' : 'Show Details'}
                    </button>
                    
                    {activeFeature === feature.id && (
                      <ul className="mt-3 space-y-1">
                        {feature.highlights.map((highlight, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center">
                            <StarIcon className="h-3 w-3 text-yellow-400 mr-2 flex-shrink-0" />
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  
                  {feature.action && (
                    <button
                      onClick={feature.action}
                      className="w-full btn-primary"
                    >
                      {feature.actionText}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Quick Navigation</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: 'Home', route: 'home', icon: '🏠' },
              { name: 'Products', route: 'products', icon: '🛍️' },
              { name: 'Cart', route: 'cart', icon: '🛒' },
              { name: 'Wishlist', route: 'wishlist', icon: '❤️' },
              { name: 'Compare', route: 'compare', icon: '⚖️' },
              { name: 'Profile', route: 'profile', icon: '👤' },
              { name: 'Admin', route: 'admin', icon: '⚙️' },
              { name: 'API Test', route: 'cart-test', icon: '🧪' }
            ].map((item) => (
              <button
                key={item.route}
                onClick={() => onNavigate(item.route)}
                className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors"
              >
                <span className="text-2xl mb-2">{item.icon}</span>
                <span className="text-sm font-medium text-gray-700">{item.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Technology Stack */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Technology Stack</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'React 18', desc: 'Modern UI Framework' },
              { name: 'Node.js', desc: 'Backend Runtime' },
              { name: 'MongoDB', desc: 'NoSQL Database' },
              { name: 'JWT', desc: 'Authentication' },
              { name: 'Tailwind CSS', desc: 'Styling Framework' },
              { name: 'Vite', desc: 'Build Tool' },
              { name: 'Express.js', desc: 'Web Framework' },
              { name: 'Headless UI', desc: 'Accessible Components' }
            ].map((tech, index) => (
              <div key={index} className="text-center">
                <h3 className="font-semibold text-lg">{tech.name}</h3>
                <p className="text-blue-100 text-sm">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Explore?</h2>
          <p className="text-gray-600 mb-6">
            Start by browsing products, adding items to your cart, or testing the admin features.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate('products')}
              className="btn-primary"
            >
              Browse Products
            </button>
            <button
              onClick={() => onNavigate('login')}
              className="btn-outline"
            >
              Sign In to Test
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureShowcase;
