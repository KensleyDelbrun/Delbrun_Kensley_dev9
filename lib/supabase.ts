import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';
import { SecureStoreAdapter } from './SecureStoreAdapter';
import { Database } from '@/types/database.types'; // Assuming you might create this file later for generated types

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// --- AJOUT DE LOGS DE DÉBOGAGE ---
console.log('--- Initialisation du client Supabase ---');
console.log('Supabase URL lue:', supabaseUrl ? `...${supabaseUrl.slice(-10)}` : 'URL MANQUANTE !');
console.log('Supabase Anon Key lue:', supabaseAnonKey ? `...${supabaseAnonKey.slice(-10)}` : 'CLÉ MANQUANTE !');
// ------------------------------------

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('ERREUR CRITIQUE: URL ou clé anonyme Supabase manquante. Vérifiez votre fichier .env et redémarrez le bundler.');
  throw new Error('Supabase URL or Anon Key is missing. Please check your .env file.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: SecureStoreAdapter, // Use the secure adapter instead of AsyncStorage
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

console.log('Client Supabase initialisé avec succès en utilisant SecureStore.');

// Note: The Database type definition has been moved to a separate file for better organization.
// You can generate this file using `npx supabase gen types typescript > types/database.types.ts`
// For now, I've kept the original structure to avoid breaking changes.
export type { Database } from '@/types/database.types';
