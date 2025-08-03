import { useState } from 'react'

const DevToolsToggle = () => {
  const [isVisible, setIsVisible] = useState(false)

  const toggleAllDevTools = () => {
    // Toggle all development tool widgets
    const devToolButtons = document.querySelectorAll('[title*="Toggle"]')
    devToolButtons.forEach(button => {
      if (button.textContent.includes('📱') || 
          button.textContent.includes('⚡') || 
          button.textContent.includes('♿') || 
          button.textContent.includes('🌐')) {
        button.click()
      }
    })
  }

  // Hide completely - access dev tools via browser console
  return null

  return (
    <div className="fixed top-1/2 right-0 transform -translate-y-1/2 z-50">
      <button
        onClick={toggleAllDevTools}
        className="bg-gray-800 text-white p-3 rounded-l-lg shadow-lg hover:bg-gray-700 transition-colors border-l-4 border-accent-500"
        title="Toggle All Dev Tools"
      >
        <div className="flex flex-col items-center space-y-1">
          <span className="text-xs font-mono">DEV</span>
          <span className="text-lg">🛠️</span>
          <span className="text-xs font-mono">TOOLS</span>
        </div>
      </button>
    </div>
  )
}

export default DevToolsToggle
