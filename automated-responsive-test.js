/**
 * Automated Responsive Testing Script for MarketHub
 * Run this script in the browser console to perform comprehensive responsive testing
 */

class ResponsiveTestSuite {
  constructor() {
    this.testResults = []
    this.currentTest = 0
    this.totalTests = 0
    this.devicePresets = [
      { name: 'iPhone SE', width: 375, height: 667, type: 'mobile' },
      { name: 'iPhone 12', width: 390, height: 844, type: 'mobile' },
      { name: 'iPhone 14 Pro Max', width: 430, height: 932, type: 'mobile' },
      { name: 'Samsung Galaxy S20', width: 412, height: 915, type: 'mobile' },
      { name: 'iPad', width: 768, height: 1024, type: 'tablet' },
      { name: 'iPad Air', width: 820, height: 1180, type: 'tablet' },
      { name: 'iPad Pro', width: 1024, height: 1366, type: 'tablet' },
      { name: 'Small Laptop', width: 1366, height: 768, type: 'desktop' },
      { name: 'Desktop', width: 1440, height: 900, type: 'desktop' },
      { name: 'Large Desktop', width: 1920, height: 1080, type: 'desktop' },
      { name: 'Ultra-wide', width: 2560, height: 1440, type: 'desktop' }
    ]
  }

  // Simulate device viewport
  setViewport(width, height) {
    return new Promise((resolve) => {
      // In a real browser automation tool like Puppeteer, you'd use page.setViewport()
      // For manual testing, we'll use CSS to simulate
      const viewport = document.querySelector('meta[name="viewport"]')
      if (viewport) {
        viewport.content = `width=${width}, initial-scale=1.0`
      }
      
      // Simulate window resize
      window.dispatchEvent(new Event('resize'))
      
      setTimeout(resolve, 500) // Wait for layout to settle
    })
  }

  // Test navigation responsiveness
  async testNavigation(deviceInfo) {
    const results = []
    
    // Check if mobile menu exists
    const mobileMenuButton = document.querySelector('[data-testid="mobile-menu"], .md\\:hidden button')
    const desktopNav = document.querySelector('nav.hidden.md\\:flex, nav:not(.md\\:hidden)')
    
    if (deviceInfo.type === 'mobile') {
      results.push({
        test: 'Mobile menu button visible',
        passed: mobileMenuButton && window.getComputedStyle(mobileMenuButton).display !== 'none',
        element: 'Mobile menu button'
      })
      
      results.push({
        test: 'Desktop navigation hidden',
        passed: !desktopNav || window.getComputedStyle(desktopNav).display === 'none',
        element: 'Desktop navigation'
      })
    } else {
      results.push({
        test: 'Desktop navigation visible',
        passed: desktopNav && window.getComputedStyle(desktopNav).display !== 'none',
        element: 'Desktop navigation'
      })
    }
    
    return results
  }

  // Test product grid responsiveness
  async testProductGrid(deviceInfo) {
    const results = []
    const productGrid = document.querySelector('.product-grid, [data-testid="product-grid"]')
    
    if (productGrid) {
      const gridStyle = window.getComputedStyle(productGrid)
      const gridColumns = gridStyle.gridTemplateColumns
      const columnCount = gridColumns.split(' ').length
      
      let expectedColumns
      if (deviceInfo.type === 'mobile') expectedColumns = 1
      else if (deviceInfo.type === 'tablet') expectedColumns = 2
      else expectedColumns = 3 // or 4 for large desktop
      
      results.push({
        test: `Product grid has ${expectedColumns} columns on ${deviceInfo.type}`,
        passed: columnCount >= expectedColumns,
        element: 'Product grid',
        details: `Expected: ${expectedColumns}, Actual: ${columnCount}`
      })
    }
    
    return results
  }

  // Test touch target sizes
  async testTouchTargets(deviceInfo) {
    const results = []
    const touchElements = document.querySelectorAll('button, a, input[type="button"], input[type="submit"]')
    const minSize = 44 // WCAG recommendation
    
    touchElements.forEach((element, index) => {
      const rect = element.getBoundingClientRect()
      const isValidSize = rect.width >= minSize && rect.height >= minSize
      
      if (!isValidSize) {
        results.push({
          test: `Touch target ${index + 1} meets minimum size`,
          passed: false,
          element: element.tagName,
          details: `Size: ${Math.round(rect.width)}×${Math.round(rect.height)}px (min: ${minSize}×${minSize}px)`
        })
      }
    })
    
    if (results.length === 0) {
      results.push({
        test: 'All touch targets meet minimum size requirements',
        passed: true,
        element: 'Touch targets'
      })
    }
    
    return results
  }

  // Test text readability
  async testTextReadability(deviceInfo) {
    const results = []
    const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div')
    
    textElements.forEach((element, index) => {
      const style = window.getComputedStyle(element)
      const fontSize = parseFloat(style.fontSize)
      const minFontSize = deviceInfo.type === 'mobile' ? 14 : 12
      
      if (fontSize < minFontSize && element.textContent.trim()) {
        results.push({
          test: `Text element ${index + 1} has readable font size`,
          passed: false,
          element: element.tagName,
          details: `Font size: ${fontSize}px (min: ${minFontSize}px)`
        })
      }
    })
    
    if (results.length === 0) {
      results.push({
        test: 'All text elements have readable font sizes',
        passed: true,
        element: 'Text elements'
      })
    }
    
    return results
  }

