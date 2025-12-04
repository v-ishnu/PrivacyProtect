// deviceInfoUtil.js
import { version } from 'react';
import DeviceInfo from 'react-native-device-info';

export function getDeviceInfo() {
  return {
    model: DeviceInfo.getModel(),
    brand: DeviceInfo.getBrand(),
    version: DeviceInfo.getSystemName() + '' + DeviceInfo.getSystemVersion(),
    version2: DeviceInfo.getSystemName(),
    systemVersion: DeviceInfo.getSystemVersion(),
  };
}
