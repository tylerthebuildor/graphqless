const GraphQLess = require('../../index.js');
const router = GraphQLess.Router();

const db = { users: [{ name: 'Tyler' }] };

router.get('/users', (req, res) => {
  const { users } = db;
  res.send(users);
});

router.get('/user', (req, res) => {
  const user = db.users.find(user => user.name === req.body.name);
  res.send(user);
});

router.post('/createUser', (req, res) => {
  const userCount = db.users.push({ name: req.body.name });
  res.send(userCount);
});

router.useSchema(`
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

module.exports = router;
