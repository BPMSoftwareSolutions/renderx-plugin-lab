import { createContext, useContext, useEffect, useState } from 'react'
import { initializeCommunicationSystem } from 'musical-conductor'
import { register as registerCanvasComponent } from '@renderx-plugins/canvas-component'

// Create context for the Conductor
const ConductorContext = createContext(null)

/**
 * ConductorProvider - Initializes and provides the Musical Conductor
 */
export function ConductorProvider({ children }) {
  const [conductorClient, setConductorClient] = useState(null)
  const [eventBus, setEventBus] = useState(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    try {
      console.log('🎼 Initializing Musical Conductor...')
      
      // Initialize the communication system
      const { conductor, eventBus: bus } = initializeCommunicationSystem()
      
      console.log('✅ Musical Conductor initialized:', conductor)
      console.log('✅ EventBus initialized:', bus)
      
      // Register the canvas component plugin
      try {
        registerCanvasComponent(conductor)
        console.log('✅ Canvas Component plugin registered')
      } catch (regError) {
        console.warn('⚠️ Canvas Component registration:', regError.message)
      }
      
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
  }, [])

  const value = {
    conductor: conductorClient,
    eventBus,
    isInitialized,
    error
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
