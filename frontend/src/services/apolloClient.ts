// src/services/apolloClient.ts

import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  HttpLink,
  Observable,
} from '@apollo/client';
import { store } from '../store';
import { setAuth, logout } from '../store/auth/authSlice';
import axios from "axios";

// Визначаємо типи з ApolloLink, як було рекомендовано
type GqlOperation = ApolloLink.Operation;
type GqlResult = ApolloLink.Result;

const httpLink = new HttpLink({
  uri: 'https://localhost:3000/graphql',
});

// Додає токен до всіх запитів
const authLink = new ApolloLink((operation: GqlOperation, forward) => {
  const token = store.getState().auth.token;

  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : '',
    },
  });

  return forward(operation);
});

type QueuedRequest = {
  operation: GqlOperation;
  forward: (op: GqlOperation) => Observable<GqlResult>;
  observer: any;
};

let isRefreshing = false;
let failedRequestsQueue: QueuedRequest[] = [];

// Кастомний лінк для обробки помилок 401
const refreshAuthLink = new ApolloLink((operation: GqlOperation, forward) => {
  return new Observable(observer => {
    const subscription = forward(operation).subscribe({
      next: (result: GqlResult) => {
        if (result.errors) {
          const isAuthError = result.errors.some(
            (err: any) => err.extensions?.code === 'UNAUTHENTICATED' || err.message === 'Unauthorized'
          );
          if (isAuthError) {
            handleAuthError(operation, forward, observer);
            return;
          }
        }
        observer.next(result);
      },
      error: (networkError: any) => {
        if (networkError && networkError.statusCode === 401) {
          handleAuthError(operation, forward, observer);
        } else {
          observer.error(networkError);
        }
      },
    });

    return () => subscription.unsubscribe();
  });
});

function handleAuthError(
  operation: GqlOperation,
  forward: (op: GqlOperation) => Observable<GqlResult>,
  observer: any
) {
  if (!isRefreshing) {
    isRefreshing = true;
    console.log('Access token expired or invalid. Refreshing...');

    axios.post('https://localhost:3000/auth/refresh', null, { withCredentials: true })
      .then(axiosResponse => {
        const { tokens, user } = axiosResponse.data;
        store.dispatch(setAuth({ user, token: tokens.accessToken }));

        failedRequestsQueue.forEach(({ operation, forward, observer }) => {
          operation.setContext({
            headers: {
              authorization: `Bearer ${tokens.accessToken}`,
            },
          });
          forward(operation).subscribe(observer);
        });
        failedRequestsQueue = [];

        operation.setContext({
          headers: {
            authorization: `Bearer ${store.getState().auth.token}`,
          },
        });
        forward(operation).subscribe(observer);
      })
      .catch(refreshError => {
        console.error('Failed to refresh token, logging out.', refreshError);
        store.dispatch(logout());
        window.location.href = '/login';
        failedRequestsQueue.forEach(({ observer }) => observer.error(refreshError));
        failedRequestsQueue = [];
        observer.error(refreshError);
      })
      .finally(() => {
        isRefreshing = false;
      });
  } else {
    failedRequestsQueue.push({ operation, forward, observer });
  }
}

const client = new ApolloClient({
  link: ApolloLink.from([authLink, refreshAuthLink, httpLink]),
  cache: new InMemoryCache(),
});

export default client;
