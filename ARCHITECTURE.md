# 🏗️ Architecture: 100% Data-Driven Plugin Lab

## Overview

This RenderX Plugin Lab is **completely data-driven** with **ZERO hardcoded plugin knowledge**. It works with any RenderX plugin that follows standard conventions.

## Key Principles

### ❌ What We DON'T Do
- ❌ No hardcoded plugin names (e.g., "canvas-component")
- ❌ No hardcoded topic names (e.g., "canvas.component.select")
- ❌ No hardcoded sequence IDs (e.g., "canvas-component-select-symphony")
- ❌ No hardcoded plugin IDs (e.g., "CanvasComponentSelectPlugin")
- ❌ No hardcoded default data structures (e.g., `{"elementId": "..."}`)
- ❌ No assumptions about plugin capabilities

### ✅ What We DO
- ✅ Dynamically discover all `@renderx-plugins/*` packages
- ✅ Dynamically load all JSON sequence files
- ✅ Dynamically extract topics from sequence beats
- ✅ Dynamically register plugins with Musical Conductor
- ✅ Dynamically display plugin metadata
- ✅ Use generic placeholders in examples (`{}`, not specific structures)

## Data-Driven Components

### 1. **Plugin Discovery** (`ConductorProvider.jsx`)

**How it works:**
```javascript
// Finds ALL plugins matching the pattern
const pluginModules = import.meta.glob(
  '../../node_modules/@renderx-plugins/*/index.js'
)

// Dynamically imports and registers each one
for (const [path, importFn] of Object.entries(pluginModules)) {
  const module = await importFn()
  if (module.register && typeof module.register === 'function') {
    module.register(conductor)
  }
}
```

**What it discovers:**
- Plugin package name
- Plugin exports (register function, handlers, etc.)
- Plugin version (if available)

**Zero assumptions:**
- Works with any number of plugins
- Doesn't require specific plugin names
- Gracefully handles plugins without register functions

---

### 2. **Sequence Discovery** (`utils/sequenceLoader.js`)

**How it works:**
```javascript
// Finds ALL JSON sequences from ALL plugins
const sequenceModules = import.meta.glob(
  '../../node_modules/@renderx-plugins/*/json-sequences/**/*.json',
  { eager: true }
)

// Validates and processes each sequence
for (const [path, module] of Object.entries(sequenceModules)) {
  const sequence = module.default || module
  
  if (isValidSequence(sequence)) {
    sequences.push({
      id: sequence.id,
      name: sequence.name,
      pluginName: extractPluginNameFromPath(path),
      movements: sequence.movements,
      topics: extractTopicsFromSequence(sequence),
      // ... other discovered metadata
    })
  }
}
```

**What it discovers:**
- Sequence ID and name
- Plugin name (from file path)
- Movement structure
- All topics used in beats
- Metadata (category, tempo, key, etc.)

**Zero assumptions:**
- Works with any sequence structure
- Doesn't require specific naming conventions
- Validates structure before processing

---

### 3. **Topic Extraction** (`utils/sequenceLoader.js`)

**How it works:**
```javascript
function extractTopicsFromSequence(sequence) {
  const topics = new Set()
  
  sequence.movements.forEach(movement => {
    movement.beats.forEach(beat => {
      if (beat.event) {
        // Convert event format: "event:topic" → "event.topic"
        topics.add(beat.event.replace(':', '.'))
      }
    })
  })
  
  return Array.from(topics).sort()
}
```

**What it discovers:**
- All unique topics across all beats
- Topic naming patterns
- Topic frequency and usage

**Zero assumptions:**
- Doesn't filter by plugin name
- Doesn't expect specific topic patterns
- Works with any valid event string

---

### 4. **Symphony Player** (`components/SymphonyPlayer.jsx`)

**Data-driven features:**
- ✅ Symphony list populated from discovered sequences
- ✅ No hardcoded symphony names or IDs
- ✅ Generic empty object `{}` as default data
- ✅ Generic placeholder in textarea
- ✅ Plugin ID and Sequence ID from discovered metadata
- ✅ Topic badges from extracted topics

**Removed hardcoded elements:**
- ❌ Removed `_oldAvailableSymphonies` array
- ❌ Removed plugin-specific default data
- ❌ Removed interaction resolution logic (not needed)
- ❌ Removed plugin-specific descriptions

---

### 5. **Topic Publisher** (`components/TopicPublisher.jsx`)

