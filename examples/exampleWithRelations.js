const { GraphQLess } = require('../index.js');
const app = new GraphQLess();

const db = {
  users: [{ id: 1, name: 'Tyler', favoriteIds: [2] }],
  favorites: [{ id: 2, name: 'Pizza', userId: 1 }],
};

class User {
  constructor({ name, favoriteIds }) {
    this.name = name;
    this.favoriteIds = favoriteIds;
  }

  favorites() {
    return db.favorites
      .filter(favorite => this.favoriteIds.includes(favorite.id))
      .map(favorite => new Favorite(favorite));
  }
}

class Favorite {
  constructor({ name, userId }) {
    this.name = name;
    this.userId = userId;
  }

  user() {
    return new User(db.users.find(user => user.id === this.userId));
  }
}

app.get('/users', (req, res) => {
  const { users } = db;
  res.send(users.map(user => new User(user)));
});

app.get('/favorites', (req, res) => {
  const { favorites } = db;
  res.send(favorites.map(favorite => new Favorite(favorite)));
});

app.useSchema(`
  type Query {
    users: [User]
    favorites: [Favorite]
  }
  type User {
    id: ID!
    name: String
    favorites: [Favorite]
  }
  type Favorite {
    id: ID!
    name: String
    user: User
  }
`);

app.listen(3000, () => {
  console.log('Visit: http://localhost:3000/graphql');
});
