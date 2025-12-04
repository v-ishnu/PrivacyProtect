// NavBar.debug.js
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';

const { width: ScreenW } = Dimensions.get('window');

const NavBarDebug = ({ navigation, state }) => {
  const names = state?.routes?.map(r => r.name) ?? [
    'Home',
    'Alerts',
    'Profile',
    'Dev',
  ];

  return (
    <View style={[styles.navLayout, { width: ScreenW * 0.89 }]}>
      {names.map((name, i) => (
        <TouchableOpacity
          key={name}
          style={styles.iconButton}
          onPress={() => navigation.navigate(name)}
        >
          <Text style={{ color: state.index === i ? '#42C83C' : 'gray' }}>
            {name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default NavBarDebug;

const styles = StyleSheet.create({
  navLayout: {
    backgroundColor: '#343434',
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 30,
    elevation: 5,
    position: 'absolute',
    bottom: 20,
  },
  iconButton: {
    padding: 10,
    alignItems: 'center',
  },
});
