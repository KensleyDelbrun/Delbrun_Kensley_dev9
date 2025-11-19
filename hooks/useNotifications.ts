import { useState } from 'react';

export type NotificationSettings = {
  newArticles: boolean;
  readReminders: boolean;
  weeklySummary: boolean;
  communityUpdates: boolean;
  importantNews: boolean;
};

export function useNotifications() {
  const [settings, setSettings] = useState<NotificationSettings>({
    newArticles: true,
    readReminders: false,
    weeklySummary: true,
    communityUpdates: false,
    importantNews: true,
  });

  const updateSetting = (key: keyof NotificationSettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return { settings, updateSetting };
}
