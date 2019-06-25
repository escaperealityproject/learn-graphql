import { GraphQLServer } from "graphql-yoga";

// Scalar types - String, Boolean, Int, Float, ID

// Type definitions (schema)
const typeDefs = `
    type Query {
        greeting(name: String): String!
        me: User!
        post: Post!
        add(a: Float!, b: Float!): Float! 
    }

    type User {
      id: ID!
      name: String!
      email: String!
      age: Int
    }

    type Post {
      id: ID!
      title: String!
      body: String
      published: Boolean!
    }
`;

// Resolvers
const resolvers = {
  Query: {
    add(parent, args, ctx, info) {
      return args.a + args.b;
    },
    greeting(parent, args, ctx, info) {
      if (!args.name) {
        return "Hello!!";
      }
      return `hello ${args.name}`;
    },
    me() {
      return {
        id: "123098",
        name: "some name",
        email: "somemail@example.com",
        age: 28
      };
    },
    post() {
      return {
        id: "123098",
        title: "some title",
        body: "Lorem Ipsum",
        published: true
      };
    }
  }
};

const server = new GraphQLServer({
  typeDefs,
  resolvers
});

server.start(() => {
  console.log("The server is up!");
});
