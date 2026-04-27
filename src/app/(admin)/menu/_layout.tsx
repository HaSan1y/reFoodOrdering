//changes ./index.tsx screentitle to Menu
// gadam didnt show image cuz view wasnt stack tag
import Colors from '../../../constants/Colors';
import { FontAwesome } from '@expo/vector-icons';
import { Link, Stack } from 'expo-router';
import { Pressable } from 'react-native';

export default function MenuStack() {
   return (
      // screenOptions={{}}>  //without this detailspage wont have header right only index will have,plus-square-o
      <Stack.Screen name="[id]" options={{
         title: 'Menu', headerRight: () => (
            <Link href="/(admin)/menu/create" asChild>
               <Pressable>
                  {({ pressed }) => (
                     <FontAwesome
                        name="pencil"
                        size={25}
                        color={Colors.light.tint}
                        style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                     />
                  )}
               </Pressable>
            </Link>
         ),
      }} />
   );
}
