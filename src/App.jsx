import { useState, useEffect } from 'react'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import { WishlistProvider } from './contexts/WishlistContext'

import Header from './components/Header'
import Hero from './components/Hero'
import ProductGrid from './components/ProductGrid'
import Footer from './components/Footer'
import About from './components/About'
import Contact from './components/Contact'
import Login from './components/Login'
import Register from './components/Register'
import UserProfile from './components/UserProfile'
import ProductManagement from './components/admin/ProductManagement'
import ApiTester from './components/admin/ApiTester'
import ResponsiveTestHelper from './components/ResponsiveTestHelper'
import PerformanceMonitor from './components/PerformanceMonitor'
import AccessibilityChecker from './components/AccessibilityChecker'
import BrowserCompatibilityChecker from './components/BrowserCompatibilityChecker'
import DevToolsToggle from './components/DevToolsToggle'

import CartSidebar from './components/cart/CartSidebar'
import CartSidebarSimple from './components/cart/CartSidebarSimple'
import CartPage from './components/cart/CartPage'
import CartTester from './components/cart/CartTester'
import WishlistPage from './components/wishlist/WishlistPage'

import ProductComparison from './components/comparison/ProductComparison'
import FeatureShowcase from './components/FeatureShowcase'
import ErrorBoundary from './components/ErrorBoundary'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [searchQuery, setSearchQuery] = useState('')

  // Handle browser extension errors and warnings
  useEffect(() => {
    // Clear console on app start (development only)
    if (import.meta.env.DEV) {
      console.clear();
      console.log('🚀 MarketHub E-commerce Platform');
      console.log('📊 Environment:', import.meta.env.MODE);
      console.log('🔗 API URL:', import.meta.env.VITE_API_URL || 'http://localhost:3001/api');
    }

    // Suppress React DevTools warning in production
    if (import.meta.env.PROD) {
      const originalWarn = console.warn;
      console.warn = (...args) => {
        if (args[0]?.includes?.('React DevTools')) return;
        originalWarn.apply(console, args);
      };
    }

    // Handle message channel errors from browser extensions
    const handleError = (event) => {
      if (event.message?.includes?.('message channel closed')) {
        // Silently ignore browser extension errors
        event.preventDefault();
        return false;
      }
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleError);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleError);
    };
  }, []);

  const handleNavigation = (page) => {
    setCurrentPage(page)
    setSearchQuery('') // Clear search when navigating
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
    if (query.trim()) {
      setCurrentPage('products') // Switch to products page when searching
    }
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <>
            <Hero onNavigate={handleNavigation} />
            <ProductGrid searchQuery={searchQuery} />
          </>
        )
      case 'products':
        return <ProductGrid searchQuery={searchQuery} showTitle={true} />
      case 'about':
        return <About />
      case 'contact':
        return <Contact />
      case 'login':
        return <Login onNavigate={handleNavigation} />
      case 'register':
        return <Register onNavigate={handleNavigation} />
      case 'profile':
        return <UserProfile onNavigate={handleNavigation} />
      case 'admin':
        return <ProductManagement />
      case 'admin-api-test':
        return <ApiTester />
      case 'cart':
        return <CartPage onNavigate={handleNavigation} />
      case 'cart-test':
        return <CartTester />
      case 'wishlist':
        return <WishlistPage onNavigate={handleNavigation} />
      case 'compare':
        return <ProductComparison onNavigate={handleNavigation} />
      case 'features':
        return <FeatureShowcase onNavigate={handleNavigation} />
      default:
        return (
          <>
            <Hero onNavigate={handleNavigation} />
            <ProductGrid searchQuery={searchQuery} />
          </>
        )
    }
  }

  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <div className="min-h-screen bg-primary-950">
          <Header
            currentPage={currentPage}
            onNavigate={handleNavigation}
            onSearch={handleSearch}
            searchQuery={searchQuery}
          />
          {renderCurrentPage()}
          <Footer onNavigate={handleNavigation} />

          {/* Cart Sidebar */}
          <CartSidebar />

          <ResponsiveTestHelper />
          <PerformanceMonitor />
          <AccessibilityChecker />
          <BrowserCompatibilityChecker />
          <DevToolsToggle />
            </div>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
