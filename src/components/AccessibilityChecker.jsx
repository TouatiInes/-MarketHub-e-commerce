import { useState, useEffect } from 'react'

const AccessibilityChecker = () => {
  const [issues, setIssues] = useState([])
  const [isVisible, setIsVisible] = useState(false)
  const [isScanning, setIsScanning] = useState(false)

  const checkAccessibility = () => {
    setIsScanning(true)
    const foundIssues = []

    // Check for missing alt text
    const images = document.querySelectorAll('img')
    images.forEach((img, index) => {
      if (!img.alt || img.alt.trim() === '') {
        foundIssues.push({
          type: 'Missing Alt Text',
          severity: 'high',
          element: `Image ${index + 1}`,
          description: 'Image missing alt text for screen readers'
        })
      }
    })

    // Check for missing form labels
    const inputs = document.querySelectorAll('input, textarea, select')
    inputs.forEach((input, index) => {
      const hasLabel = input.labels && input.labels.length > 0
      const hasAriaLabel = input.getAttribute('aria-label')
      const hasAriaLabelledBy = input.getAttribute('aria-labelledby')
      
      if (!hasLabel && !hasAriaLabel && !hasAriaLabelledBy) {
        foundIssues.push({
          type: 'Missing Form Label',
          severity: 'high',
          element: `${input.tagName} ${index + 1}`,
          description: 'Form element missing accessible label'
        })
      }
    })

    // Check for insufficient color contrast
    const checkContrast = (element) => {
      const style = window.getComputedStyle(element)
      const bgColor = style.backgroundColor
      const textColor = style.color
      
      // Simple contrast check (would need more sophisticated algorithm for production)
      if (bgColor === 'rgba(0, 0, 0, 0)' || bgColor === 'transparent') {
        return true // Skip transparent backgrounds
      }
      
      // This is a simplified check - in production, you'd use a proper contrast ratio calculator
      return true
    }

    // Check for missing heading hierarchy
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
    let lastLevel = 0
    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1))
      if (level > lastLevel + 1) {
        foundIssues.push({
          type: 'Heading Hierarchy',
          severity: 'medium',
          element: `${heading.tagName} ${index + 1}`,
          description: `Heading level skipped (${lastLevel} to ${level})`
        })
      }
      lastLevel = level
    })

    // Check for missing focus indicators
    const focusableElements = document.querySelectorAll(
      'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    )
    focusableElements.forEach((element, index) => {
      const style = window.getComputedStyle(element, ':focus')
      const outline = style.outline
      const boxShadow = style.boxShadow
      
      if (outline === 'none' && !boxShadow.includes('inset')) {
        foundIssues.push({
          type: 'Missing Focus Indicator',
          severity: 'medium',
          element: `${element.tagName} ${index + 1}`,
          description: 'Element missing visible focus indicator'
        })
      }
    })

    // Check for small touch targets
    const touchTargets = document.querySelectorAll('button, a, input[type="button"], input[type="submit"]')
    touchTargets.forEach((element, index) => {
      const rect = element.getBoundingClientRect()
      const minSize = 44 // WCAG recommended minimum
      
      if (rect.width < minSize || rect.height < minSize) {
        foundIssues.push({
          type: 'Small Touch Target',
          severity: 'medium',
          element: `${element.tagName} ${index + 1}`,
          description: `Touch target too small (${Math.round(rect.width)}×${Math.round(rect.height)}px, should be ${minSize}×${minSize}px)`
        })
      }
    })

    // Check for missing ARIA landmarks
    const landmarks = document.querySelectorAll('main, nav, header, footer, aside, section[aria-label], [role="banner"], [role="navigation"], [role="main"], [role="contentinfo"]')
    if (landmarks.length === 0) {
      foundIssues.push({
        type: 'Missing ARIA Landmarks',
        severity: 'medium',
        element: 'Page structure',
        description: 'Page missing semantic landmarks for navigation'
      })
    }

    setIssues(foundIssues)
    setIsScanning(false)
  }

  useEffect(() => {
    if (import.meta.env.DEV) {
      setIsVisible(false) // Hidden by default, click to show
      // Auto-scan on component mount
      setTimeout(checkAccessibility, 1000)
    }
  }, [])

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-red-400'
      case 'medium': return 'text-yellow-400'
      case 'low': return 'text-blue-400'
      default: return 'text-gray-400'
    }
  }

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high': return '🚨'
      case 'medium': return '⚠️'
      case 'low': return 'ℹ️'
      default: return '📝'
    }
  }

  if (!isVisible) return null

  return (
    <div className="fixed top-4 left-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors mb-2"
        title="Toggle Accessibility Checker"
      >
        ♿
      </button>
      
      <div className="bg-black/90 text-white p-4 rounded-lg shadow-xl text-xs font-mono max-w-sm max-h-96 overflow-y-auto custom-scrollbar">
        <div className="space-y-2">
          <div className="flex items-center justify-between border-b border-gray-600 pb-2 mb-3">
            <div className="font-bold text-blue-400">Accessibility Checker</div>
            <button
              onClick={checkAccessibility}
              disabled={isScanning}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-2 py-1 rounded text-xs transition-colors"
            >
              {isScanning ? '🔄' : '🔍'} Scan
            </button>
          </div>
          
          <div className="mb-3">
            <div className="text-gray-300 text-xs mb-1">
              Issues Found: <span className="text-white font-semibold">{issues.length}</span>
            </div>
            <div className="flex space-x-4 text-xs">
              <span className="text-red-400">
                High: {issues.filter(i => i.severity === 'high').length}
              </span>
              <span className="text-yellow-400">
                Medium: {issues.filter(i => i.severity === 'medium').length}
              </span>
              <span className="text-blue-400">
                Low: {issues.filter(i => i.severity === 'low').length}
              </span>
            </div>
          </div>
          
          {issues.length === 0 ? (
            <div className="text-green-400 text-center py-4">
              ✅ No accessibility issues found!
            </div>
          ) : (
            <div className="space-y-2">
              {issues.map((issue, index) => (
                <div key={index} className="bg-gray-800/50 p-2 rounded border-l-2 border-gray-600">
                  <div className="flex items-start space-x-2">
                    <span className="text-sm">{getSeverityIcon(issue.severity)}</span>
                    <div className="flex-1">
                      <div className={`font-semibold ${getSeverityColor(issue.severity)}`}>
                        {issue.type}
                      </div>
                      <div className="text-gray-300 text-xs">
                        Element: {issue.element}
                      </div>
                      <div className="text-gray-400 text-xs mt-1">
                        {issue.description}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-4 pt-3 border-t border-gray-600">
            <div className="text-gray-300 text-xs mb-2">Quick Tests:</div>
            <div className="space-y-1 text-xs">
              <div className="text-gray-400">• Tab through all elements</div>
              <div className="text-gray-400">• Test with screen reader</div>
              <div className="text-gray-400">• Check color contrast</div>
              <div className="text-gray-400">• Verify keyboard navigation</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccessibilityChecker
