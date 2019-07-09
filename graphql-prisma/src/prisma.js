import { Prisma } from "prisma-binding";
import Query from "../../graphql-basics/src/resolvers/Query";
import { FragmentsOnCompositeTypesRule } from "graphql";

const prisma = new Prisma({
  typeDefs: "src/generated/prisma.graphql",
  endpoint: "http://localhost:4466"
});

const createPostForUser = async (authorId, data) => {
  const userExists = await prisma.exists.User({ id: authorId });

  if (!userExists) {
    throw new Error("User not found");
  }

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
    "{ author { id name email posts{ id title published } } }"
  );
  return post.author;
};

const updatePostForUser = async (postId, data) => {
  const postExists = await prisma.exists.Post({ id: postId });

  if (!postExists) {
    throw new Error("Post not found");
  }

  const post = await prisma.mutation.updatePost(
    {
      where: {
        id: postId
      },
      data
    },
    "{author{id name email posts{id title published}}}"
  );

  return post.author;
};

// updatePostForUser("cjxqkqf4l00950880iss48oo6", {
//   published: false
// })
//   .then(user => console.log(JSON.stringify(user, undefined, 2)))
//   .catch(err => console.log(err.message));

// createPostForUser("cjxptzkcw003c0780128ca8xz", {
//   title: "Books to read",
//   body: "PJO, HOO",
//   published: true
// })
//   .then(user => {
//     console.log(JSON.stringify(user, undefined, 2));
//   })
//   .catch(err => console.log(err.message));
