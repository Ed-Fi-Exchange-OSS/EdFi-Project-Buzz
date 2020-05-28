import ApolloClient from 'apollo-boost';

const client = new ApolloClient({
  uri: 'http://localhost:52972/GraphQL',
});

export default client;
