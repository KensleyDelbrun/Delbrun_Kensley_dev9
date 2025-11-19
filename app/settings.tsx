import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppearance } from '@/contexts/AppearanceContext';
import { usePreferences } from '@/hooks/usePreferences';
import ScreenHeader from '@/components/ScreenHeader';
import { Palette, TextQuote, Bell, Database, Info, ChevronRight, SunMoon } from 'lucide-react-native';
import { clearOfflineArticles, getOfflineArticlesSize, formatBytes } from '@/lib/offlineStorage';
import { useAppearanceSync } from '@/hooks/useAppearanceSync';

export default function SettingsScreen() {
  const { t } = useLanguage();
  const { 
    colors, 
    isDarkMode, 
    manualDarkMode, 
    setManualDarkMode, 
    autoDarkMode, 
    setAutoDarkMode, 
    textSize, 
    setTextSize 
  } = useAppearance();
  const { updatePreferences } = usePreferences();
  const styles = getStyles({ colors, textSize, autoDarkMode });
  const router = useRouter();
  const [cacheSize, setCacheSize] = useState('0 Bytes');

  // Sync local settings with backend on change
  const handleAutoDarkModeChange = async (value: boolean) => {
    await setAutoDarkMode(value);
    updatePreferences({ dark_mode_auto: value });
  };

  const handleManualDarkModeChange = async (value: boolean) => {
    await setManualDarkMode(value);
    updatePreferences({ dark_mode: value });
  };

  const updateCacheSize = useCallback(async () => {
    const size = await getOfflineArticlesSize();
    setCacheSize(formatBytes(size));
  }, []);

  useFocusEffect(
    useCallback(() => {
      updateCacheSize();
    }, [updateCacheSize])
  );
  
  // Load preferences from backend when screen is focused
  useAppearanceSync();

  const handleClearCache = () => {
    Alert.alert(
      t('settings.clearCacheConfirmTitle'),
      t('settings.clearCacheConfirmMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('settings.clearCacheButton'),
          style: 'destructive',
          onPress: async () => {
            const { success } = await clearOfflineArticles();
            if (success) {
              Alert.alert(t('common.success'), t('settings.cacheClearedSuccess'));
              updateCacheSize();
            } else {
              Alert.alert(t('common.error'), t('settings.cacheClearedError', 'An error occurred while clearing the cache.'));
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title={t('settings.title')} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>{t('settings.appearance')}</Text>
        <View style={styles.section}>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <SunMoon color={colors.textSecondary} size={20} />
              <View>
                <Text style={styles.rowText}>{t('settings.automaticTheme')}</Text>
                <Text style={styles.rowSubText}>{t('settings.automaticThemeDesc')}</Text>
              </View>
            </View>
            <Switch
              value={autoDarkMode}
              onValueChange={handleAutoDarkModeChange}
              trackColor={{ false: '#767577', true: colors.primary }}
              thumbColor={'#f4f3f4'}
            />
          </View>
          <View style={styles.divider} />
          <View style={[styles.row, autoDarkMode && styles.rowDisabled]}>
            <View style={styles.rowLeft}>
              <Palette color={autoDarkMode ? colors.border : colors.textSecondary} size={20} />
              <Text style={styles.rowText}>{t('settings.darkMode')}</Text>
            </View>
            <Switch
              value={autoDarkMode ? isDarkMode : manualDarkMode}
              onValueChange={handleManualDarkModeChange}
              disabled={autoDarkMode}
              trackColor={{ false: '#767577', true: colors.primary }}
              thumbColor={'#f4f3f4'}
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <TextQuote color={colors.textSecondary} size={20} />
              <Text style={styles.rowText}>{t('settings.textSize')}</Text>
            </View>
          </View>
          <View style={styles.textSizeSelector}>
            <TouchableOpacity onPress={() => setTextSize(1)} style={[styles.sizeOption, textSize === 1 && styles.sizeOptionSelected]}>
              <Text style={[styles.sizeText, textSize === 0.85 && styles.sizeTextSelected]}>{t('settings.textSizeSmall')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setTextSize(1.15)} style={[styles.sizeOption, textSize === 1 && styles.sizeOptionSelected]}>
              <Text style={[styles.sizeText, textSize === 1 && styles.sizeTextSelected]}>{t('settings.textSizeMedium')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setTextSize(1.30)} style={[styles.sizeOption, textSize === 1.30 && styles.sizeOptionSelected]}>
              <Text style={[styles.sizeText, textSize === 1.15 && styles.sizeTextSelected]}>{t('settings.textSizeLarge')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.sectionTitle}>{t('settings.notifications')}</Text>
        <View style={styles.section}>
          <TouchableOpacity style={styles.row} onPress={() => router.push('/notification')}>
            <View style={styles.rowLeft}>
              <Bell color={colors.textSecondary} size={20} />
              <Text style={styles.rowText}>{t('settings.manageNotifications')}</Text>
            </View>
            <ChevronRight color={colors.textSecondary} size={20} />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>{t('settings.storage')}</Text>
        <View style={styles.section}>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Database color={colors.textSecondary} size={20} />
              <Text style={styles.rowText}>{t('settings.usedSpace')}</Text>
            </View>
            <Text style={styles.rowValue}>{cacheSize} / 128 MB</Text>
          </View>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.row} onPress={handleClearCache}>
            <View style={styles.rowLeft}>
              <Text style={[styles.rowText, styles.destructiveText]}>{t('settings.clearCache')}</Text>
            </View>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>{t('settings.about')}</Text>
        <View style={styles.section}>
          <TouchableOpacity style={styles.row} onPress={() => router.push('/about')}>
            <View style={styles.rowLeft}>
              <Info color={colors.textSecondary} size={20} />
              <Text style={styles.rowText}>{t('help.aboutUs')}</Text>
            </View>
            <ChevronRight color={colors.textSecondary} size={20} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const getStyles = ({ colors, textSize, autoDarkMode }: { colors: any, textSize: number, autoDarkMode: boolean }) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 14 * textSize,
    color: colors.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginVertical: 8,
    marginLeft: 8,
  },
  section: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: 24,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    minHeight: 55,
    paddingVertical: 8,
  },
  rowDisabled: {
    opacity: 0.5,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rowText: {
    fontSize: 16 * textSize,
    color: colors.text,
    marginLeft: 16,
  },
  rowSubText: {
    fontSize: 12 * textSize,
    color: colors.textSecondary,
    marginLeft: 16,
    marginTop: 2,
  },
  rowValue: {
    fontSize: 15 * textSize,
    color: colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 52,
  },
  textSizeSelector: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    margin: 16,
    borderRadius: 8,
    padding: 4,
  },
  sizeOption: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  sizeOptionSelected: {
    backgroundColor: colors.primary,
  },
  sizeText: {
    fontSize: 14 * textSize,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  sizeTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  destructiveText: {
    color: colors.error,
    marginLeft: 0,
  },
});
