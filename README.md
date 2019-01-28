<p align="center">
    <img alt="GraphQLess" src="examples/logo.png" width="60" />
</p>
<h1 align="center">
  GraphQLess
</h1>
<h3 align="center">
  ⚛️ 🚀🤘
</h3>
<p align="center">
  <strong>REST and GraphQL really aren't that different. ll prove it!</strong><br>
  GraphQLess is a thin wrapper around the official <a href="https://github.com/graphql/express-graphql">express-graphql</a> project.
  <br />
  GraphQLess let's you write your GraphQL server almost exactly like you would with Express.js.
</p>

## Setup

```bash
yarn add graphqless
```

And here is how you write a server... Look familiar?

```jsx
const GraphQLess = require('graphqless');
const app = new GraphQLess();

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

GraphQL requires us to write a schema that describes the `.get` and `.post` functions' inputs and outputs.
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

That's the only catch! You now have a fully functioning and extendable GraphQL server.

You can find more examples in the [examples](/examples) folder.

## Queries for examples/example

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

## Queries for examples/exampleWithAuth

```bash
npx nodemon examples/exampleWithAuth.js
```

```graphql
# Add this to "HTTP HEADERS" in GraphQL Playground:
# { "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.YWJj.4noRC-c0ay0hOeZ5Cgc80MVS0P4p4FrR2lJFzMNSnE4" }

query getMe {
  getToken
  me {
    id
    name
  }
}
```

## Queries for examples/exampleWithRouter

```bash
npx nodemon examples/exampleWithRouter/index.js
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

## Queries for examples/exampleWithReactClient

```bash
npx nodemon examples/exampleWithReactClient/index.js
```

```graphql
mutation createUser {
  createUser(name: "Buchea") {
    name
  }
}

query getUsers {
  users {
    name
  }
}
```
