import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function DevScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: 'red' }}>
      <Text>Dev Screen</Text>
      <TouchableOpacity onPress={() => navigation.replace('AppList')}>
        <Text>Go to AppList</Text>
      </TouchableOpacity>
    </View>
  );
}
