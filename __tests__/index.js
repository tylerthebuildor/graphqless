const { GraphQLess } = require('../index.js');

describe('Router()', () => {
  it('Router variables are not static and should not be shared between routers', () => {
    const router1 = GraphQLess.Router();
    const router2 = GraphQLess.Router();

    router1.useSchema('a dog');
    router2.useSchema('a cat');

    expect(router1.schemas).not.toEqual(['a dog', 'a cat']);
    expect(router1.schemas).toEqual(['a dog']);
    expect(router2.schemas).toEqual(['a cat']);
  });
});

describe('use()', () => {
  it('should only accept an instance of Function or Router', () => {
    const app = new GraphQLess();
    const router = GraphQLess.Router();

    expect(app.use(() => {})).toEqual(app);
    expect(app.use(router)).toEqual(app);
    expect(() => app.use('red')).toThrow(
      Error('use() expects an instance of Function or Router')
    );
  });

  it('should chain multiple middleware functions', () => {
    const app = new GraphQLess();

    app.use(() => 'first in chain');
    app.use(() => 'second in chain');

    expect(app.middlewares.length).toEqual(2);
    expect(app.middlewares[0]()).toEqual('first in chain');
    expect(app.middlewares[1]()).toEqual('second in chain');
  });

  it('should merge class variables if input is a GraphQLess instance', () => {
    const app = new GraphQLess();
    const router = GraphQLess.Router();

    router.get('/get', () => {});
    router.post('/post', () => {});
    router.put('/put', () => {});
    router.delete('/delete', () => {});
    router.query('/query', () => {});
    router.mutation('/mutation', () => {});
    router.subscription('/mutation', () => {});

    router.useSchema('test');
    router.useSchema('test2');

    router.use(() => {});
    router.use(() => {});

    app.use(router);
    expect(app.middlewares.length).toEqual(2);
    expect(
      Object.keys({
        ...app.resolvers.Query,
        ...app.resolvers.Mutation,
        ...app.resolvers.Subscription,
      }).length
    ).toBe(6);
    expect(app.schemas.length).toBe(2);
  });

  it('should correctly chain Router middlewares to existing app middleswares', () => {
    const app = new GraphQLess();
    const router = GraphQLess.Router();

    router.use(() => 'router middleware');
    app.use(router);
    app.use(() => 'app middleware');

    expect(app.middlewares.length).toEqual(2);
    expect(app.middlewares[0]()).toEqual('router middleware');
    expect(app.middlewares[1]()).toEqual('app middleware');
  });
});

describe('express', () => {
  it('should be accessible from GraphQLess instance', () => {
    const app = new GraphQLess();
    app.express.use('/example', (req, res) => res.send('test'));

    // express internals
    const layer = app.express._router.stack.pop();
    const output = layer.handle(null, { send: val => val });

    expect(output).toEqual('test');
  });
});
