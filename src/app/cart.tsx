import {
   View,
   Text,
   FlatList,
   Platform,
   StyleSheet,
   Alert,
   ActivityIndicator,
} from 'react-native';
import { useCart } from '../providers/CartProvider';
import CartListItem from '../components/CartListItem';
import { StatusBar } from 'expo-status-bar';
import Button from '../components/Button';
import { useInsertOrder } from '../api/orders';
import { useInsertOrderItems } from '../api/products/order-items';
import { Href, Redirect, useRouter } from 'expo-router';
import { useAuth } from '../providers/AuthProvider';

const CartScreen = () => {
   const { session } = useAuth();
   const { items, total, clearCart, itemsCount } = useCart();
   const { mutateAsync: createOrder, isPending: isCreatingOrder } = useInsertOrder();
   const { mutateAsync: createOrderItems, isPending: isCreatingOrderItems } =
      useInsertOrderItems();
   const router = useRouter();
   const isSubmitting = isCreatingOrder || isCreatingOrderItems;

   if (!session) {
      return <Redirect href={'/sign-in' as Href} />;
   }


   const onCheckout = async () => {
      if (items.length === 0 || isSubmitting) {
         return;
      }

      try {
         const order = await createOrder({ total });

         await createOrderItems(
            items.map((item) => ({
               order_id: order.id,
               product_id: item.product_id,
               quantity: item.quantity,
               size: item.size,
            }))
         );

         clearCart();
         Alert.alert('Order placed 🎉', `Your order #${order.id} is now in progress.`);
         router.replace(`/(user)/orders/${order.id}`);
      } catch {
         Alert.alert('Checkout failed', 'Please try again in a moment.');
      }
   };

   return (
      <View style={styles.container}>
         <Text style={styles.title}>Your Cart</Text>
         <Text style={styles.subtitle}>{itemsCount} items ready to checkout</Text>

         <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <CartListItem cartItem={item} />}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
               <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No items yet. Add meals from the menu.</Text>
               </View>
            }
         />

         <View style={styles.footer}>
            <View>
               <Text style={styles.totalLabel}>Total</Text>
               <Text style={styles.total}>${total.toFixed(2)}</Text>
            </View>

            <Button
               text={isSubmitting ? 'Placing order...' : 'Checkout'}
               onPress={onCheckout}
               disabled={isSubmitting || items.length === 0}
            />
         </View>


         {isSubmitting && <ActivityIndicator style={{ marginBottom: 8 }} />}
         <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
      </View>
   );
};

export default CartScreen;

//rnfe default react native arrow function
const styles = StyleSheet.create({
   container: {
      flex: 1,
      paddingHorizontal: 14,
      paddingTop: 16,
      backgroundColor: '#f8fafc',
   },
   title: {
      fontSize: 28,
      fontWeight: '800',
   },
   subtitle: {
      color: '#6b7280',
      marginTop: 4,
      marginBottom: 12,
   },
   listContent: {
      gap: 10,
      paddingBottom: 16,
   },
   emptyContainer: {
      paddingVertical: 40,
      alignItems: 'center',
   },
   emptyText: {
      color: '#9ca3af',
   },
   footer: {
      borderTopWidth: 1,
      borderTopColor: '#e5e7eb',
      paddingTop: 10,
      paddingBottom: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 16,
   },
   totalLabel: {
      color: '#6b7280',
   },
   total: {
      fontSize: 28,
      fontWeight: '800',
   },
});
