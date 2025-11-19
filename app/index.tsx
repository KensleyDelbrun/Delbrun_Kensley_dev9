import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { Redirect } from 'expo-router';
import { useAppearance } from '@/contexts/AppearanceContext';

export default function StartPage() {
  const { session, loading } = useAuth();
  const { colors } = useAppearance();

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!session) {
    // If no session, redirect to the login screen.
    return <Redirect href="/login" />;
  }

  // If a session exists, redirect to the main app (tabs).
  return <Redirect href="/(tabs)" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
