import { useOrderDetails, useUpdateOrder } from '../../../api/orders';
import OrderItemListItem from '../../../components/OrderItemListItem';
import OrderListItem from '../../../components/OrderListItem';
import { OrderStatus, OrderStatusList } from '../../../../src/types';
import Colors from '../../../constants/Colors';
import OrderStatusBadge from '../../../components/OrderStatusBadge';

// import { notifyUserAboutOrderUpdate } from '../../../lib/notifications';

// import orders from '../../../../assets/data/order';
import { Stack, useLocalSearchParams } from 'expo-router';
import {
   FlatList,
   Text,
   View,
   Pressable,
   ActivityIndicator,
   Alert,
} from 'react-native';
import { canTransitionStatus, getStatusTimeline, recordStatusTransition } from '../../../lib/orderStatus';
import dayjs from 'dayjs';

export default function OrderDetailsScreen() {
   const { id: idString } = useLocalSearchParams();
   // const id = parseFloat(typeof idString === 'string' ? idString : idString[0]);
   const idParam = Array.isArray(idString) ? idString[0] : idString;
   const id = Number(idParam);
   const hasValidId = Number.isFinite(id);

   const { data: order, isLoading, error } = useOrderDetails(id);
   const { mutateAsync: updateOrder, isPending } = useUpdateOrder();
   const timeline = order ? getStatusTimeline(order.id, order.created_at, order.status) : [];

   const updateStatus = async (status: OrderStatus) => {
      if (!order) return;
      if (!canTransitionStatus(order.status, status)) {
         Alert.alert('Invalid transition', `Cannot move from ${order.status} to ${status}.`);
         return;
      }
      try {
         await updateOrder({
            id,
            updatedFields: { status },
         });
         recordStatusTransition(id, status);
      } catch {
         Alert.alert('Status update failed', 'Please try again.');
      }
   };

   if (isLoading) {
      return <ActivityIndicator />;
   }
   if (!hasValidId) {
      return <Text>Invalid order id</Text>;
   }
   if (error || !order) {
      return <Text>Failed to fetch</Text>;
   }

   return (
      <View style={{ padding: 10, gap: 20, flex: 1 }}>
         <Stack.Screen options={{ title: `Order #${id}` }} />

         <FlatList
            data={order.order_items}
            renderItem={({ item }) => <OrderItemListItem item={item} />}
            contentContainerStyle={{ gap: 10 }}
            ListHeaderComponent={() => <OrderListItem order={order} />}
            ListFooterComponent={() => <>
               <Text style={{ fontWeight: 'bold' }}>Status</Text>
               <View style={{ marginTop: 8, marginBottom: 4 }}>
                  <OrderStatusBadge status={order.status} />
               </View>
               <View style={{ flexDirection: 'row', gap: 5 }}>
                  {OrderStatusList.map((status) => (
                     <Pressable
                        key={status}
                        disabled={isPending}
                        onPress={() => updateStatus(status)}
                        style={{
                           borderColor: Colors.light.tint,
                           borderWidth: 1,
                           padding: 10,
                           borderRadius: 5,
                           marginVertical: 10,
                           opacity: isPending ? 0.6 : 1,
                           backgroundColor:
                              order.status === status
                                 ? Colors.light.tint
                                 : 'transparent',
                        }}
                     >
                        <Text
                           style={{
                              color:
                                 order.status === status ? 'white' : Colors.light.tint,
                           }}
                        >
                           {status}
                        </Text>
                     </Pressable>
                  ))}
               </View>
               <Text style={{ fontWeight: 'bold', marginTop: 6 }}>Timeline</Text>
               {timeline.map((entry) => (
                  <Text key={`${entry.status}-${entry.at}`} style={{ color: '#4b5563', marginTop: 4 }}>
                     {entry.status} - {dayjs(entry.at).format('DD.MM.YYYY HH:mm')}
                  </Text>
               ))}
            </>}
         />
      </View>
   );
}
