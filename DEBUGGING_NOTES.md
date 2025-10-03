# Debugging Notes: Plugin Handler Registration Issue

## Date: October 3, 2025

## Summary

This document captures the investigation into why plugin handlers are not being invoked during symphony execution in the RenderX Plugin Lab.

---

## Problem Statement

**Issue:** E2E tests fail because button components are not created on the canvas when the "Canvas Component Create" symphony is played.

**Expected Behavior:**
1. User selects "Canvas Component Create" symphony
2. User enters JSON data for a button component
3. User clicks "Play"
4. Symphony executes and publishes `canvas.component.create` event
5. CanvasViewer listens to the event and displays the component

**Actual Behavior:**
1. ✅ Symphony selection works
2. ✅ JSON data entry works
3. ✅ Play button triggers execution
4. ✅ Symphony executes all beats without errors
5. ❌ **No events are published** - handlers show "handler=?" in logs
6. ❌ CanvasViewer never receives events
7. ❌ Canvas remains empty

---

## Investigation Timeline

### 1. Initial Test Failures
**Symptom:** Cypress test couldn't find "Symphony Player" text  
**Root Cause:** Component only renders when `activeTab === 'symphonies'`  
**Solution:** Click "Symphonies" tab before asserting text visibility

### 2. Empty State Text Mismatch
**Symptom:** Test looked for "No components on canvas"  
**Actual Text:** "Canvas is Empty"  
**Solution:** Updated test assertion

### 3. Execution Log Text Mismatch
**Symptom:** Test looked for "Play Log"  
**Actual Text:** "Execution Log"  
**Solution:** Updated test assertion

### 4. Plugin Handler Registration Issue (CURRENT)
**Symptom:** All beats execute but show "handler=?" in logs  
**Evidence:**
```
[LOG] 🎽 DataBaton: No changes | seq=Canvas Component Create beat=1 event=canvas:component:resolve-template handler=?
[LOG] 🎽 DataBaton: No changes | seq=Canvas Component Create beat=2 event=canvas:component:register-instance handler=?
[LOG] 🎽 DataBaton: No changes | seq=Canvas Component Create beat=3 event=canvas:component:create handler=?
```

---

## Technical Architecture

### Plugin Structure
```
@renderx-plugins/canvas-component/
├── dist/
│   └── index.js (exports handlers, register)
├── json-sequences/
│   └── canvas-component/
│       └── create.json (sequence definition)
```

### Sequence Definition Example
```json
{
  "pluginId": "CanvasComponentPlugin",
  "id": "canvas-component-create-symphony",
  "beats": [
    {
      "beat": 3,
      "event": "canvas:component:create",
      "handler": "createNode",
      "timing": "immediate"
    }
  ]
}
```

### Musical Conductor Flow
```
1. Play symphony
2. Load sequence from registry
3. Execute each beat:
   a. Look up plugin by pluginId ("CanvasComponentPlugin")
   b. Look up handler by name ("createNode")
   c. Execute handler function
   d. Handler publishes event to EventBus
4. EventBus notifies subscribers
```

---

## Key Findings

### 1. Plugin's `register()` Function is a No-Op
**Location:** `node_modules/@renderx-plugins/canvas-component/dist/index.js`

```javascript
async function register(conductor) {
  try {
    if (conductor && conductor._canvasComponentRegistered) return;
    if (conductor) conductor._canvasComponentRegistered = true;
  } catch {
  }
}
```

**Finding:** The register function only sets a flag. It does NOT:
- Subscribe handlers to EventBus
- Register handlers with PluginManager
- Set up any event wiring

### 2. Handler Name vs Event Name Mismatch
**Handler Names:** `createNode`, `resolveTemplate`, `registerInstance`  
**Event Names:** `canvas:component:create`, `canvas:component:resolve-template`

**Finding:** Direct EventBus subscription won't work because names don't match. The mapping is defined in the sequence JSON, and the conductor must handle the lookup.

### 3. React StrictMode Double-Rendering
**Evidence:** Console logs show two initialization cycles

**Finding:** React.StrictMode causes useEffect to run twice in development mode. This is expected behavior and doesn't affect functionality.

### 4. Sequence Registration Works
**Evidence:**
```
[LOG] Successfully registered 29 of 29 sequences with conductor
[LOG] 🎼 SequenceRegistry: Registered sequence "Canvas Component Create"
```

**Finding:** Sequence discovery and registration is functioning correctly.

### 5. PluginManager Data Structure
**Current Implementation:**
```javascript
pluginManager.mountedPlugins.set('CanvasComponentPlugin', {
  id: 'CanvasComponentPlugin',
  handlers: {
    createNode: [Function],
    resolveTemplate: [Function],
    // ... 58 total handlers
  }
})

pluginManager.pluginHandlers.set('CanvasComponentPlugin', handlers)
pluginManager.discoveredPluginIds.push('CanvasComponentPlugin')
```

**Finding:** Data is populated correctly, but conductor can't retrieve handlers during beat execution.

---

## Attempted Solutions

### Attempt 1: Direct EventBus Subscription
```javascript
for (const [eventName, handlerFn] of Object.entries(handlers)) {
  const topic = eventName.replace(/:/g, '.')
  conductor.eventBus.addEventListener(topic, handlerFn)
}
```
**Result:** Failed - handler names don't match event names

### Attempt 2: PluginInterface.registerPlugin()
```javascript
conductor.pluginInterface.registerPlugin(pluginId, handlers)
```
**Result:** Method doesn't exist or fails silently

### Attempt 3: Manual PluginManager Population
```javascript
pluginManager.mountedPlugins.set('CanvasComponentPlugin', {...})
pluginManager.pluginHandlers.set('CanvasComponentPlugin', handlers)
pluginManager.discoveredPluginIds.push('CanvasComponentPlugin')
```
**Result:** Data is stored but not retrieved during beat execution

