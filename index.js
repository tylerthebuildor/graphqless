const { mergeResolvers, mergeTypes } = require('merge-graphql-schemas');
const ApolloServerExpress = require('apollo-server-express');
const express = require('express');

const { ApolloServer, gql } = ApolloServerExpress;

class Router {
  constructor() {
    this.delete = this.patch = this.post = this.put = this.mutation;
    this.get = this.query;
    this.middlewares = [];
    this.resolvers = {};
    this.schemas = [];
  }

  use(func) {
    if (func instanceof Router) {
      this.middlewares = this.middlewares.concat(func.middlewares);
      this.resolvers = mergeResolvers([this.resolvers, func.resolvers]);
      this.schemas = [...this.schemas, ...func.schemas];
    } else if (func instanceof Function) {
      this.middlewares.push(func);
    } else {
      throw Error('use() expects an instance of Function or Router');
    }
    return this;
  }

  query(route, resolver) {
    if (!this.resolvers.Query) this.resolvers.Query = {};
    return this.useResolver(route, resolver, 'Query');
  }

  mutation(route, resolver) {
    if (!this.resolvers.Mutation) this.resolvers.Mutation = {};
    return this.useResolver(route, resolver, 'Mutation');
  }

  subscription(route, resolver) {
    if (!this.resolvers.Subscription) this.resolvers.Subscription = {};
    return this.useResolver(route, resolver, 'Subscription');
  }

  useResolver(route, resolver, type) {
    const name = route.replace('/', '');
    if (this.resolvers[type][name]) {
      throw Error(`Cannot declare duplicate resolver name: ${name}`);
    }
    this.resolvers[type][name] = (parent, args, context, info) =>
      new Promise(resolve =>
        resolver({ body: args, context }, { send: resolve })
      );
    return this;
  }

  useSchema(schema) {
    this.schemas.push(schema);
    return this;
  }
}

class GraphQLess extends Router {
  static Router() {
    const instance = new Router();
    return instance;
  }

  constructor(config = {}, options = {}) {
    super();
    this.express = express();
    this.config = config;
    this.options = {
      endpoint: '/graphql',
      playground: true,
      mergeTypes: { all: true },
      ...options,
    };
  }

  listen(...argsListen) {
    const server = new ApolloServer({
      typeDefs: gql(mergeTypes(this.schemas, this.options.mergeTypes)),
      resolvers: this.resolvers,
      playground: this.options.playground,
      ...this.config,
    });

    this.middlewares.forEach(middleware => {
      this.express.use(this.options.endpoint, middleware);
    });

    server.applyMiddleware({ app: this.express, path: this.options.endpoint });
    this.express.listen(...argsListen);
  }
}

module.exports = {
  GraphQLess,
  Router,
  ApolloServerExpress,
  express,
};
