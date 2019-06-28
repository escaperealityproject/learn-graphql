import { GraphQLServer } from "graphql-yoga";
import uuidv4 from "uuid/v4";

// Scalar types - String, Boolean, Int, Float, ID

// Demo user data
const users = [
  {
    id: "1",
    name: "Andrew",
    email: "andrew@example.com",
    age: 27
  },
  {
    id: "2",
    name: "Sarah",
    email: "sarah@example.com"
  },
  {
    id: "3",
    name: "Mike",
    email: "mike@example.com"
  }
];

const posts = [
  {
    id: "10",
    title: "GraphQL 101",
    body: "This is how to use GraphQL...",
    published: true,
    author: "1"
  },
  {
    id: "11",
    title: "GraphQL 201",
    body: "This is an advanced GraphQL post...",
    published: false,
    author: "1"
  },
  {
    id: "12",
    title: "Programming Music",
    body: "",
    published: false,
    author: "2"
  }
];

const comments = [
  {
    id: "102",
    text: "Comment 1",
    author: "3",
    post: "11"
  },
  {
    id: "103",
    text: "Comment 2",
    author: "1",
    post: "12"
  },
  {
    id: "104",
    text: "Comment 3",
    author: "2",
    post: "11"
  },
  {
    id: "105",
    text: "Comment 4",
    author: "1",
    post: "10"
  }
];

// Type definitions (schema)
const typeDefs = `
    type Query {
        users(query: String): [User!]!
        posts(query: String): [Post!]!
        me: User!
        post: Post!
        comments: [Comment!]
    }

    type Mutation{
      createUser(data: CreateUserInput): User!
      createPost(data: CreatePostInput): Post!
      createComment(data: CreateCommentInput): Comment!
    }

    input CreateUserInput{
      name: String!
      email: String!
      age: Int
    }

    input CreatePostInput{
      title: String!
      body: String!
      published: Boolean!
      author: ID!
    }

    input CreateCommentInput{
      text: String!
      author: ID!
      post: ID!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments: [Comment!]
    }

    type Comment {
      id: ID!
      text: String!
      author: User!
      post: Post!
    }
`;

// Resolvers
const resolvers = {
  Query: {
    users(parent, args, ctx, info) {
      if (!args.query) {
        return users;
      }

      return users.filter(user => {
        return user.name.toLowerCase().includes(args.query.toLowerCase());
      });
    },
    posts(parent, args, ctx, info) {
      if (!args.query) {
        return posts;
      }

      return posts.filter(post => {
        const isTitleMatch = post.title
          .toLowerCase()
          .includes(args.query.toLowerCase());
        const isBodyMatch = post.body
          .toLowerCase()
          .includes(args.query.toLowerCase());
        return isTitleMatch || isBodyMatch;
      });
    },
    comments(parent, args, ctx, info) {
      return comments;
    },
    me() {
      return {
        id: "123098",
        name: "Mike",
        email: "mike@example.com"
      };
    },
    post() {
      return {
        id: "092",
        title: "GraphQL 101",
        body: "",
        published: false
      };
    }
  },
  Mutation: {
    createUser(parent, { data }, ctx, info) {
      const taken = users.some(user => {
        return user.email === data.email;
      });

      if (taken) {
        throw new Error("Email taken");
      }
      const user = {
        id: uuidv4(),
        ...data
      };
      users.push(user);
      return user;
    },
    createPost(parent, { data }, ctx, info) {
      const userExists = users.some(user => {
        return user.id === data.author;
      });
      if (!userExists) {
        throw new Error("User not found");
      }
      const post = {
        id: uuidv4(),
        title: data.title,
        ...data
      };
      posts.push(post);
      return post;
    },
    createComment(parent, { data }, ctx, info) {
      const postExist = posts.some(
        post => post.id === data.post && post.published
      );
      const userExist = users.some(user => user.id === data.author);
      if (!postExist) {
        throw new Error("Post not found");
      }
      if (!userExist) {
        throw new Error("Author not found");
      }
      const comment = {
        id: uuidv4(),
        ...data
      };
      return comment;
    }
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find(user => {
        return user.id === parent.author;
      });
    },
    comments(parent, args, ctx, info) {
      return comments.filter(comment => comment.post === parent.id);
    }
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter(post => {
        return post.author === parent.id;
      });
    },
    comments(parent, args, ctx, info) {
      return comments.filter(comment => {
        return comment.author === parent.id;
      });
    }
  },
  Comment: {
    author(parent, args, ctx, info) {
      return users.find(user => {
        return user.id === parent.author;
      });
    },
    post(parent, args, ctx, info) {
      return posts.find(post => {
        return post.id === parent.post;
      });
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
