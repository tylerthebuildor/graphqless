const graphQLess = require('../index.js');
const app = new graphQLess();

const db = { users: [{ name: 'Tyler' }] };

app.get('/users', () => db.users);
app.get('/user', ({ name }) => db.users.find(user => user.name === name));
app.post('/createUser', ({ name }) => db.users.push({ name }));

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
