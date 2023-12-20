describe('Navigation', () => {

  it('should simulate user visiting landing page', () => {
    //signup
    cy.visit('http://localhost:4200/')
    cy.get('[data-cy="signup"]').click()


    // cy.get('[data-cy="userName"]').type('James Angulars')
    // cy.get('[data-cy="email"]').type('james@gmail.com')
    // let loginEmail = ('[data-cy="email"]')
    // cy.get(loginEmail).type('james@gmail.com')
    // cy.get('[data-cy="email"]').as('email')
    // cy.get('@email').type('james@gmail.com')

    // cy.get('[data-cy="phone_no"]').type('0704142445')
    // cy.get('[data-cy="password"]').type('Mike1234567')
    // cy.get('[data-cy="confirm-password"]').type('Mike1234567')

    // cy.get('[data-cy="signup-btn"]').as('signup-btn')
    // cy.get('@signup-btn').then((el)=>{
    //   expect(el.val()).to.equal('Submit')
    //   expect(el.val()).to.contain('Sub')

    // })
    // cy.get('[data-cy="signup-btn"]').click()

    // //signin
    // cy.visit('http://localhost:4200/signin')
    // cy.get('[data-cy="email"]').type('eucs@gmail.com')
    // cy.get('[data-cy="password"]').type('Mike1234567')
    // cy.get('[data-cy="login-btn"]').click()

    // cy.visit('http://localhost:4200/landing')
    // cy.contains('.cards', 'ALX').click();
    // cy.url().should('include', '/single')

    // cy.loginUser()

    // cy.location('pathname').should('equal', '/admin')

    // cy.go('back')

    // cy.location('pathname').should('eq', '/')

    // cy.go('forward')

    // cy.location('pathname').should('equal', '/admin')

    // cy.contains('EMS')
  })
  it('should simulate user signup', () => {
    cy.visit('http://localhost:4200/signup')
    cy.get('[data-cy="email"]').type('james@gmail.com')
    cy.get('[data-cy="userName"]').type('James')
    cy.get('[data-cy="password"]').type('Mike123.100#')
    cy.get('[data-cy="confirm-password"]').type('Mike123.100#')

    cy.get('[data-cy="signup-btn"]').click()

  });

  it('should simulate login', () => {
    cy.visit('http://localhost:4200/signin')
    cy.get('[data-cy="userName"]').type("eucs")
    cy.get('[data-cy="password"]').type("Mike123.100#")
    cy.get('[data-cy="signin-btn"]').click()
  })


})
