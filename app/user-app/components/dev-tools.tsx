'use client'

import { useState, useEffect } from 'react'

export function DevTools() {
  const [isVisible, setIsVisible] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [changes, setChanges] = useState<string[]>([])

  useEffect(() => {
    // Toggle visibility with Ctrl+Shift+D
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault()
        setIsVisible(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Listen for file changes (in development)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const ws = new WebSocket('ws://localhost:3003')

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          if (data.type === 'hot-update') {
            setLastUpdate(new Date())
            setChanges(prev => [`${new Date().toLocaleTimeString()}: ${data.file}`, ...prev].slice(0, 5))
          }
        } catch (e) {
          console.error('Failed to parse WebSocket message:', e)
        }
      }

      return () => ws.close()
    }
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 rounded-lg border bg-background p-4 shadow-lg">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Development Tools</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-muted-foreground hover:text-foreground"
        >
          ✕
        </button>
      </div>
      <div className="mt-2">
        <p className="text-sm text-muted-foreground">
          Last update: {lastUpdate.toLocaleTimeString()}
        </p>
        <div className="mt-2 space-y-1">
          {changes.map((change, i) => (
            <p key={i} className="text-xs text-muted-foreground">
              {change}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
} 