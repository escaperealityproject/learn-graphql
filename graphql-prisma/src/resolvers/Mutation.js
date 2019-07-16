import bcrypt from "bcryptjs";
import getUserId from "../utils/getUserId";
import generateToken from "../utils/generateToken";

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
    return {
      user,
      token: generateToken(user.id)
    };
  },
  async login(parent, { email, password }, { prisma }, info) {
    const user = await prisma.query.user({ where: { email } });
    if (!user) {
      throw new Error("Unable to login");
    }
    const passCompare = await bcrypt.compare(password, user.password);
    if (!passCompare) {
      throw new Error("Unable to login");
    }
    return {
      user,
      token: generateToken(user.id)
    };
  },
  async deleteUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    return prisma.mutation.deleteUser({ where: { id: userId } }, info);
  },
  updateUser(parent, { data }, { prisma, request }, info) {
    const userId = getUserId(request);

    return prisma.mutation.updateUser({ data, where: { id: userId } }, info);
  },
  createPost(parent, { data }, { prisma, request }, info) {
    const userId = getUserId(request);

    return prisma.mutation.createPost(
      {
        data: {
          title: data.title,
          body: data.body,
          published: data.published,
          author: { connect: { id: userId } }
        }
      },
      info
    );
  },

  async deletePost(parent, { id }, { prisma, request }, info) {
    const userId = getUserId(request);

    const postExists = await prisma.exists.Post({ id, author: { id: userId } });
    if (!postExists) {
      throw new Error("Unable to delete post");
    }

    return prisma.mutation.deletePost({ where: { id } }, info);
  },
  async updatePost(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);
    const postExists = await prisma.exists.Post({
      id: args.id,
      author: {
        id: userId
      }
    });
    const isPublished = await prisma.exists.Post({
      id: args.id,
      published: true
    });

    if (!postExists) {
      throw new Error("Unable to update post");
    }

    if (isPublished && args.data.published === false) {
      await prisma.mutation.deleteManyComments({
        where: { post: { id: args.id } }
      });
    }

    return prisma.mutation.updatePost(
      {
        where: {
          id: args.id
        },
        data: args.data
      },
      info
    );
  },
  async createComment(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);
    const postExists = await prisma.exists.Post({
      id: args.data.post,
      published: true
    });

    if (!postExists) {
      throw new Error("Unable to find post");
    }

    return prisma.mutation.createComment(
      {
        data: {
          text: args.data.text,
          author: {
            connect: {
              id: userId
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
  async createComment(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);
    const postExists = await prisma.exists.Post({
      id: args.data.post,
      published: true
    });

    if (!postExists) {
      throw new Error("Unable to find post");
    }

    return prisma.mutation.createComment(
      {
        data: {
          text: args.data.text,
          author: {
            connect: {
              id: userId
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
  async deleteComment(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);
    const commentExists = await prisma.exists.Comment({
      id: args.id,
      author: {
        id: userId
      }
    });

    if (!commentExists) {
      throw new Error("Unable to delete comment");
    }

    return prisma.mutation.deleteComment(
      {
        where: {
          id: args.id
        }
      },
      info
    );
  },
  async updateComment(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);
    const commentExists = await prisma.exists.Comment({
      id: args.id,
      author: {
        id: userId
      }
    });

    if (!commentExists) {
      throw new Error("Unable to update comment");
    }

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
