const About = () => {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-white min-h-screen">
      {/* Enhanced Hero Section */}
      <section className="hero-bg py-20 min-h-screen flex items-center relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-responsive-xl font-bold text-white mb-6 animate-fadeInDown text-shadow-lg">
              About <span className="text-gradient-accent">MarketHub</span>
            </h1>
            <p className="text-responsive-md text-gray-300 max-w-3xl mx-auto animate-fadeInUp text-shadow">
              Your trusted partner in discovering amazing products and exceptional shopping experiences.
            </p>
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-accent-500/20 to-accent-600/20 rounded-full animate-bounce-gentle"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-gradient-to-r from-white/10 to-gray-200/10 rounded-full animate-pulse-slow"></div>
      </section>

      {/* Enhanced Main Content */}
      <section className="py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="animate-slideInLeft">
              <h2 className="text-responsive-lg font-bold text-gradient mb-6">Our Story</h2>
              <p className="text-lg text-gray-600 mb-6">
                Founded with a vision to revolutionize online shopping, MarketHub has grown from a small startup 
                to a trusted e-commerce platform serving customers worldwide. We believe that everyone deserves 
                access to quality products at fair prices.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Our journey began with a simple idea: create a marketplace where customers can discover amazing 
                products while enjoying a seamless shopping experience. Today, we're proud to offer thousands 
                of carefully curated products across multiple categories.
              </p>
            </div>
            <div className="bg-gradient-to-br from-primary-100 via-white to-accent-100 rounded-2xl p-8 shadow-2xl hover:shadow-primary-lg transition-all duration-500 animate-slideInRight border border-primary-200/50">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center group">
                  <div className="text-4xl font-bold text-gradient mb-2 group-hover:scale-110 transition-transform duration-300">10K+</div>
                  <div className="text-gray-600 font-medium">Happy Customers</div>
                </div>
                <div className="text-center group">
                  <div className="text-4xl font-bold text-gradient mb-2 group-hover:scale-110 transition-transform duration-300">5K+</div>
                  <div className="text-gray-600 font-medium">Products</div>
                </div>
                <div className="text-center group">
                  <div className="text-4xl font-bold text-gradient mb-2 group-hover:scale-110 transition-transform duration-300">99%</div>
                  <div className="text-gray-600 font-medium">Satisfaction Rate</div>
                </div>
                <div className="text-center group">
                  <div className="text-4xl font-bold text-gradient mb-2 group-hover:scale-110 transition-transform duration-300">24/7</div>
                  <div className="text-gray-600 font-medium">Support</div>
                </div>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-accent-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Quality First</h3>
                <p className="text-gray-600">
                  We carefully curate every product to ensure it meets our high standards for quality and value.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-primary-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Fast Delivery</h3>
                <p className="text-gray-600">
                  Lightning-fast shipping and delivery to get your products to you as quickly as possible.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-accent-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Customer Love</h3>
                <p className="text-gray-600">
                  Your satisfaction is our priority. We're here to help with exceptional customer service.
                </p>
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Meet Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">JD</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">John Doe</h3>
                <p className="text-accent-600 font-medium mb-2">CEO & Founder</p>
                <p className="text-gray-600 text-sm">
                  Visionary leader with 15+ years in e-commerce and retail innovation.
                </p>
              </div>
              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">JS</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Jane Smith</h3>
                <p className="text-accent-600 font-medium mb-2">Head of Product</p>
                <p className="text-gray-600 text-sm">
                  Product expert focused on creating amazing user experiences and product curation.
                </p>
              </div>
              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-primary-400 to-accent-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">MB</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Mike Brown</h3>
                <p className="text-accent-600 font-medium mb-2">CTO</p>
                <p className="text-gray-600 text-sm">
                  Technology leader ensuring our platform delivers the best shopping experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
