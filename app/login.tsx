import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppearance } from '@/contexts/AppearanceContext';
import { useNotifications, NotificationSettings } from '@/hooks/useNotifications';
import ScreenHeader from '@/components/ScreenHeader';
import { Info } from 'lucide-react-native';

type NotificationItemProps = {
  title: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
};

const NotificationItem = ({ title, description, value, onValueChange }: NotificationItemProps) => {
  const { colors, textSize } = useAppearance();
  const styles = getStyles(colors, textSize);

  return (
    <View style={styles.itemContainer}>
      <View style={styles.textContainer}>
        <Text style={styles.itemTitle}>{title}</Text>
        <Text style={styles.itemDescription}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#767577', true: colors.primary }}
        thumbColor={value ? '#f4f3f4' : '#f4f3f4'}
      />
    </View>
  );
};

export default function NotificationScreen() {
  const { t } = useLanguage();
  const { colors, textSize } = useAppearance();
  const { settings, updateSetting } = useNotifications();
  const styles = getStyles(colors, textSize);

  const notificationItems: { key: keyof NotificationSettings; title: string; desc: string }[] = [
    { key: 'newArticles', title: t('notifications.newArticles'), desc: t('notifications.newArticlesDesc') },
    { key: 'readReminders', title: t('notifications.readReminders'), desc: t('notifications.readRemindersDesc') },
    { key: 'weeklySummary', title: t('notifications.weeklySummary'), desc: t('notifications.weeklySummaryDesc') },
    { key: 'communityUpdates', title: t('notifications.communityUpdates'), desc: t('notifications.communityUpdatesDesc') },
    { key: 'importantNews', title: t('notifications.importantNews'), desc: t('notifications.importantNewsDesc') },
  ];

  return (
    <View style={styles.container}>
      <ScreenHeader title={t('notifications.title')} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.infoBox}>
          <Info size={20} color={colors.primary} />
          <Text style={styles.infoText}>{t('notifications.info')}</Text>
        </View>
        <View style={styles.tipBox}>
          <Text style={styles.tipText}>{t('notifications.tip')}</Text>
        </View>
        <View style={styles.listContainer}>
          {notificationItems.map((item, index) => (
            <React.Fragment key={item.key}>
              <NotificationItem
                title={item.title}
                description={item.desc}
                value={settings[item.key]}
                onValueChange={(value) => updateSetting(item.key, value)}
              />
              {index < notificationItems.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
          ))}
        </View>
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
  infoBox: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    color: colors.textSecondary,
    fontSize: 14 * textSize,
    lineHeight: 20 * textSize,
  },
  tipBox: {
    backgroundColor: colors.primary + '20',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  tipText: {
    color: colors.primary,
    fontSize: 14 * textSize,
    lineHeight: 20 * textSize,
    textAlign: 'center',
  },
  listContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  textContainer: {
    flex: 1,
    marginRight: 16,
  },
  itemTitle: {
    fontSize: 16 * textSize,
    color: colors.text,
    fontWeight: '500',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 13 * textSize,
    color: colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 16,
  },
});
