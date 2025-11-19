import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePreferences } from '@/hooks/usePreferences';
import { useAppearance } from '@/contexts/AppearanceContext';

/**
 * Hook to sync appearance settings with backend preferences
 */
export function useAppearanceSync() {
  const { user } = useAuth();
  const { fetchPreferences } = usePreferences();
  const { setManualDarkMode, setAutoDarkMode } = useAppearance();

  useEffect(() => {
    if (user) {
      loadAppearancePreferences();
    }
  }, [user]);

  const loadAppearancePreferences = async () => {
    try {
      const prefs = await fetchPreferences();
      if (prefs) {
        if (prefs.dark_mode_auto !== undefined) {
          await setAutoDarkMode(prefs.dark_mode_auto);
        }
        if (prefs.dark_mode !== undefined) {
          await setManualDarkMode(prefs.dark_mode);
        }
      }
    } catch (error) {
      console.error('Failed to load appearance preferences:', error);
    }
  };

  return { loadAppearancePreferences };
}
