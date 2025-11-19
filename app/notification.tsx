import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, ActivityIndicator, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppearance } from '@/contexts/AppearanceContext';
import { useScheduledReminders } from '@/hooks/useScheduledReminders';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { ArrowLeft, Info, Clock } from 'lucide-react-native';

export default function NotificationScreen() {
  const { t } = useLanguage();
  const { textSize, colors, isDarkMode } = useAppearance();
  const router = useRouter();
  const styles = getStyles(textSize, colors, isDarkMode);
  
  const { isLoaded, isEnabled, scheduledTime, toggleReminders, updateReminderTime } = useScheduledReminders();
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleTimeChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || scheduledTime;
    setShowTimePicker(Platform.OS === 'ios');
    if (event.type === 'set') {
      updateReminderTime(currentDate);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const renderToggleItem = (
    title: string,
    description: string,
    disabled: boolean = false
  ) => (
    <View style={[styles.toggleItem, disabled && styles.disabledItem]}>
      <View style={styles.toggleTextContainer}>
        <Text style={styles.toggleTitle}>{title}</Text>
        <Text style={styles.toggleDescription}>{description}</Text>
      </View>
      <Switch
        value={false}
        disabled={true}
        trackColor={{ false: '#767577', true: colors.primary }}
        thumbColor={'#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
      />
    </View>
  );

  const renderReminderSection = () => (
    <View style={styles.section}>
      <View style={styles.toggleItem}>
        <View style={styles.toggleTextContainer}>
          <Text style={styles.toggleTitle}>{t('notifications.readReminders')}</Text>
          <Text style={styles.toggleDescription}>{t('notifications.readRemindersDesc')}</Text>
        </View>
        <Switch
          value={isEnabled}
          onValueChange={toggleReminders}
          trackColor={{ false: '#767577', true: colors.primary }}
          thumbColor={isDarkMode ? '#f4f3f4' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
        />
      </View>
      {isEnabled && (
        <View style={styles.timePickerContainer}>
          <View style={styles.timePickerLabel}>
            <Clock size={18} color={colors.textSecondary} />
            <Text style={styles.timePickerText}>{t('notifications.reminderTime')}</Text>
          </View>
          <TouchableOpacity style={styles.timePickerButton} onPress={() => setShowTimePicker(true)}>
            <Text style={styles.timePickerButtonText}>{formatTime(scheduledTime)}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft color={colors.text} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('notifications.title')}</Text>
        <View style={{ width: 40 }} />
      </View>

      {!isLoaded ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.infoBox}>
            <Info size={20} color={colors.primary} style={styles.infoIcon} />
            <Text style={styles.infoText}>{t('notifications.info')}</Text>
          </View>

          {renderReminderSection()}

          <View style={[styles.section, { marginTop: 24 }]}>
            {renderToggleItem(
              t('notifications.newArticles'),
              t('notifications.featureDisabled'),
              true
            )}
            {renderToggleItem(
              t('notifications.weeklySummary'),
              t('notifications.featureDisabled'),
              true
            )}
            {renderToggleItem(
              t('notifications.communityUpdates'),
              t('notifications.featureDisabled'),
              true
            )}
            {renderToggleItem(
              t('notifications.importantNews'),
              t('notifications.featureDisabled'),
              true
            )}
          </View>
        </ScrollView>
      )}
      {showTimePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={scheduledTime}
          mode="time"
          is24Hour={false}
          display="default"
          onChange={handleTimeChange}
        />
      )}
    </SafeAreaView>
  );
}

const getStyles = (textSize: number, colors: any, isDarkMode: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 16 * textSize,
    fontWeight: '700',
    color: colors.text,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  infoIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    fontSize: 14 * textSize,
    color: colors.textSecondary,
    lineHeight: 20 * textSize,
  },
  section: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    overflow: 'hidden',
  },
  toggleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  disabledItem: {
    opacity: 0.5,
  },
  toggleTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  toggleTitle: {
    fontSize: 16 * textSize,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  toggleDescription: {
    fontSize: 13 * textSize,
    color: colors.textSecondary,
  },
  timePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: colors.background,
  },
  timePickerLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timePickerText: {
    fontSize: 15 * textSize,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  timePickerButton: {
    backgroundColor: colors.border,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  timePickerButtonText: {
    fontSize: 15 * textSize,
    fontWeight: '600',
    color: colors.text,
  },
});
