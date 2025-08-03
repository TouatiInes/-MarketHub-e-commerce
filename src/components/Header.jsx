import { useState } from 'react'
import { ShoppingCartIcon, Bars3Icon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'

const Header = ({ cartItems, currentPage, onNavigate, onSearch, searchQuery }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    const query = e.target.search.value.trim()
    onSearch(query)
    setIsSearchOpen(false)
    setIsMenuOpen(false)
  }

  const handleNavClick = (page, e) => {
    e.preventDefault()
    onNavigate(page)
    setIsMenuOpen(false)
  }

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'products', label: 'Products' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' }
  ]

  return (
    <header className="bg-gradient-to-r from-primary-900 via-primary-800 to-primary-900 shadow-2xl sticky top-0 z-50 backdrop-blur-sm border-b border-primary-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <button
              onClick={(e) => handleNavClick('home', e)}
              className="text-2xl font-bold text-white hover:text-gray-200 transition-all duration-300 transform hover:scale-105"
            >
              Market<span className="text-gradient-accent">Hub</span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={(e) => handleNavClick(item.id, e)}
                className={`transition-all duration-300 transform hover:scale-105 ${
                  currentPage === item.id
                    ? 'nav-link-active'
                    : 'nav-link'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearchSubmit} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  name="search"
                  placeholder="Search products..."
                  defaultValue={searchQuery}
                  className="input-search hover:shadow-glow focus:shadow-glow transition-all duration-300"
                  aria-label="Search products"
                />
                <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </form>
          </div>

          {/* Cart, Search and Mobile Menu */}
          <div className="flex items-center space-x-2">
            {/* Mobile Search Button */}
            <button
              className="md:hidden touch-target text-gray-300 hover:text-white transition-colors"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              aria-label="Open search"
            >
              <MagnifyingGlassIcon className="h-6 w-6" />
            </button>

            {/* Cart */}
            <button className="relative touch-target text-gray-300 hover:text-white transition-all duration-300 transform hover:scale-110 hover:shadow-glow rounded-lg" aria-label={`Shopping cart with ${totalItems} items`}>
              <ShoppingCartIcon className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-accent-500 to-accent-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-bounce-gentle shadow-lg">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              className="md:hidden touch-target text-gray-300 hover:text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        {isSearchOpen && (
          <div className="md:hidden mt-2">
            <form onSubmit={handleSearchSubmit} className="px-2">
              <div className="relative">
                <input
                  type="text"
                  name="search"
                  placeholder="Search products..."
                  defaultValue={searchQuery}
                  className="w-full bg-primary-800 text-white placeholder-gray-400 border border-primary-700 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500"
                  autoFocus
                  aria-label="Search products on mobile"
                />
                <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </form>
          </div>
        )}

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-primary-800 rounded-lg mt-2">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={(e) => handleNavClick(item.id, e)}
                  className={`block w-full text-left px-3 py-3 transition-colors min-h-[44px] flex items-center ${
                    currentPage === item.id
                      ? 'text-accent-500 font-medium'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
