# GraphQLess

Write GraphQL like you would vanilla Express.js.

## Setup

```bash
yarn install graphqless
```

And here is how you write a server... Look familiar?

```jsx
const graphQLess = require('graphqless');
const app = new graphQLess();

const db = { users: [{ name: 'Tyler' }] };

app.get('/users', () => db.users);
app.get('/user', ({ name }) => db.users.find(user => user.name === name));
app.post('/createUser', ({ name }) => db.users.push({ name }));

// This is the only substantial difference
// you need ot write a schema that paris to the
// .get and .post functions above
// .get === Query && .post === Mutation
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
```

You can find more examples in the [examples](/examples) folder.

## Queries for examples/example.js

```bash
npx nodemon examples/example.js
```

```graphql
mutation createUser {
  createUser(name: "Buchea")
}

query getUsers {
  users {
    name
  }
  user(name: "Tyler") {
    name
  }
}
```

## Queries for examples/exampleWithAuth.js

```bash
npx nodemon examples/exampleWithAuth.js
```

```graphql
query getToken {
  getToken
}

# Add this to "HTTP HEADERS" in GraphQL Playground:
# { "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.YWJj.4noRC-c0ay0hOeZ5Cgc80MVS0P4p4FrR2lJFzMNSnE4" }

query getMe {
  me {
    id
    name
  }
}
```
