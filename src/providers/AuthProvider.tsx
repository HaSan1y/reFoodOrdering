import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';
import {
   PropsWithChildren,
   createContext,
   useContext,
   useEffect,
   useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { canUseDevAuth, isMockBackendEnabled } from '../lib/devMode';

type AuthData = {
   session: Session | null;
   profile: Profile | null;
   loading: boolean;
   isAdmin: boolean;
   canUseDevAuth: boolean;
   usingDevAuth: boolean;
   signInAsDevAdmin: () => Promise<void>;
   signInWithDevCredentials: (email: string, password: string) => Promise<boolean>;
   signOut: () => Promise<void>;
};

type Profile = {
   avatar_url: string | null;
   full_name: string | null;
   group: string;
   id: string;
   updated_at: string | null;
   username: string | null;
   website: string | null;
};

const AuthContext = createContext<AuthData>({
   session: null,
   loading: true,
   profile: null,
   isAdmin: false,
   canUseDevAuth: false,
   usingDevAuth: false,
   signInAsDevAdmin: async () => {},
   signInWithDevCredentials: async () => false,
   signOut: async () => {},
});

const DEV_AUTH_KEY = 'refood-dev-auth';

const createDevSession = (id: string, email: string, group: 'ADMIN' | 'USER'): Session =>
   ({
      access_token: 'dev-access-token',
      refresh_token: 'dev-refresh-token',
      expires_in: 3600,
      token_type: 'bearer',
      user: {
         id,
         aud: 'authenticated',
         role: 'authenticated',
         email,
         email_confirmed_at: new Date().toISOString(),
         phone: '',
         confirmed_at: new Date().toISOString(),
         app_metadata: {},
         user_metadata: { group },
         identities: [],
         created_at: new Date().toISOString(),
         updated_at: new Date().toISOString(),
      },
   } as Session);

export default function AuthProvider({ children }: PropsWithChildren) {
   const [session, setSession] = useState<Session | null>(null);
   const [profile, setProfile] = useState<Profile | null>(null);
   const [loading, setLoading] = useState(true);
   const [usingDevAuth, setUsingDevAuth] = useState(false);

   const applyDevIdentity = async (identity: { id: string; email: string; group: 'ADMIN' | 'USER' }) => {
      const devSession = createDevSession(identity.id, identity.email, identity.group);
      setSession(devSession);
      setProfile({
         id: devSession.user.id,
         avatar_url: null,
         full_name: identity.group === 'ADMIN' ? 'Dev Admin' : 'Dev User',
         group: identity.group,
         updated_at: new Date().toISOString(),
         username: identity.email.split('@')[0],
         website: null,
      });
      setUsingDevAuth(true);
      await AsyncStorage.setItem(DEV_AUTH_KEY, JSON.stringify(identity));
      setLoading(false);
   };

   const signInAsDevAdmin = async () => {
      await applyDevIdentity({
         id: 'dev-admin',
         email: 'admin@local.dev',
         group: 'ADMIN',
      });
   };

   const signInWithDevCredentials = async (email: string, password: string) => {
      const normalizedEmail = email.trim().toLowerCase();
      const normalizedPassword = password.trim().toLowerCase();

      if (normalizedPassword !== 'login') {
         return false;
      }

      if (normalizedEmail === 'admin' || normalizedEmail === 'admin@local.dev') {
         await applyDevIdentity({
            id: 'dev-admin',
            email: 'admin@local.dev',
            group: 'ADMIN',
         });
         return true;
      }

      if (normalizedEmail === 'user' || normalizedEmail === 'user@local.dev') {
         await applyDevIdentity({
            id: 'dev-user',
            email: 'user@local.dev',
            group: 'USER',
         });
         return true;
      }

      return false;
   };

   const signOut = async () => {
      if (usingDevAuth) {
         setSession(null);
         setProfile(null);
         setUsingDevAuth(false);
         await AsyncStorage.removeItem(DEV_AUTH_KEY);
         return;
      }
      await supabase.auth.signOut();
   };

   const loadProfile = async (nextSession: Session | null) => {
      if (!nextSession) {
         setProfile(null);
         return;
      }

      const { data, error } = await supabase
         .from('profiles')
         .select('*')
         .eq('id', nextSession.user.id)
         .maybeSingle();

      if (error) {
         setProfile(null);
         return;
      }

      if (data) {
         setProfile(data);
         return;
      }

      const profileSeed = {
         id: nextSession.user.id,
         group: 'USER',
         full_name:
            (nextSession.user.user_metadata?.full_name as string | undefined) || null,
      };

      const { data: created } = await supabase
         .from('profiles')
         .upsert(profileSeed)
         .select('*')
         .single();

      setProfile(created || { ...profileSeed, avatar_url: null, updated_at: null, username: null, website: null });
   };

   useEffect(() => {
      let mounted = true;

      const init = async () => {
         if (canUseDevAuth()) {
            const persisted = await AsyncStorage.getItem(DEV_AUTH_KEY);
            if (persisted) {
               const parsed = JSON.parse(persisted) as { id: string; email: string; group: 'ADMIN' | 'USER' };
               await applyDevIdentity(parsed);
               return;
            }
         }

         if (isMockBackendEnabled()) {
            setLoading(false);
            return;
         }

         const {
            data: { session },
         } = await supabase.auth.getSession();

         if (mounted) {
            setSession(session);
            await loadProfile(session);

            setLoading(false);
         }
      };

      init();

      if (isMockBackendEnabled()) {
         return () => {
            mounted = false;
         };
      }

      const { data: listener } = supabase.auth.onAuthStateChange(
         async (_event, nextSession) => {
            if (mounted) {
               setUsingDevAuth(false);
               setSession(nextSession);
               await loadProfile(nextSession);
               setLoading(false);
            }
         }
      );

      return () => {
         mounted = false;
         listener.subscription.unsubscribe();
      };
   }, []);

   return (
      <AuthContext.Provider
         value={{
            session,
            profile,
            loading,
            isAdmin: profile?.group === 'ADMIN',
            canUseDevAuth: canUseDevAuth(),
            usingDevAuth,
            signInAsDevAdmin,
            signInWithDevCredentials,
            signOut,
         }}
      >
         {children}
      </AuthContext.Provider>
   );
}

export const useAuth = () => useContext(AuthContext);
