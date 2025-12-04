// src/screens/AppDetailScreen.js
import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
  Platform,
} from 'react-native';

export default function AppDetailScreen({ route }) {
  const { app } = route.params || {};
  if (!app) {
    return (
      <View style={styles.center}>
        <Text>No app data provided.</Text>
      </View>
    );
  }

  const openPlayStore = () => {
    const packageName = app.packageName;
    // Prefer market: intent; fall back to http link
    const marketUrl = `market://details?id=${packageName}`;
    const httpUrl = `https://play.google.com/store/apps/details?id=${packageName}`;

    Linking.openURL(marketUrl).catch(() => {
      Linking.openURL(httpUrl).catch(err => {
        Alert.alert(
          'Unable to open Play Store',
          err?.message || 'unknown error',
        );
      });
    });
  };

  const openAppSettings = () => {
    // Opens the App Info/settings page for this app
    // For Android use the special settings URL
    if (Platform.OS === 'android') {
      const url = `package:${app.packageName}`;
      // Linking to app-specific settings can be done with ACTION_APPLICATION_DETAILS_SETTINGS
      // Use the formatted URI:
      const settingsUrl = `app-settings:`; // fallback
      // Use Linking with ACTION_APPLICATION_DETAILS_SETTINGS scheme via `Intent` style is not supported directly,
      // but Android maps `package:` URIs with ACTION_PACKAGE_DETAILS; React Native provides a helper:
      Linking.openSettings().catch(() => {
        // If openSettings doesn't work, show alert
        Alert.alert(
          'Cannot open settings',
          'Please open the app settings manually.',
        );
      });

      // NOTE: Linking.openSettings() opens this app's settings; to open another app's settings you'd need a native Intent helper.
      // We fallback to advising the user to open Play Store.
    } else {
      Alert.alert(
        'Not available',
        'Opening app settings for other apps is not supported on this platform.',
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Image
          source={
            app.iconUri
              ? { uri: app.iconUri }
              : require('../../Assets/image.png')
          }
          style={styles.icon}
        />
        <View style={{ flex: 1, paddingLeft: 12 }}>
          <Text style={styles.title}>{app.label}</Text>
          <Text style={styles.subtitle}>{app.packageName}</Text>
          {app.versionName ? (
            <Text style={styles.subtitle}>Version: {app.versionName}</Text>
          ) : null}
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.button} onPress={openPlayStore}>
          <Text style={styles.buttonText}>Open in Play Store</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={openAppSettings}>
          <Text style={styles.buttonText}>Open App Settings</Text>
        </TouchableOpacity>
      </View>

      <View style={{ marginTop: 20 }}>
        <Text style={{ fontWeight: '600' }}>Raw package data</Text>
        <Text style={styles.raw}>{JSON.stringify(app, null, 2)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  icon: { width: 80, height: 80, borderRadius: 12 },
  title: { fontSize: 18, fontWeight: '700' },
  subtitle: { fontSize: 13, color: '#555', marginTop: 4 },
  actions: { marginTop: 18, flexDirection: 'row', gap: 12 },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#eee',
    marginRight: 12,
  },
  buttonText: { fontSize: 14, fontWeight: '600' },
  raw: {
    marginTop: 8,
    fontFamily: Platform.OS === 'android' ? 'monospace' : undefined,
    color: '#333',
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
