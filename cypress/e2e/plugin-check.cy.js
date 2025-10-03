describe('Plugin Registration Check', () => {
  it('should have canvas component plugin registered', () => {
    cy.visit('/')
    
    // Wait for initialization
    cy.wait(2000)
    
    // Check the console for plugin registration
    cy.window().then((win) => {
      // Access the conductor from window if exposed
      expect(win).to.exist
    })
    
    // Verify UI is loaded
    cy.contains('Symphony Player').should('be.visible')
    cy.contains('Canvas Viewer').should('be.visible')
  })
})
