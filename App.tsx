import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

import {Colors} from './colors';
import AnimatedContactsScreen from './screens/animatedContactsScreen';

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={'default'} />
        <Tab.Navigator
          screenOptions={({route}) => ({
            headerShown: false,
            tabBarActiveTintColor: Colors.TOMATO,
            tabBarInactiveTintColor: Colors.GREY,
            tabBarIcon: ({color, size}) => {
              let iconName;

              if (route.name === 'Contacts') {
                iconName = 'contacts';
              } else if (route.name === 'Settings') {
                iconName = 'contacts';
              }
              return <Icon name={iconName} size={size} color={color} />;
            },
          })}>
          <Tab.Screen component={AnimatedContactsScreen} name={'Contacts'} />
        </Tab.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
});

export default App;
