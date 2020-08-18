import "cross-fetch"
import * as fetch from 'cross-fetch'

import {
  ApolloClient,
  InMemoryCache,
  split,
  HttpLink,
  from,
  Observable,
  ApolloLink,
} from "@apollo/client";
import * as ws from 'ws';
import { getMainDefinition } from "@apollo/client/utilities";
import { onError } from "@apollo/client/link/error";
import { WebSocketLink } from "@apollo/client/link/ws";
const getClient = (
  jwt?: string,
  httpURL = "http://localhost:4000",
  websocketURL = "ws://localhost:4000"
) => {
  // Setup the authorization header for the http client
  const request = async (operation: any) => {
    if (jwt) {
      operation.setContext({
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
    }
  };

  // Setup the request handlers for the http clients
  const requestLink = new ApolloLink((operation, forward) => {
    return new Observable((observer: any) => {
      let handle: any;
      Promise.resolve(operation)
        .then((oper) => {
          request(oper);
        })
        .then(() => {
          handle = forward(operation).subscribe({
            next: observer.next.bind(observer),
            error: observer.error.bind(observer),
            complete: observer.complete.bind(observer),
          });
        })
        .catch(observer.error.bind(observer));

      return () => {
        if (handle) {
          handle.unsubscribe();
        }
      };
    });
  });

  // Web socket link for subscriptions
  const wsLink = from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        graphQLErrors.map(({ message, locations, path }) =>
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
          )
        );
      }

      if (networkError) {
        console.log(`[Network error]: ${networkError}`);
      }
    }),
    requestLink,
    new WebSocketLink({
      uri: websocketURL,
      options: {
        reconnect: true,
        connectionParams: () => {
          if (jwt) {
            return {
              Authorization: `Bearer ${jwt}`,
            };
          }
        },
      },
      webSocketImpl: ws
    }),
  ]);

  // HTTP link for queries and mutations
  const httpLink = from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        graphQLErrors.map(({ message, locations, path }) =>
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
          )
        );
      }
      if (networkError) {
        console.log(`[Network error]: ${networkError}`);
      }
    }),
    requestLink,
    new HttpLink({
      uri: httpURL,
      fetch: fetch.fetch,
      credentials: "same-origin",
    }),
  ]);

  interface Definintion {
    kind: string;
    operation?: string;
  };
  // Link to direct ws and http traffic to the correct place
  const link = split(
    // Pick which links get the data based on the operation kind
    ({ query }) => {
      const { kind, operation }: Definintion = getMainDefinition(query);
      return kind === "OperationDefinition" && operation === "subscription";
    },
    wsLink,
    httpLink
  );

  return new ApolloClient({
    link,
    cache: new InMemoryCache(),
  });
};

export default getClient;
