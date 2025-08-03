import { useState, useEffect } from 'react'

const ResponsiveTestHelper = () => {
  const [screenInfo, setScreenInfo] = useState({
    width: 0,
    height: 0,
    devicePixelRatio: 1,
    orientation: 'portrait',
    touchSupport: false
  })
  
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const updateScreenInfo = () => {
      setScreenInfo({
        width: window.innerWidth,
        height: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio || 1,
        orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait',
        touchSupport: 'ontouchstart' in window || navigator.maxTouchPoints > 0
      })
    }

    updateScreenInfo()
    window.addEventListener('resize', updateScreenInfo)
    window.addEventListener('orientationchange', updateScreenInfo)

    // Show helper in development mode
    if (import.meta.env.DEV) {
      setIsVisible(false) // Hidden by default, click to show
    }

    return () => {
      window.removeEventListener('resize', updateScreenInfo)
      window.removeEventListener('orientationchange', updateScreenInfo)
    }
  }, [])

  const getDeviceType = () => {
    const { width } = screenInfo
    if (width < 768) return 'Mobile'
    if (width < 1024) return 'Tablet'
    return 'Desktop'
  }

  const getBreakpoint = () => {
    const { width } = screenInfo
    if (width < 640) return 'xs'
    if (width < 768) return 'sm'
    if (width < 1024) return 'md'
    if (width < 1280) return 'lg'
    if (width < 1536) return 'xl'
    return '2xl'
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-primary-600 text-white p-2 rounded-full shadow-lg hover:bg-primary-700 transition-colors mb-2"
        title="Toggle Responsive Info"
      >
        📱
      </button>
      
      <div className="bg-black/90 text-white p-4 rounded-lg shadow-xl text-xs font-mono max-w-xs">
        <div className="space-y-1">
          <div className="font-bold text-accent-400 border-b border-gray-600 pb-1 mb-2">
            Responsive Info
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <span className="text-gray-300">Device:</span>
            <span className="text-accent-400 font-semibold">{getDeviceType()}</span>
            
            <span className="text-gray-300">Breakpoint:</span>
            <span className="text-accent-400 font-semibold">{getBreakpoint()}</span>
            
            <span className="text-gray-300">Width:</span>
            <span className="text-white">{screenInfo.width}px</span>
            
            <span className="text-gray-300">Height:</span>
            <span className="text-white">{screenInfo.height}px</span>
            
            <span className="text-gray-300">DPR:</span>
            <span className="text-white">{screenInfo.devicePixelRatio}x</span>
            
            <span className="text-gray-300">Orient:</span>
            <span className="text-white">{screenInfo.orientation}</span>
            
            <span className="text-gray-300">Touch:</span>
            <span className={screenInfo.touchSupport ? 'text-green-400' : 'text-red-400'}>
              {screenInfo.touchSupport ? 'Yes' : 'No'}
            </span>
          </div>
          
          <div className="mt-3 pt-2 border-t border-gray-600">
            <div className="text-gray-300 text-xs">Tailwind Breakpoints:</div>
            <div className="text-xs space-y-0.5 mt-1">
              <div className={`${screenInfo.width >= 640 ? 'text-green-400' : 'text-gray-500'}`}>
                sm: 640px+
              </div>
              <div className={`${screenInfo.width >= 768 ? 'text-green-400' : 'text-gray-500'}`}>
                md: 768px+
              </div>
              <div className={`${screenInfo.width >= 1024 ? 'text-green-400' : 'text-gray-500'}`}>
                lg: 1024px+
              </div>
              <div className={`${screenInfo.width >= 1280 ? 'text-green-400' : 'text-gray-500'}`}>
                xl: 1280px+
              </div>
              <div className={`${screenInfo.width >= 1536 ? 'text-green-400' : 'text-gray-500'}`}>
                2xl: 1536px+
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResponsiveTestHelper
