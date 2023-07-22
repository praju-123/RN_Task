import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import {ApolloClient, InMemoryCache, ApolloProvider, gql} from '@apollo/client';
import FilmInfoScreen from './src/filmInfoScreen';

// Initialize Apollo Client
const client = new ApolloClient({
  uri: 'https://swapi-graphql.netlify.app/.netlify/functions/index',
  cache: new InMemoryCache(),
});

const App = () => (
  <ApolloProvider client={client}>
    <FilmInfoScreen />
  </ApolloProvider>
);

AppRegistry.registerComponent(appName, () => App);
