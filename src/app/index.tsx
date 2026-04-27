import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Href, Redirect } from 'expo-router';
import { useAuth } from '../providers/AuthProvider';

const Index = () => {
   const { session, loading, isAdmin } = useAuth();

   if (loading) {
      return (
         <View style={styles.loader}>
            <ActivityIndicator size="large" />
         </View>
      );
   }

   if (!session) {
      return <Redirect href={'/sign-in' as Href} />;
   }

    if (isAdmin) {
      return <Redirect href={'/(admin)' as Href} />;
   }

   return <Redirect href={'/(user)' as Href} />;
};

const styles = StyleSheet.create({
   loader: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
   },
});
export default Index;
