describe('empty spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:8080')
    cy.contains('Now I have been modified!')
  })
})