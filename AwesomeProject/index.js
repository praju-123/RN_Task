import {AppRegistry} from 'react-native';
import MyRootComponent from './MyRootComponent';
import {name as appName} from './app.json';
import {ApolloClient, InMemoryCache, ApolloProvider, gql} from '@apollo/client';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import FilmInfoScreen from './src/filmInfoScreen';

// Initialize Apollo Client
const client = new ApolloClient({
  uri: 'https://swapi-graphql.netlify.app/.netlify/functions/index',
  cache: new InMemoryCache(),
});

// // const client = ...

// client
//   .query({
//     query: gql`
//       query AllFilms {
//         allFilms {
//           films {
//             title
//             episodeID
//             director
//             producers
//             releaseDate
//           }
//         }
//       }
//     `,
//   })
//   .then(result => console.log(result.data.allFilms.films[0]));

const Stack = createStackNavigator();

const App = () => (
  <ApolloProvider client={client}>
    <FilmInfoScreen />
  </ApolloProvider>
);

AppRegistry.registerComponent(appName, () => App);
