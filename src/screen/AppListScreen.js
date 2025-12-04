// src/screens/AppListScreen.js
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import AppList from '../native/AppList';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDeviceInfo } from '../native/GetInfo';

const STORAGE_KEY = 'cached_app_list_v1';

export default function AppListScreen() {
  const [apps, setApps] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [includeSystem, setIncludeSystem] = useState(false);

  const device = getDeviceInfo();

  useEffect(() => {
    loadCachedThenRefresh();
  }, [includeSystem]);

  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (q === '') setFiltered(apps);
    else
      setFiltered(
        apps.filter(
          a =>
            (a.label || '').toLowerCase().includes(q) ||
            (a.packageName || '').toLowerCase().includes(q),
        ),
      );
  }, [query, apps]);

  const loadCachedThenRefresh = async () => {
    setLoading(true);
    try {
      const cached = await AsyncStorage.getItem(
        STORAGE_KEY + (includeSystem ? '_all' : '_user'),
      );
      if (cached) {
        const parsed = JSON.parse(cached);
        setApps(parsed);
      }
    } catch (e) {
      // ignore
    }

    // call native module
    AppList.getInstalledApps(includeSystem)
      .then(list => {
        // sort by label
        const sorted = list
          .slice()
          .sort((a, b) =>
            (a.label || '')
              .toLowerCase()
              .localeCompare((b.label || '').toLowerCase()),
          );
        setApps(sorted);
        setFiltered(sorted);
        // cache minimal fields
        AsyncStorage.setItem(
          STORAGE_KEY + (includeSystem ? '_all' : '_user'),
          JSON.stringify(sorted),
        ).catch(() => {});
      })
      .catch(err => {
        console.warn('getInstalledApps error', err);
      })
      .finally(() => setLoading(false));
  };

  const refresh = useCallback(() => {
    loadCachedThenRefresh();
  }, [includeSystem]);

  const renderItem = useCallback(({ item }) => {
    return (
      <TouchableOpacity style={styles.row}>
        <Image
          source={
            item.iconUri
              ? { uri: item.iconUri }
              : require('../../Assets/image.png')
          }
          style={styles.icon}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{item.label}</Text>
          <Text style={styles.subtitle}>
            {item.packageName}
            {item.versionName ? ` • ${item.versionName}` : ''}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }, []);

  const keyExtractor = useCallback(item => item.packageName, []);

  const sW = Dimensions.get('window').width;
  const sH = Dimensions.get('window').height;

  return (
    <View
      style={{ flex: 1, flexDirection: 'column', backgroundColor: '#0000FF' }}
    >
      <View style={{ paddingVertical: sH * 0.05, paddingHorizontal: 16 }}>
        <View
          style={{
            flexDirection: 'row',
            padding: 8,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Text
            style={{
              color: 'white',
              fontSize: sW * 0.07,
              fontWeight: '700',
              fontFamily: 'PlusJakartaSans-Regular',
            }}
          >
            {device.model}
          </Text>
          <Text
            style={{
              color: 'white',
              fontSize: sW * 0.05,
              fontWeight: '700',
              fontStyle: 'italic',
              fontFamily: 'PlusJakartaSans-Regular',
            }}
          >
            {device.version}
          </Text>
        </View>
      </View>
    </View>
    // <SafeAreaView style={{ flex: 1, backgroundColor: "#bbbbbb" }}>
    //   <View style={styles.header}>
    //     <TextInput
    //       placeholder="Search apps..."
    //       value={query}
    //       onChangeText={setQuery}
    //       style={styles.search}
    //       autoCapitalize="none"
    //     />
    //     <TouchableOpacity
    //       onPress={() => {
    //         setIncludeSystem(prev => !prev);
    //       }}
    //       style={styles.toggle}
    //     >
    //       <Text>
    //         {includeSystem ? 'Include system: ON' : 'Include system: OFF'}
    //       </Text>
    //     </TouchableOpacity>
    //     <TouchableOpacity onPress={refresh} style={styles.button}>
    //       <Text>Refresh</Text>
    //     </TouchableOpacity>
    //   </View>

    //   {loading && <ActivityIndicator style={{ marginTop: 20 }} />}

    //   {!loading && (
    //     <FlatList
    //       data={filtered}
    //       keyExtractor={keyExtractor}
    //       renderItem={renderItem}
    //       initialNumToRender={20}
    //       maxToRenderPerBatch={30}
    //       windowSize={21}
    //       removeClippedSubviews={true}
    //     />
    //   )}
    // </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  search: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  toggle: {
    marginBottom: 8,
  },
  button: {
    padding: 8,
    alignSelf: 'flex-start',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#f2f2f2',
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
  },
  title: {
    fontSize: 16,
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
  },
});
