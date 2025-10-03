describe('Canvas Component Create Symphony', () => {
  beforeEach(() => {
    // Visit the app
    cy.visit('/')
    
    // Wait for app header to load
    cy.contains('RenderX Plugin Lab', { timeout: 5000 }).should('be.visible')
    
    // Click the Symphonies tab to show Symphony Player
    cy.contains('button', 'Symphonies').click()
    
    // Wait for Symphony Player to be visible
    cy.contains('Symphony Player', { timeout: 5000 }).should('be.visible')
    
    // Verify Canvas Viewer is visible
    cy.contains('Canvas Viewer').should('be.visible')
  })

  it('should create a button component on the canvas when symphony is played', () => {
    // Step 1: Verify canvas is empty initially
    cy.get('.canvas-viewer').should('be.visible')
    cy.get('.empty-state').should('be.visible').and('contain', 'Canvas is Empty')
    
    // Step 2: Select the "Canvas Component Create" symphony
    cy.get('select').first().select('Canvas Component Create')
    cy.get('select').first().should('have.value', 'canvas-component-create-symphony')
    
    // Step 3: Enter the test data for a button
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
    
    cy.get('textarea').first().clear()
    cy.get('textarea').first().type(JSON.stringify(testData, null, 2), { delay: 0, parseSpecialCharSequences: false })
    
    // Step 4: Click the Play button
    cy.contains('button', 'Play').click()
    
    // Step 5: Verify no errors occurred
    cy.get('.symphony-player').within(() => {
      cy.contains('Error:', { timeout: 1000 }).should('not.exist')
    })
    
    // Step 6: Verify success in the execution log
    cy.contains('Execution Log', { timeout: 5000 }).should('be.visible')
    cy.get('.log-entry').first().within(() => {
      cy.contains('Canvas Component Create').should('be.visible')
      // The log entry shows timestamp, symphony name, and result
    })
    
    // Step 7: *** MAIN ASSERTION *** - Verify the button component is created on the canvas
    cy.get('.canvas-viewer').within(() => {
      // Empty state should be gone
      cy.get('.empty-state').should('not.exist')
      
      // Component should appear in the components list
      cy.get('.components-list').should('be.visible')
      cy.get('.component-card').should('have.length', 1)
      
      // Verify the component details
      cy.get('.component-card').first().within(() => {
        cy.contains('button').should('be.visible') // type
        cy.contains('button-1').should('be.visible') // elementId
      })
    })
    
    // Step 8: Verify last event shows creation
    cy.get('.event-display').within(() => {
      cy.contains('Last Event').should('be.visible')
      cy.contains('create').should('be.visible')
      cy.contains('button-1').should('be.visible')
    })
    
    // Log success
    cy.log('✅ Button component successfully created on canvas!')
  })

  it('should handle multiple component creations', () => {
    // Create first button
    cy.get('select').first().select('Canvas Component Create')
    
    const button1 = {
      type: 'button',
      elementId: 'button-1',
      x: 100,
      y: 100,
      width: 120,
      height: 40
    }
    
    cy.get('textarea').first().clear().type(JSON.stringify(button1), { delay: 0, parseSpecialCharSequences: false })
    cy.contains('button', 'Play').click()
    cy.wait(500)
    
    // Create second button
    const button2 = {
      type: 'button',
      elementId: 'button-2',
      x: 250,
      y: 150,
      width: 100,
      height: 35
    }
    
    cy.get('textarea').first().clear().type(JSON.stringify(button2), { delay: 0, parseSpecialCharSequences: false })
    cy.contains('button', 'Play').click()
    cy.wait(500)
    
    // Verify both components exist
    cy.get('.canvas-viewer .component-card').should('have.length', 2)
    cy.contains('button-1').should('be.visible')
    cy.contains('button-2').should('be.visible')
    
    cy.log('✅ Multiple components created successfully!')
  })
})
