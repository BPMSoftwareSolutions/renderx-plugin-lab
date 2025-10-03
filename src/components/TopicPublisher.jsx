import { useState } from 'react'
import { useEventBus, useConductorStatus } from '../ConductorProvider'
import './TopicPublisher.css'

/**
 * TopicPublisher - Interactive component for publishing topics to the EventRouter
 * Allows testing various canvas component topics with custom payloads
 */
function TopicPublisher() {
  const eventBus = useEventBus()
  const { isInitialized } = useConductorStatus()
  const [selectedTopic, setSelectedTopic] = useState('canvas.component.select')
  const [payload, setPayload] = useState('{"elementId": "test-element-1"}')
  const [publishLog, setPublishLog] = useState([])
  const [error, setError] = useState(null)

  // Available topics from the canvas-component plugin
  const availableTopics = [
    { 
      value: 'canvas.component.select', 
      label: 'Select Component',
      defaultPayload: '{"elementId": "test-element-1"}'
    },
    { 
      value: 'canvas.component.deselect', 
      label: 'Deselect Component',
      defaultPayload: '{"elementId": "test-element-1"}'
    },
    { 
      value: 'canvas.component.drag.start', 
      label: 'Drag Start',
      defaultPayload: '{"elementId": "test-element-1", "x": 100, "y": 100}'
    },
    { 
      value: 'canvas.component.drag.move', 
      label: 'Drag Move',
      defaultPayload: '{"elementId": "test-element-1", "x": 150, "y": 150, "deltaX": 50, "deltaY": 50}'
    },
    { 
      value: 'canvas.component.drag.end', 
      label: 'Drag End',
      defaultPayload: '{"elementId": "test-element-1", "x": 200, "y": 200}'
    },
    { 
      value: 'canvas.component.selection.changed', 
      label: 'Selection Changed',
      defaultPayload: '{"selectedIds": ["test-element-1", "test-element-2"]}'
    },
    { 
      value: 'canvas.component.create', 
      label: 'Create Component',
      defaultPayload: '{"type": "button", "x": 100, "y": 100, "width": 120, "height": 40}'
    },
    { 
      value: 'canvas.component.update', 
      label: 'Update Component',
      defaultPayload: '{"elementId": "test-element-1", "properties": {"width": 200, "height": 100}}'
    },
    { 
      value: 'canvas.component.delete', 
      label: 'Delete Component',
      defaultPayload: '{"elementId": "test-element-1"}'
    },
    { 
      value: 'canvas.component.export.gif', 
      label: 'Export as GIF',
      defaultPayload: '{"elementId": "test-element-1", "duration": 3000}'
    },
    { 
      value: 'canvas.component.import.requested', 
      label: 'Import Components',
      defaultPayload: '{"source": "clipboard", "format": "ui"}'
    }
  ]

  const handleTopicChange = (e) => {
    const topic = e.target.value
    setSelectedTopic(topic)
    
    // Update payload with default for the selected topic
    const topicInfo = availableTopics.find(t => t.value === topic)
    if (topicInfo) {
      setPayload(topicInfo.defaultPayload)
    }
    setError(null)
  }

  const handlePublish = () => {
    try {
      setError(null)
      
      // Parse the payload
      const parsedPayload = JSON.parse(payload)
      
      // Publish the topic via EventBus
      console.log(`📢 Publishing topic: ${selectedTopic}`, parsedPayload)
      if (eventBus && eventBus.emit) {
        eventBus.emit(selectedTopic, parsedPayload)
      } else {
        throw new Error('EventBus not available or emit method not found')
      }
      
      // Add to log
      const logEntry = {
        timestamp: new Date().toLocaleTimeString(),
        topic: selectedTopic,
        payload: parsedPayload,
        success: true
      }
      setPublishLog(prev => [logEntry, ...prev].slice(0, 10)) // Keep last 10
      
    } catch (err) {
      console.error('Error publishing topic:', err)
      setError(err.message)
      
      const logEntry = {
        timestamp: new Date().toLocaleTimeString(),
        topic: selectedTopic,
        error: err.message,
        success: false
      }
      setPublishLog(prev => [logEntry, ...prev].slice(0, 10))
    }
  }

  const clearLog = () => {
    setPublishLog([])
  }

  return (
    <div className="topic-publisher">
      <h3>📢 Topic Publisher</h3>
      <p className="description">
        Publish events to the EventRouter to test canvas component interactions
      </p>

      <div className="form-group">
        <label htmlFor="topic-select">Select Topic:</label>
        <select 
          id="topic-select"
          value={selectedTopic} 
          onChange={handleTopicChange}
          className="topic-select"
        >
          {availableTopics.map(topic => (
            <option key={topic.value} value={topic.value}>
              {topic.label} ({topic.value})
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="payload-input">Payload (JSON):</label>
        <textarea
          id="payload-input"
          value={payload}
          onChange={(e) => setPayload(e.target.value)}
          className="payload-input"
          rows={6}
          placeholder='{"elementId": "test-element-1"}'
        />
      </div>

      {error && (
        <div className="error-message">
          ⚠️ Error: {error}
        </div>
      )}

      <button onClick={handlePublish} className="publish-btn">
        📢 Publish Topic
      </button>

      {publishLog.length > 0 && (
        <div className="publish-log">
          <div className="log-header">
            <h4>📋 Publish Log</h4>
            <button onClick={clearLog} className="clear-btn">Clear</button>
          </div>
          <div className="log-entries">
            {publishLog.map((entry, index) => (
              <div 
                key={index} 
                className={`log-entry ${entry.success ? 'success' : 'error'}`}
              >
                <div className="log-time">{entry.timestamp}</div>
                <div className="log-topic">{entry.topic}</div>
                {entry.success ? (
                  <div className="log-payload">
                    {JSON.stringify(entry.payload, null, 2)}
                  </div>
                ) : (
                  <div className="log-error">{entry.error}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default TopicPublisher
