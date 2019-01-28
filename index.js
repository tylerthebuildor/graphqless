const express = require('express');
const expressGraphQL = require('express-graphql');
const { buildSchema } = require('graphql');
const { mergeTypes } = require('merge-graphql-schemas');
const expressPlayground = require('graphql-playground-middleware-express');

class Router {
  constructor() {
    this.middlewares = [];
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
    if (func instanceof Router) {
      this.middlewares = this.middlewares.concat(func.middlewares);
      this.resolvers = { ...this.resolvers, ...func.resolvers };
      this.schemas = [...this.schemas, ...func.schemas];
    } else if (func instanceof Function) {
      this.middlewares.push(func);
    } else {
      throw Error('use() expects an instance of Function or Router');
    }
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
    this.expressGraphQL = null;
    this.config = config instanceof Function ? config : () => config;
    this.options = {
      endpoint: '/graphql',
      usePlayground: true,
      mergeTypes: { all: true },
      expressPlayground: { endpoint: '/graphql' },
      ...options,
    };
  }

  listen(...argsListen) {
    this.expressGraphQL = expressGraphQL((req, res, next) => ({
      schema: buildSchema(mergeTypes(this.schemas, this.options.mergeTypes)),
      rootValue: this.resolvers,
      graphiql: true,
      ...this.config(req, res, next, {
        schemas: this.schemas,
        resolvers: this.resolvers,
      }),
    }));

    this.middlewares.forEach(middleware => {
      this.express.use(this.options.endpoint, middleware);
    });

    if (this.options.usePlayground) {
      this.express.get(
        '/playground',
        expressPlayground.default(this.options.expressPlayground)
      );
    }

    this.express
      .use(this.options.endpoint, this.expressGraphQL)
      .listen(...argsListen);
  }
}

module.exports = GraphQLess;
