import { supabase } from '../../../lib/supabase';
import { InsertTables, PizzaSize } from '../../../types';
import { useMutation } from '@tanstack/react-query';
import { isMockBackendEnabled } from '../../../lib/devMode';
import { mockStore } from '../../../lib/mockStore';

export const useInsertOrderItems = () => {
   return useMutation({
      async mutationFn(items: InsertTables<'order_items'>[]) {
         if (isMockBackendEnabled()) {
            return mockStore.createOrderItems(
               items.map((item) => ({
                  order_id: item.order_id,
                  product_id: item.product_id,
                  quantity: item.quantity ?? 1,
                  size: (item.size ?? 'M') as PizzaSize,
               }))
            );
         }

         const { error, data: newProduct } = await supabase
            .from('order_items')
            .insert(items)
            .select();

         if (error) {
            throw new Error(error.message);
         }
         return newProduct;
      },
      retry: 1,
   });
};
