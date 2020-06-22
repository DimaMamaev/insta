import ApolloClient from "apollo-client";
import { WebSocketLink } from "apollo-link-ws";
import { InMemoryCache } from "apollo-cache-inmemory";
import { DBuri, DBuriSecret } from "../keys";

const headers = { "x-hasura-admin-secret": DBuriSecret };

export const client = new ApolloClient({
  link: new WebSocketLink({
    uri: DBuri,
    options: {
      reconnect: true,
      connectionParams: {
        headers,
      },
    },
  }),
  cache: new InMemoryCache(),
});
