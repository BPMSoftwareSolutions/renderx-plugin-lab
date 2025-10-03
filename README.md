# 🧪 RenderX Plugin Lab

A **completely data-driven** testing environment for RenderX plugins. This lab makes zero assumptions about installed plugins—everything is dynamically discovered from JSON files and package exports.

## ✨ Key Features

### 🔍 **100% Data-Driven**
- **No hardcoded plugin knowledge** - works with any RenderX plugin
- **Automatic discovery** of sequences, topics, and capabilities
- **Dynamic registration** of plugins with Musical Conductor
- **Zero configuration** - just install a plugin package and go!

### 🎼 **Musical Conductor Integration**
- Fully functional orchestration system
- Automatic plugin registration
- EventBus for topic publishing
- Symphony execution with real results

### 📦 **What Gets Discovered**
- **Plugins**: All `@renderx-plugins/*` packages
- **Sequences**: All JSON files in `json-sequences/` directories
- **Topics**: Automatically extracted from sequence beats
- **Metadata**: Symphony names, categories, movement counts, etc.

## 🚀 Getting Started

### Install Dependencies
```bash
npm install
```

### Install a RenderX Plugin
```bash
npm install @renderx-plugins/canvas-component
# or any other @renderx-plugins/* package
```

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

## 🏗️ Architecture

### Pure Data-Driven Design
This lab follows a **convention-over-configuration** approach:

1. **Plugin Discovery** (`ConductorProvider.jsx`)
   - Scans `node_modules/@renderx-plugins/*/index.js`
   - Looks for `register()` function exports
   - Automatically registers with Musical Conductor

2. **Sequence Loading** (`utils/sequenceLoader.js`)
   - Uses Vite's `import.meta.glob()` to find JSON files
   - Pattern: `node_modules/@renderx-plugins/*/json-sequences/**/*.json`
   - Parses sequence structure (movements, beats, topics)

3. **Topic Extraction**
   - Reads beat events from sequence JSON
   - Converts event format (`event:topic` → `event.topic`)
   - Deduplicates and sorts topics

### Component Structure
```
src/
├── App.jsx                      # Main app with dynamic plugin display
├── ConductorProvider.jsx        # Auto-discovers and registers plugins
├── components/
│   ├── TopicPublisher.jsx       # Publish events via EventBus
│   ├── SymphonyPlayer.jsx       # Execute sequences via Conductor
│   └── QuickReference.jsx       # Documentation
└── utils/
    └── sequenceLoader.js        # Dynamic sequence/topic discovery
```

## 📋 Usage

### Topic Publisher Tab
- **See all topics** from all installed plugins
- **Publish events** with custom payloads
- **View associations** - which sequences use which topics
- Works with EventBus for real-time event publishing

### Symphony Player Tab
- **See all symphonies** from all installed plugins
- **Execute sequences** via Musical Conductor
- **View metadata** - movements, beats, topics, categories
- Returns real results and logs execution

### Quick Reference Tab
- Architecture explanation
- Topics vs Symphonies comparison
- Data-driven approach details

## 🔧 How It Works

### Plugin Discovery
```javascript
// Automatically finds and registers all plugins
const pluginModules = import.meta.glob(
  '../../node_modules/@renderx-plugins/*/index.js'
)

for (const [path, importFn] of Object.entries(pluginModules)) {
  const module = await importFn()
  if (module.register) {
    module.register(conductor)
  }
}
```

### Sequence Discovery
```javascript
// Automatically loads all JSON sequences
const sequenceModules = import.meta.glob(
  '../../node_modules/@renderx-plugins/*/json-sequences/**/*.json',
  { eager: true }
)

// Extracts topics from beats
function extractTopicsFromSequence(sequence) {
  const topics = new Set()
  sequence.movements.forEach(movement => {
    movement.beats.forEach(beat => {
      if (beat.event) {
        topics.add(beat.event.replace(':', '.'))
      }
    })
  })
  return Array.from(topics)
}
```

## 🎯 Benefits

### For Plugin Developers
- Test your plugin without writing test harnesses
- See all sequences and topics at a glance
- Verify Musical Conductor integration
- Debug event publishing and symphony execution

### For Plugin Users
- Understand plugin capabilities before integration
- Explore available sequences and topics
- Test interactions in isolation
- Learn the plugin's API surface

