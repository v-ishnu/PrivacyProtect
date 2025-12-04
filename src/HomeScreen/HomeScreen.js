import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

const HomeScreen = ({ route }) => {
  return (
    <View style={{ flex: 1, backgroundColor: 'red' }}>
      <Text>Home Screen</Text>
      <TouchableOpacity onPress={() => navigation.replace('AppList')}>
        <Text>Go to AppList</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;
