import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, useProfile } from '@/hooks/useProfile';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Animated } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppearance } from '@/contexts/AppearanceContext';
import { User, Settings, Bell, Globe, HelpCircle, LogOut, ChevronRight, Pencil } from 'lucide-react-native';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { textSize, colors, isDarkMode } = useAppearance();
  const router = useRouter();
  const styles = getStyles(textSize, colors, isDarkMode);
  const { fetchProfile, updateProfile } = useProfile();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    React.useCallback(() => {
      if (user) {
        loadProfile();
      } else {
        setProfile(null);
        setLoading(false);
        fadeIn();
      }
    }, [user])
  );

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const loadProfile = async () => {
    // Don't show spinner for cached data, load it instantly
    const userProfile = await fetchProfile();
    if (userProfile) {
      setProfile(userProfile);
      if (userProfile.preferred_language !== language) {
        setLanguage(userProfile.preferred_language);
      }
    }
    setLoading(false);
    fadeIn();
  };

  const handleSignOut = () => {
    Alert.alert(
      t('profile.signOutConfirmTitle'),
      t('profile.signOutConfirmMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('profile.signOut'),
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/login');
          },
        },
      ]
    );
  };

  const handleLanguageChange = () => {
    Alert.alert(
      t('profile.changeLanguageTitle'),
      t('profile.changeLanguageMessage'),
      [
        {
          text: 'Français',
          onPress: async () => {
            setLanguage('fr');
            const updatedProfile = await updateProfile({ preferred_language: 'fr' });
            if (updatedProfile) {
              setProfile(updatedProfile);
            }
          },
        },
        {
          text: 'Kreyòl Ayisyen',
          onPress: async () => {
            setLanguage('ht');
            const updatedProfile = await updateProfile({ preferred_language: 'ht' });
            if (updatedProfile) {
              setProfile(updatedProfile);
            }
          },
        },
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
      ]
    );
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.logo}>{t('profile.title')}</Text>
        </View>
        <Animated.View style={[styles.emptyState, { opacity: fadeAnim }]}>
          <View style={styles.userIconContainer}>
            <User color="#9CA3AF" size={48} />
          </View>
          <Text style={styles.emptyTitle}>
            {t('profile.notConnected')}
          </Text>
          <Text style={styles.emptyText}>
            {t('profile.notConnectedMessage')}
          </Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push('/login')}
          >
            <Text style={styles.loginButtonText}>
              {t('profile.signIn')}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    );
  }

  // We only show a full-screen loader if there's no profile data at all on the first load.
  // Subsequent loads will be instant.
  if (loading && !profile) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.logo}>{t('profile.title')}</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>
            {t('common.loading')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.logo}>{t('profile.title')}</Text>
        <View style={styles.languageBadge}>
          <View style={styles.flagMini}>
            <View style={[styles.flagHalf, { backgroundColor: '#0038A8' }]} />
            <View style={[styles.flagHalf, { backgroundColor: '#D21034' }]} />
          </View>
          <Text style={styles.languageText}>{language === 'fr' ? 'FR' : 'HT'}</Text>
        </View>
      </View>

      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <User color={colors.primary} size={48} />
              </View>
            </View>
            <View style={styles.userNameContainer}>
              <Text style={styles.userName}>
                {profile?.full_name || user.user_metadata?.full_name || t('common.user')}
              </Text>
              <TouchableOpacity style={styles.editButton} onPress={() => router.push('/edit-profile')}>
                <Pencil color={colors.textSecondary} size={18} />
              </TouchableOpacity>
            </View>
            <Text style={styles.userEmail}>{profile?.email || user.email}</Text>
          </View>

          <View style={styles.menuSection}>
            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7} onPress={() => router.push('/settings')}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: colors.primary + '1A' }]}>
                  <Settings color={colors.primary} size={20} />
                </View>
                <Text style={styles.menuItemText}>
                  {t('profile.settings')}
                </Text>
              </View>
              <ChevronRight color={colors.textSecondary} size={20} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7} onPress={() => router.push('/notification')}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: '#F59E0B' + '1A' }]}>
                  <Bell color="#F59E0B" size={20} />
                </View>
                <Text style={styles.menuItemText}>
                  {t('profile.notifications')}
                </Text>
              </View>
              <ChevronRight color={colors.textSecondary} size={20} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7} onPress={handleLanguageChange}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: colors.primary + '1A' }]}>
                  <Globe color={colors.primary} size={20} />
                </View>
                <Text style={styles.menuItemText}>
                  {t('profile.language')}
                </Text>
              </View>
              <View style={styles.menuItemRight}>
                <Text style={styles.languageValue}>{language === 'fr' ? 'FR' : 'HT'}</Text>
                <ChevronRight color={colors.textSecondary} size={20} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} activeOpacity={0.7} onPress={() => router.push('/help')}>
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: '#A855F7' + '1A' }]}>
                  <HelpCircle color="#A855F7" size={20} />
                </View>
                <Text style={styles.menuItemText}>
                  {t('profile.helpSupport')}
                </Text>
              </View>
              <ChevronRight color={styles.textSecondary} size={20} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.menuItem, styles.logoutItem]}
              activeOpacity={0.7}
              onPress={handleSignOut}
            >
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: '#EF4444' + '1A' }]}>
                  <LogOut color="#EF4444" size={20} />
                </View>
                <Text style={[styles.menuItemText, styles.logoutText]}>
                  {t('profile.signOut')}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.version}>{t('common.version')} 1.0.0</Text>
          </View>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}

const getStyles = (textSize: number, colors: any, isDarkMode: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.surface,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    fontSize: 16 * textSize,
    fontWeight: '700',
    color: colors.text,
  },
  languageBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDarkMode ? colors.border : '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  flagMini: {
    flexDirection: 'row',
    width: 20,
    height: 12,
    marginRight: 6,
    overflow: 'hidden',
    borderRadius: 2,
  },
  flagHalf: {
    flex: 1,
  },
  languageText: {
    fontSize: 12 * textSize,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  content: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: colors.surface,
    marginBottom: 16,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 20 * textSize,
    fontWeight: '700',
    color: colors.text,
  },
  editButton: {
    marginLeft: 12,
    padding: 4,
  },
  userEmail: {
    fontSize: 15 * textSize,
    color: colors.textSecondary,
  },
  menuSection: {
    backgroundColor: colors.surface,
    paddingVertical: 8,
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuItemText: {
    fontSize: 16 * textSize,
    color: colors.text,
    fontWeight: '500',
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageValue: {
    fontSize: 14 * textSize,
    color: colors.textSecondary,
    marginRight: 8,
    fontWeight: '600',
  },
  logoutItem: {
    borderBottomWidth: 0,
  },
  logoutText: {
    color: '#EF4444',
  },
  footer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  version: {
    fontSize: 14 * textSize,
    color: colors.textSecondary,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  userIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyTitle: {
    fontSize: 20 * textSize,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 15 * textSize,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  loginButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 8,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16 * textSize,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16 * textSize,
    color: colors.textSecondary,
  },
});
