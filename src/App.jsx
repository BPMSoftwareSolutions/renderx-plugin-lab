import { useState, useEffect } from 'react'
import TopicPublisher from './components/TopicPublisher'
import SymphonyPlayer from './components/SymphonyPlayer'
import QuickReference from './components/QuickReference'
import { getPluginsSummary } from './utils/sequenceLoader'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('topics')
  const [plugins, setPlugins] = useState([])

  // Discover all loaded plugins dynamically - no hardcoded knowledge
  useEffect(() => {
    try {
      const discoveredPlugins = getPluginsSummary()
      setPlugins(discoveredPlugins)
      
      console.log('� Discovered plugins:', discoveredPlugins)
      discoveredPlugins.forEach(plugin => {
        console.log(`  📦 ${plugin.name}: ${plugin.sequenceCount} sequences, ${plugin.topicCount} topics`)
      })
    } catch (err) {
      console.error('Failed to discover plugins:', err)
    }
  }, [])

  return (
    <div className="app">
      <header className="app-header">
        <h1>🧪 RenderX Plugin Lab</h1>
        <p className="subtitle">Data-driven testing environment for RenderX plugins</p>
        {plugins.length > 0 && (
          <div className="plugins-info">
            {plugins.map(plugin => (
              <div key={plugin.name} className="plugin-info">
                <span className="plugin-name">@renderx-plugins/{plugin.name}</span>
                <span className="plugin-stats">
                  {plugin.sequenceCount} sequences · {plugin.topicCount} topics
                </span>
              </div>
            ))}
          </div>
        )}
      </header>

      <main className="app-main">

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
