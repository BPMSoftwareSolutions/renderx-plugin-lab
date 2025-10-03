/**
 * Utility to dynamically load and parse plugin sequences
 * 
 * This is completely data-driven and makes no assumptions about the plugin.
 * It discovers sequences from any plugin's JSON files.
 */

// Dynamically discover all JSON sequence files from all installed plugins
// This pattern will find any plugin under @renderx-plugins/ that has json-sequences
const sequenceModules = import.meta.glob(
  '../../node_modules/@renderx-plugins/*/json-sequences/**/*.json',
  { eager: true }
)

/**
 * Load all sequences from all installed plugins
 * Pure data-driven approach - no hardcoded plugin knowledge
 */
export function loadSequences() {
  const sequences = []
  
  for (const [path, module] of Object.entries(sequenceModules)) {
    const fileName = path.split('/').pop()
    const pluginName = extractPluginNameFromPath(path)
    
    // Skip index files
    if (fileName === 'index.json') continue
    
    try {
      const sequence = module.default || module
      
      // Only process if it looks like a valid sequence
      // (has id/name and movements structure)
      if (isValidSequence(sequence)) {
        sequences.push({
          id: sequence.id,
          name: sequence.name,
          pluginId: sequence.pluginId,
          pluginName,
          fileName,
          path,
          movements: sequence.movements,
          category: sequence.category,
          key: sequence.key,
          tempo: sequence.tempo,
          // Extract all event topics from beats
          topics: extractTopicsFromSequence(sequence),
          // Store complete sequence for reference
          raw: sequence
        })
      }
    } catch (err) {
      console.warn(`Failed to load sequence from ${path}:`, err)
    }
  }
  
  return sequences
}

/**
 * Extract plugin name from file path
 */
function extractPluginNameFromPath(path) {
  const match = path.match(/@renderx-plugins\/([^/]+)/)
  return match ? match[1] : 'unknown'
}

/**
 * Check if an object looks like a valid sequence
 */
function isValidSequence(obj) {
  return obj && 
         typeof obj === 'object' &&
         (obj.id || obj.name) &&
         Array.isArray(obj.movements) &&
         obj.movements.length > 0
}

/**
 * Extract all unique topics from a sequence's beats
 */
function extractTopicsFromSequence(sequence) {
  const topics = new Set()
  
  if (sequence.movements) {
    sequence.movements.forEach(movement => {
      if (movement.beats) {
        movement.beats.forEach(beat => {
          if (beat.event) {
            // Convert event format to topic format (replace : with .)
            const topic = beat.event.replace(/:/g, '.')
            topics.add(topic)
          }
        })
      }
    })
  }
  
  return Array.from(topics)
}

/**
 * Get all unique topics from all sequences
 */
export function getAllTopics() {
  const sequences = loadSequences()
  const allTopics = new Set()
  
  sequences.forEach(seq => {
    seq.topics.forEach(topic => allTopics.add(topic))
  })
  
  return Array.from(allTopics).sort()
}

/**
 * Get sequence metadata for the symphony player
 */
export function getSequencesMetadata() {
  return loadSequences().map(seq => ({
    id: seq.id,
    name: seq.name,
    pluginId: seq.pluginId,
    pluginName: seq.pluginName,
    fileName: seq.fileName,
    category: seq.category,
    topics: seq.topics,
    // Include any metadata we found
    metadata: {
      key: seq.key,
      tempo: seq.tempo,
      movementCount: seq.movements?.length || 0,
      beatCount: seq.movements?.reduce((sum, m) => sum + (m.beats?.length || 0), 0) || 0
    }
  }))
}

/**
 * Get all loaded plugins with their sequences
 */
export function getPluginsSummary() {
  const sequences = loadSequences()
  const pluginsMap = new Map()
  
  sequences.forEach(seq => {
    const pluginKey = seq.pluginName
    if (!pluginsMap.has(pluginKey)) {
      pluginsMap.set(pluginKey, {
        name: seq.pluginName,
        sequences: [],
        topicCount: 0,
        topics: new Set()
      })
    }
    
    const plugin = pluginsMap.get(pluginKey)
    plugin.sequences.push(seq)
    seq.topics.forEach(topic => plugin.topics.add(topic))
  })
  
  // Convert to array and add counts
  return Array.from(pluginsMap.values()).map(plugin => ({
    name: plugin.name,
    sequenceCount: plugin.sequences.length,
    topicCount: plugin.topics.size,
    sequences: plugin.sequences,
    topics: Array.from(plugin.topics).sort()
  }))
}

/**
 * Get topics with their associated sequences
 */
export function getTopicsWithMetadata() {
  const sequences = loadSequences()
  const topicsMap = new Map()
  
  sequences.forEach(seq => {
    seq.topics.forEach(topic => {
      if (!topicsMap.has(topic)) {
        topicsMap.set(topic, {
          topic,
          sequences: []
        })
      }
      topicsMap.get(topic).sequences.push({
        name: seq.name,
        id: seq.id,
        pluginId: seq.pluginId
      })
    })
  })
  
  return Array.from(topicsMap.values()).sort((a, b) => 
    a.topic.localeCompare(b.topic)
  )
}
