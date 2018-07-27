const { GraphQLServer } = require('graphql-yoga');
const { Prisma } = require('prisma-binding');

const resolvers = {
  Query: {
    info: () => null,
    feed: (root, args, context, info) => context.db.query.links({}, info),
    // link: (root, { id }) => links.find(l => l.id === id),
  },
  Mutation: {
    post: (root, args, context, info) =>
      context.db.mutation.createLink(
        {
          data: {
            url: args.url,
            description: args.description,
          },
        },
        info
      ),
    // updateLink: (root, args) => {
    //   const linkIndex = links.findIndex(l => l.id === args.id);
    //   if (linkIndex === -1) {
    //     return null;
    //   }

    //   const updatedLink = { ...links[linkIndex], ...args };
    //   links = [...links.slice(0, linkIndex), updatedLink, ...links.slice(linkIndex + 1)];
    //   return updatedLink;
    // },
    // deleteLink: (root, { id }) => {
    //   const linkIndex = links.findIndex(l => l.id === id);
    //   if (linkIndex === -1) {
    //     return null;
    //   }

    //   const deletedLink = links[linkIndex];
    //   links = [...links.slice(0, linkIndex), ...links.slice(linkIndex + 1)];
    //   return deletedLink;
    // },
  },
};

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: req => ({
    ...req,
    db: new Prisma({
      typeDefs: 'src/generated/prisma.graphql',
      endpoint: 'https://eu1.prisma.sh/jonas-pauthier-3b900f/database/dev',
      secret: 'mysecret123',
      debug: true,
    }),
  }),
});
server.start(() => console.log('Server is running on localhost:4000'));
