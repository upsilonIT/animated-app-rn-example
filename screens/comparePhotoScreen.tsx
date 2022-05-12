import 'react-native-gesture-handler';

import * as React from 'react';
import {
  Dimensions,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {PanGestureHandler} from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const {width} = Dimensions.get('window');
const image =
  'https://images.pexels.com/photos/302896/pexels-photo-302896.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500';
const secondImage =
  'https://images.pexels.com/photos/302888/pexels-photo-302888.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260';
const bg =
  'https://images.pexels.com/photos/585750/pexels-photo-585750.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260';

const IMAGE_HEIGHT = 300;
const HANDLER_SIZE = 6;

const ComparePhotoScreen = () => {
  const posX = useSharedValue(0);
  const gestureHandler = useAnimatedGestureHandler({
    onStart: (event, ctx) => {
      ctx.startX = posX.value;
    },
    onActive: (event, ctx) => {
      posX.value = ctx.startX + event.translationX;
    },
  });

  const leftImage = useAnimatedStyle(() => {
    return {
      flex: interpolate(posX.value, [-width / 2, 0, width / 2], [0, 1, 2]),
    };
  });
  const rightImage = useAnimatedStyle(() => {
    return {
      flex: interpolate(posX.value, [-width / 2, 0, width / 2], [2, 1, 0]),
    };
  });

  return (
    <ImageBackground
      source={{uri: bg}}
      style={styles.container}
      blurRadius={80}>
      <StatusBar hidden />
      <View style={styles.main}>
        <Text style={styles.header}>Compare Photos</Text>
        <View style={styles.imgView}>
          <Animated.Image
            source={{uri: image}}
            style={[styles.imageStyle, {height: IMAGE_HEIGHT}, leftImage]}
          />
          <PanGestureHandler onGestureEvent={gestureHandler}>
            <Animated.View
              collapsable={false}
              style={[
                styles.animatedContainer,
                {
                  width: HANDLER_SIZE,
                },
              ]}>
              <View style={styles.arrowContainer}>
                <MaterialIcons name={'arrow-left'} size={30} color="black" />
                <MaterialIcons name={'arrow-right'} size={30} color="black" />
              </View>
            </Animated.View>
          </PanGestureHandler>
          <Animated.Image
            source={{uri: secondImage}}
            style={[{height: IMAGE_HEIGHT}, styles.imageStyle, rightImage]}
          />
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 20,
  },
  main: {alignItems: 'center'},
  header: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 20,
    color: '#fff',
    opacity: 0.7,
  },
  imgView: {
    flexDirection: 'row',
    borderRadius: 16,
    overflow: 'hidden',
  },
  arrowContainer: {
    width: 60,
    height: 60,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderRadius: 30,
  },
  animatedContainer: {
    backgroundColor: 'transparent',
    zIndex: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageStyle: {
    resizeMode: 'cover',
    flex: 1,
  },
});

export default ComparePhotoScreen;
