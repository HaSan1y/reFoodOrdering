import { CartItem, Tables } from '../types';
import { PropsWithChildren, createContext, useContext, useState, useMemo } from 'react';
import { randomUUID } from 'expo-crypto';
// import { Href, router } from 'expo-router';
// import { useInsertOrder } from '../api/orders';
// import { useInsertOrderItems } from '../api/order-items';
type Product = Tables<'products'>;
type CartType = {
   // items: CartItem[],
   // // onAddItem: (item: CartItem) => void,
   // addItem: (product: Tables<'products'>, size: CartItem['size']) => void,
   // updateQuantity: (itemId: string, amount: -1 | 1) => void,
   // total: number;
   // checkout: () => void;
   items: CartItem[];
   addItem: (product: Product, size: CartItem['size']) => void;
   updateQuantity: (itemId: string, amount: -1 | 1) => void;
   clearCart: () => void;
   total: number;
   itemsCount: number;
};

const CartContext = createContext<CartType>({
   items: [],
   addItem: () => { },
   updateQuantity: () => { },
   clearCart: () => { },
   total: 0,
   itemsCount: 0,
   // checkout: () => { }
})
// : { children: React.ReactNode }||: PropsWithChildren
const CartProvider = ({ children }: PropsWithChildren) => {
   const [items, setItems] = useState<CartItem[]>([]);

   const addItem = (product: Product, size: CartItem['size']) => {
      setItems((currentItems) => {
         const existingItem = currentItems.find(
            (item) => item.product_id === product.id && item.size === size
         );
         // const [items, setItems] = useState<CartItem[]>([]);

         // const { mutate: insertOrder } = useInsertOrder();
         // const { mutate: insertOrderItems } = useInsertOrderItems();

         // const addItem = (product: Tables<'products'>, size: CartItem['size']) => {
         // const existingItem = items.find((item) => item.product === product && item.size === size);

         if (existingItem) {
            // updateQuantity(existingItem.id, 1);
            // return;
            return currentItems.map((item) =>
               item.id === existingItem.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
            );
         }
         const newCartItem: CartItem = {
            //       id: randomUUID(),//Date.now().toString(),
            //       product,
            //       product_id: product.id,
            //       size,
            //       quantity: 1
            //    }
            //    setItems([newCartItem, ...items])
            //    console.log(items)
            // }
            // const updateQuantity = (itemId: string, amount: -1 | 1) => {
            //    setItems(items.map((item) => item.id !== itemId ? item : { ...item, quantity: item.quantity + amount }).filter((item) => item.quantity > 0))

            // }
            // const clearCart = () => {
            //    setItems([])
            // }
            // const checkout = () => {
            //    insertOrder({ total }, { onSuccess: saveOrderItems })
            // }

            // const saveOrderItems = async (order: Tables<'orders'>) => {

            //    const orderItems = items.map((cartItem) => ({
            //       order_id: order.id,
            //       product_id: cartItem.product.id,
            //       size: cartItem.size,
            //       quantity: cartItem.quantity
            //    }))

            //    insertOrderItems(orderItems, {
            //       onSuccess() {
            //          clearCart();
            //          // router.push(`/(users)/orders/${order.id}` as Href);
            //          router.push({
            //             pathname: '/(user)/orders/[id]',
            //             params: { id: order.id }
            //          });
            //       }
            //    })
            id: randomUUID(),
            product,
            product_id: product.id,
            size,
            quantity: 1,
         };

         return [newCartItem, ...currentItems];
      });
   };

   const updateQuantity = (itemId: string, amount: -1 | 1) => {
      setItems((currentItems) =>
         currentItems
            .map((item) =>
               item.id !== itemId ? item : { ...item, quantity: item.quantity + amount }
            )
            .filter((item) => item.quantity > 0)
      );
   };

   const clearCart = () => setItems([]);

   const total = useMemo(
      () => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
      [items]
   );

   const itemsCount = useMemo(
      () => items.reduce((sum, item) => sum + item.quantity, 0),
      [items]
   );
   // }
   return (
      <CartContext.Provider
         value={{
            items,
            addItem,
            updateQuantity,
            clearCart,
            total,
            itemsCount,
         }}
      >
         {children}
      </CartContext.Provider>
   );
};
//    console.log(items)
//    const total = items.reduce((sum, item) => sum += item.product.price * item.quantity, 0)
//    return (
//       <CartContext.Provider value={{
//          items,
//          addItem,
//          updateQuantity,
//          total,
//          checkout
//       }}>{children}
//       </CartContext.Provider>
//    )
// }

export default CartProvider;
export const useCart = () => useContext(CartContext);
