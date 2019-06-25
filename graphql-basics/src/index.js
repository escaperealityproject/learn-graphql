import { GraphQLServer } from "graphql-yoga";

// Scalar types -> String, Boolean, Int, Float, ID
// Type definitions (schema)
const typeDefs = `
    type Query{
        id: ID!
        name: String!
        age: Int!
        employed: Boolean!
        gpa: Float
    }
`;

// Resolvers
const resolvers = {
  Query: {
    id() {
      return "abc123";
    },
    name() {
      return "Some name";
    },
    age() {
      return 20;
    },
    employed() {
      return true;
    },
    gpa() {
      return null;
    }
  }
};

const server = new GraphQLServer({
  typeDefs,
  resolvers
});

server.start(() => {
  console.log("Server is running");
});
