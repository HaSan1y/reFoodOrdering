import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import * as Linking from 'expo-linking';
import { Href, router } from 'expo-router';
import { supabase } from '../../lib/supabase';

function getParamsFromUrl(url: string) {
   const fragment = url.includes('#') ? url.split('#')[1] : '';
   const query = url.includes('?') ? url.split('?')[1] : '';
   const source = fragment || query;
   return new URLSearchParams(source);
}

export default function AuthCallbackScreen() {
   const [message, setMessage] = useState('Signing you in...');

   useEffect(() => {
      let active = true;

      const applySessionFromUrl = async (url: string | null) => {
         if (!active || !url) {
            return;
         }

         try {
            const params = getParamsFromUrl(url);
            const accessToken = params.get('access_token');
            const refreshToken = params.get('refresh_token');

            if (accessToken && refreshToken) {
               const { error } = await supabase.auth.setSession({
                  access_token: accessToken,
                  refresh_token: refreshToken,
               });

               if (error) {
                  setMessage('Session could not be restored. Please sign in manually.');
                  return;
               }
            }

            router.replace('/' as Href);
         } catch {
            setMessage('Invalid auth link. Please return and sign in again.');
         }
      };

      Linking.getInitialURL().then(applySessionFromUrl);
      const sub = Linking.addEventListener('url', ({ url }) => applySessionFromUrl(url));

      return () => {
         active = false;
         sub.remove();
      };
   }, []);

   return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, gap: 10 }}>
         <ActivityIndicator size="large" />
         <Text>{message}</Text>
      </View>
   );
}

