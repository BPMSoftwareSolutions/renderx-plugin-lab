import { useState, useEffect } from 'react'
import { useConductor, useConductorStatus } from '../ConductorProvider'
import { getSequencesMetadata } from '../utils/sequenceLoader'
import './SymphonyPlayer.css'

/**
 * SymphonyPlayer - Interactive component for playing symphonies via the Conductor
 * Allows testing various canvas component symphonies with custom data
 */
function SymphonyPlayer() {
  const conductor = useConductor()
  const { isInitialized, error: initError } = useConductorStatus()
  const [availableSymphonies, setAvailableSymphonies] = useState([])
  const [selectedSymphony, setSelectedSymphony] = useState('')
  const [symphonyData, setSymphonyData] = useState('{}')
  const [playLog, setPlayLog] = useState([])
  const [error, setError] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)

  // Load available symphonies from the plugin
  useEffect(() => {
    try {
      const sequences = getSequencesMetadata()
      console.log('📋 Loaded sequences:', sequences)
      
      const formattedSequences = sequences.map(seq => ({
        id: seq.id,
        name: seq.name || seq.id,
        pluginId: seq.pluginId,
        sequenceId: seq.id,
        topics: seq.topics || [],
        defaultData: '{}'
      }))
      
      setAvailableSymphonies(formattedSequences)
      if (formattedSequences.length > 0) {
        setSelectedSymphony(formattedSequences[0].id)
      }
    } catch (err) {
      console.error('Failed to load sequences:', err)
      setError(err.message)
    }
  }, [])

  const handleSymphonyChange = (e) => {
    const symphonyId = e.target.value
    setSelectedSymphony(symphonyId)
    
    // Update data with default for the selected symphony
    const symphonyInfo = availableSymphonies.find(s => s.id === symphonyId)
    if (symphonyInfo) {
      setSymphonyData(symphonyInfo.defaultData)
    }
    setError(null)
  }

  const handlePlay = async () => {
    try {
      setError(null)
      setIsPlaying(true)
      
      // Parse the data
      const parsedData = JSON.parse(symphonyData)
      const symphonyInfo = availableSymphonies.find(s => s.id === selectedSymphony)
      
      console.log(`🎵 Playing symphony: ${symphonyInfo.name}`, {
        pluginId: symphonyInfo.pluginId,
        sequenceId: symphonyInfo.sequenceId,
        data: parsedData
      })
      
      const pluginId = symphonyInfo.pluginId
      const sequenceId = symphonyInfo.sequenceId
      
      // Play the symphony via conductor
      let result
      if (conductor && conductor.play) {
        result = await conductor.play(pluginId, sequenceId, parsedData)
        console.log('🎵 Symphony result:', result)
      } else {
        // Simulate what would happen
        console.log('🎵 [SIMULATED] Would play symphony:', {
          pluginId,
          sequenceId,
          data: parsedData
        })
        result = {
          simulated: true,
          message: 'Conductor not available - this is a simulation of what would be executed',
          pluginId,
          sequenceId,
          data: parsedData
        }
      }
      
      // Add to log
      const logEntry = {
        timestamp: new Date().toLocaleTimeString(),
        symphony: symphonyInfo.name,
        pluginId,
        sequenceId,
        data: parsedData,
        result,
        success: true
      }
      setPlayLog(prev => [logEntry, ...prev].slice(0, 10))
      
    } catch (err) {
      console.error('Error playing symphony:', err)
      setError(err.message)
      
      const symphonyInfo = availableSymphonies.find(s => s.id === selectedSymphony)
      const logEntry = {
        timestamp: new Date().toLocaleTimeString(),
        symphony: symphonyInfo.name,
        error: err.message,
        success: false
      }
      setPlayLog(prev => [logEntry, ...prev].slice(0, 10))
    } finally {
      setIsPlaying(false)
    }
  }

  const clearLog = () => {
    setPlayLog([])
  }

  const selectedSymphonyInfo = availableSymphonies.find(s => s.id === selectedSymphony)

  return (
    <div className="symphony-player">
      <h3>🎵 Symphony Player</h3>
      <p className="description">
        Execute symphonies via the Conductor to test plugin operations
      </p>

      {availableSymphonies.length > 0 && (
        <div className="stats-badge">
          ✅ Loaded {availableSymphonies.length} symphon{availableSymphonies.length !== 1 ? 'ies' : 'y'} from plugin
        </div>
      )}

      {selectedSymphony && selectedSymphonyInfo && (
        <div className="current-selection">
          <strong>Current Symphony:</strong> <code>{selectedSymphonyInfo.name || selectedSymphony}</code>
        </div>
      )}

      {initError && (
        <div className="error-message">
          <h4>❌ Conductor Initialization Error</h4>
          <p>{initError.message}</p>
        </div>
      )}

      {!isInitialized && !initError && (
        <div className="info-message">
          <h4>⏳ Initializing Conductor...</h4>
          <p>Setting up the Musical Conductor orchestration system...</p>
        </div>
      )}

      {isInitialized && conductor && (
        <div className="success-message">
          <h4>✅ Conductor Ready</h4>
          <p>
            The Musical Conductor is initialized and ready to orchestrate symphonies!
          </p>
        </div>
      )}

      <div className="form-group">
        <label htmlFor="symphony-select">Select Symphony:</label>
        <select 
          id="symphony-select"
          value={selectedSymphony} 
          onChange={handleSymphonyChange}
          className="symphony-select"
        >
          {availableSymphonies.map(symphony => (
            <option key={symphony.id} value={symphony.id}>
              {symphony.name || symphony.id}
            </option>
          ))}
        </select>
      </div>

      {selectedSymphonyInfo && (
        <div className="symphony-info">
          <div className="info-row">
            <span className="info-label">Plugin ID:</span>
            <code>{selectedSymphonyInfo.pluginId}</code>
          </div>
          <div className="info-row">
            <span className="info-label">Sequence ID:</span>
            <code>{selectedSymphonyInfo.sequenceId || selectedSymphonyInfo.id}</code>
          </div>
          {selectedSymphonyInfo.topics && selectedSymphonyInfo.topics.length > 0 && (
            <div className="info-row">
              <span className="info-label">Topics:</span>
              <div className="topics-badges">
                {selectedSymphonyInfo.topics.map((topic, idx) => (
                  <span key={idx} className="topic-badge">{topic}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="data-input">Symphony Data (JSON):</label>
        <textarea
          id="data-input"
          value={symphonyData}
          onChange={(e) => setSymphonyData(e.target.value)}
          className="data-input"
          rows={6}
          placeholder='{}'
        />
      </div>

      {error && (
        <div className="error-message">
          ⚠️ Error: {error}
        </div>
      )}

      <button 
        onClick={handlePlay} 
        className="play-btn"
        disabled={isPlaying || !isInitialized}
      >
        {isPlaying 
          ? '⏳ Playing...' 
          : !isInitialized
            ? '⏸️ Waiting for Conductor...'
            : '▶️ Play Symphony'}
      </button>

      {playLog.length > 0 && (
        <div className="play-log">
          <div className="log-header">
            <h4>📋 Execution Log</h4>
            <button onClick={clearLog} className="clear-btn">Clear</button>
          </div>
          <div className="log-entries">
            {playLog.map((entry, index) => (
              <div 
                key={index} 
                className={`log-entry ${entry.success ? 'success' : 'error'}`}
              >
                <div className="log-time">{entry.timestamp}</div>
                <div className="log-symphony">{entry.symphony}</div>
                {entry.success ? (
                  <>
                    <div className="log-route">
                      <span className="route-label">Route:</span>
                      <code>{entry.pluginId} → {entry.sequenceId}</code>
                    </div>
                    <div className="log-data">
                      <span className="data-label">Data:</span>
                      <pre>{JSON.stringify(entry.data, null, 2)}</pre>
                    </div>
                    {entry.result && (
                      <div className="log-result">
                        <span className="result-label">Result:</span>
                        <pre>{JSON.stringify(entry.result, null, 2)}</pre>
                      </div>
                    )}
                  </>
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

export default SymphonyPlayer
