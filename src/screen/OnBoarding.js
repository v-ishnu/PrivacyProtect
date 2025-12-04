import { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';

const OnBoarding = ({ navigation }) => {
  return (
    <View style={{ flex: 1, backgroundColor: 'red' }}>
      <Text>OnBoarding Screen</Text>
      <TouchableOpacity onPress={() => navigation.replace('AppList')}>
        <Text>Go to AppList</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OnBoarding; 
