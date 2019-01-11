# GraphQLess

REST and GraphQL really aren't that different.

I'll prove it!

With this library you can write your GraphQL server almost exactly like you would with Express.js.

## Setup

```bash
yarn install graphqless
```

And here is how you write a server... Look familiar?

```jsx
const graphQLess = require('graphqless');
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

app.listen(3000, () => {
  console.log('Visit: http://localhost:3000/playground');
});
```

I know it looks like Express.js but the code above is a GraphQL server! There is one caveat though...

GraphQL requires us to write a schema that describes the `.get` and `.post` functions inputs and outputs.
Just know that `.get === Query && .post === Mutation`. Now let's modify the last few lines of the snippet above to include the required schema:

```jsx
app
  .useSchema(
    `
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
  `
  )
  .listen(3000, () => {
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
