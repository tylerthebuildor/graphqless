const GraphQLess = require('../index.js');

describe('Router()', () => {
  it('should return a new instance of GraphQLess everytime its called', () => {
    const router1 = GraphQLess.Router();
    const router2 = GraphQLess.Router();

    router1.useSchema('a dog');
    router2.useSchema('a cat');

    // proves GraphQLess instance
    expect(router1 instanceof GraphQLess).toBe(true);
    // proves new instance (class variables aren't shared)
    expect(router1.schemas).toEqual(['a dog']);
    expect(router2.schemas).toEqual(['a cat']);
  });

  it('should remove the listen method from GraphQLess instance before returning it', () => {
    const router = GraphQLess.Router();
    expect(router.listen).toBe(undefined);
  });
});