### For Everyone
- **No maintenance** - adapts to any plugin automatically
- **No configuration** - works out of the box
- **No assumptions** - purely data-driven
- **Future-proof** - supports any RenderX plugin

## 📦 Currently Loaded Plugins

The app will display:
- Plugin name (e.g., `@renderx-plugins/canvas-component`)
- Number of sequences discovered
- Number of unique topics found

## 🧩 Adding More Plugins

Just install them:
```bash
npm install @renderx-plugins/another-plugin
npm install @renderx-plugins/yet-another-plugin
```

The lab will automatically:
✅ Discover the new plugins  
✅ Load their sequences  
✅ Extract their topics  
✅ Register them with Conductor  
✅ Display them in the UI  

**No code changes required!**

## 🎨 Technology Stack

- **React 19** - UI framework
- **Vite** - Build tool with HMR
- **Musical Conductor** - Orchestration system
- **@renderx-plugins/host-sdk** - EventRouter and resolvers
- **Vite Glob Imports** - Dynamic module discovery

## 📝 License

This is a testing lab for RenderX plugins. 🧪

A React-based lab for testing RenderX plugins in isolation

## Installed Packages
- `@renderx-plugins/canvas-component@1.0.10` - Canvas component plugin
- `@renderx-plugins/host-sdk@1.0.4-rc.0` - Host SDK for plugin interactions
- `musical-conductor@1.4.5` - Sequence orchestration engine

## Tech Stack
- ⚛️ React 19
- ⚡ Vite - Fast build tool and dev server
- 🎼 Musical Conductor - Full orchestration system
- 🎨 Modern CSS with gradient design

## Getting Started

1. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```
   This will start Vite dev server at `http://localhost:3000` and open it in your browser.

3. **Build for production**:
   ```bash
   npm run build
   ```

4. **Preview production build**:
   ```bash
   npm run preview
   ```

## Project Structure
```
├── src/
│   ├── App.jsx          # Main React component
│   ├── App.css          # Component styles
│   ├── main.jsx         # React entry point
│   └── index.css        # Global styles
├── index.html           # HTML template
├── vite.config.js       # Vite configuration
└── package.json         # Project dependencies
```

## Development

The canvas component plugin is imported in `src/App.jsx` and ready to use. 

### Interactive Testing Tools

The lab includes three powerful testing interfaces:

#### 📢 Topic Publisher
- Publish events to the EventRouter
- Test various canvas component topics
- Try different payload structures
- See real-time publish logs

**Available Topics:**
- `canvas.component.select` - Select a component
- `canvas.component.drag.start/move/end` - Drag operations
- `canvas.component.create/update/delete` - Component lifecycle
- `canvas.component.export.gif` - Export as GIF
- And many more!

#### 🎵 Symphony Player
- Execute complete workflows via the Conductor
- Play symphonies with custom data
- See execution results and logs
- Test interaction resolution

**Available Symphonies:**
- Select/Deselect symphonies
- Drag start/move/end symphonies
- Create/Update/Delete symphonies
- Export GIF symphony
- And more!

#### 📚 Quick Reference
- Learn the difference between Topics and Symphonies
- See usage examples
- Get testing tips
- Understand available actions

### How to Use:

1. Run `npm run dev` to start the development server
2. Open the app in your browser (auto-opens at http://localhost:3000)
3. Switch between tabs: Topics, Symphonies, or Reference
4. Open browser DevTools (F12) to see detailed console logs
5. Experiment with publishing topics and playing symphonies

### Understanding the Architecture:

**Topics (EventRouter):**
- Lightweight event broadcasting
- Fire-and-forget pattern
- Multiple subscribers can listen
- Good for notifications

**Symphonies (Conductor):**
- Orchestrated sequences of actions
- Returns results/promises
- Single handler per sequence
- Good for complex workflows

### Hot Module Replacement

Vite provides instant HMR (Hot Module Replacement), so any changes you make will be reflected immediately in the browser without losing state.

## Features

✨ Modern React setup with Vite  
🎨 Beautiful gradient UI  
📦 Plugin ready to test  
📢 Interactive Topic Publisher  
🎵 Symphony Player with execution logs  
📚 Built-in reference documentation  
🔥 Fast refresh during development  
📱 Responsive design  
🧪 Comprehensive testing playground
