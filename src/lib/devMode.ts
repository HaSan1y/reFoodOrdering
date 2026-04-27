import { Platform } from 'react-native';
import { useSyncExternalStore } from 'react';

export const hasSupabaseConfig = Boolean(
   process.env.EXPO_PUBLIC_SUPABASE_URL && process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
);

type BackendMode = 'live' | 'mock';

const BACKEND_MODE_KEY = 'refood-backend-mode';

export const isDesktopDemoMode = __DEV__ && Platform.OS === 'web';

const defaultMode: BackendMode =
   !hasSupabaseConfig || process.env.EXPO_PUBLIC_FORCE_MOCK_API === 'true' ? 'mock' : 'live';

let backendMode: BackendMode = defaultMode;

if (typeof window !== 'undefined') {
   const stored = window.localStorage.getItem(BACKEND_MODE_KEY);
   if (stored === 'live' || stored === 'mock') {
      backendMode = stored;
   }
}

const subscribers = new Set<() => void>();

const emit = () => subscribers.forEach((fn) => fn());

export const getBackendMode = () => backendMode;

export const setBackendMode = (mode: BackendMode) => {
   backendMode = mode;
   if (typeof window !== 'undefined') {
      window.localStorage.setItem(BACKEND_MODE_KEY, mode);
   }
   emit();
};

export const subscribeBackendMode = (listener: () => void) => {
   subscribers.add(listener);
   return () => subscribers.delete(listener);
};

export const useBackendMode = () =>
   useSyncExternalStore(subscribeBackendMode, getBackendMode, getBackendMode);

export const isMockBackendEnabled = () => getBackendMode() === 'mock' || !hasSupabaseConfig;

export const canUseDevAuth = () =>
   __DEV__ && (isDesktopDemoMode || isMockBackendEnabled() || process.env.EXPO_PUBLIC_ENABLE_DEV_AUTH === 'true');

