// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import AppListScreen from './src/screen/AppListScreen';
import AppDetailScreen from './src/screen/AppDetailScreen';
import SplashScreen from './src/screen/SplashScreen';
import OnBoarding from './src/screen/OnBoarding';
import NavBar from './src/component/NavBar';
import HomeScreen from './src/HomeScreen/HomeScreen';
import AlertScreen from './src/AlertScreen/AlertScreen';
import ProfileScreen from './src/ProfileScreen/ProfileScreen';
import DevScreen from './src/DevScreen/DevScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function PrivacyProtect() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={props => <NavBar {...props} />}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Alerts" component={AlertScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Dev" component={DevScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="SplashScreen"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="OnBoardingScreen" component={OnBoarding} />
        <Stack.Screen name="PrivacyProtect" component={PrivacyProtect} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="AlertScreen" component={AlertScreen} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="DevScreen" component={DevScreen} />
        <Stack.Screen name="AppList" component={AppListScreen} />
        <Stack.Screen name="AppDetail" component={AppDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
