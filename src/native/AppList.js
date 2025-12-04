// src/native/AppList.js
import { NativeModules } from 'react-native';
const { AppList } = NativeModules || {};

export default {
  // returns Promise resolving to array of apps
  getInstalledApps: (includeSystem = false) => {
    if (!AppList || !AppList.getInstalledApps) {
      return Promise.reject(
        new Error('Native module AppList is not linked or not available'),
      );
    }
    return AppList.getInstalledApps(includeSystem);
  },

  getAppIcon: packageName => {
    if (!AppList || !AppList.getAppIcon) {
      return Promise.reject(
        new Error('Native module AppList.getAppIcon not available'),
      );
    }
    return AppList.getAppIcon(packageName);
  },

  clearIconCache: () => {
    if (!AppList || !AppList.clearIconCache) {
      return Promise.reject(
        new Error('Native module AppList.clearIconCache not available'),
      );
    }
    return AppList.clearIconCache();
  },
};
