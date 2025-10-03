import { defineConfig } from 'cypress'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.js', // Enable support file for console capture
    setupNodeEvents(on, config) {
      // Create logs directory if it doesn't exist
      const logsDir = path.join(config.projectRoot, '.logs')
      if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true })
      }

      // Capture browser console logs
      on('task', {
        log(message) {
          console.log(message)
          return null
        },
        saveLogs({ specName, logs }) {
          const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
          const filename = `${specName}-${timestamp}.log`
          const filepath = path.join(logsDir, filename)
          
          fs.writeFileSync(filepath, logs.join('\n'))
          console.log(`📝 Saved console logs to: ${filepath}`)
          
          return null
        }
      })

      return config
    },
  },
})
