import bcrypt from "bcryptjs";
import prisma from "../../src/prisma";
import jwt from "jsonwebtoken";

const userOne = {
  input: {
    name: "baniket",
    email: "baniket@example.com",
    password: bcrypt.hashSync("password")
  },
  user: undefined,
  jwt: undefined
};

const postOne = {
  input: {
    title: "My published post",
    body: "",
    published: true
  },
  post: undefined
};

const postTwo = {
  input: {
    title: "My draft post",
    body: "",
    published: false
  },
  post: undefined
};

const seedDatabase = async () => {
  jest.setTimeout(15000);
  // Delete test data
  await prisma.mutation.deleteManyPosts();
  await prisma.mutation.deleteManyUsers();

  // Create user one
  userOne.user = await prisma.mutation.createUser({
    data: userOne.input
  });

  userOne.jwt = jwt.sign({ userId: userOne.user.id }, process.env.JWT_SECRET);

  postOne.post = await prisma.mutation.createPost({
    data: {
      ...postOne.input,
      author: {
        connect: {
          id: userOne.user.id
        }
      }
    }
  });
  postTwo.post = await prisma.mutation.createPost({
    data: {
      ...postTwo.input,
      author: {
        connect: {
          id: userOne.user.id
        }
      }
    }
  });
};

export { seedDatabase as default, userOne, postOne, postTwo };
