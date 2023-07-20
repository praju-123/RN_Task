// FilmInfoScreen.js

import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
} from 'react-native';
import {useQuery} from '@apollo/client';
import {GET_ALL_FILMS} from '../graphql';

const {width} = Dimensions.get('window');
const ITEM_WIDTH = width * 0.7;
const SPACING = 10;

const FilmInfoScreen = () => {
  const {loading, error, data} = useQuery(GET_ALL_FILMS);

  const scrollX = React.useRef(new Animated.Value(0)).current;

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  const renderItem = ({item, index}) => {
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
          style={{
            backgroundColor: '#f9c2ff',
            borderRadius: 12,
            padding: SPACING,
            alignItems: 'center',
            transform: [{translateY}],
          }}>
          <Image
            source={{uri: 'https://via.placeholder.com/150'}}
            style={{width: ITEM_WIDTH - SPACING * 2, height: ITEM_WIDTH * 1.5}}
          />
          <Text style={{fontSize: 16, fontWeight: 'bold', marginTop: 10}}>
            {item.title}
          </Text>
          <Text style={{fontSize: 12}}>{item.releaseDate}</Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const onScroll = Animated.event(
    [{nativeEvent: {contentOffset: {x: scrollX}}}],
    {useNativeDriver: false}, // Set useNativeDriver to false for FlatList
  );

  return (
    <View style={{flex: 1, padding: SPACING * 2}}>
      <FlatList
        data={data.allFilms.films}
        keyExtractor={item => item.episodeID.toString()}
        horizontal
        contentContainerStyle={{paddingLeft: SPACING}}
        snapToInterval={ITEM_WIDTH + SPACING * 2}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll} // Use the onScroll handler here
        renderItem={renderItem}
      />
    </View>
  );
};

export default FilmInfoScreen;
