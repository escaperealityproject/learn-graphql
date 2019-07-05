import { Prisma } from "prisma-binding";
import Query from "../../graphql-basics/src/resolvers/Query";
import { FragmentsOnCompositeTypesRule } from "graphql";

const prisma = new Prisma({
  typeDefs: "src/generated/prisma.graphql",
  endpoint: "http://localhost:4466"
});

const createPostForUser = async (authorId, data) => {
  const post = await prisma.mutation.createPost(
    {
      data: {
        ...data,
        author: {
          connect: {
            id: authorId
          }
        }
      }
    },
    "{id}"
  );
  const user = await prisma.query.user(
    { where: { id: authorId } },
    "{id name email posts{id title published}}"
  );
  return user;
};

const updatePostForUser = async (postId, data) => {
  const post = await prisma.mutation.updatePost(
    {
      where: {
        id: postId
      },
      data
    },
    "{author{id}}"
  );

  const user = await prisma.query.user(
    { where: { id: post.author.id } },
    "{id name email posts{id title published}}"
  );
  return user;
};

// updatePostForUser("cjxqkqf4l00950880iss48oo6", {
//   published: false
// }).then(user => console.log(JSON.stringify(user, undefined, 2)));

// createPostForUser("cjxqkmhpz006i0880774nu550", {
//   title: "Books to read",
//   body: "PJO, HOO",
//   published: true
// }).then(user => {
//   console.log(JSON.stringify(user, undefined, 2));
// });
