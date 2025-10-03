# renderx-plugin-lab 🧪

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
