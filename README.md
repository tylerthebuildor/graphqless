# GraphQLess

## Queries for example.js

```bash
npx nodemon example.js
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

## Queries for exampleWithAuth.js

```bash
npx nodemon exampleWithAuth.js
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
