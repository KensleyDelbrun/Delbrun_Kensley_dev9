import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, LayoutAnimation, UIManager, Platform, Linking, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppearance } from '@/contexts/AppearanceContext';
import ScreenHeader from '@/components/ScreenHeader';
import { ChevronDown, ChevronRight, FileText, Info, Mail } from 'lucide-react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type FaqItemProps = {
  question: string;
  answer: string;
};

const FaqItem = ({ question, answer }: FaqItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { colors, textSize } = useAppearance();
  const styles = getStyles(colors, textSize);

  const toggleOpen = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsOpen(!isOpen);
  };

  return (
    <View>
      <TouchableOpacity onPress={toggleOpen} style={styles.faqQuestionContainer} activeOpacity={0.8}>
        <Text style={styles.faqQuestion}>{question}</Text>
        <ChevronDown color={colors.textSecondary} size={20} style={{ transform: [{ rotate: isOpen ? '180deg' : '0deg' }] }} />
      </TouchableOpacity>
      {isOpen && (
        <View style={styles.faqAnswerContainer}>
          <Text style={styles.faqAnswer}>{answer}</Text>
        </View>
      )}
    </View>
  );
};

export default function HelpScreen() {
  const { t } = useLanguage();
  const { colors, textSize } = useAppearance();
  const router = useRouter();
  const styles = getStyles(colors, textSize);

  const faqs = [
    { q: t('help.faq1_q'), a: t('help.faq1_a') },
    { q: t('help.faq2_q'), a: t('help.faq2_a') },
    { q: t('help.faq3_q'), a: t('help.faq3_a') },
    { q: t('help.faq4_q'), a: t('help.faq4_a') },
  ];

  const handleContactPress = async () => {
    const email = 'support@citoyeneclaire.ht';
    const subject = t('help.emailSubject');
    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}`;

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert(t('common.error'), t('help.emailError'));
      }
    } catch (error) {
      Alert.alert(t('common.error'), t('help.emailError'));
    }
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title={t('help.title')} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>{t('help.faq')}</Text>
        <View style={styles.section}>
          {faqs.map((faq, index) => (
            <React.Fragment key={index}>
              <FaqItem question={faq.q} answer={faq.a} />
              {index < faqs.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
          ))}
        </View>

        <Text style={styles.sectionTitle}>{t('help.otherResources')}</Text>
        <View style={styles.section}>
          <TouchableOpacity style={styles.linkItem} onPress={() => router.push('/privacy')}>
            <FileText color={colors.textSecondary} size={20} />
            <Text style={styles.linkText}>{t('help.privacyPolicy')}</Text>
            <ChevronRight color={colors.textSecondary} size={20} />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.linkItem} onPress={() => router.push('/about')}>
            <Info color={colors.textSecondary} size={20} />
            <Text style={styles.linkText}>{t('help.aboutUs')}</Text>
            <ChevronRight color={colors.textSecondary} size={20} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.contactSection} onPress={handleContactPress} activeOpacity={0.8}>
          <Mail color={colors.primary} size={24} />
          <Text style={styles.contactTitle}>{t('help.needMoreHelp')}</Text>
          <Text style={styles.contactText}>{t('help.contactSupport')}</Text>
        </TouchableOpacity>
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
    padding: 16,
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
  },
  faqQuestionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  faqQuestion: {
    flex: 1,
    fontSize: 15 * textSize,
    color: colors.text,
    fontWeight: '500',
    marginRight: 16,
  },
  faqAnswerContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  faqAnswer: {
    fontSize: 14 * textSize,
    color: colors.textSecondary,
    lineHeight: 22 * textSize,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 16,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  linkText: {
    flex: 1,
    fontSize: 16 * textSize,
    color: colors.text,
    marginLeft: 16,
  },
  contactSection: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  contactTitle: {
    fontSize: 16 * textSize,
    color: colors.text,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14 * textSize,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