---

## Console Log Capture System

Successfully implemented console log capture for Cypress tests:

### Files Created/Modified
1. `cypress/support/e2e.js` - Intercepts console methods
2. `cypress.config.js` - Task to save logs to `.logs/` directory

### Captured Log Format
```
Test: should create a button component on the canvas when symphony is played
Status: failed
Timestamp: 2025-10-03T04:50:22.521Z
Spec: symphony-player.cy.js

=== Console Logs ===

[LOG] 🎼 EventBus: Using internal conductor (legacy mode)
[LOG] 📋 Loaded topics: [...]
[ERROR] Failed to register plugin canvas-component: {}
```

**Benefit:** Essential for debugging React initialization, plugin registration, and symphony execution.

---

## Test Status

### ✅ Passing Tests (1/3)
- **plugin-check.cy.js** - Verifies plugin registration and UI loading

### ❌ Failing Tests (2/3)
- **symphony-player.cy.js** - "should create a button component on the canvas when symphony is played"
  - Fails at: Empty state should disappear after symphony execution
  - Reason: Handlers not invoked, no component created
  
- **symphony-player.cy.js** - "should handle multiple component creations"
  - Skipped due to beforeEach hook failure

---

## Root Cause Hypothesis

The musical-conductor's internal handler lookup mechanism expects plugins to be loaded through its own plugin loading system (`PluginLoader.loadPlugin()`). This system likely:

1. Loads plugin from file path
2. Calls plugin's `register()` function
3. **Performs additional internal wiring** that we're missing
4. Stores metadata about handler-to-event mappings
5. Creates internal references used during beat execution

Our manual registration bypasses steps 3-5, leaving the beat executor unable to find handlers.

---

## Recommended Next Steps

### Option 1: Discover the Missing Wiring
- Debug musical-conductor source code
- Find how PluginLoader connects handlers to beat executor
- Replicate that logic in our manual registration

### Option 2: Use Musical Conductor's Plugin Loading
- Investigate if we can provide plugin as object instead of file path
- Extend PluginLoader to accept in-memory modules
- Let musical-conductor handle all internal wiring

### Option 3: Create Minimal Test Plugin
- Build a simple plugin that registers correctly
- Compare its structure to canvas-component
- Identify what's different

### Option 4: Bypass Handler System
- Subscribe directly to EventBus in CanvasViewer
- Listen for symphony execution completion
- Manually trigger component creation
- **Trade-off:** Not testing real plugin behavior

---

## Testing Infrastructure Success

Despite the handler invocation issue, we successfully:

1. ✅ Installed and configured Cypress 15.3.0
2. ✅ Created comprehensive E2E test suite
3. ✅ Implemented console log capture system
4. ✅ Set up screenshot capture on failure
5. ✅ Discovered and fixed UI/navigation issues
6. ✅ Verified plugin and sequence registration
7. ✅ Confirmed symphony execution mechanics work

**Key Achievement:** We can now iterate quickly with automated tests and detailed logging.

---

## Code Locations

### Critical Files
- `src/ConductorProvider.jsx` - Plugin registration logic
- `src/components/SymphonyPlayer.jsx` - Symphony execution UI
- `src/components/CanvasViewer.jsx` - Event subscriber for canvas updates
- `cypress/e2e/symphony-player.cy.js` - E2E test
- `cypress/support/e2e.js` - Console log capture

### Plugin Files
- `node_modules/@renderx-plugins/canvas-component/dist/index.js`
- `node_modules/@renderx-plugins/canvas-component/json-sequences/**/*.json`

### Log Files
- `.logs/symphony-player-should-create-a-button-*.log`
- Contains full console output from test runs

---

## Useful Console Log Patterns

Search these patterns in logs to debug:

```bash
# Handler lookup
grep "handler=?" *.log

# Plugin registration
grep "Registered.*Plugin" *.log

# Sequence registration
grep "Registered sequence" *.log

# Symphony execution
grep "Playing symphony" *.log

# Event publishing
grep "Publishing.*canvas.component" *.log

# EventBus subscriptions
grep "Subscribed to" *.log
```

---

## Known Working Components

### ✅ Fully Functional
1. **Vite Development Server** - Runs on port 3000
2. **React App** - Renders correctly with tabs
3. **Musical Conductor** - Initializes successfully
4. **EventBus** - Event system works
5. **Sequence Discovery** - Finds all 29 sequences
6. **Sequence Registration** - Registers with SequenceRegistry
7. **Symphony Execution** - Beats execute in order
8. **Cypress Testing** - E2E framework operational

### ⚠️ Partially Functional
1. **Plugin Registration** - Data stored but not retrieved correctly
2. **Handler Invocation** - Handlers exist but aren't called

### ❌ Not Working
1. **Event Publishing** - Handlers never publish events
2. **Component Creation** - Canvas stays empty
3. **E2E Test Pass** - 2/3 tests failing

---

## Conclusion

We've made significant progress in understanding the system architecture and identifying the exact failure point. The issue is isolated to the handler lookup mechanism during beat execution. All supporting infrastructure (tests, logging, registration) is working correctly.

The next debugging session should focus on understanding the musical-conductor's internal handler resolution system and either:
- Replicating its logic in our manual registration, OR
- Finding a way to use its built-in plugin loading mechanism

---

## Additional Resources

- Musical Conductor Version: v1.4.5
- React Version: v19.2.0
- Cypress Version: v15.3.0
- Canvas Component Plugin Version: v1.0.10
- Host SDK Version: v1.0.4-rc.0

---

*Document last updated: October 3, 2025*
