import { createContext, useContext, useEffect, useState } from 'react'
import { initializeCommunicationSystem } from 'musical-conductor'
import { loadSequences } from './utils/sequenceLoader.js'

// Direct imports of plugins (not host-sdk which is infrastructure)
import * as CanvasComponentPlugin from '@renderx-plugins/canvas-component'

// Create context for the Conductor
const ConductorContext = createContext(null)

/**
 * Register all plugins with the conductor
 * Note: host-sdk is NOT a plugin - it's infrastructure for communication
 * Note: @renderx-plugins/components is NOT a code plugin - just JSON definitions
 */
async function registerPlugins(conductor) {
  const registeredPlugins = []
  
  try {
    console.log('Registering plugin: canvas-component')
    console.log('Available exports:', Object.keys(CanvasComponentPlugin))
    console.log('Conductor methods:', Object.keys(conductor))
    
    // Call the plugin's register function
    if (CanvasComponentPlugin.register && typeof CanvasComponentPlugin.register === 'function') {
      await CanvasComponentPlugin.register(conductor)
      console.log('Called register() for canvas-component')
    }
    
    // Directly register the plugin with the pluginManager
    // Since we've already imported the module, we don't use pluginLoader (which expects file paths)
    if (conductor.pluginManager) {
      const pluginManager = conductor.pluginManager
      
      // Add to mountedPlugins directly
      if (pluginManager.mountedPlugins) {
        pluginManager.mountedPlugins.set('CanvasComponentPlugin', {
          id: 'CanvasComponentPlugin',
          handlers: CanvasComponentPlugin.handlers || {}
        })
        console.log('Added CanvasComponentPlugin to mountedPlugins')
      }
      
      // Add to pluginHandlers map
      if (pluginManager.pluginHandlers) {
        pluginManager.pluginHandlers.set('CanvasComponentPlugin', CanvasComponentPlugin.handlers || {})
        console.log('Added CanvasComponentPlugin handlers to pluginHandlers')
      }
      
      // Add to discoveredPluginIds
      if (pluginManager.discoveredPluginIds && Array.isArray(pluginManager.discoveredPluginIds)) {
        if (!pluginManager.discoveredPluginIds.includes('CanvasComponentPlugin')) {
          pluginManager.discoveredPluginIds.push('CanvasComponentPlugin')
        }
        console.log('Added CanvasComponentPlugin to discoveredPluginIds')
      }
      
      registeredPlugins.push('CanvasComponentPlugin')
      console.log('Successfully registered CanvasComponentPlugin with pluginManager')
    } else {
      console.warn('Could not find pluginManager')
    }
    
  } catch (err) {
    console.error('Failed to register plugin canvas-component:', err)
  }
  
  return registeredPlugins
}

/**
 * ConductorProvider - Initializes and provides the Musical Conductor
 * Registers all plugins
 */
export function ConductorProvider({ children }) {
  const [conductorClient, setConductorClient] = useState(null)
  const [eventBus, setEventBus] = useState(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [error, setError] = useState(null)
  const [registeredPlugins, setRegisteredPlugins] = useState([])

  useEffect(() => {
    async function initialize() {
      try {
        console.log('Initializing Musical Conductor...')
        
        // Initialize the communication system
        const { conductor, eventBus: bus } = initializeCommunicationSystem()
        
        console.log('Musical Conductor initialized:', conductor)
        console.log('EventBus initialized:', bus)
        
        // Register all plugins
        const plugins = await registerPlugins(conductor)
        setRegisteredPlugins(plugins)
        
        console.log(`Registered ${plugins.length} plugin(s):`, plugins)
        
        // Register sequences with the conductor using sequenceLoader
        const sequences = loadSequences()
        let sequenceCount = 0
        
        console.log(`Found ${sequences.length} sequences to register`)
        
        if (conductor.sequenceRegistry) {
          console.log('SequenceRegistry methods:', Object.keys(conductor.sequenceRegistry))
          console.log('SequenceRegistry proto methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(conductor.sequenceRegistry)))
          
          for (const sequence of sequences) {
            try {
              console.log(`Registering sequence:`, sequence.name || sequence.id)
              
              // Try different registration methods
              if (typeof conductor.sequenceRegistry.register === 'function') {
                conductor.sequenceRegistry.register(sequence)
                sequenceCount++
              } else if (typeof conductor.sequenceRegistry.registerSequence === 'function') {
                conductor.sequenceRegistry.registerSequence(sequence)
                sequenceCount++
              } else if (typeof conductor.sequenceRegistry.add === 'function') {
                conductor.sequenceRegistry.add(sequence)
                sequenceCount++
              } else {
                console.warn('Cannot find registration method on sequenceRegistry')
                break
              }
            } catch (err) {
              console.warn(`Failed to register sequence ${sequence.name || sequence.id}:`, err)
            }
          }
        } else {
          console.warn('No sequenceRegistry found on conductor')
        }
        
        console.log(`Successfully registered ${sequenceCount} of ${sequences.length} sequences with conductor`)
        
        setConductorClient(conductor)
        setEventBus(bus)
        setIsInitialized(true)
        
        // Log available methods
        if (conductor) {
          console.log('Conductor methods:', Object.keys(conductor))
        }
        
      } catch (err) {
        console.error('Failed to initialize Conductor:', err)
        setError(err)
      }
    }
    
    initialize()
  }, [])

  const value = {
    conductor: conductorClient,
    eventBus,
    isInitialized,
    error,
    registeredPlugins
  }

  return (
    <ConductorContext.Provider value={value}>
      {children}
    </ConductorContext.Provider>
  )
}

/**
 * Hook to access the Conductor
 */
export function useConductor() {
  const context = useContext(ConductorContext)
  if (!context) {
    throw new Error('useConductor must be used within ConductorProvider')
  }
  return context.conductor
}

/**
 * Hook to access the EventBus
 */
export function useEventBus() {
  const context = useContext(ConductorContext)
  if (!context) {
    throw new Error('useEventBus must be used within ConductorProvider')
  }
  return context.eventBus
}

/**
 * Hook to access initialization status
 */
export function useConductorStatus() {
  const context = useContext(ConductorContext)
  if (!context) {
    throw new Error('useConductorStatus must be used within ConductorProvider')
  }
  return {
    isInitialized: context.isInitialized,
    error: context.error
  }
}
