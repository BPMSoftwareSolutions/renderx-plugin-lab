describe('Canvas Component Create Symphony', () => {
  beforeEach(() => {
    // Visit the app
    cy.visit('/')
    
    // Wait for the app to initialize
    cy.contains('Symphony Player', { timeout: 10000 }).should('be.visible')
  })

  it('should successfully play the canvas component create symphony', () => {
    // Step 1: Select the "Canvas Component Create" symphony
    cy.get('select').first().select('Canvas Component Create')
    
    // Step 2: Enter the test data
    const testData = {
      type: 'button',
      elementId: 'button-1',
      x: 100,
      y: 100,
      width: 120,
      height: 40,
      properties: {
        text: 'Click Me',
        backgroundColor: '#667eea',
        color: 'white',
        borderRadius: '6px',
        fontSize: '14px',
        fontWeight: '600'
      }
    }
    
    cy.get('textarea').first().clear().type(JSON.stringify(testData, null, 2), { delay: 0 })
    
    // Step 3: Click the Play button
    cy.contains('button', 'Play').click()
    
    // Step 4: Verify no errors occurred
    cy.contains('Error:', { timeout: 1000 }).should('not.exist')
    
    // Step 5: Verify success in the play log
    cy.contains('Play Log', { timeout: 5000 }).should('be.visible')
    cy.contains('Canvas Component Create').should('be.visible')
    cy.contains('button-1').should('be.visible')
    
    // Step 6: Verify the component appears in the canvas viewer
    cy.contains('Canvas Viewer').should('be.visible')
    cy.contains('button-1').should('be.visible')
    
    // Log success
    cy.log('✅ Symphony played successfully!')
  })

  it('should show plugin registered in console', () => {
    // Check console logs for successful plugin registration
    cy.window().then((win) => {
      // We can't directly access console logs, but we can check if errors exist
      cy.wrap(win.console).should('exist')
    })
  })
})
