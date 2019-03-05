const jwt = require('jsonwebtoken');

const { GraphQLess } = require('../index.js');
const app = new GraphQLess({ context: ({ req }) => ({ userId: req.jwt }) });

const JWT_SECRET = 'SHHH';
const db = { users: [{ id: 'abc', name: 'Tyler' }] };

// This is our authentication middleware
app.use((req, res, next) => {
  req.jwt = req.headers.authorization
    ? jwt.verify(req.headers.authorization.replace('Bearer ', ''), JWT_SECRET)
    : null;
  next();
});

// Hit this route to get a token
app.get('getToken', (req, res) => {
  res.send(jwt.sign(db.users[0].id, JWT_SECRET));
});

// Now we can access in our route
// context is passed inside req
app.get('/me', (req, res) => {
  res.send(db.users.find(user => user.id === req.context.userId));
});

app.useSchema(`
  type Query {
    me: User
    getToken: String
  }
  type User {
    id: ID
    name: String
  }
`);

app.listen(3000, () => {
  console.log('Visit: http://localhost:3000/graphql');
});
