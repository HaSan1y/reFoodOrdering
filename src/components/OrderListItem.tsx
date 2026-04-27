import { View, Text, StyleSheet, Pressable } from 'react-native';
import React from 'react';
import { Tables } from '../types';
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';
import { Href, Link, useSegments } from 'expo-router';
import OrderStatusBadge from './OrderStatusBadge';

dayjs.extend(relativeTime);

type OrderListItemProps = {
   order: Tables<'orders'>;
};

const OrderListItem = ({ order }: OrderListItemProps) => {
   const segments = useSegments();

   return (
      <Link href={`/${segments[0]}/orders/${order.id}` as Href} asChild>
         <Pressable style={styles.container}>
            <View>
               <Text style={styles.title}>Order #{order.id}</Text>
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
   time: {
      color: 'gray',
   },
});

export default OrderListItem;
