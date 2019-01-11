const graphQLess = require('../index.js');
const app = new graphQLess();

const db = { users: [{ name: 'Tyler' }] };

app.get('/users', (req, res) => res.send(db.users));
app.get('/user', (req, res) =>
  res.send(db.users.find(user => user.name === req.body.name))
);
app.post('/createUser', (req, res) =>
  res.send(db.users.push({ name: req.body.name }))
);

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
