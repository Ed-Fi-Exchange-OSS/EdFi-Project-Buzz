import { ApolloClient } from 'apollo-client';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';

const client = new ApolloClient<NormalizedCacheObject>({
  link: new HttpLink({
    uri: 'http://localhost:53923/GraphQL',
  }),
  cache: new InMemoryCache(),
});

export default client;
