const { GraphQLess } = require('../../index.js');
const app = new GraphQLess();
const router = require('./router');

app.use(router);

app.listen(3000, () => {
  console.log('Visit: http://localhost:3000/graphql');
});
