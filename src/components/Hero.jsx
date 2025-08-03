const Hero = ({ onNavigate }) => {
  return (
    <section className="hero-bg py-12 min-h-[80vh] flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Hero Image */}
          <div className="order-2 lg:order-1 flex justify-center lg:justify-start">
            <div className="relative">
              <div className="w-80 h-80 lg:w-96 lg:h-96 rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-500">
                <img
                  src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
                  alt="Shopping Experience - Modern E-commerce"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/30 to-transparent"></div>
              </div>
              {/* Floating elements around image */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r from-accent-500 to-accent-600 rounded-full opacity-80 animate-bounce-gentle shadow-glow"></div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-r from-white to-gray-200 rounded-full opacity-60 animate-pulse-slow"></div>
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="order-1 lg:order-2 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 animate-fadeInDown text-shadow-lg">
              Discover Amazing
              <span className="block text-gradient-accent animate-fadeInUp">Products</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl animate-fadeInUp text-shadow">
              Shop the latest trends and find everything you need in one place.
              Quality products, unbeatable prices, and exceptional service.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start animate-fadeInUp">
              <button
                onClick={() => onNavigate('products')}
                className="btn-primary text-lg px-8 py-4 shadow-2xl hover:shadow-glow-lg transform hover:scale-105 hover:-translate-y-1 transition-all duration-300"
              >
                Shop Now
              </button>
              <button
                onClick={() => onNavigate('products')}
                className="btn-outline text-lg px-8 py-4 bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white hover:text-primary-900 shadow-2xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-300"
              >
                View Categories
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-20 h-20 bg-gradient-to-r from-accent-500 to-accent-600 rounded-full opacity-30 animate-bounce-gentle shadow-glow"></div>
        <div className="absolute top-32 left-20 w-16 h-16 bg-gradient-to-r from-white to-gray-200 rounded-full opacity-20 animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-1/4 w-12 h-12 bg-gradient-to-r from-accent-400 to-accent-500 rounded-full opacity-40 animate-bounce-gentle delay-1000 shadow-glow"></div>
        <div className="absolute bottom-32 left-1/3 w-8 h-8 bg-gradient-to-r from-white to-gray-200 rounded-full opacity-30 animate-pulse-slow delay-500"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-accent-500/5 to-primary-500/5 rounded-full animate-spin-slow"></div>

        {/* Floating particles */}
        <div className="absolute top-1/4 right-1/6 w-2 h-2 bg-accent-400 rounded-full animate-bounce-gentle delay-300"></div>
        <div className="absolute top-3/4 left-1/6 w-3 h-3 bg-white/40 rounded-full animate-bounce-gentle delay-700"></div>
        <div className="absolute top-1/3 left-1/4 w-1 h-1 bg-accent-300 rounded-full animate-pulse-slow delay-200"></div>
        <div className="absolute bottom-1/4 right-1/3 w-2 h-2 bg-white/30 rounded-full animate-pulse-slow delay-900"></div>
      </div>
    </section>
  )
}

export default Hero
