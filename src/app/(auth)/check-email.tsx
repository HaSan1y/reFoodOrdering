import { Alert, StyleSheet, Text, View } from 'react-native';
import { Href, Link, Stack, useLocalSearchParams } from 'expo-router';
import { supabase } from '../../lib/supabase';
import Button from '../../components/Button';
import Colors from '../../constants/Colors';
import { getAuthRedirectUrl } from '../../lib/authRedirect';

export default function CheckEmailScreen() {
   const { email } = useLocalSearchParams<{ email?: string }>();

   const resendConfirmation = async () => {
      if (!email) return;

      const { error } = await supabase.auth.resend({
         type: 'signup',
         email: String(email),
         options: { emailRedirectTo: getAuthRedirectUrl() },
      });

      if (error) {
         Alert.alert('Resend failed', error.message);
         return;
      }

      Alert.alert('Email sent', 'We sent you a new confirmation link.');
   };

   return (
      <View style={styles.container}>
         <Stack.Screen options={{ title: 'Check your email' }} />

         <Text style={styles.title}>Almost done</Text>
         <Text style={styles.text}>
            We sent a confirmation link to:
         </Text>
         <Text style={styles.email}>{email || 'your email address'}</Text>
         <Text style={styles.text}>
            Open the link on this device so the app can complete sign-in.
         </Text>

         <Button onPress={resendConfirmation} text="Resend confirmation email" />

         <Link
            href={`/sign-in?email=${encodeURIComponent(String(email || ''))}` as Href}
            style={styles.textButton}
         >
            I already confirmed, go to sign in
         </Link>
      </View>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      padding: 24,
      justifyContent: 'center',
      gap: 10,
   },
   title: {
      fontSize: 28,
      fontWeight: '800',
   },
   text: {
      color: '#4b5563',
      fontSize: 15,
   },
   email: {
      fontWeight: '700',
      color: '#111827',
      marginBottom: 8,
   },
   textButton: {
      alignSelf: 'center',
      color: Colors.light.tint,
      fontWeight: '700',
      marginTop: 8,
   },
});
