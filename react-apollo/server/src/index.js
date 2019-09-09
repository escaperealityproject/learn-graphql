import { GraphQLServer, PubSub } from "graphql-yoga";
import axios from "axios";
import Query from "./resolvers/Query";

// // Not needed, but if making an express server, to allow croos-origin
// import cors from "cors";
// app.use(cors());

const server = new GraphQLServer({
  typeDefs: "./schema.graphql",
  resolvers: { Query },
  context: { axios }
});

server.start({ port: 5000 }, () => {
  console.log("Server running on port 5000 ");
});
