//changes ./index.tsx screentitle to Menu
// gadam didnt show image cuz view wasnt stack tag
import { FontAwesome } from '@expo/vector-icons';
import { Link, Stack } from 'expo-router';
import { Pressable } from 'react-native';
import Colors from '../../../constants/Colors';
import { useAuth } from '../../../providers/AuthProvider';

export default function MenuStack() {
   const { signOut } = useAuth();

   return (
      <Stack
         screenOptions={{
            headerRight: () => (
               <Pressable style={{ flexDirection: 'row', gap: 15, marginRight: 15 }}>
                  <Link href="/cart" asChild>
                     <Pressable>
                        {({ pressed }) => (
                           <FontAwesome
                              name="shopping-cart"
                              size={25}
                              color={Colors.light.tint}
                              style={{ opacity: pressed ? 0.5 : 1 }}
                           />
                        )}
                     </Pressable>
                  </Link>
                  <Pressable onPress={signOut}>
                     {({ pressed }) => (
                        <FontAwesome
                           name="sign-out"
                           size={25}
                           color={Colors.light.tint}
                           style={{ opacity: pressed ? 0.5 : 1 }}
                        />
                     )}
                  </Pressable>
               </Pressable>
            ),
         }}
      >
         <Stack.Screen name="index" options={{ title: 'Menu' }} />
      </Stack>
   );
}
