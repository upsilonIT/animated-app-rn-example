import faker, {GenderType} from '@faker-js/faker';
import * as React from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import {Colors} from '../colors';
import getRandomColor from '../utils/generateRandomColor';

const {width, height} = Dimensions.get('screen');

const COLUMNS = 2;
const ITEM_SIZE = width / 2;
const SPACING = 10;
const HEADER_SPACING = height * 0.3;
const HEADER_FONTSIZE = 74;

const AnimatedContactsScreen: React.FunctionComponent = () => {
  const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

  faker.seed(4);

  type PersonItem = {
    key: string;
    hasAvatar: boolean;
    avatar: string;
    firstName: string;
    lastName: string;
    initials: string;
    backgroundColor: string;
    text: string;
  };

  const data: PersonItem[] = [...Array(50).keys()].map(() => {
    const backgroundColor = getRandomColor();
    const text = Colors.WHITE;
    const hasAvatar = faker.datatype.boolean();
    const gender = faker.name.gender();
    const firstName = faker.name.firstName(gender as GenderType);
    const lastName = faker.name.lastName(gender as GenderType);
    return {
      key: faker.datatype.uuid(),
      hasAvatar,
      avatar: hasAvatar
        ? `https://i.pravatar.cc/200?u=${faker.datatype.uuid()}`
        : '',
      firstName,
      lastName,
      initials: `${firstName.substring(0, 1)}${lastName.substring(0, 1)}`,
      backgroundColor,
      text,
    };
  });

  const scrollY = useSharedValue(0);
  const headerHeight = useSharedValue(height);

  const onScroll = useAnimatedScrollHandler(event => {
    scrollY.value = event.contentOffset.y;
  });

  const textStyles = useAnimatedStyle(() => {
    return {
      fontSize: interpolate(
        scrollY.value,
        [0, HEADER_SPACING, headerHeight.value],

        [HEADER_FONTSIZE, 24, 24],
        Extrapolate.CLAMP,
      ),
    };
  });

  const headerContainerStyle = useAnimatedStyle(() => {
    return {
      marginBottom: interpolate(
        scrollY.value,
        [
          -1,
          0,
          HEADER_SPACING + HEADER_FONTSIZE,
          headerHeight.value + HEADER_FONTSIZE,
        ],
        [HEADER_SPACING + 1, HEADER_SPACING, 0, 0],
      ),
    };
  });

  const listHeaderStyle = useAnimatedStyle(() => {
    return {
      height: headerHeight.value,
    };
  });

  const renderItem = ({item}: {item: PersonItem}) => {
    return (
      <View
        style={{
          width: ITEM_SIZE,
          height: ITEM_SIZE,
          backgroundColor: item.backgroundColor,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {item.hasAvatar ? (
          <Image source={{uri: item.avatar}} style={styles.image} />
        ) : (
          <Text
            style={[
              styles.initials,
              {
                color: item.text,
              },
            ]}
            numberOfLines={1}
            adjustsFontSizeToFit>
            {item.initials}
          </Text>
        )}
        <LinearGradient
          colors={
            item.hasAvatar
              ? ['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,.8)']
              : ['transparent', 'transparent']
          }
          style={[
            StyleSheet.absoluteFillObject,
            {justifyContent: 'flex-end', padding: SPACING},
          ]}>
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            style={{
              color: item.hasAvatar ? Colors.WHITE : item.text,
              fontWeight: '600',
            }}>
            {item.firstName} {item.lastName}
          </Text>
        </LinearGradient>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View
        style={[styles.main, styles.statusBar, {padding: SPACING}]}
        onLayout={ev => {
          if (
            headerHeight.value === ev.nativeEvent.layout.height ||
            headerHeight.value !== height
          ) {
            return;
          }
          headerHeight.value = withTiming(ev.nativeEvent.layout.height, {
            duration: 0,
          });
        }}>
        <Animated.View>
          <Animated.Text
            style={[
              styles.text,
              textStyles,
              {paddingRight: width / 4 - SPACING * 2},
            ]}
            numberOfLines={1}
            adjustsFontSizeToFit>
            Friends
          </Animated.Text>
          <Text style={styles.subtitle}>{data.length} contacts</Text>
        </Animated.View>
        <Animated.View style={headerContainerStyle} />
      </View>
      <AnimatedFlatList
        data={data}
        numColumns={COLUMNS}
        keyExtractor={item => item.key}
        scrollEventThrottle={16}
        onScroll={onScroll}
        ListHeaderComponent={<Animated.View style={listHeaderStyle} />}
        stickyHeaderIndices={[0]}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  main: {
    zIndex: 1,
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: Colors.WHITE,
  },
  statusBar: {
    paddingTop: 20,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  text: {
    color: Colors.TOMATO,
    fontSize: 54,
    fontWeight: '700',
    letterSpacing: -1,
  },
  subtitle: {
    color: Colors.TOMATO,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  initials: {
    fontSize: 94,
    fontWeight: 'bold',
    opacity: 0.1,
  },
});

export default AnimatedContactsScreen;
