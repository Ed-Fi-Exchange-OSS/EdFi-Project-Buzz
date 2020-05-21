import ApolloClient from "apollo-boost";

const client = new ApolloClient({
  uri: 'https://localhost:5001',
});

export {
  client
}