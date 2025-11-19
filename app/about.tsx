import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppearance } from '@/contexts/AppearanceContext';
import ScreenHeader from '@/components/ScreenHeader';
import { CheckCircle } from 'lucide-react-native';

const FeatureItem = ({ text }: { text: string }) => {
  const { colors, textSize } = useAppearance();
  const styles = getStyles(colors, textSize);
  return (
    <View style={styles.featureItem}>
      <CheckCircle color={colors.primary} size={18} style={styles.featureIcon} />
      <Text style={styles.paragraph}>{text}</Text>
    </View>
  );
};

export default function AboutScreen() {
  const { t } = useLanguage();
  const { colors, textSize } = useAppearance();
  const styles = getStyles(colors, textSize);

  return (
    <View style={styles.container}>
      <ScreenHeader title={t('help.aboutUs')} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerSection}>
          <Text style={styles.appName}>{t('about.title')}</Text>
          <Text style={styles.appVersion}>{t('common.version')} 1.0.0</Text>
        </View>

        <Text style={styles.title}>{t('about.missionTitle')}</Text>
        <Text style={styles.paragraph}>{t('about.missionText')}</Text>

        <Text style={styles.title}>{t('about.featuresTitle')}</Text>
        <FeatureItem text={t('about.feature1')} />
        <FeatureItem text={t('about.feature2')} />
        <FeatureItem text={t('about.feature3')} />
        <FeatureItem text={t('about.feature4')} />
        <FeatureItem text={t('about.feature5')} />

        <Text style={styles.title}>{t('about.contactTitle')}</Text>
        <Text style={styles.paragraph}>{t('about.contactText')}</Text>
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
  headerSection: {
    alignItems: 'center',
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: 24,
  },
  appName: {
    fontSize: 22 * textSize,
    fontWeight: '700',
    color: colors.text,
  },
  appVersion: {
    fontSize: 14 * textSize,
    color: colors.textSecondary,
    marginTop: 8,
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
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  featureIcon: {
    marginRight: 12,
    marginTop: 4,
  },
});
