import * as SecureStore from 'expo-secure-store';
import { Storage } from '@supabase/supabase-js';

/**
 * A custom storage adapter for Supabase that uses Expo's SecureStore.
 * This ensures that the user's session token is encrypted and stored securely.
 */
export const SecureStoreAdapter: Storage = {
  async getItem(key: string): Promise<string | null> {
    try {
      // Retrieve the item from SecureStore.
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error('SecureStoreAdapter.getItem error:', error);
      // In case of an error, it's safer to return null.
      return null;
    }
  },
  async setItem(key: string, value: string): Promise<void> {
    try {
      // Store the item securely.
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error('SecureStoreAdapter.setItem error:', error);
    }
  },
  async removeItem(key: string): Promise<void> {
    try {
      // Remove the item from SecureStore.
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error('SecureStoreAdapter.removeItem error:', error);
    }
  },
};
