/// <reference types="cypress"/>

describe("navigation", () => {
  it("should navigate to conference sessions page", () => {
    cy.clickViewSessions();

    cy.url().should("include", "sessions");
  })
})