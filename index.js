const express = require('express');
const expressGraphQL = require('express-graphql');
const { buildSchema } = require('graphql');
const { mergeTypes } = require('merge-graphql-schemas');
const expressPlayground = require('graphql-playground-middleware-express');

class GraphQLess {
  static Router() {
    const instance = new GraphQLess();
    instance.listen = undefined;
    return instance;
  }

  constructor(config) {
    this.app = null;
    this.config = typeof config === 'function' ? config : () => config;
    this.middlewares = (req, res, next) => next();
    this.post = this.put = this.delete = this.patch = this.query = this.mutation = this.get;
    this.resolvers = {};
    this.schemas = [];
  }

  get(route, resolver) {
    const name = route.replace('/', '');
    if (this.resolvers[name]) {
      throw Error(`Cannot declare duplicate resolver name: ${name}`);
    }
    this.resolvers[name] = (args, context) =>
      new Promise(resolve =>
        resolver({ body: args, context }, { send: resolve })
      );
    return this;
  }

  use(func) {
    if (func instanceof GraphQLess) {
      this.middlewares = (req, res, next) => func.middlewares(req, res, next);
      this.resolvers = { ...this.resolvers, ...func.resolvers };
      this.schemas = [...this.schemas, ...func.schemas];
    } else {
      this.middlewares = (req, res, next) => func(req, res, next);
    }
    return this;
  }

  useSchema(schema) {
    this.schemas.push(schema);
    return this;
  }

  listen(...args) {
    const appGraphQL = expressGraphQL(req => ({
      schema: buildSchema(mergeTypes(this.schemas, { all: true })),
      rootValue: this.resolvers,
      graphiql: true,
      ...this.config(req),
    }));

    const rootMiddleware = (req, res, next) =>
      this.middlewares(req, res, () => appGraphQL(req, res, next));

    this.app = express();
    this.app
      .use('/graphql', rootMiddleware)
      .get('/playground', expressPlayground.default({ endpoint: '/graphql' }))
      .listen(...args);
  }
}

module.exports = GraphQLess;
