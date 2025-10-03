import { createContext, useContext, useEffect, useState } from 'react'
import { initializeCommunicationSystem } from 'musical-conductor'

// Create context for the Conductor
const ConductorContext = createContext(null)

/**
 * Dynamically discover and load all plugins
 * This is data-driven with no hardcoded plugin knowledge
 */
async function discoverAndRegisterPlugins(conductor) {
  // Pattern to discover all @renderx-plugins packages
  const pluginModules = import.meta.glob('../../node_modules/@renderx-plugins/*/index.js')
  
  const registeredPlugins = []
  
  for (const [path, importFn] of Object.entries(pluginModules)) {
    const pluginName = path.match(/@renderx-plugins\/([^/]+)/)?.[1]
    
    try {
      const module = await importFn()
      
      // Try to register if the plugin exports a register function
      if (module.register && typeof module.register === 'function') {
        module.register(conductor)
        registeredPlugins.push(pluginName)
        console.log(`✅ Registered plugin: ${pluginName}`)
      } else {
        console.log(`ℹ️ Plugin ${pluginName} loaded (no register function)`)
      }
    } catch (err) {
      console.warn(`⚠️ Failed to load plugin ${pluginName}:`, err.message)
    }
  }
  
  return registeredPlugins
}

/**
 * ConductorProvider - Initializes and provides the Musical Conductor
 * Dynamically discovers and registers all plugins
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
        console.log('🎼 Initializing Musical Conductor...')
        
        // Initialize the communication system
        const { conductor, eventBus: bus } = initializeCommunicationSystem()
        
        console.log('✅ Musical Conductor initialized:', conductor)
        console.log('✅ EventBus initialized:', bus)
        
        // Dynamically discover and register all plugins
        const plugins = await discoverAndRegisterPlugins(conductor)
        setRegisteredPlugins(plugins)
        
        console.log(`📦 Registered ${plugins.length} plugin(s):`, plugins)
        
        setConductorClient(conductor)
        setEventBus(bus)
        setIsInitialized(true)
        
        // Log available methods
        if (conductor) {
          console.log('🎵 Conductor methods:', Object.keys(conductor))
        }
        
      } catch (err) {
        console.error('❌ Failed to initialize Conductor:', err)
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
