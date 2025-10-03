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
  'canvas.component.select',
  { elementId: 'button-1' }
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
  'CanvasComponentSelectPlugin',
  'canvas-component-select-symphony',
  { elementId: 'button-1' }
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
        <h4>🎬 Available Actions</h4>
        <ul className="action-list">
          <li><strong>Select/Deselect:</strong> Manage component selection state</li>
          <li><strong>Drag:</strong> Start, move, and end drag operations</li>
          <li><strong>Create:</strong> Instantiate new components</li>
          <li><strong>Update:</strong> Modify component properties</li>
          <li><strong>Delete:</strong> Remove components</li>
          <li><strong>Export:</strong> Generate GIF/MP4 from canvas</li>
          <li><strong>Import:</strong> Load components from external sources</li>
        </ul>
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
          <li><strong>✅ Canvas Plugin:</strong> Registered and ready to handle sequences</li>
          <li><strong>⚠️ Visual Canvas:</strong> No actual canvas UI exists, but operations will execute</li>
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
