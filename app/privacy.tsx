import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppearance } from '@/contexts/AppearanceContext';
import ScreenHeader from '@/components/ScreenHeader';

export default function PrivacyScreen() {
  const { t } = useLanguage();
  const { colors, textSize } = useAppearance();
  const styles = getStyles(colors, textSize);

  return (
    <View style={styles.container}>
      <ScreenHeader title={t('help.privacyPolicy')} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.lastUpdated}>{t('privacy.lastUpdated')}</Text>
        <Text style={styles.paragraph}>{t('privacy.intro')}</Text>

        <Text style={styles.title}>{t('privacy.section1Title')}</Text>
        <Text style={styles.paragraph}>{t('privacy.section1Content')}</Text>

        <Text style={styles.title}>{t('privacy.section2Title')}</Text>
        <Text style={styles.paragraph}>{t('privacy.section2Content')}</Text>

        <Text style={styles.title}>{t('privacy.section3Title')}</Text>
        <Text style={styles.paragraph}>{t('privacy.section3Content')}</Text>
      </ScrollView>
    </View>
  );
}

const getStyles = (colors: any, textSize: number) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
  },
  lastUpdated: {
    fontSize: 13 * textSize,
    color: colors.textSecondary,
    marginBottom: 24,
    fontStyle: 'italic',
  },
  title: {
    fontSize: 18 * textSize,
    color: colors.text,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 15 * textSize,
    color: colors.textSecondary,
    lineHeight: 24 * textSize,
  },
});
