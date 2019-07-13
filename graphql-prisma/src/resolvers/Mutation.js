import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// jwt.sign({object},'secret')
// jwt.decode(token)
// jwt.verify(token,'secret')

const Mutation = {
  async createUser(parent, args, { prisma }, info) {
    const emailTaken = await prisma.exists.User({ email: args.data.email });
    if (args.data.password.length < 8) {
      throw new Error("Password must be 8 characters or longer");
    }

    // second argument is salt
    const password = await bcrypt.hash(args.data.password, 10);

    if (emailTaken) {
      throw new Error("Email taken");
    }

    const user = await prisma.mutation.createUser({
      data: {
        ...args.data,
        password
      }
    });
    return { user, token: jwt.sign({ userId: user.id }, "thisisasecret") };
  },
  async deleteUser(parent, args, { prisma }, info) {
    const userExists = await prisma.exists.User({ id: args.id });

    if (!userExists) {
      throw new Error("User does not exist");
    }

    return prisma.mutation.deleteUser({ where: { id: args.id } }, info);
  },
  updateUser(parent, { id, data }, { prisma }, info) {
    return prisma.mutation.updateUser({ data, where: { id } }, info);
  },
  createPost(parent, { data }, { prisma }, info) {
    return prisma.mutation.createPost(
      {
        data: {
          title: data.title,
          body: data.body,
          published: data.published,
          author: { connect: { id: data.author } }
        }
      },
      info
    );
  },

  deletePost(parent, { id }, { prisma }, info) {
    return prisma.mutation.deletePost({ where: { id } }, info);
  },
  updatePost(parent, { id, data }, { prisma }, info) {
    return prisma.mutation.updatePost({ data, where: { id } }, info);
  },
  createComment(parent, args, { prisma }, info) {
    return prisma.mutation.createComment(
      {
        data: {
          text: args.data.text,
          author: {
            connect: {
              id: args.data.author
            }
          },
          post: {
            connect: {
              id: args.data.post
            }
          }
        }
      },
      info
    );
  },
  deleteComment(parent, args, { prisma }, info) {
    return prisma.mutation.deleteComment(
      {
        where: {
          id: args.id
        }
      },
      info
    );
  },
  updateComment(parent, args, { prisma }, info) {
    return prisma.mutation.updateComment(
      {
        where: {
          id: args.id
        },
        data: args.data
      },
      info
    );
  }
};

export default Mutation;
