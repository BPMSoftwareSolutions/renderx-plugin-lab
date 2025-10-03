import './QuickReference.css'

function QuickReference() {
  return (
    <div className="quick-reference">
      <h3>📚 Quick Reference</h3>
      
      <div className="ref-section">
        <h4>🎯 What are Topics?</h4>
        <p>
          Topics are events published through the <code>EventRouter</code>. They represent 
          things happening in the application (e.g., "component selected", "drag started"). 
          Plugins subscribe to topics and react to them.
        </p>
        <div className="example-box">
          <strong>Example:</strong>
          <pre>{`EventRouter.publish(
  'your.topic.name',
  { /* your data */ }
)`}</pre>
        </div>
      </div>

      <div className="ref-section">
        <h4>🎵 What are Symphonies?</h4>
        <p>
          Symphonies are sequences of coordinated actions ("beats") executed by the 
          <code>Conductor</code>. They describe complex workflows like dragging, creating, 
          or updating components. Each symphony is composed of movements and beats.
        </p>
        <div className="example-box">
          <strong>Example:</strong>
          <pre>{`conductor.play(
  'YourPluginId',
  'your-sequence-id',
  { /* your data */ }
)`}</pre>
        </div>
      </div>

      <div className="ref-section">
        <h4>🔄 Topics vs Symphonies</h4>
        <table className="comparison-table">
          <thead>
            <tr>
              <th>Topics (EventRouter)</th>
              <th>Symphonies (Conductor)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Lightweight event broadcasting</td>
              <td>Orchestrated sequence execution</td>
            </tr>
            <tr>
              <td>Fire-and-forget pattern</td>
              <td>Returns results/promises</td>
            </tr>
            <tr>
              <td>Many subscribers possible</td>
              <td>Single handler per sequence</td>
            </tr>
            <tr>
              <td>Good for notifications</td>
              <td>Good for complex workflows</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="ref-section">
        <h4>� Data-Driven Architecture</h4>
        <p>
          This lab is <strong>completely data-driven</strong> with zero hardcoded plugin knowledge! 
          All information is dynamically discovered from the plugin's JSON files.
        </p>
        <ul className="tips-list">
          <li><strong>✅ Plugin Discovery:</strong> Automatically scans for all @renderx-plugins packages</li>
          <li><strong>✅ Sequence Loading:</strong> Dynamically imports all JSON sequences from plugins</li>
          <li><strong>✅ Topic Extraction:</strong> Parses topics from sequence beats automatically</li>
          <li><strong>✅ Auto Registration:</strong> Detects and registers plugins with Musical Conductor</li>
          <li><strong>🔄 No Hardcoding:</strong> Works with any plugin that follows conventions</li>
        </ul>
        <p>
          <strong>What this means:</strong> Install any RenderX plugin package, and this lab 
          will automatically discover its sequences, topics, and capabilities—no code changes needed!
        </p>
      </div>

      <div className="ref-section">
        <h4>🎼 Musical Conductor Integration</h4>
        <p>
          This lab includes a <strong>fully functional Musical Conductor</strong> orchestration system! 
          The Conductor and EventBus are automatically initialized when the app starts.
        </p>
        <ul className="tips-list">
          <li><strong>✅ Musical Conductor:</strong> Fully initialized and ready to orchestrate symphonies</li>
          <li><strong>✅ EventBus:</strong> Available for publishing and subscribing to events</li>
          <li><strong>✅ Dynamic Registration:</strong> Plugins are discovered and registered automatically</li>
          <li><strong>⚠️ Visual UI:</strong> No actual canvas UI exists, but all operations execute</li>
        </ul>
        <p>
          <strong>What this means:</strong> Both the <strong>Topic Publisher</strong> and 
          <strong>Symphony Player</strong> are fully functional! You can test real event publishing 
          and symphony orchestration.
        </p>
      </div>

      <div className="ref-section">
        <h4>💡 Testing Tips</h4>
        <ul className="tips-list">
          <li>Open the browser console (F12) to see detailed logs</li>
          <li>Try publishing topics first to see events in action</li>
          <li>Use Symphony Player in simulation mode to see data structures</li>
          <li>Experiment with different payload structures</li>
          <li>Check the execution logs to see what happened</li>
          <li>Combine multiple actions to test complex scenarios</li>
        </ul>
      </div>
    </div>
  )
}

export default QuickReference