**Data-driven features:**
- ✅ Topic list populated from discovered sequences
- ✅ No hardcoded topic names
- ✅ Generic empty object `{}` as default payload
- ✅ Generic placeholder in textarea
- ✅ Sequence associations from metadata

**Removed hardcoded elements:**
- ❌ Removed `_oldAvailableTopics` array
- ❌ Removed plugin-specific default payloads
- ❌ Removed plugin-specific descriptions

---

### 6. **App Component** (`App.jsx`)

**Data-driven features:**
- ✅ Plugin list from `getPluginsSummary()`
- ✅ Sequence counts from discovered data
- ✅ Topic counts from extracted topics
- ✅ No hardcoded plugin names or versions

**Removed hardcoded elements:**
- ❌ Removed import of specific plugin package
- ❌ Removed hardcoded plugin info display
- ❌ Removed plugin-specific version display

---

### 7. **Quick Reference** (`components/QuickReference.jsx`)

**Data-driven features:**
- ✅ Generic examples (`'your.topic.name'`, not specific topics)
- ✅ Generic placeholders (`{ /* your data */ }`, not specific structures)
- ✅ Architecture explanation emphasizes data-driven approach

**Removed hardcoded elements:**
- ❌ Removed specific plugin examples
- ❌ Removed specific topic examples
- ❌ Removed specific data structure examples

---

## Convention-Based Discovery

The lab follows these conventions to discover plugins:

### Plugin Package Convention
```
@renderx-plugins/<plugin-name>/
├── index.js              # Main entry, exports register() function
└── json-sequences/       # Sequence definitions
    └── <plugin-name>/
        ├── sequence-1.json
        ├── sequence-2.json
        └── ...
```

### Sequence JSON Convention
```json
{
  "id": "unique-sequence-id",
  "name": "Human Readable Name",
  "pluginId": "PluginIdentifier",
  "movements": [
    {
      "beats": [
        {
          "event": "topic:name",
          "data": {}
        }
      ]
    }
  ]
}
```

### Plugin Registration Convention
```javascript
// Plugin must export a register function
export function register(conductor) {
  // Register sequences with conductor
  conductor.registerPlugin(/* ... */)
}
```

---

## Benefits of Data-Driven Approach

### 🔌 **Plugin Agnostic**
- Works with **any** RenderX plugin
- No code changes needed for new plugins
- Just `npm install @renderx-plugins/new-plugin`

### 🔄 **Self-Updating**
- New sequences appear automatically
- New topics discovered automatically
- Metadata updates automatically

### 🧪 **Easy Testing**
- Test any plugin without custom code
- See all capabilities at a glance
- No test harness development needed

### 📦 **Maintainable**
- No hardcoded values to update
- No version-specific code
- No plugin-specific logic

### 🚀 **Future-Proof**
- Works with plugins not yet created
- Adapts to new plugin conventions
- Scales to any number of plugins

---

## File-by-File Analysis

| File | Plugin-Specific Code | Data-Driven |
|------|---------------------|-------------|
| `App.jsx` | ❌ None | ✅ 100% |
| `ConductorProvider.jsx` | ❌ None | ✅ 100% |
| `SymphonyPlayer.jsx` | ❌ None | ✅ 100% |
| `TopicPublisher.jsx` | ❌ None | ✅ 100% |
| `QuickReference.jsx` | ❌ None | ✅ 100% |
| `sequenceLoader.js` | ❌ None | ✅ 100% |

**Result: ZERO plugin-specific code in the entire codebase!**

---

## Testing the Data-Driven Approach

### Adding a New Plugin
```bash
# Install any RenderX plugin
npm install @renderx-plugins/some-new-plugin

# Start the dev server
npm run dev

# The lab will automatically:
# ✅ Discover the new plugin
# ✅ Load its sequences
# ✅ Extract its topics
# ✅ Register it with Conductor
# ✅ Display it in the UI
```

**No code changes required!**

---

## Architecture Validation

To verify the data-driven architecture:

```bash
# Search for plugin-specific terms (should find NONE in src/)
grep -r "canvas-component" src/
grep -r "CanvasComponent" src/
grep -r "elementId" src/
grep -r "test-element" src/

# Expected: No matches in source code (only in node_modules)
```

---

## Summary

This plugin lab achieves **100% data-driven architecture** by:

1. **Never importing** specific plugin packages in components
2. **Never hardcoding** plugin names, topics, or sequences
3. **Always discovering** plugin capabilities from JSON files
4. **Always using** generic placeholders in examples
5. **Always validating** discovered data before use

**The result:** A truly universal testing environment for RenderX plugins!
