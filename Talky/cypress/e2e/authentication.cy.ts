describe('Navigation', () => {


  it('should simulate user signup', () => {
    cy.viewport(2024, 1020)
    cy.visit('http://localhost:4200/signup')
    cy.get('[data-cy="email"]').type('james@gmail.com')
    cy.get('[data-cy="userName"]').type('James')
    cy.get('[data-cy="password"]').type('Mike123.100#')
    cy.get('[data-cy="confirm-password"]').type('Mike123.100#')
    cy.wait(1000)
    cy.get('[data-cy="signup-btn"]').click()

  });

  it('should simulate login', () => {
    cy.viewport(2024, 1020)
    cy.visit('http://localhost:4200/signin')
    cy.get('[data-cy="userName"]').type("eucs")
    cy.get('[data-cy="password"]').type("Mike123.100#")
    cy.get('[data-cy="signin-btn"]').click()
  });


  it('should simulate user forgets password', () => {
    cy.viewport(2024, 1020)
    cy.visit('http://localhost:4200/signin')
    cy.get('[data-cy="forgotPassword"]').click()
    cy.wait(1000)

  });
  it('should simulate user request password reset ', () => {
    cy.viewport(2024, 1020)
    cy.visit('http://localhost:4200/passwordReset')
    cy.get('[data-cy="email"]').type('eucs@gmail.com')
    cy.get('[data-cy="resetPwd-btn"]').click()
    cy.wait(2000)

  });

  it('should simulate user reset password ', () => {
    cy.viewport(2024, 1020)
    cy.visit('http://localhost:4200/reset')
    cy.get('[data-cy="email"]').type('eucs@gmail.com')
    cy.get('[data-cy="token"]').type('1234567890')
    cy.get('[data-cy="newPassword"]').type('Mike123.100#')
    cy.get('[data-cy="resetPwd-btn"]').click()
    cy.visit('http://localhost:4200/signin')
    cy.visit('http://localhost:4200/landing')
  });






})
