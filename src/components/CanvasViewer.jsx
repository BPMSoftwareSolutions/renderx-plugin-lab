import { useEffect, useRef, useState } from 'react'
import { useConductor, useEventBus } from '../ConductorProvider'
import './CanvasViewer.css'

/**
 * CanvasViewer - Displays the actual canvas UI plugin for real-time interaction
 * Shows components dropped on the canvas and visualizes topic/symphony interactions
 */
function CanvasViewer() {
  const canvasRef = useRef(null)
  const conductor = useConductor()
  const eventBus = useEventBus()
  const [components, setComponents] = useState([])
  const [lastEvent, setLastEvent] = useState(null)

  useEffect(() => {
    if (!canvasRef.current || !eventBus) return

    // Subscribe to all canvas-related events to show real-time updates
    const handlers = []

    // Helper to add event listener
    const addListener = (eventName, handler) => {
      if (eventBus.addEventListener) {
        eventBus.addEventListener(eventName, handler)
        handlers.push({ eventName, handler })
      }
    }

    // Listen for component creation
    addListener('canvas.component.create', (data) => {
      console.log('📦 Component created:', data)
      setLastEvent({ type: 'create', data, timestamp: new Date() })
      setComponents(prev => [...prev, { 
        id: data.elementId || `component-${Date.now()}`, 
        type: data.type || 'unknown',
        ...data 
      }])
    })

    // Listen for component selection
    addListener('canvas.component.select', (data) => {
      console.log('🎯 Component selected:', data)
      setLastEvent({ type: 'select', data, timestamp: new Date() })
    })

    // Listen for component updates
    addListener('canvas.component.update.attribute', (data) => {
      console.log('✏️ Component updated:', data)
      setLastEvent({ type: 'update', data, timestamp: new Date() })
    })

    // Listen for component deletion
    addListener('canvas.component.delete', (data) => {
      console.log('🗑️ Component deleted:', data)
      setLastEvent({ type: 'delete', data, timestamp: new Date() })
      setComponents(prev => prev.filter(c => c.id !== data.elementId))
    })

    // Listen for drag operations
    addListener('canvas.component.drag.start', (data) => {
      console.log('👆 Drag started:', data)
      setLastEvent({ type: 'drag-start', data, timestamp: new Date() })
    })

    addListener('canvas.component.drag.move', (data) => {
      console.log('👉 Drag move:', data)
      setLastEvent({ type: 'drag-move', data, timestamp: new Date() })
    })

    // Cleanup subscriptions
    return () => {
      if (eventBus.removeEventListener) {
        handlers.forEach(({ eventName, handler }) => {
          eventBus.removeEventListener(eventName, handler)
        })
      }
    }
  }, [eventBus])

  const clearCanvas = () => {
    setComponents([])
    setLastEvent(null)
  }

  const getEventIcon = (type) => {
    switch (type) {
      case 'create': return '📦'
      case 'select': return '🎯'
      case 'update': return '✏️'
      case 'delete': return '🗑️'
      case 'drag-start': return '👆'
      case 'drag-move': return '👉'
      case 'drag-end': return '🎯'
      default: return '📌'
    }
  }

  return (
    <div className="canvas-viewer">
      <div className="canvas-header">
        <h3>🎨 Canvas Viewer</h3>
        <button onClick={clearCanvas} className="clear-btn">Clear Canvas</button>
      </div>
      
      <div className="canvas-info">
        <span className="component-count">
          {components.length} component{components.length !== 1 ? 's' : ''}
        </span>
        {lastEvent && (
          <span className="last-event">
            {getEventIcon(lastEvent.type)} Last: {lastEvent.type}
          </span>
        )}
      </div>

      <div className="canvas-container" ref={canvasRef}>
        <div className="canvas-grid">
          {components.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🎨</div>
              <h4>Canvas is Empty</h4>
              <p>Publish topics or play symphonies to see components appear here</p>
              <div className="empty-hints">
                <div className="hint">💡 Try publishing <code>canvas.component.create</code></div>
                <div className="hint">💡 Play a symphony like "Create Component"</div>
              </div>
            </div>
          ) : (
            <div className="components-list">
              {components.map((component, index) => (
                <div key={component.id} className="canvas-component">
                  <div className="component-header">
                    <span className="component-type">{component.type}</span>
                    <span className="component-id">{component.id}</span>
                  </div>
                  <div className="component-details">
                    {component.x !== undefined && component.y !== undefined && (
                      <div className="component-position">
                        Position: ({component.x}, {component.y})
                      </div>
                    )}
                    {component.width && component.height && (
                      <div className="component-size">
                        Size: {component.width} × {component.height}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {lastEvent && (
        <div className="event-display">
          <div className="event-header">
            <span className="event-icon">{getEventIcon(lastEvent.type)}</span>
            <strong>Last Event: {lastEvent.type}</strong>
            <span className="event-time">
              {lastEvent.timestamp.toLocaleTimeString()}
            </span>
          </div>
          <pre className="event-data">
            {JSON.stringify(lastEvent.data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}

export default CanvasViewer
