import axios from 'axios';
import { Platform } from 'react-native';

import Constants from 'expo-constants';

let BASE_URL = 'http://localhost:8080/api';

if (__DEV__) {
  // Dynamically get the IP address of your laptop from Expo's config
  const debuggerHost = Constants.expoConfig?.hostUri;
  if (debuggerHost) {
    const localIp = debuggerHost.split(':')[0]; // Extracts the IP, e.g., '192.168.x.x'
    BASE_URL = `http://${localIp}:8080/api`;
  } else if (Platform.OS === 'android') {
    // Fallback for Android Emulators
    BASE_URL = 'http://10.0.2.2:8080/api';
  }
} else {
  // Production backend URL (update this when deploying your app)
  BASE_URL = 'https://your-production-api.com/api';
}

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
