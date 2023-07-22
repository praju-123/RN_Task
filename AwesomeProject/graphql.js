// graphql.js

import {gql} from '@apollo/client';

export const ALL_FILMS_QUERY = gql`
  query AllFilms($first: Int, $after: String, $before: String, $last: Int) {
    allFilms(first: $first, after: $after, before: $before, last: $last) {
      edges {
        cursor
      }
      pageInfo {
        startCursor
        hasPreviousPage
        hasNextPage
        endCursor
      }
      totalCount
      films {
        episodeID
        releaseDate
        title
      }
    }
  }
`;
