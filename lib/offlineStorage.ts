import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserPreferences } from '@/hooks/usePreferences';

// --- Constants ---
const ARTICLE_KEY_PREFIX = '@offline-article-';
const USER_PROFILE_KEY_PREFIX = '@user-profile-';
const USER_PREFERENCES_KEY_PREFIX = '@user-preferences-';

// --- Types ---
export type OfflineArticle = {
  id: string;
  category_name_fr: string;
  category_name_ht: string;
  saved_at: string;
  [key: string]: any;
};

type CategoryName = {
  fr: string;
  ht: string;
};

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  preferred_language: 'fr' | 'ht';
  created_at: string;
  updated_at: string;
}

// --- Article Storage ---

/**
 * Saves an article for offline access.
 */
export async function saveArticleOffline(article: { id: string, [key: string]: any }, categoryNames: CategoryName): Promise<{ success: boolean }> {
  try {
    const articleToSave: OfflineArticle = {
      ...article,
      category_name_fr: categoryNames.fr,
      category_name_ht: categoryNames.ht,
      saved_at: new Date().toISOString(),
    };
    await AsyncStorage.setItem(ARTICLE_KEY_PREFIX + article.id, JSON.stringify(articleToSave));
    return { success: true };
  } catch (e) {
    console.error('Failed to save article offline', e);
    return { success: false };
  }
}

/**
 * Removes an article from offline storage.
 */
export async function removeArticleOffline(articleId: string): Promise<{ success: boolean }> {
  try {
    await AsyncStorage.removeItem(ARTICLE_KEY_PREFIX + articleId);
    return { success: true };
  } catch (e) {
    console.error('Failed to remove article offline', e);
    return { success: false };
  }
}

/**
 * Checks if an article is saved offline.
 */
export async function isArticleSavedOffline(articleId: string): Promise<boolean> {
  try {
    const item = await AsyncStorage.getItem(ARTICLE_KEY_PREFIX + articleId);
    return item !== null;
  } catch (e) {
    console.error('Failed to check if article is saved', e);
    return false;
  }
}

/**
 * Retrieves a single offline article by its ID.
 */
export async function getOfflineArticleById(articleId: string): Promise<OfflineArticle | null> {
  try {
    const jsonValue = await AsyncStorage.getItem(ARTICLE_KEY_PREFIX + articleId);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Failed to get offline article by ID', e);
    return null;
  }
}

/**
 * Retrieves all saved offline articles.
 */
export async function getAllOfflineArticles(): Promise<OfflineArticle[]> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const articleKeys = keys.filter(key => key.startsWith(ARTICLE_KEY_PREFIX));
    if (articleKeys.length === 0) return [];
    const items = await AsyncStorage.multiGet(articleKeys);
    return items.map(item => JSON.parse(item[1]!));
  } catch (e) {
    console.error('Failed to get all offline articles', e);
    return [];
  }
}

/**
 * Clears all saved offline articles from storage.
 */
export async function clearOfflineArticles(): Promise<{ success: boolean }> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const articleKeys = keys.filter(key => key.startsWith(ARTICLE_KEY_PREFIX));
    if (articleKeys.length > 0) {
      await AsyncStorage.multiRemove(articleKeys);
    }
    return { success: true };
  } catch (e) {
    console.error('Failed to clear offline articles', e);
    return { success: false };
  }
}

// --- User Profile Storage ---

/**
 * Saves a user profile for offline access.
 */
export async function saveUserProfile(profile: UserProfile): Promise<{ success: boolean }> {
  try {
    await AsyncStorage.setItem(USER_PROFILE_KEY_PREFIX + profile.id, JSON.stringify(profile));
    return { success: true };
  } catch (e) {
    console.error('Failed to save user profile offline', e);
    return { success: false };
  }
}

/**
 * Retrieves a user profile from offline storage.
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const jsonValue = await AsyncStorage.getItem(USER_PROFILE_KEY_PREFIX + userId);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Failed to get user profile offline', e);
    return null;
  }
}

/**
 * Removes a user profile from offline storage.
 */
export async function removeUserProfile(userId: string): Promise<{ success: boolean }> {
  try {
    await AsyncStorage.removeItem(USER_PROFILE_KEY_PREFIX + userId);
    return { success: true };
  } catch (e) {
    console.error('Failed to remove user profile offline', e);
    return { success: false };
  }
}

// --- User Preferences Storage ---

/**
 * Saves user preferences for offline access.
 */
export async function saveUserPreferences(userId: string, preferences: UserPreferences): Promise<{ success: boolean }> {
  try {
    await AsyncStorage.setItem(USER_PREFERENCES_KEY_PREFIX + userId, JSON.stringify(preferences));
    return { success: true };
  } catch (e) {
    console.error('Failed to save user preferences offline', e);
    return { success: false };
  }
}

/**
 * Retrieves user preferences from offline storage.
 */
export async function getUserPreferences(userId: string): Promise<UserPreferences | null> {
  try {
    const jsonValue = await AsyncStorage.getItem(USER_PREFERENCES_KEY_PREFIX + userId);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Failed to get user preferences offline', e);
    return null;
  }
}

/**
 * Removes user preferences from offline storage.
 */
export async function removeUserPreferences(userId: string): Promise<{ success: boolean }> {
  try {
    await AsyncStorage.removeItem(USER_PREFERENCES_KEY_PREFIX + userId);
    return { success: true };
  } catch (e) {
    console.error('Failed to remove user preferences offline', e);
    return { success: false };
  }
}


// --- General Cache Management ---

/**
 * Calculates the size of only the offline articles stored in AsyncStorage.
 */
export async function getOfflineArticlesSize(): Promise<number> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const articleKeys = keys.filter(key => key.startsWith(ARTICLE_KEY_PREFIX));
    if (articleKeys.length === 0) {
      return 0;
    }
    const items = await AsyncStorage.multiGet(articleKeys);
    let totalSize = 0;
    items.forEach(item => {
      const keySize = item[0].length;
      const valueSize = item[1] ? item[1].length : 0;
      totalSize += keySize + valueSize;
    });
    return totalSize;
  } catch (e) {
    console.error('Failed to get articles storage size from AsyncStorage', e);
    return 0;
  }
}

/**
 * Formats a size in bytes to a human-readable string.
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
