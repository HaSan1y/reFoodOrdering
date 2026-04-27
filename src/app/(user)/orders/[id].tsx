import { useOrderDetails } from '../../../api/orders';
import { useUpdateOrderSubscription } from '../../../api/orders/subscriptions';
import OrderItemListItem from '../../../components/OrderItemListItem';
import OrderListItem from '../../../components/OrderListItem';
import { Stack, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { getStatusTimeline, recordStatusTransition } from '../../../lib/orderStatus';
import dayjs from 'dayjs';

export default function OrderDetailsScreen() {
   const { id: idString } = useLocalSearchParams();
   // const id = parseFloat(typeof idString === 'string' ? idString : idString[0]);
   const idParam = Array.isArray(idString) ? idString[0] : idString;
   const id = Number(idParam);
   const hasValidId = Number.isFinite(id);

   const { data: order, isLoading, error } = useOrderDetails(id);
   useUpdateOrderSubscription(id);
   const timeline = order ? getStatusTimeline(order.id, order.created_at, order.status) : [];

   if (order) {
      recordStatusTransition(order.id, order.status);
   }

   if (isLoading) {
      return <ActivityIndicator />;
   }
   if (!hasValidId) return <Text>Invalid order id</Text>;
   if (error) {
      return <Text>Failed to fetch</Text>;
   }

   return (
      <View style={{ padding: 10, gap: 20, flex: 1 }}>
         <Stack.Screen options={{ title: `Order #${id}` }} />

         {order && <FlatList
            data={order.order_items}
            renderItem={({ item }) => <OrderItemListItem item={item} />}
            contentContainerStyle={{ gap: 10 }}
            ListHeaderComponent={() => <OrderListItem order={order} />}
            ListFooterComponent={() => (
               <View style={{ marginTop: 8 }}>
                  <Text style={{ fontWeight: 'bold' }}>Timeline</Text>
                  {timeline.map((entry) => (
                     <Text key={`${entry.status}-${entry.at}`} style={{ color: '#4b5563', marginTop: 4 }}>
                        {entry.status} - {dayjs(entry.at).format('DD.MM.YYYY HH:mm')}
                     </Text>
                  ))}
               </View>
            )}
         />}
      </View>
   );
}
