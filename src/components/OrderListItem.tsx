import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Href, Link, useSegments } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import OrderStatusBadge from './OrderStatusBadge';

dayjs.extend(relativeTime);

type OrderListItemProps = {
   order: any;
   isAdmin?: boolean;
};

const OrderListItem = ({ order, isAdmin }: OrderListItemProps) => {
   const segments = useSegments();
   const userName = order?.profiles?.full_name || order?.profiles?.username || 'Unknown User';

   return (
      <Link href={`/${segments[0]}/orders/${order.id}` as Href} asChild>
         <Pressable style={styles.container}>
            <View style={{ flex: 1 }}>
               <Text style={styles.title}>Order #{order.id}</Text>
               {isAdmin && <Text style={styles.user}>User: {userName}</Text>}
               <Text style={styles.time}>{dayjs(order.created_at).fromNow()}</Text>
            </View>

            <OrderStatusBadge status={order.status} />
         </Pressable>
      </Link>
   );
};

const styles = StyleSheet.create({
   container: {
      backgroundColor: 'white',
      padding: 10,
      borderRadius: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
   },
   title: {
      fontWeight: 'bold',
      marginVertical: 5,
   },
   user: {
      color: '#2563eb',
      fontSize: 12,
      fontWeight: '600',
      marginVertical: 2,
   },
   time: {
      color: 'gray',
   },
});

export default OrderListItem;