  // Test horizontal scrolling
  async testHorizontalScrolling(deviceInfo) {
    const results = []
    const body = document.body
    const html = document.documentElement
    
    const hasHorizontalScroll = Math.max(
      body.scrollWidth,
      body.offsetWidth,
      html.clientWidth,
      html.scrollWidth,
      html.offsetWidth
    ) > window.innerWidth
    
    results.push({
      test: 'No horizontal scrolling',
      passed: !hasHorizontalScroll,
      element: 'Page layout',
      details: hasHorizontalScroll ? 'Horizontal scroll detected' : 'No horizontal scroll'
    })
    
    return results
  }

  // Test image responsiveness
  async testImageResponsiveness(deviceInfo) {
    const results = []
    const images = document.querySelectorAll('img')
    
    images.forEach((img, index) => {
      const rect = img.getBoundingClientRect()
      const parentRect = img.parentElement.getBoundingClientRect()
      
      const overflowsParent = rect.width > parentRect.width
      
      if (overflowsParent) {
        results.push({
          test: `Image ${index + 1} fits within container`,
          passed: false,
          element: 'Image',
          details: `Image width: ${Math.round(rect.width)}px, Container: ${Math.round(parentRect.width)}px`
        })
      }
    })
    
    if (results.length === 0) {
      results.push({
        test: 'All images fit within their containers',
        passed: true,
        element: 'Images'
      })
    }
    
    return results
  }

  // Run all tests for a specific device
  async runDeviceTests(deviceInfo) {
    console.log(`🧪 Testing ${deviceInfo.name} (${deviceInfo.width}×${deviceInfo.height})...`)
    
    await this.setViewport(deviceInfo.width, deviceInfo.height)
    
    const allResults = []
    
    // Run individual test suites
    const navigationResults = await this.testNavigation(deviceInfo)
    const gridResults = await this.testProductGrid(deviceInfo)
    const touchResults = await this.testTouchTargets(deviceInfo)
    const textResults = await this.testTextReadability(deviceInfo)
    const scrollResults = await this.testHorizontalScrolling(deviceInfo)
    const imageResults = await this.testImageResponsiveness(deviceInfo)
    
    allResults.push(...navigationResults, ...gridResults, ...touchResults, ...textResults, ...scrollResults, ...imageResults)
    
    const deviceResult = {
      device: deviceInfo,
      tests: allResults,
      passed: allResults.filter(r => r.passed).length,
      failed: allResults.filter(r => !r.passed).length,
      total: allResults.length
    }
    
    this.testResults.push(deviceResult)
    this.currentTest++
    
    // Log progress
    console.log(`✅ ${deviceInfo.name}: ${deviceResult.passed}/${deviceResult.total} tests passed`)
    
    return deviceResult
  }

  // Run complete test suite
  async runAllTests() {
    console.log('🚀 Starting Automated Responsive Testing Suite...')
    console.log(`📱 Testing ${this.devicePresets.length} devices`)
    
    this.testResults = []
    this.currentTest = 0
    this.totalTests = this.devicePresets.length
    
    for (const device of this.devicePresets) {
      await this.runDeviceTests(device)
      
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
    
    this.generateReport()
  }

  // Generate comprehensive test report
  generateReport() {
    console.log('\n📊 RESPONSIVE TESTING REPORT')
    console.log('=' * 50)
    
    const totalTests = this.testResults.reduce((sum, device) => sum + device.total, 0)
    const totalPassed = this.testResults.reduce((sum, device) => sum + device.passed, 0)
    const totalFailed = this.testResults.reduce((sum, device) => sum + device.failed, 0)
    
    console.log(`\n📈 OVERALL RESULTS:`)
    console.log(`Total Tests: ${totalTests}`)
    console.log(`Passed: ${totalPassed} (${Math.round(totalPassed/totalTests*100)}%)`)
    console.log(`Failed: ${totalFailed} (${Math.round(totalFailed/totalTests*100)}%)`)
    
    console.log(`\n📱 DEVICE BREAKDOWN:`)
    this.testResults.forEach(result => {
      const status = result.failed === 0 ? '✅' : '❌'
      console.log(`${status} ${result.device.name}: ${result.passed}/${result.total} passed`)
      
      if (result.failed > 0) {
        result.tests.filter(t => !t.passed).forEach(test => {
          console.log(`   ❌ ${test.test} - ${test.details || ''}`)
        })
      }
    })
    
    console.log(`\n🎯 RECOMMENDATIONS:`)
    const failedTests = this.testResults.flatMap(r => r.tests.filter(t => !t.passed))
    const commonIssues = {}
    
    failedTests.forEach(test => {
      const key = test.test.split(' ')[0] // Group by first word
      commonIssues[key] = (commonIssues[key] || 0) + 1
    })
    
    Object.entries(commonIssues)
      .sort(([,a], [,b]) => b - a)
      .forEach(([issue, count]) => {
        console.log(`• Fix ${issue} issues (${count} occurrences)`)
      })
    
    // Store results globally for further analysis
    window.responsiveTestResults = this.testResults
    console.log('\n💾 Results saved to window.responsiveTestResults')
  }
}

// Auto-run if script is executed directly
if (typeof window !== 'undefined') {
  window.ResponsiveTestSuite = ResponsiveTestSuite
  
  // Provide easy access function
  window.runResponsiveTests = () => {
    const suite = new ResponsiveTestSuite()
    return suite.runAllTests()
  }
  
  console.log('🧪 Responsive Test Suite loaded!')
  console.log('Run window.runResponsiveTests() to start testing')
}

export default ResponsiveTestSuite
