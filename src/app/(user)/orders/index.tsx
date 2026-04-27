import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { useMyOrderList } from '../../../api/orders';
import OrderListItem from '../../../components/OrderListItem';
export default function MyOrdersScreen() {
   const { data: orders, isLoading, error, refetch, isRefetching } = useMyOrderList();
   if (isLoading) {
      return <ActivityIndicator style={{ marginTop: 30 }} size="large" />;
   }
   if (error) {
      return (
         <View style={styles.centered}>
            <Text style={styles.errorTitle}>Couldn&apos;t load your orders.</Text>
            <Text style={styles.retry} onPress={() => refetch()}>
               Tap to retry
            </Text>
         </View>
      );
   }

   return (
      <FlatList
         style={styles.page}
         data={orders || []}
         keyExtractor={(item) => item.id.toString()}
         renderItem={({ item }) => <OrderListItem order={item} />}
         contentContainerStyle={styles.content}
         onRefresh={refetch}
         refreshing={isRefetching}
         ListHeaderComponent={<Text style={styles.heading}>Your orders</Text>}
         ListEmptyComponent={
            <View style={styles.centered}>
               <Text style={styles.emptyTitle}>No orders yet.</Text>
               <Text style={styles.emptySubtitle}>Place your first order from the menu tab.</Text>
            </View>
         }
      />
   );
}
const styles = StyleSheet.create({
   page: {
      flex: 1,
      backgroundColor: '#f8fafc',
   },
   content: {
      padding: 14,
      gap: 10,
      paddingBottom: 24,
      flexGrow: 1,
   },
   heading: {
      fontSize: 24,
      fontWeight: '800',
      marginBottom: 8,
   },
   centered: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 40,
      gap: 8,
   },
   emptyTitle: {
      fontSize: 18,
      fontWeight: '700',
   },
   emptySubtitle: {
      color: '#6b7280',
   },
   errorTitle: {
      color: '#b91c1c',
      fontWeight: '700',
   },
   retry: {
      color: '#2563eb',
      fontWeight: '600',
   },
});
