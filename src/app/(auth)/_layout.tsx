import { useAuth } from '../../providers/AuthProvider';
import { Href, Redirect, Stack } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

export default function AuthLayout() {
   const { session, loading } = useAuth();

   if (loading) {
      return (
         <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator size="large" />
         </View>
      );
   }

   if (session) {
      return <Redirect href={'/' as Href} />;
   }

   return <Stack />;
}
