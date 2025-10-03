import { useState, useEffect } from 'react'
import { useEventBus, useConductorStatus } from '../ConductorProvider'
import { getTopicsWithMetadata } from '../utils/sequenceLoader'
import './TopicPublisher.css'

/**
 * TopicPublisher - Interactive component for publishing topics to the EventRouter
 * Allows testing plugin topics with custom payloads
 */
function TopicPublisher() {
  const eventBus = useEventBus()
  const { isInitialized } = useConductorStatus()
  const [availableTopics, setAvailableTopics] = useState([])
  const [selectedTopic, setSelectedTopic] = useState('')
  const [payload, setPayload] = useState('{}')
  const [publishLog, setPublishLog] = useState([])
  const [error, setError] = useState(null)

  // Load available topics from the plugin
  useEffect(() => {
    try {
      const topicsData = getTopicsWithMetadata()
      console.log('📋 Loaded topics:', topicsData)
      
      const formattedTopics = topicsData.map(item => ({
        value: item.topic,
        label: formatTopicLabel(item.topic),
        defaultPayload: '{}',
        sequences: item.sequences
      }))
      
      setAvailableTopics(formattedTopics)
      if (formattedTopics.length > 0) {
        setSelectedTopic(formattedTopics[0].value)
      }
    } catch (err) {
      console.error('Failed to load topics:', err)
      setError(err.message)
    }
  }, [])

  // Helper to format topic names nicely
  const formatTopicLabel = (topic) => {
    return topic
      .split('.')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

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
        Publish events to the EventRouter to test plugin interactions
      </p>

      {availableTopics.length > 0 && (
        <div className="stats-badge">
          ✅ Loaded {availableTopics.length} topic{availableTopics.length !== 1 ? 's' : ''} from plugin
        </div>
      )}

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
          placeholder='{}'
        />
      </div>

      {selectedTopic && availableTopics.length > 0 && (
        <div className="topic-info">
          <h4>📌 Topic Information</h4>
          {(() => {
            const topicInfo = availableTopics.find(t => t.value === selectedTopic)
            if (topicInfo && topicInfo.sequences && topicInfo.sequences.length > 0) {
              return (
                <div>
                  <p><strong>Used by {topicInfo.sequences.length} sequence(s):</strong></p>
                  <ul className="sequence-list">
                    {topicInfo.sequences.map((seq, idx) => (
                      <li key={idx}>
                        {seq.name} <code>({seq.pluginId})</code>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            }
            return <p>No sequences found for this topic</p>
          })()}
        </div>
      )}

      {error && (
        <div className="error-message">
          ⚠️ Error: {error}
        </div>
      )}

      <button onClick={handlePublish} className="publish-btn" disabled={!availableTopics.length}>
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
