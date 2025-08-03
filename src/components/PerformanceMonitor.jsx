import { useState, useEffect, useRef } from 'react'

const PerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({
    fps: 0,
    memory: 0,
    loadTime: 0,
    renderTime: 0,
    networkSpeed: 'unknown',
    deviceType: 'unknown'
  })
  const [isVisible, setIsVisible] = useState(false)
  const frameCount = useRef(0)
  const lastTime = useRef(performance.now())
  const animationId = useRef(null)

  useEffect(() => {
    // Show in development mode
    if (import.meta.env.DEV) {
      setIsVisible(false) // Hidden by default, click to show
    }

    // Measure initial load time
    const loadTime = performance.timing 
      ? performance.timing.loadEventEnd - performance.timing.navigationStart
      : 0

    // Detect device type based on screen and capabilities
    const detectDeviceType = () => {
      const width = window.screen.width
      const height = window.screen.height
      const pixelRatio = window.devicePixelRatio || 1
      const touchSupport = 'ontouchstart' in window
      
      if (touchSupport && width < 768) return 'Mobile Phone'
      if (touchSupport && width < 1024) return 'Tablet'
      if (width < 1366) return 'Small Laptop'
      if (width < 1920) return 'Desktop'
      return 'Large Display'
    }

    // Estimate network speed
    const estimateNetworkSpeed = () => {
      if (navigator.connection) {
        const connection = navigator.connection
        const effectiveType = connection.effectiveType
        const downlink = connection.downlink
        
        if (effectiveType === 'slow-2g') return 'Very Slow'
        if (effectiveType === '2g') return 'Slow'
        if (effectiveType === '3g') return 'Medium'
        if (effectiveType === '4g' && downlink > 10) return 'Fast'
        if (effectiveType === '4g') return 'Good'
        return 'Unknown'
      }
      return 'Unknown'
    }

    setMetrics(prev => ({
      ...prev,
      loadTime,
      deviceType: detectDeviceType(),
      networkSpeed: estimateNetworkSpeed()
    }))

    // FPS monitoring
    const measureFPS = () => {
      frameCount.current++
      const currentTime = performance.now()
      
      if (currentTime >= lastTime.current + 1000) {
        const fps = Math.round((frameCount.current * 1000) / (currentTime - lastTime.current))
        
        setMetrics(prev => ({
          ...prev,
          fps,
          memory: performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1048576) : 0
        }))
        
        frameCount.current = 0
        lastTime.current = currentTime
      }
      
      animationId.current = requestAnimationFrame(measureFPS)
    }

    measureFPS()

    // Performance observer for render timing
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          if (entry.entryType === 'measure') {
            setMetrics(prev => ({
              ...prev,
              renderTime: Math.round(entry.duration)
            }))
          }
        })
      })
      
      try {
        observer.observe({ entryTypes: ['measure'] })
      } catch (e) {
        console.log('Performance observer not supported')
      }
    }

    return () => {
      if (animationId.current) {
        cancelAnimationFrame(animationId.current)
      }
    }
  }, [])

  const getPerformanceStatus = () => {
    if (metrics.fps >= 55) return { status: 'Excellent', color: 'text-green-400' }
    if (metrics.fps >= 45) return { status: 'Good', color: 'text-yellow-400' }
    if (metrics.fps >= 30) return { status: 'Fair', color: 'text-orange-400' }
    return { status: 'Poor', color: 'text-red-400' }
  }

  const getMemoryStatus = () => {
    if (metrics.memory < 50) return { status: 'Low', color: 'text-green-400' }
    if (metrics.memory < 100) return { status: 'Medium', color: 'text-yellow-400' }
    if (metrics.memory < 200) return { status: 'High', color: 'text-orange-400' }
    return { status: 'Critical', color: 'text-red-400' }
  }

  if (!isVisible) return null

  const performanceStatus = getPerformanceStatus()
  const memoryStatus = getMemoryStatus()

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-green-600 text-white p-2 rounded-full shadow-lg hover:bg-green-700 transition-colors mb-2"
        title="Toggle Performance Monitor"
      >
        ⚡
      </button>
      
      <div className="bg-black/90 text-white p-4 rounded-lg shadow-xl text-xs font-mono max-w-xs">
        <div className="space-y-1">
          <div className="font-bold text-green-400 border-b border-gray-600 pb-1 mb-2">
            Performance Monitor
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <span className="text-gray-300">FPS:</span>
            <span className={`font-semibold ${performanceStatus.color}`}>
              {metrics.fps} ({performanceStatus.status})
            </span>
            
            <span className="text-gray-300">Memory:</span>
            <span className={`font-semibold ${memoryStatus.color}`}>
              {metrics.memory}MB ({memoryStatus.status})
            </span>
            
            <span className="text-gray-300">Load:</span>
            <span className="text-white">{metrics.loadTime}ms</span>
            
            <span className="text-gray-300">Render:</span>
            <span className="text-white">{metrics.renderTime}ms</span>
            
            <span className="text-gray-300">Network:</span>
            <span className="text-white">{metrics.networkSpeed}</span>
            
            <span className="text-gray-300">Device:</span>
            <span className="text-white text-xs">{metrics.deviceType}</span>
          </div>
          
          <div className="mt-3 pt-2 border-t border-gray-600">
            <div className="text-gray-300 text-xs">Performance Tips:</div>
            <div className="text-xs space-y-0.5 mt-1">
              {metrics.fps < 30 && (
                <div className="text-red-400">• Reduce animations</div>
              )}
              {metrics.memory > 100 && (
                <div className="text-orange-400">• High memory usage</div>
              )}
              {metrics.loadTime > 3000 && (
                <div className="text-yellow-400">• Slow initial load</div>
              )}
              {metrics.networkSpeed === 'Slow' && (
                <div className="text-red-400">• Optimize for slow network</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PerformanceMonitor
