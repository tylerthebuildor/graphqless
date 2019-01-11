const jwt = require('jsonwebtoken');

const graphQLess = require('../index.js');
const app = new graphQLess(req => ({ context: { userId: req.jwt } }));

const JWT_SECRET = 'SHHH';
const db = { users: [{ id: 'abc', name: 'Tyler' }] };

app.use(next => (req, res) => {
  req.jwt = jwt.verify(
    req.headers.authorization.replace('Bearer ', ''),
    JWT_SECRET
  );
  next(req, res);
});

// Hit this route to get a token
app.get('getToken', (req, res) =>
  res.send(jwt.sign(db.users[0].id, JWT_SECRET))
);

// Now we can access in our route
// context is passed inside req
app.get('/me', (req, res) =>
  res.send(db.users.find(user => user.id === req.context.userId))
);

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
  console.log('Visit: http://localhost:3000/playground');
});
