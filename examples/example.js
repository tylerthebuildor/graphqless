const graphQLess = require('../index.js');
const app = new graphQLess();

const db = { users: [{ name: 'Tyler' }] };

app.get('/users', (req, res) => {
  const { users } = db;
  res.send(users);
});

app.get('/user', (req, res) => {
  const user = db.users.find(user => user.name === req.body.name);
  res.send(user);
});

app.post('/createUser', (req, res) => {
  const userCount = db.users.push({ name: req.body.name });
  res.send(userCount);
});

app.useSchema(`
  type Query {
    users: [User]
    user(name: String): User
  }
  type Mutation {
    createUser(name: String): Int
  }
  type User {
    name: String
  }
`);

app.listen(3000, () => {
  console.log('Visit: http://localhost:3000/playground');
});
