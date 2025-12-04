import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

export default function AlertScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: 'red' }}>
      <Text>Alert Screen</Text>
      <TouchableOpacity onPress={() => navigation.replace('AppList')}>
        <Text>Go to AppList</Text>
      </TouchableOpacity>
    </View>
  );
}
