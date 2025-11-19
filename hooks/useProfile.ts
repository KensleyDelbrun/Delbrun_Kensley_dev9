import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { getUserProfile, saveUserProfile, UserProfile } from '@/lib/offlineStorage';

export function useProfile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async (): Promise<UserProfile | null> => {
    if (!user) return null;

    setLoading(true);
    setError(null);

    // 1. Get local data first for instant load
    const localProfile = await getUserProfile(user.id);

    // 2. Try to fetch remote data to sync
    try {
      const { data, error: remoteError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (remoteError && remoteError.code !== 'PGRST116') { // PGRST116 means no rows found
        if (localProfile) return localProfile; // If network fails, return local data
        throw remoteError;
      }

      if (data) {
        const profileData = { ...data, email: user.email || '' };
        await saveUserProfile(profileData); // Update local cache
        return profileData;
      }

      return localProfile;
    } catch (e: any) {
      setError(e.message);
      // On error, return whatever we have locally
      return localProfile;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updateProfile = async (updates: Partial<Omit<UserProfile, 'id' | 'email' | 'created_at'>>): Promise<UserProfile | null> => {
    if (!user) return null;

    setLoading(true);
    setError(null);

    // 1. Optimistic UI: update local data first
    const localProfile = await getUserProfile(user.id);
    let optimisticProfile: UserProfile | null = null;

    if (localProfile) {
      optimisticProfile = {
        ...localProfile,
        ...updates,
        updated_at: new Date().toISOString(),
      };
      await saveUserProfile(optimisticProfile);
    }

    // 2. Try to sync with remote
    try {
      const upsertData = {
        id: user.id,
        ...updates,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('user_profiles')
        .upsert(upsertData)
        .select()
        .single();

      if (error) throw error;

      // 3. If remote sync is successful, update local cache with definitive data
      const finalProfile = { ...data, email: user.email || '' };
      await saveUserProfile(finalProfile);
      return finalProfile;
    } catch (e: any) {
      setError(e.message);
      // If remote sync fails, return the optimistic data. It's already saved locally.
      return optimisticProfile;
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchProfile,
    updateProfile,
    loading,
    error,
  };
}
