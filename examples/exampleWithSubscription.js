const { GraphQLess, ApolloServerExpress } = require('../index.js');
const { PubSub } = ApolloServerExpress;

const app = new GraphQLess();
const pubsub = new PubSub();
const COUNT_UP = 'COUNT_UP';

let count = 0;
setInterval(() => pubsub.publish(COUNT_UP, { count: count++ }), 1000);

app.subscription('/count', (req, res) => {
  res.send({ subscribe: () => pubsub.asyncIterator(COUNT_UP) });
});

app.query('/dummy', (req, res) => {
  res.send('Hello');
});

app.useSchema(`
  type Subscription {
    count: Int
  }
  type Query {
    dummy: String
  }
`);

app.listen(3000, () => {
  console.log('Visit: http://localhost:3000/graphql');
});
