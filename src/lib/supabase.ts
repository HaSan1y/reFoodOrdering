import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import { Database } from '../database.types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { hasSupabaseConfig } from './devMode';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://example.supabase.co';
const supabaseKey =
   process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'public-anon-key-for-local-demo-only';
const isServer = typeof window === 'undefined';

const webStorage =
   !isServer && Platform.OS === 'web'
      ? {
           getItem: (key: string) => window.localStorage.getItem(key),
           setItem: (key: string, value: string) => window.localStorage.setItem(key, value),
           removeItem: (key: string) => window.localStorage.removeItem(key),
        }
      : undefined;

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
   auth: {
      storage: isServer ? undefined : webStorage || AsyncStorage,
      autoRefreshToken: !isServer,
      persistSession: !isServer,
      detectSessionInUrl: false,
   },
});

export { hasSupabaseConfig };
