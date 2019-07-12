import { Prisma } from "prisma-binding";
import Query from "../../graphql-basics/src/resolvers/Query";
import { FragmentsOnCompositeTypesRule } from "graphql";

const prisma = new Prisma({
  typeDefs: "src/generated/prisma.graphql",
  endpoint: "http://localhost:4466",
  secret: "Icanputwhatevriwanthere"
});

export default prisma;
