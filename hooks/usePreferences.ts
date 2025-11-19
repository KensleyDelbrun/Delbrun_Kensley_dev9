import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { getUserPreferences, saveUserPreferences } from '@/lib/offlineStorage';

export interface UserPreferences {
  id: string;
  new_articles_notif: boolean;
  read_reminders_notif: boolean;
  weekly_summary_notif: boolean;
  community_updates_notif: boolean;
  important_news_notif: boolean;
  dark_mode?: boolean;
  dark_mode_auto?: boolean;
  updated_at: string;
}

const defaultPreferences: Omit<UserPreferences, 'id' | 'updated_at'> = {
  new_articles_notif: true,
  read_reminders_notif: false,
  weekly_summary_notif: true,
  community_updates_notif: true,
  important_news_notif: true,
  dark_mode: false,
  dark_mode_auto: true,
};

export function usePreferences() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPreferences = useCallback(async (): Promise<UserPreferences | null> => {
    if (!user) return null;

    setLoading(true);
    setError(null);

    // 1. Get local data first for instant load
    const localPrefs = await getUserPreferences(user.id);

    // 2. Try to fetch remote data to sync
    try {
      const { data, error: remoteError } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('id', user.id)
        .single();

      if (remoteError && remoteError.code !== 'PGRST116') { // Ignore 'no rows found'
        if (localPrefs) return localPrefs; // If network fails, return local data
        throw remoteError;
      }

      if (data) {
        await saveUserPreferences(user.id, data); // Update local cache
        return data;
      }
      
      // If no remote data, return local or default
      return localPrefs || { ...defaultPreferences, id: user.id, updated_at: new Date().toISOString() };

    } catch (e: any) {
      setError(e.message);
      // On error, return whatever we have locally, or defaults
      return localPrefs || { ...defaultPreferences, id: user.id, updated_at: new Date().toISOString() };
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updatePreferences = async (updates: Partial<Omit<UserPreferences, 'id' | 'updated_at'>>): Promise<UserPreferences | null> => {
    if (!user) return null;

    setLoading(true);
    setError(null);

    // 1. Optimistic UI: update local data first
    const localPrefs = await getUserPreferences(user.id) || { ...defaultPreferences, id: user.id, updated_at: new Date().toISOString() };
    
    const optimisticPrefs: UserPreferences = {
      ...localPrefs,
      ...updates,
      updated_at: new Date().toISOString(),
    };
    await saveUserPreferences(user.id, optimisticPrefs);

    // 2. Try to sync with remote
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .upsert({ id: user.id, ...updates, updated_at: new Date().toISOString() })
        .select()
        .single();

      if (error) throw error;

      // 3. If remote sync is successful, update local cache with definitive data
      await saveUserPreferences(user.id, data);
      return data;
    } catch (e: any) {
      setError(e.message);
      // If remote sync fails, return the optimistic data. It's already saved locally.
      return optimisticPrefs;
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchPreferences,
    updatePreferences,
    loading,
    error,
  };
}
