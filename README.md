# 🛒 MarketHub - Premium E-commerce Platform

A modern, responsive e-commerce website built with React, Vite, and Tailwind CSS. Features a sophisticated dark purple and orange design with comprehensive accessibility and performance optimization.

![MarketHub Preview](https://via.placeholder.com/800x400/2e0176/ffffff?text=MarketHub+E-commerce+Platform)

## ✨ Features

### 🎨 **Modern Design**
- Dark purple gradient backgrounds with orange accents
- Responsive design that works on all devices (320px to 2560px)
- Smooth animations and hover effects
- Professional product cards with image optimization

### 🛍️ **E-commerce Functionality**
- Product catalog with category filtering
- Shopping cart with item counter
- Search functionality across products
- Responsive product grid (1→2→3→4 columns)
- Product ratings and reviews display

### 📱 **Responsive & Accessible**
- Mobile-first design approach
- WCAG 2.1 AA accessibility compliance
- Touch-friendly interface (44px minimum touch targets)
- Screen reader support with proper ARIA labels
- Keyboard navigation support

### ⚡ **Performance Optimized**
- 60 FPS smooth animations
- Lazy loading for images
- Optimized bundle sizes
- Hardware-accelerated transitions
- WebP image format with fallbacks

### 🧪 **Advanced Testing Suite**
- Automated responsive testing across 11 device types
- Real-time performance monitoring
- Accessibility compliance checking
- Cross-browser compatibility testing
- Comprehensive development tools

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/TouatiInes/-MarketHub-e-commerce.git
   cd -MarketHub-e-commerce
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

## 📁 Project Structure

```
MarketHub/
├── src/
│   ├── components/
│   │   ├── Header.jsx              # Navigation & search
│   │   ├── Hero.jsx                # Landing section
│   │   ├── ProductGrid.jsx         # Product catalog
│   │   ├── ProductCard.jsx         # Individual product cards
│   │   ├── Footer.jsx              # Footer with links
│   │   ├── About.jsx               # About page
│   │   ├── Contact.jsx             # Contact form
│   │   ├── ResponsiveImage.jsx     # Optimized image component
│   │   └── testing/                # Development tools
│   ├── index.css                   # Global styles & utilities
│   ├── App.jsx                     # Main application
│   └── main.jsx                    # Entry point
├── public/                         # Static assets
├── test-responsive.html            # Multi-device testing tool
├── automated-responsive-test.js    # Automated testing suite
└── README.md                       # Project documentation
```

## 🎨 Design System

### **Color Palette**
- **Primary**: Dark purple gradients (#2e0176 to #7916ff)
- **Accent**: Orange highlights (#f97316 to #ea580c)
- **Neutral**: White and gray tones for content

### **Typography**
- **Font**: Inter (Google Fonts)
- **Responsive**: Fluid typography using clamp()
- **Hierarchy**: Clear heading structure (h1-h6)

### **Components**
- **Buttons**: Primary, secondary, outline, and ghost variants
- **Cards**: Interactive product cards with hover effects
- **Forms**: Accessible form inputs with proper labels
- **Navigation**: Responsive header with mobile menu

## 📱 Responsive Breakpoints

| Breakpoint | Screen Size | Layout |
|------------|-------------|---------|
| xs | 0px - 639px | Mobile (1 column) |
| sm | 640px - 767px | Large mobile (1-2 columns) |
| md | 768px - 1023px | Tablet (2-3 columns) |
| lg | 1024px - 1279px | Small desktop (3-4 columns) |
| xl | 1280px - 1535px | Desktop (4 columns) |
| 2xl | 1536px+ | Large desktop (4+ columns) |

## 🧪 Testing

### **Automated Testing**
```bash
# Run responsive tests (in browser console)
window.runResponsiveTests()
```

### **Manual Testing**
1. **Browser DevTools**: F12 → Device Toolbar
2. **External Tool**: Open `test-responsive.html`
3. **Development Widgets**: Available in dev mode

### **Accessibility Testing**
- WCAG 2.1 AA compliance
- Screen reader compatibility
- Keyboard navigation
- Color contrast validation

## 🛠️ Built With

- **[React 18](https://reactjs.org/)** - UI library
- **[Vite](https://vitejs.dev/)** - Build tool
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS
- **[Heroicons](https://heroicons.com/)** - SVG icons
- **[PostCSS](https://postcss.org/)** - CSS processing

## 📦 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🌟 Key Features Implemented

### **Navigation & Search**
- ✅ Responsive navigation with mobile hamburger menu
- ✅ Real-time product search functionality
- ✅ Category-based filtering
- ✅ Breadcrumb navigation

### **Product Catalog**
- ✅ Responsive product grid
- ✅ Product cards with images, ratings, and pricing
- ✅ Category filtering (Electronics, Fashion, Home, Sports)
- ✅ Add to cart functionality

### **User Experience**
- ✅ Smooth page transitions
- ✅ Loading states and animations
- ✅ Error handling and empty states
- ✅ Mobile-optimized touch interactions

### **Performance**
- ✅ Image lazy loading and optimization
- ✅ Code splitting and tree shaking
- ✅ CSS optimization and purging
- ✅ Fast development with HMR

## 🔧 Configuration

### **Tailwind CSS**
Custom configuration with extended color palette and animations in `tailwind.config.js`

### **Vite**
Optimized build configuration in `vite.config.js`

### **PostCSS**
CSS processing pipeline in `postcss.config.js`

## 📈 Performance Metrics

- ⚡ **First Contentful Paint**: < 1.5s
- ⚡ **Largest Contentful Paint**: < 2.5s
- ⚡ **Time to Interactive**: < 3.0s
- ⚡ **Cumulative Layout Shift**: < 0.1

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Ines Touati**
- GitHub: [@TouatiInes](https://github.com/TouatiInes)

## 🙏 Acknowledgments

- Design inspiration from modern e-commerce platforms
- Icons by [Heroicons](https://heroicons.com/)
- Images from [Unsplash](https://unsplash.com/)
- Fonts by [Google Fonts](https://fonts.google.com/)

---

⭐ **Star this repository if you found it helpful!**
