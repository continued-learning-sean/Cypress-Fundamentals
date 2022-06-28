/// <reference types="cypress"/>

const thursdaySessionsData = {
  data:{
    intro: [
      {
        id: "78170",
        title: "Cypress 9 Fundamentals",
        startsAt: "8:30",
        day: "Thursday",
        room: "Jupiter",
        level: "Introductory and overview",
        speakers: [
          {
            id: "37313769-11ae-4245-93b3-e6e60d5d187c",
            name: "Adhithi Ravichandran",
            __typename: "Speaker",
          },
        ],
        __typename: "Session",
      },
      {
        id: "12345",
        title: "New Fundamentals",
        startsAt: "10:30",
        day: "Thursday",
        room: "Jupiter",
        level: "Introductory and overview",
        speakers: [
          {
            id: "37313769-11ae-4245-93b3-e6e60d5d187c",
            name: "Adhithi Ravichandran",
            __typename: "Speaker",
          },
        ],
        __typename: "Session",
      },
    ],
    intermediate: [
      {
        id: "85324",
        title: "Bamboo Spec",
        startsAt: "8:30",
        day: "Thursday",
        room: "Io",
        level: "Intermediate",
        speakers: [
          {
            id: "e9c40ccc-1ffd-44f5-90c2-9d69ada76073",
            name: "Benjamin Cox",
            __typename: "Speaker",
          },
        ],
        __typename: "Session",
      },
    ],
    advanced: [
      {
        id: "84969",
        title: "Microservices -- The Hard Way is the right Way",
        startsAt: "9:45",
        day: "Thursday",
        room: "Ganymede",
        level: "Advanced",
        speakers: [
          {
            id: "60e31e1b-2d77-4f36-8e11-4d9f8b639bc8",
            name: "Joe Lopez",
            __typename: "Speaker",
          },
        ],
        __typename: "Session",
      },
    ]
  }
}

describe("Sessions page", () => {
  beforeEach(() => {
    cy.clickViewSessions();
    cy.url().should("include", "sessions");

    // Define aliases here 
    cy.dataCY("AllSessions").as("AllSessionsBtn");
    cy.dataCY("Wednesday").as("WednesdayBtn");
    cy.dataCY("Thursday").as("ThursdayBtn");
    cy.dataCY("Friday").as("FridayBtn");
  });
  
  it("should navigate to conference sessions page and view day filter buttons", () => {
    // Validate that buttons to filter by dy exists.
    cy.get("@AllSessionsBtn");
    cy.get("@WednesdayBtn");
    cy.get("@ThursdayBtn");
    cy.get("@FridayBtn");
  });

  it("should filter sessions and only display AllSessions sessions when AllSessions button is clicked", () => {
    cy.intercept("POST", "http://localhost:4000/graphql").as("getSessionInfo");
    cy.get("@AllSessionsBtn").click();
    cy.wait("@getSessionInfo");
    // you can add a screenshot method in order to get a screenshot at a specific part in the tests. 
    // cy.screenshot();

    // Assertions 
    cy.dataCY("day").contains("Wednesday").should("be.visible");
    cy.dataCY("day").contains("Thursday").should("be.visible");
    cy.dataCY("day").contains("Friday").should("be.visible");
  });
  
  it("should filter sessions and only display Wednesday sessions when Wednesday button is clicked", () => {
    // cy.intercept("POST", "http://localhost:4000/graphql").as("getSessionInfo");
    cy.get("@WednesdayBtn").click();
    // cy.wait("@getSessionInfo");
    // fails, not sure why

    // Assertions 
    // Assert there are 100 sessions after Wednesday button is clicked
    cy.dataCY("day").should("have.length", 21);
    cy.dataCY("day").contains("Wednesday").should("be.visible");
    cy.dataCY("day").contains("Thursday").should("not.exist");
    cy.dataCY("day").contains("Friday").should("not.exist");
  });

  it("should filter sessions and only display Thursday sessions when Thursday button is clicked", () => {
    // Stubbing response data 
    cy.intercept("POST", "http://localhost:4000/graphql", thursdaySessionsData).as("getSessionInfo");
    cy.get("@ThursdayBtn").click();
    cy.wait("@getSessionInfo");

    // Assertions 
    cy.dataCY("day").should("have.length",4);
    cy.dataCY("day").contains("Wednesday").should("not.exist");
    cy.dataCY("day").contains("Thursday").should("be.visible");
    cy.dataCY("day").contains("Friday").should("not.exist");
  });

  it("should filter sessions and only display Friday sessions when Friday button is clicked", () => {
    cy.intercept("POST", "http://localhost:4000/graphql", {fixture: "sessions.json"}).as("getSessionInfo");
    cy.get("@FridayBtn").click();
    cy.wait("@getSessionInfo");

    // Assertions 
    cy.dataCY("day").should("have.length", 4);
    cy.dataCY("day").contains("Wednesday").should("not.exist");
    cy.dataCY("day").contains("Thursday").should("not.exist");
    cy.dataCY("day").contains("Friday").should("be.visible");
  });
})