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

// Hit this route first to get a token
app.get('getToken', () => jwt.sign(db.users[0].id, JWT_SECRET));

// Now we can access in our routes/resolvers
// context is passed as the second argument
app.get('/me', (data, context) =>
  db.users.find(user => user.id === context.userId)
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
