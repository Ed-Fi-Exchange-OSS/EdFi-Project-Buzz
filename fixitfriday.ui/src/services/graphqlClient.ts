import ApolloClient from 'apollo-boost';

const client = new ApolloClient({
  uri: 'http://localhost:53923/GraphQL',
});

export default client;
