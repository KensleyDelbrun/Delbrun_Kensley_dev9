import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLanguage } from '@/contexts/LanguageContext';

const STORAGE_KEY = '@ReadReminderSettings';
const REMINDER_NOTIFICATION_ID = 'read-reminder-notification';

type ReminderSettings = {
  isEnabled: boolean;
  time: string; // ISO string format
};

export function useScheduledReminders() {
  const { t } = useLanguage();
  const [isEnabled, setIsEnabled] = useState(false);
  const [scheduledTime, setScheduledTime] = useState<Date>(new Date());
  const [isLoaded, setIsLoaded] = useState(false);

  const saveSettings = useCallback(async (settings: ReminderSettings) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, []);

  const cancelReminder = useCallback(async () => {
    await Notifications.cancelScheduledNotificationAsync(REMINDER_NOTIFICATION_ID);
  }, []);

  const scheduleReminder = useCallback(async (time: Date) => {
    await cancelReminder();

    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      alert(t('notifications.permissionDenied'));
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: t('notifications.reminderTitle'),
        body: t('notifications.reminderBody'),
      },
      trigger: {
        hour: time.getHours(),
        minute: time.getMinutes(),
        repeats: true,
      },
      identifier: REMINDER_NOTIFICATION_ID,
    });
  }, [cancelReminder, t]);

  const updateReminderTime = useCallback(async (newTime: Date) => {
    setScheduledTime(newTime);
    if (isEnabled) {
      await scheduleReminder(newTime);
    }
    await saveSettings({ isEnabled, time: newTime.toISOString() });
  }, [isEnabled, saveSettings, scheduleReminder]);

  const toggleReminders = useCallback(async (enabled: boolean) => {
    setIsEnabled(enabled);
    if (enabled) {
      await scheduleReminder(scheduledTime);
    } else {
      await cancelReminder();
    }
    await saveSettings({ isEnabled: enabled, time: scheduledTime.toISOString() });
  }, [scheduledTime, saveSettings, scheduleReminder, cancelReminder]);

  useEffect(() => {
    const loadSettings = async () => {
      const settingsString = await AsyncStorage.getItem(STORAGE_KEY);
      if (settingsString) {
        const settings: ReminderSettings = JSON.parse(settingsString);
        setIsEnabled(settings.isEnabled);
        setScheduledTime(new Date(settings.time));
      } else {
        // Default settings
        const defaultTime = new Date();
        defaultTime.setHours(20, 0, 0, 0); // 8:00 PM
        setScheduledTime(defaultTime);
      }
      setIsLoaded(true);
    };

    loadSettings();
  }, []);

  return {
    isLoaded,
    isEnabled,
    scheduledTime,
    toggleReminders,
    updateReminderTime,
  };
}
