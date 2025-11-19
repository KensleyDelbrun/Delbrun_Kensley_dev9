import React from 'react';
import { Tabs } from 'expo-router';
import { Home, Bookmark, User, Compass, LayoutGrid } from 'lucide-react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppearance } from '@/contexts/AppearanceContext';
import { View, StyleSheet } from 'react-native';

export default function TabLayout() {
  const { t } = useLanguage();
  const { colors } = useAppearance();

  const styles = StyleSheet.create({
    tabBar: {
      backgroundColor: colors.surface,
      borderTopColor: colors.border,
      height: 80,
      paddingTop: 10,
      paddingBottom: 100, // Adjusted for better safe area handling
    },
    tabBarItem: {
      // Removed paddingBottom to let the tab bar handle spacing
    },
  });

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarItemStyle: styles.tabBarItem,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.home'),
          tabBarIcon: ({ color, focused }) => (
            <Home color={color} size={24} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: t('tabs.categories'),
          tabBarIcon: ({ color, focused }) => (
            <LayoutGrid color={color} size={24} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: t('tabs.saved'),
          tabBarIcon: ({ color, focused }) => (
            <Bookmark color={color} size={24} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('tabs.profile'),
          tabBarIcon: ({ color, focused }) => (
            <User color={color} size={24} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
    </Tabs>
  );
}
