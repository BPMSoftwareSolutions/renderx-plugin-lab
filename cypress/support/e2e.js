// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// ===== Console Log Capture =====
// Store console logs in memory
let consoleLogs = []

// Intercept cy.visit to capture console logs
Cypress.on('window:before:load', (win) => {
  // Intercept console methods
  const originalLog = win.console.log
  const originalError = win.console.error
  const originalWarn = win.console.warn
  const originalInfo = win.console.info

  win.console.log = function(...args) {
    const message = `[LOG] ${args.map(arg => {
      try {
        return typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      } catch (e) {
        return String(arg)
      }
    }).join(' ')}`
    consoleLogs.push(message)
    originalLog.apply(win.console, args)
  }

  win.console.error = function(...args) {
    const message = `[ERROR] ${args.map(arg => {
      try {
        return typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      } catch (e) {
        return String(arg)
      }
    }).join(' ')}`
    consoleLogs.push(message)
    originalError.apply(win.console, args)
  }

  win.console.warn = function(...args) {
    const message = `[WARN] ${args.map(arg => {
      try {
        return typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      } catch (e) {
        return String(arg)
      }
    }).join(' ')}`
    consoleLogs.push(message)
    originalWarn.apply(win.console, args)
  }

  win.console.info = function(...args) {
    const message = `[INFO] ${args.map(arg => {
      try {
        return typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      } catch (e) {
        return String(arg)
      }
    }).join(' ')}`
    consoleLogs.push(message)
    originalInfo.apply(win.console, args)
  }
})

// Reset logs before each test
beforeEach(() => {
  consoleLogs = []
})

// Save console logs after each test (especially on failure)
afterEach(function() {
  const testName = this.currentTest.title
  const specName = Cypress.spec.name.replace('.cy.js', '')
  const state = this.currentTest.state
  
  if (consoleLogs.length > 0) {
    cy.task('saveLogs', {
      specName: `${specName}-${testName.replace(/[^a-zA-Z0-9]/g, '-')}`,
      logs: [
        `Test: ${testName}`,
        `Status: ${state}`,
        `Timestamp: ${new Date().toISOString()}`,
        `Spec: ${Cypress.spec.name}`,
        ``,
        '=== Console Logs ===',
        '',
        ...consoleLogs
      ]
    })
  }
})
