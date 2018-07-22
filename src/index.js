const { GraphQLServer } = require('graphql-yoga');

let links = [
  {
    id: 'link-0',
    url: 'www.google.com',
    description: 'search engine web site',
  },
];
let idCount = links.length;

const resolvers = {
  Query: {
    info: () => null,
    feed: () => links,
    link: (root, { id }) => links.find(l => l.id === id),
  },
  Mutation: {
    post: (root, args) => {
      const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url,
      };
      links = [...links, link];
      return link;
    },
    updateLink: (root, args) => {
      const linkIndex = links.findIndex(l => l.id === args.id);
      if (linkIndex === -1) {
        return null;
      }

      const updatedLink = { ...links[linkIndex], ...args };
      links = [...links.slice(0, linkIndex), updatedLink, ...links.slice(linkIndex + 1)];
      return updatedLink;
    },
    deleteLink: (root, { id }) => {
      const linkIndex = links.findIndex(l => l.id === id);
      if (linkIndex === -1) {
        return null;
      }

      const deletedLink = links[linkIndex];
      links = [...links.slice(0, linkIndex), ...links.slice(linkIndex + 1)];
      return deletedLink;
    },
  },
};

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
});
server.start(() => console.log('Server is running on localhost:4000'));
