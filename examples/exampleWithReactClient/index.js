const express = require('express');
const GraphQLess = require('../../index.js');
const app = new GraphQLess();

const db = {
  users: [{ name: 'Tyler' }, { name: 'Brett' }, { name: 'Josh' }],
};

app.get('/users', (req, res) => {
  const { users } = db;
  res.send(users);
});

app.post('/createUser', (req, res) => {
  const user = { name: req.body.name };
  db.users.push(user);
  return res.send(user);
});

app.useSchema(`
  type Query {
    users: [User]
  }
  type Mutation {
    createUser(name: String): User
  }
  type User {
    name: String
  }
`);

app.express.use('/', express.static(__dirname + '/dist'));
app.listen(3000, () => {
  console.log('Visit: http://localhost:3000/ for React.js front-end');
  console.log('Visit: http://localhost:3000/playground for GraphQLPlayground');
});
