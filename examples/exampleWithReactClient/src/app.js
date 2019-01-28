import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider, Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';

const client = new ApolloClient({ uri: 'http://localhost:3000/graphql' });
const CREATE_USER = gql(`
mutation createUser($name: String) {
  createUser(name: $name) {
    name
  }
}
`);
const GET_USERS = gql(`
query getUsers {
  users {
    name
  }
}
`);

class UserList extends React.Component {
  state = { name: '' };

  render() {
    return (
      <ApolloProvider client={client}>
        <Query query={GET_USERS}>
          {({ loading, error, data }) => {
            if (loading) return <h2>Loading...</h2>;
            if (error) return <h2>Error</h2>;
            return (
              <div>
                <h2>User List</h2>
                <input
                  onChange={ev => this.setState({ name: ev.target.value })}
                  placeholder="New username..."
                  value={this.state.name}
                />
                <Mutation
                  mutation={CREATE_USER}
                  update={(cache, { data: { createUser } }) => {
                    const { users } = cache.readQuery({ query: GET_USERS });
                    cache.writeQuery({
                      query: GET_USERS,
                      data: { users: users.concat([createUser]) },
                    });
                  }}
                >
                  {createUser => (
                    <button
                      onClick={() =>
                        createUser({ variables: { name: this.state.name } })
                      }
                    >
                      Create
                    </button>
                  )}
                </Mutation>
                <ul>
                  {data.users.map((user, index) => (
                    <li key={index}>{user.name}</li>
                  ))}
                </ul>
              </div>
            );
          }}
        </Query>
      </ApolloProvider>
    );
  }
}

ReactDOM.render(
  <ApolloProvider client={client}>
    <UserList />
  </ApolloProvider>,
  document.getElementById('root')
);
