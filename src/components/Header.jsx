import { useState } from 'react'
import { Bars3Icon, XMarkIcon, MagnifyingGlassIcon, UserIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../contexts/AuthContext'
import CartIcon from './cart/CartIcon'

const Header = ({ currentPage, onNavigate, onSearch, searchQuery }) => {
  const { user, isAuthenticated, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

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
    { id: 'features', label: 'Features' },
    { id: 'wishlist', label: 'Wishlist' },
    { id: 'compare', label: 'Compare' },
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
            <CartIcon className="text-gray-300 hover:text-white transition-all duration-300 transform hover:scale-110 hover:shadow-glow rounded-lg" />

            {/* User Authentication */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors touch-target"
                  aria-label="User menu"
                >
                  <div className="h-8 w-8 bg-gradient-to-r from-accent-500 to-accent-600 rounded-full flex items-center justify-center">
                    <UserIcon className="h-5 w-5 text-white" />
                  </div>
                  <span className="hidden md:block text-sm font-medium">
                    {user?.firstName || 'User'}
                  </span>
                  <ChevronDownIcon className="hidden md:block h-4 w-4" />
                </button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        onNavigate('profile')
                        setIsUserMenuOpen(false)
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      My Profile
                    </button>
                    <button
                      onClick={() => {
                        onNavigate('orders')
                        setIsUserMenuOpen(false)
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      My Orders
                    </button>
                    {user?.role === 'admin' && (
                      <button
                        onClick={() => {
                          onNavigate('admin')
                          setIsUserMenuOpen(false)
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-purple-700 hover:bg-purple-50 transition-colors"
                      >
                        Admin Panel
                      </button>
                    )}
                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button
                        onClick={() => {
                          logout()
                          setIsUserMenuOpen(false)
                          onNavigate('home')
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <button
                  onClick={() => onNavigate('login')}
                  className="text-gray-300 hover:text-white transition-colors font-medium"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onNavigate('register')}
                  className="btn-primary px-4 py-2"
                >
                  Sign Up
                </button>
              </div>
            )}

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

              {/* Mobile Authentication */}
              <div className="border-t border-primary-700 mt-4 pt-4">
                {isAuthenticated ? (
                  <>
                    <div className="px-3 py-2 mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-gradient-to-r from-accent-500 to-accent-600 rounded-full flex items-center justify-center">
                          <UserIcon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="text-white font-medium">
                            {user?.firstName} {user?.lastName}
                          </p>
                          <p className="text-gray-400 text-sm">{user?.email}</p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        onNavigate('profile')
                        setIsMenuOpen(false)
                      }}
                      className="block w-full text-left px-3 py-3 text-gray-300 hover:text-white transition-colors min-h-[44px] flex items-center"
                    >
                      My Profile
                    </button>
                    <button
                      onClick={() => {
                        onNavigate('orders')
                        setIsMenuOpen(false)
                      }}
                      className="block w-full text-left px-3 py-3 text-gray-300 hover:text-white transition-colors min-h-[44px] flex items-center"
                    >
                      My Orders
                    </button>
                    {user?.role === 'admin' && (
                      <button
                        onClick={() => {
                          onNavigate('admin')
                          setIsMenuOpen(false)
                        }}
                        className="block w-full text-left px-3 py-3 text-purple-300 hover:text-purple-100 transition-colors min-h-[44px] flex items-center"
                      >
                        Admin Panel
                      </button>
                    )}
                    <button
                      onClick={() => {
                        logout()
                        setIsMenuOpen(false)
                        onNavigate('home')
                      }}
                      className="block w-full text-left px-3 py-3 text-red-300 hover:text-red-100 transition-colors min-h-[44px] flex items-center"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        onNavigate('login')
                        setIsMenuOpen(false)
                      }}
                      className="block w-full text-left px-3 py-3 text-gray-300 hover:text-white transition-colors min-h-[44px] flex items-center"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => {
                        onNavigate('register')
                        setIsMenuOpen(false)
                      }}
                      className="block w-full text-left px-3 py-3 bg-gradient-to-r from-accent-500 to-accent-600 text-white rounded-lg mx-3 mt-2 min-h-[44px] flex items-center justify-center"
                    >
                      Sign Up
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
