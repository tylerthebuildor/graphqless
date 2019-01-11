const express = require('express');
const expressGraphQL = require('express-graphql');
const { buildSchema } = require('graphql');
const { mergeTypes } = require('merge-graphql-schemas');
const expressPlayground = require('graphql-playground-middleware-express');

class App {
  constructor(config) {
    this.app = express();
    this.config = typeof config === 'function' ? config : () => config;
    this.middlewares = [];
    this.resolvers = {};
    this.schemas = [];
  }

  get(route, resolver) {
    const name = route.replace('/', '');
    if (this.resolvers[name]) {
      throw Error('Cannot declare duplicate resolver names');
    }
    this.resolvers[name] = async (args, context) =>
      new Promise(resolve =>
        resolver({ body: args, context }, { send: resolve })
      );
    return this;
  }

  post(route, resolver) {
    return this.get(route, resolver);
  }

  use(func) {
    this.middlewares.push(func);
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

    const appGraphQLWithMiddleware = this.middlewares.length
      ? this.middlewares[0](appGraphQL)
      : appGraphQL;
    // const store = { dispatch: server => server() }
    // this.middlewares.forEach(middleware => (dispatch = middleware(store)(dispatch)))

    this.app
      .use('/graphql', appGraphQLWithMiddleware)
      .get('/playground', expressPlayground.default({ endpoint: '/graphql' }))
      .listen(...args);
  }
}

module.exports = App;
