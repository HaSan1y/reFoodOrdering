import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import Button from '../../components/Button';
import Colors from '../../constants/Colors';
import { Link, Stack, Href, useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { isRetriableError } from '../../lib/network';
import { useAuth } from '../../providers/AuthProvider';
import { getBackendMode, setBackendMode, useBackendMode } from '../../lib/devMode';

const SignInScreen = () => {
   const params = useLocalSearchParams<{ email?: string }>();
   const router = useRouter();
   const { canUseDevAuth, signInAsDevAdmin, signInWithDevCredentials } = useAuth();
   const backendMode = useBackendMode();
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [loading, setLoading] = useState(false);

   useEffect(() => {
      if (params.email) {
         setEmail(String(params.email));
      }
   }, [params.email]);

   async function signInWithEmail() {
      setLoading(true);

      if (canUseDevAuth) {
         const didUseDev = await signInWithDevCredentials(email, password);
         if (didUseDev) {
            router.replace('/' as Href);
            return;
         }
      }

      const { error } = await supabase.auth.signInWithPassword({
         email,
         password,
      });

      if (error) {
         if (isRetriableError(error)) {
            Alert.alert(
               'Network problem',
               'Could not reach the server. Check your connection and try again.'
            );
         } else {
            Alert.alert(error.message);
         }
      }
      setLoading(false);
   }

   return (
      <View style={styles.container}>
         <Stack.Screen options={{ title: 'Sign in' }} />

         <Text style={styles.label}>Email</Text>
         <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="jon@gmail.com"
            style={styles.input}
         />

         <Text style={styles.label}>Password</Text>
         <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder=""
            style={styles.input}
            secureTextEntry
         />

         <Button
            onPress={signInWithEmail}
            disabled={loading}
            text={loading ? 'Signing in...' : 'Sign in'}
         />
         {canUseDevAuth && (
            <Button
               onPress={() => {
                  const next = getBackendMode() === 'mock' ? 'live' : 'mock';
                  setBackendMode(next);
                  Alert.alert('Backend mode switched', `Using ${next.toUpperCase()} backend.`);
               }}
               text={`Switch Backend: ${backendMode.toUpperCase()}`}
            />
         )}
         {canUseDevAuth && (
            <Button
               onPress={async () => {
                  await signInAsDevAdmin();
                  router.replace('/' as Href);
               }}
               text="Dev Admin Quick Login"
            />
         )}
         {canUseDevAuth && <Text style={styles.hint}>Seed logins: `Admin / Login` or `User / Login`</Text>}
         <Link href={`/sign-up` as Href} style={styles.textButton} >
            Create an account
         </Link>
      </View>
   );
};

const styles = StyleSheet.create({
   container: {
      padding: 20,
      justifyContent: 'center',
      flex: 1,
   },
   label: {
      color: 'gray',
   },
   input: {
      borderWidth: 1,
      borderColor: 'gray',
      padding: 10,
      marginTop: 5,
      marginBottom: 20,
      backgroundColor: 'white',
      borderRadius: 5,
   },
   textButton: {
      alignSelf: 'center',
      fontWeight: 'bold',
      color: Colors.light.tint,
      marginVertical: 10,
   },
   hint: {
      textAlign: 'center',
      color: '#6b7280',
      fontSize: 12,
      marginTop: 4,
   },
});

export default SignInScreen;
