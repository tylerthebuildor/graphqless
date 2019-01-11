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
// you need to write a schema that describes the
// .get and .post functions inputs and outputs
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

One other small difference you may have noticed is that the get/post functions don't use `(req, res)` arguments. I could of added these. But I let some of the GraphQL interface shine through here because it's just so much simpler. Instead of having `(req, res)` for the first and second argument we have requestBody for the first argument, so you can always grab your input or "POST" data from this argument. As for `res` it's not even needed because in GraphQL we just do a regular return from the function with the value we want to serve to the API consumer.

If you're thinking hey that's great for synchronous JavaScript object fetching, but what about my async database calls. Well GraphQL can handle promises so you'll just need to return a promise that returns a value instead. You can also use async await just as easily.

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

## Queries for examples/exampleAsync.js

This one is the same as example.js except the `users` query will asynchronously wait for 5 seconds before returning the value.

```bash
npx nodemon examples/exampleAsync.js
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
