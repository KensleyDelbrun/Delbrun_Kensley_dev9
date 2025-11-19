import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AppearanceProvider } from '@/contexts/AppearanceContext';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { session, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    // Wait for the session to load before doing anything
    if (loading) {
      return;
    }

    const inTabsGroup = segments[0] === '(tabs)';

    // If the user is not signed in and the initial segment is not an auth route,
    // redirect them to the login page.
    if (!session && !inTabsGroup) {
      // Check if the current route is one of the protected ones outside of tabs
      const isProtectedRoute = segments[0] === 'edit-profile' || segments[0] === 'notification';
      if (isProtectedRoute) {
        router.replace('/login');
      }
    } 
    // If the user is signed in and they are on an auth route (login/register),
    // redirect them away to the main app.
    else if (session && (segments[0] === 'login' || segments[0] === 'register')) {
      router.replace('/(tabs)');
    }
  }, [session, loading, segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="edit-profile" />
      <Stack.Screen name="notification" />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <AuthProvider>
      <LanguageProvider>
        <AppearanceProvider>
          <RootLayoutNav />
        </AppearanceProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}
