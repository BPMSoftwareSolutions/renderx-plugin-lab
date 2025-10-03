import { useState } from 'react'
import { useConductor, resolveInteraction } from '@renderx-plugins/host-sdk'
import './SymphonyPlayer.css'

/**
 * SymphonyPlayer - Interactive component for playing symphonies via the Conductor
 * Allows testing various canvas component symphonies with custom data
 */
function SymphonyPlayer() {
  const conductor = useConductor()
  const [selectedSymphony, setSelectedSymphony] = useState('select')
  const [symphonyData, setSymphonyData] = useState('{"elementId": "test-element-1"}')
  const [playLog, setPlayLog] = useState([])
  const [error, setError] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)

  // Available symphonies from the canvas-component plugin
  const availableSymphonies = [
    { 
      id: 'select',
      interaction: 'canvas.component.select',
      name: 'Select Component',
      pluginId: 'CanvasComponentSelectionPlugin',
      sequenceId: 'canvas-component-select-symphony',
      defaultData: '{"elementId": "test-element-1"}'
    },
    { 
      id: 'deselect',
      interaction: 'canvas.component.deselect',
      name: 'Deselect Component',
      pluginId: 'CanvasComponentSelectionPlugin',
      sequenceId: 'canvas-component-deselect-symphony',
      defaultData: '{"elementId": "test-element-1"}'
    },
    { 
      id: 'drag-start',
      interaction: 'canvas.component.drag.start',
      name: 'Drag Start',
      pluginId: 'CanvasComponentDragStartPlugin',
      sequenceId: 'canvas-component-drag-start-symphony',
      defaultData: '{"elementId": "test-element-1", "x": 100, "y": 100}'
    },
    { 
      id: 'drag-move',
      interaction: 'canvas.component.drag.move',
      name: 'Drag Move',
      pluginId: 'CanvasComponentDragMovePlugin',
      sequenceId: 'canvas-component-drag-move-symphony',
      defaultData: '{"elementId": "test-element-1", "x": 150, "y": 150}'
    },
    { 
      id: 'drag-end',
      interaction: 'canvas.component.drag.end',
      name: 'Drag End',
      pluginId: 'CanvasComponentDragEndPlugin',
      sequenceId: 'canvas-component-drag-end-symphony',
      defaultData: '{"elementId": "test-element-1", "x": 200, "y": 200}'
    },
    { 
      id: 'create',
      interaction: 'canvas.component.create',
      name: 'Create Component',
      pluginId: 'CanvasComponentCreatePlugin',
      sequenceId: 'canvas-component-create-symphony',
      defaultData: '{"type": "button", "x": 100, "y": 100}'
    },
    { 
      id: 'update',
      interaction: 'canvas.component.update',
      name: 'Update Component',
      pluginId: 'CanvasComponentUpdatePlugin',
      sequenceId: 'canvas-component-update-symphony',
      defaultData: '{"elementId": "test-element-1", "properties": {"width": 200}}'
    },
    { 
      id: 'delete',
      interaction: 'canvas.component.delete',
      name: 'Delete Component',
      pluginId: 'CanvasComponentDeletePlugin',
      sequenceId: 'canvas-component-delete-symphony',
      defaultData: '{"elementId": "test-element-1"}'
    },
    { 
      id: 'export-gif',
      interaction: 'canvas.component.export.gif',
      name: 'Export GIF',
      pluginId: 'CanvasComponentExportPlugin',
      sequenceId: 'canvas-component-export-gif-symphony',
      defaultData: '{"elementId": "test-element-1", "duration": 3000}'
    }
  ]

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
      
      // Try to resolve interaction first
      let pluginId = symphonyInfo.pluginId
      let sequenceId = symphonyInfo.sequenceId
      
      try {
        const route = resolveInteraction(symphonyInfo.interaction)
        if (route) {
          pluginId = route.pluginId
          sequenceId = route.sequenceId
          console.log('✅ Resolved interaction:', route)
        }
      } catch (resolveErr) {
        console.warn('Could not resolve interaction, using defaults:', resolveErr.message)
      }
      
      // Play the symphony via conductor
      let result
      if (conductor && conductor.play) {
        result = await conductor.play(pluginId, sequenceId, parsedData)
        console.log('🎵 Symphony result:', result)
      } else {
        throw new Error('Conductor not available or play method not found')
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
        Execute symphonies via the Conductor to test canvas component operations
      </p>

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
              {symphony.name}
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
            <code>{selectedSymphonyInfo.sequenceId}</code>
          </div>
          <div className="info-row">
            <span className="info-label">Interaction:</span>
            <code>{selectedSymphonyInfo.interaction}</code>
          </div>
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
          placeholder='{"elementId": "test-element-1"}'
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
        disabled={isPlaying}
      >
        {isPlaying ? '⏳ Playing...' : '▶️ Play Symphony'}
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
