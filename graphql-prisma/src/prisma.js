import { Prisma } from "prisma-binding";
import Query from "../../graphql-basics/src/resolvers/Query";

const prisma = new Prisma({
  typeDefs: "src/generated/prisma.graphql",
  endpoint: "http://localhost:4466"
});

// prisma.query.users(null, "{ id name posts{id title }}").then(data => {
//     console.log(JSON.stringify(data, undefined, 2));
// });

// prisma.mutation
//   .createPost(
//     {
//       data: {
//         title: "New graphQL post",
//         body: "This was made using prisma inside node",
//         published: true,
//         author: {
//           connect: {
//             id: "cjxpta7zr01mg0772fe1a5y2n"
//           }
//         }
//       }
//     },
//     "{id title body published}"
//   )
//   .then(data => {
//     console.log(data);
//     return prisma.query.users(null, "{ id name posts{id title }}");
//   })
//   .then(data => {
//     console.log(JSON.stringify(data, undefined, 2));
//   });

prisma.mutation
  .updatePost(
    {
      where: {
        id: "cjxq6oc4z01b5088020fhtkcw"
      },
      data: {
        body: "Newer graphQL post updated!",
        published: true
      }
    },
    "{id}"
  )
  .then(data => {
    return prisma.query.posts(null, "{id title body published}");
  })
  .then(data => {
    console.log(data);
  });
