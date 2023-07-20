// graphql.js

import {ApolloClient, InMemoryCache, createHttpLink, gql} from '@apollo/client';

const httpLink = createHttpLink({
  uri: 'https://swapi-graphql.netlify.app/.netlify/functions/index',
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

// graphql.js

export const GET_ALL_FILMS = gql`
  query AllFilms {
    allFilms {
      films {
        title
        episodeID
        director
        producers
        releaseDate
      }
    }
  }
`;

export default client;
