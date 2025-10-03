describe('Plugin Registration Check', () => {
  it('should have canvas component plugin registered', () => {
    cy.visit('/')
    
    // Wait for app to load - check for the header
    cy.contains('RenderX Plugin Lab', { timeout: 5000 }).should('be.visible')
    
    // Click the Symphonies tab to show Symphony Player
    cy.contains('button', 'Symphonies').click()
    
    // Verify Symphony Player is now visible
    cy.contains('Symphony Player').should('be.visible')
    
    // Verify Canvas Viewer is visible (it's always visible)
    cy.contains('Canvas Viewer').should('be.visible')
    
    // Check that sequences are loaded
    cy.get('.symphony-player').within(() => {
      cy.contains('Loaded').should('be.visible')
      cy.contains('symphon').should('be.visible') // "symphonies" or "symphony"
    })
  })
})
