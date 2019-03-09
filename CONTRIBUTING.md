# Contributing

Welcome to the contributing doc! Thanks for showing interest, we're stoked to have you help us make this project even better! Anything you can think of no matter how small just open an issue or PR and we can explore your idea together.

To get started clone this repo then run `./ops setup`. If you're not running MacOS you'll need a bash shell installed on your OS then you can alternatively run `./ops setup-bash`.

Checkout the `examples` folder to get started:

```bash
npx nodemon examples/example.js
npx nodemon examples/exampleWithAuth.js
npx nodemon examples/exampleWithRouter/index.js
npx nodemon examples/exampleWithReactClient/index.js
npx nodemon examples/exampleWithSubscription.js
```

The `__tests__` folder provides good documentation of the inner workings of GraphQLess:

```bash
./ops test
```

## Setup

```bash
./ops setup # MacOS
./ops setup-bash # other systems with BASH installed
```

## Test

```bash
./ops test
```

## Todo

- Write tests with nock and or graphql-request
- Create Github action for building/releasing npm package and use Github package for local development of actions
- Maybe add variable route resolution ie: `/users/:id` req.query.id or something??? Use pick to pull the route defined variables from the GraphQL input vars and place them in req.query then leave the rest in req.body
- Throw error for any route with more than one name `/users` okay. `/users/:id` okay. `/users/:id/:name` okay. `/users/favorites` -> throw Error("Because routes map directly to resolvers they can only have a depth of 1")
- Add something like this to the main README??? "The great thing about this library is that as you learn more about GraphQL and you want to use the official implementation it is very easy to remove the GraphQLess abstraction and use the raw `express-graphql` library. You could convert a sizeable project in a single morning."
