import { useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import ProductGrid from './components/ProductGrid'
import Footer from './components/Footer'
import About from './components/About'
import Contact from './components/Contact'
import ResponsiveTestHelper from './components/ResponsiveTestHelper'
import PerformanceMonitor from './components/PerformanceMonitor'
import AccessibilityChecker from './components/AccessibilityChecker'
import BrowserCompatibilityChecker from './components/BrowserCompatibilityChecker'
import DevToolsToggle from './components/DevToolsToggle'

function App() {
  const [cartItems, setCartItems] = useState([])
  const [currentPage, setCurrentPage] = useState('home')
  const [searchQuery, setSearchQuery] = useState('')

  const addToCart = (product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id)
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

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
            <ProductGrid onAddToCart={addToCart} searchQuery={searchQuery} />
          </>
        )
      case 'products':
        return <ProductGrid onAddToCart={addToCart} searchQuery={searchQuery} showTitle={true} />
      case 'about':
        return <About />
      case 'contact':
        return <Contact />
      default:
        return (
          <>
            <Hero onNavigate={handleNavigation} />
            <ProductGrid onAddToCart={addToCart} searchQuery={searchQuery} />
          </>
        )
    }
  }

  return (
    <div className="min-h-screen bg-primary-950">
      <Header
        cartItems={cartItems}
        currentPage={currentPage}
        onNavigate={handleNavigation}
        onSearch={handleSearch}
        searchQuery={searchQuery}
      />
      {renderCurrentPage()}
      <Footer onNavigate={handleNavigation} />
      <ResponsiveTestHelper />
      <PerformanceMonitor />
      <AccessibilityChecker />
      <BrowserCompatibilityChecker />
      <DevToolsToggle />
    </div>
  )
}

export default App
