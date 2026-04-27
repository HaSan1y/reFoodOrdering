import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Href, Redirect, Tabs } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

import Colors from '../../constants/Colors';
import { useColorScheme } from '../../components/useColorScheme';
// import { useClientOnlyValue } from '../../components/useClientOnlyValue';
// import { ActivityIndicator } from 'react-native';
import { useAuth } from '../../providers/AuthProvider';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={23} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { session, loading } = useAuth();
  //  const headerShown = useClientOnlyValue(false, true);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!session) {
    return <Redirect href={'/sign-in' as Href} />;
  }
  // if (loading) {
  //   return <ActivityIndicator />;
  // }
  // if (!isAdmin) {
  //   return <Redirect href={'/(user)' as Href} />;
  // }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        // headerShown: headerShown,
        // to prevent a hydration error in React Navigation v6.
        // headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          href: null,
          headerShown: false,        // Hide header for the index screen
        }} />
      <Tabs.Screen
        name="menu"
        options={{
          headerShown: false,
          title: 'Menu',
          tabBarIcon: ({ color }) => <TabBarIcon name="cutlery" color={color} />,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Orders',
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="list" color={color} />,
        }}
      />
    </Tabs>
  );
}
// change title = Menu+Orders, name = cutlery+list, (tabs) == navigation, screen = route, options = route options, tabBarIcon = icon, headerRight = right header button
