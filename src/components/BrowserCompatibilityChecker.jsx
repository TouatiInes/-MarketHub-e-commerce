import { useState, useEffect } from 'react'

const BrowserCompatibilityChecker = () => {
  const [browserInfo, setBrowserInfo] = useState({})
  const [compatibilityIssues, setCompatibilityIssues] = useState([])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (import.meta.env.DEV) {
      setIsVisible(false) // Hidden by default, click to show
    }

    detectBrowserInfo()
    checkCompatibility()
  }, [])

  const detectBrowserInfo = () => {
    const userAgent = navigator.userAgent
    const platform = navigator.platform
    const vendor = navigator.vendor
    
    let browserName = 'Unknown'
    let browserVersion = 'Unknown'
    let engineName = 'Unknown'
    
    // Detect browser
    if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
      browserName = 'Chrome'
      browserVersion = userAgent.match(/Chrome\/([0-9.]+)/)?.[1] || 'Unknown'
      engineName = 'Blink'
    } else if (userAgent.includes('Firefox')) {
      browserName = 'Firefox'
      browserVersion = userAgent.match(/Firefox\/([0-9.]+)/)?.[1] || 'Unknown'
      engineName = 'Gecko'
    } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
      browserName = 'Safari'
      browserVersion = userAgent.match(/Version\/([0-9.]+)/)?.[1] || 'Unknown'
      engineName = 'WebKit'
    } else if (userAgent.includes('Edg')) {
      browserName = 'Edge'
      browserVersion = userAgent.match(/Edg\/([0-9.]+)/)?.[1] || 'Unknown'
      engineName = 'Blink'
    }
    
    // Detect OS
    let osName = 'Unknown'
    if (platform.includes('Win')) osName = 'Windows'
    else if (platform.includes('Mac')) osName = 'macOS'
    else if (platform.includes('Linux')) osName = 'Linux'
    else if (userAgent.includes('Android')) osName = 'Android'
    else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) osName = 'iOS'
    
    setBrowserInfo({
      browserName,
      browserVersion,
      engineName,
      osName,
      platform,
      userAgent,
      vendor,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      language: navigator.language,
      languages: navigator.languages,
      hardwareConcurrency: navigator.hardwareConcurrency,
      maxTouchPoints: navigator.maxTouchPoints,
      deviceMemory: navigator.deviceMemory,
      connection: navigator.connection
    })
  }

  const checkCompatibility = () => {
    const issues = []
    
    // Check for modern JavaScript features
    if (!window.fetch) {
      issues.push({
        feature: 'Fetch API',
        severity: 'high',
        description: 'Browser does not support modern fetch API',
        fallback: 'Use XMLHttpRequest polyfill'
      })
    }
    
    if (!window.Promise) {
      issues.push({
        feature: 'Promises',
        severity: 'high',
        description: 'Browser does not support Promises',
        fallback: 'Use Promise polyfill'
      })
    }
    
    if (!Array.prototype.includes) {
      issues.push({
        feature: 'Array.includes',
        severity: 'medium',
        description: 'Browser does not support Array.includes',
        fallback: 'Use indexOf polyfill'
      })
    }
    
    // Check for CSS features
    const testElement = document.createElement('div')
    
    if (!CSS.supports('display', 'grid')) {
      issues.push({
        feature: 'CSS Grid',
        severity: 'high',
        description: 'Browser does not support CSS Grid',
        fallback: 'Use Flexbox fallback'
      })
    }
    
    if (!CSS.supports('display', 'flex')) {
      issues.push({
        feature: 'CSS Flexbox',
        severity: 'high',
        description: 'Browser does not support Flexbox',
        fallback: 'Use float-based layout'
      })
    }
    
    if (!CSS.supports('backdrop-filter', 'blur(10px)')) {
      issues.push({
        feature: 'Backdrop Filter',
        severity: 'low',
        description: 'Browser does not support backdrop-filter',
        fallback: 'Use solid background fallback'
      })
    }
    
    // Check for Web APIs
    if (!('IntersectionObserver' in window)) {
      issues.push({
        feature: 'Intersection Observer',
        severity: 'medium',
        description: 'Browser does not support Intersection Observer',
        fallback: 'Use scroll event polyfill'
      })
    }
    
    if (!('ResizeObserver' in window)) {
      issues.push({
        feature: 'Resize Observer',
        severity: 'low',
        description: 'Browser does not support Resize Observer',
        fallback: 'Use window resize events'
      })
    }
    
    if (!('serviceWorker' in navigator)) {
      issues.push({
        feature: 'Service Workers',
        severity: 'medium',
        description: 'Browser does not support Service Workers',
        fallback: 'No offline functionality'
      })
    }
    
    // Check for modern image formats
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    if (!canvas.toDataURL('image/webp').includes('data:image/webp')) {
      issues.push({
        feature: 'WebP Images',
        severity: 'low',
        description: 'Browser does not support WebP format',
        fallback: 'Use JPEG/PNG fallbacks'
      })
    }
    
    setCompatibilityIssues(issues)
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-red-400'
      case 'medium': return 'text-yellow-400'
      case 'low': return 'text-blue-400'
      default: return 'text-gray-400'
    }
  }

  const getBrowserIcon = (browserName) => {
    switch (browserName) {
      case 'Chrome': return '🟢'
      case 'Firefox': return '🟠'
      case 'Safari': return '🔵'
      case 'Edge': return '🟦'
      default: return '🌐'
    }
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-purple-600 text-white p-2 rounded-full shadow-lg hover:bg-purple-700 transition-colors mb-2"
        title="Toggle Browser Compatibility"
      >
        🌐
      </button>
      
      <div className="bg-black/90 text-white p-4 rounded-lg shadow-xl text-xs font-mono max-w-sm max-h-96 overflow-y-auto custom-scrollbar">
        <div className="space-y-2">
          <div className="font-bold text-purple-400 border-b border-gray-600 pb-1 mb-3">
            Browser Compatibility
          </div>
          
          {/* Browser Info */}
          <div className="bg-gray-800/50 p-2 rounded">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-lg">{getBrowserIcon(browserInfo.browserName)}</span>
              <div>
                <div className="font-semibold text-white">
                  {browserInfo.browserName} {browserInfo.browserVersion}
                </div>
                <div className="text-gray-400 text-xs">
                  {browserInfo.osName} • {browserInfo.engineName}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-1 text-xs">
              <span className="text-gray-300">Language:</span>
              <span className="text-white">{browserInfo.language}</span>
              
              <span className="text-gray-300">Cores:</span>
              <span className="text-white">{browserInfo.hardwareConcurrency || 'Unknown'}</span>
              
              <span className="text-gray-300">Touch:</span>
              <span className="text-white">{browserInfo.maxTouchPoints > 0 ? 'Yes' : 'No'}</span>
              
              <span className="text-gray-300">Online:</span>
              <span className={browserInfo.onLine ? 'text-green-400' : 'text-red-400'}>
                {browserInfo.onLine ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
          
          {/* Compatibility Issues */}
          <div>
            <div className="text-gray-300 text-xs mb-2">
              Compatibility Issues: <span className="text-white font-semibold">{compatibilityIssues.length}</span>
            </div>
            
            {compatibilityIssues.length === 0 ? (
              <div className="text-green-400 text-center py-2">
                ✅ Fully Compatible!
              </div>
            ) : (
              <div className="space-y-2">
                {compatibilityIssues.map((issue, index) => (
                  <div key={index} className="bg-gray-800/50 p-2 rounded border-l-2 border-gray-600">
                    <div className={`font-semibold ${getSeverityColor(issue.severity)}`}>
                      {issue.feature}
                    </div>
                    <div className="text-gray-400 text-xs mt-1">
                      {issue.description}
                    </div>
                    <div className="text-blue-400 text-xs mt-1">
                      💡 {issue.fallback}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Quick Actions */}
          <div className="mt-3 pt-2 border-t border-gray-600">
            <div className="text-gray-300 text-xs mb-1">Quick Actions:</div>
            <div className="space-y-1">
              <button 
                onClick={checkCompatibility}
                className="w-full bg-purple-600 hover:bg-purple-700 px-2 py-1 rounded text-xs transition-colors"
              >
                🔄 Re-check Compatibility
              </button>
              <button 
                onClick={() => console.log('Browser Info:', browserInfo)}
                className="w-full bg-gray-600 hover:bg-gray-700 px-2 py-1 rounded text-xs transition-colors"
              >
                📋 Log Browser Info
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BrowserCompatibilityChecker
