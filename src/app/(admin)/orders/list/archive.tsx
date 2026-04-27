import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { useAdminOrderList } from '../../../../api/orders';
import OrderListItem from '../../../../components/OrderListItem';

export default function ArchivedOrdersScreen() {
   const {
      data: orders,
      isLoading,
      error, refetch, isRefetching
   } = useAdminOrderList({ archived: true });

   if (isLoading) {
      return <ActivityIndicator style={{ marginTop: 30 }} size="large" />;
   }
   if (error) {
      return <Text style={styles.error}>Failed to fetch archived orders.</Text>;
   }

   return (
      <FlatList
         // data={orders}
         // renderItem={({ item }) => <OrderListItem order={item} />}
         // contentContainerStyle={{ gap: 10, padding: 10 }}
         style={styles.page}
         data={orders || []}
         keyExtractor={(item) => item.id.toString()}
         renderItem={({ item }) => <OrderListItem order={item} />}
         contentContainerStyle={styles.content}
         onRefresh={refetch}
         refreshing={isRefetching}
         ListEmptyComponent={<View style={styles.empty}><Text>No archived orders.</Text></View>} />
   );
}

const styles = StyleSheet.create({
   page: { flex: 1, backgroundColor: '#f8fafc' },
   content: { padding: 14, gap: 10, paddingBottom: 24, flexGrow: 1 },
   error: { padding: 16, color: '#b91c1c', fontWeight: '700' },
   empty: { alignItems: 'center', justifyContent: 'center', flex: 1, paddingVertical: 30 },
});
