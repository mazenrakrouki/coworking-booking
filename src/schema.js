const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Space {
    id: ID!
    name: String!
    type: String!
    capacity: Int!
  }

  type Booking {
    id: ID!
    user: User!
    space: Space!
    start: String!
    end: String!
  }

  type Query {
    users: [User]
    spaces: [Space]
    availableSpaces(start: String!, end: String!): [Space]
  }

  type Mutation {
    createUser(name: String!, email: String!): User
    createSpace(name: String!, type: String!, capacity: Int!): Space
    bookSpace(userId: ID!, spaceId: ID!, start: String!, end: String!): Booking
  }
`;

module.exports = typeDefs;