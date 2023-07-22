// FilmInfoScreen.js

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Animated,
  StyleSheet,
} from 'react-native';
import {useQuery} from '@apollo/client';
import {ALL_FILMS_QUERY} from '../graphql';

const {width} = Dimensions.get('window');
const ITEM_WIDTH = width * 0.7;
const SPACING = 10;

const FilmInfoScreen = () => {
  // const {loading, error, data} = useQuery(GET_ALL_FILMS);

  const allFilmsFirst2 = 2; // Number of items per page
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const [scale, setScale] = useState(new Animated.Value(1));
  const [lastScale, setLastScale] = useState(1);
  const onScroll = Animated.event(
    [{nativeEvent: {contentOffset: {x: scrollX}}}],
    {useNativeDriver: false}, // Set useNativeDriver to false for FlatList
  );

  //to Fetch data
  const {loading, error, data, fetchMore} = useQuery(ALL_FILMS_QUERY, {
    variables: {
      first: allFilmsFirst2,
      after: null,
      before: null, // Initialize with null for the initial page
      last: null,
    },
  });

  //list of images
  const filmPosterImage = [
    {
      id: 0,
      name: 'https://images.unsplash.com/flagged/photo-1589829482673-03413c918c48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8c3RhciUyMHdhcnN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60',
    },
    {
      id: 1,
      name: 'https://images.unsplash.com/photo-1578374173705-969cbe6f2d6b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHN0YXIlMjB3YXJzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60',
    },
    {
      id: 2,
      name: 'https://images.unsplash.com/photo-1623107274042-16962aa28ea8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHN0YXIlMjB3YXJzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60',
    },
    {
      id: 3,
      name: 'https://images.unsplash.com/photo-1478479405421-ce83c92fb3ba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHN0YXIlMjB3YXJzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60',
    },
    {
      id: 4,
      name: 'https://images.unsplash.com/photo-1586136194012-35ceaddbd773?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c3RhciUyMHdhcnN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60',
    },
    {
      id: 5,
      name: 'https://images.unsplash.com/photo-1537420327992-d6e192287183?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHN0YXIlMjB3YXJzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60',
    },
  ];

  const mapEpisodeIDToIndex = episodeID => {
    return episodeID % filmPosterImage.length;
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  //componnetnt render in flatlist
  const renderItem = ({item, index}) => {
    console.log('ITEM', index);

    const mappedIndex = mapEpisodeIDToIndex(item.episodeID);

    const filmPosterUrl = filmPosterImage[mappedIndex].name;

    const posterImageStyle = [
      styles.posterImage,
      {
        transform: [
          {
            scale: Animated.multiply(scale, new Animated.Value(lastScale)),
          },
        ],
      },
    ];

    const inputRange = [
      (index - 1) * ITEM_WIDTH,
      index * ITEM_WIDTH,
      (index + 1) * ITEM_WIDTH,
    ];

    const translateY = scrollX.interpolate({
      inputRange,
      outputRange: [100, 0, 100],
    });

    return (
      <TouchableOpacity
        style={{width: ITEM_WIDTH, padding: SPACING}}
        activeOpacity={0.8}>
        <Animated.View
          style={
            (styles.imageContainer,
            {
              backgroundColor: '#f9c2ff',
              borderRadius: 12,
              padding: SPACING,
              alignItems: 'center',
              transform: [{translateY}],
            })
          }>
          <Animated.Image
            source={{uri: filmPosterUrl}}
            style={posterImageStyle}
          />
          <Text style={{fontSize: 16, fontWeight: 'bold', marginTop: 10}}>
            {item.title}
          </Text>
          <Text style={{fontSize: 12}}>{item.releaseDate}</Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  //time of horizontal scrollview
  const handleLoadMore = () => {
    if (data?.allFilms?.pageInfo?.hasNextPage) {
      fetchMore({
        variables: {
          after: data.allFilms.pageInfo.endCursor,
          first: allFilmsFirst2,
        },
        updateQuery: (prevResult, {fetchMoreResult}) => {
          if (!fetchMoreResult) {
            return prevResult;
          }
          return {
            allFilms: {
              ...fetchMoreResult.allFilms,
              edges: [
                ...prevResult.allFilms.edges,
                ...fetchMoreResult.allFilms.edges,
              ],
            },
          };
        },
      });
    }
  };

  return (
    <View style={{flex: 1, padding: SPACING * 2}}>
      <FlatList
        data={data.allFilms.films}
        // keyExtractor={item => item.episodeID.toString()}
        horizontal
        contentContainerStyle={{paddingLeft: SPACING}}
        snapToInterval={ITEM_WIDTH + SPACING * 2}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll} // Use the onScroll handler here
        renderItem={renderItem}
        onEndReached={handleLoadMore}
      />
    </View>
  );
};

export default FilmInfoScreen;

const styles = StyleSheet.create({
  // ... (other styles)
  imageContainer: {
    width: ITEM_WIDTH - SPACING * 2,
    height: (ITEM_WIDTH - SPACING * 2) * 1.5,
    overflow: 'hidden',
    borderRadius: 12,
  },
  posterImage: {
    width: ITEM_WIDTH - SPACING * 2,
    height: (ITEM_WIDTH - SPACING * 2) * 1.5,
  },
});
