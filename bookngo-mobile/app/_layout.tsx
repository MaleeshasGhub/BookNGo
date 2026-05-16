import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments, useRootNavigationState } from 'expo-router';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider, useAuth } from '../context/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    if (loading || !navigationState?.key) return;

    const currentSegment = segments[0] as string;
    const inAuthGroup = currentSegment === '(admin)' || currentSegment === '(dashboard)' || currentSegment === '(driver)' || currentSegment === 'payment' || currentSegment === 'review';

    if (!user && inAuthGroup) {
      // Kick unauthenticated users out of protected screens
      router.replace('/');
    } else if (user && !inAuthGroup && currentSegment !== 'payment' && currentSegment !== 'review') {
      // Skip login screen if already authenticated, but allow payment/review screens
      if (user.userType === 'ADMIN') {
        router.replace('/(admin)');
      } else if (user.userType === 'DRIVER') {
        router.replace('/(driver)');
      } else {
        router.replace('/(dashboard)');
      }
    }
  }, [user, loading, segments]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="register" />
        <Stack.Screen name="driver-register" />
        <Stack.Screen name="payment" />
        <Stack.Screen name="(dashboard)" />
        <Stack.Screen name="(driver)" />
        <Stack.Screen name="(admin)" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
