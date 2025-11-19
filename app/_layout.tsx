import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AppearanceProvider } from '@/contexts/AppearanceContext';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { usePushNotifications } from '@/hooks/usePushNotifications';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  // NOTE: The hook for remote push notifications is prepared but disabled for now.
  // It causes errors in Expo Go and the feature is not yet implemented.
  // To enable it in the future, a development build will be required.
  // usePushNotifications();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="edit-profile" />
      <Stack.Screen name="notification" />
      {/* On pourra ajouter ici d'autres écrans modaux comme 'settings' ou 'help' */}
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
      // Hide the splash screen after the fonts have loaded (or failed to load)
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Prevent rendering until the fonts are loaded
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
