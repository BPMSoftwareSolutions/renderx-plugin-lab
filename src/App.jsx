import { useState, useEffect } from 'react'
import * as canvasComponent from '@renderx-plugins/canvas-component'
import TopicPublisher from './components/TopicPublisher'
import SymphonyPlayer from './components/SymphonyPlayer'
import QuickReference from './components/QuickReference'
import './App.css'

function App() {
  const [pluginLoaded, setPluginLoaded] = useState(false)
  const [activeTab, setActiveTab] = useState('topics')

  useEffect(() => {
    console.log('🎨 Canvas Component Plugin:', canvasComponent)
    console.log('📦 Plugin exports:', Object.keys(canvasComponent))
    console.log('🔧 Available functions:', Object.keys(canvasComponent.handlers || {}))
    setPluginLoaded(true)
    
    // Log available symphonies
    console.log('🎵 Available symphonies for testing:')
    console.log('  - Select/Deselect components')
    console.log('  - Drag (start, move, end)')
    console.log('  - Create/Update/Delete components')
    console.log('  - Export (GIF, MP4)')
    console.log('  - Import components')
  }, [])

  return (
    <div className="app">
      <header className="app-header">
        <h1>🧪 RenderX Plugin Lab</h1>
        <p className="subtitle">Interactive Testing Environment for Canvas Component</p>
      </header>

      <main className="app-main">
        <div className="info-card">
          <h2>Plugin Information</h2>
          <div className="info-item">
            <span className="label">Package:</span>
            <code>@renderx-plugins/canvas-component@1.0.10</code>
          </div>
          <div className="info-item">
            <span className="label">Dependencies:</span>
            <code>@renderx-plugins/host-sdk, gif.js.optimized</code>
          </div>
          <div className="info-item">
            <span className="label">Status:</span>
            <span className={`status ${pluginLoaded ? 'loaded' : 'loading'}`}>
              {pluginLoaded ? '✓ Loaded' : '⟳ Loading...'}
            </span>
          </div>
        </div>

        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'topics' ? 'active' : ''}`}
            onClick={() => setActiveTab('topics')}
          >
            📢 Topics
          </button>
          <button 
            className={`tab ${activeTab === 'symphonies' ? 'active' : ''}`}
            onClick={() => setActiveTab('symphonies')}
          >
            🎵 Symphonies
          </button>
          <button 
            className={`tab ${activeTab === 'reference' ? 'active' : ''}`}
            onClick={() => setActiveTab('reference')}
          >
            📚 Reference
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'topics' && <TopicPublisher />}
          {activeTab === 'symphonies' && <SymphonyPlayer />}
          {activeTab === 'reference' && <QuickReference />}
        </div>

        <div className="tips-footer">
          <h3>💡 Pro Tips</h3>
          <ul>
            <li>Open browser DevTools (F12) to see detailed console logs</li>
            <li>Try publishing topics to trigger events in the system</li>
            <li>Play symphonies to execute complete workflows</li>
            <li>Experiment with different payload structures and combinations</li>
          </ul>
        </div>
      </main>
    </div>
  )
}

export default App
