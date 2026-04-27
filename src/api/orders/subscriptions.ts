import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { isMockBackendEnabled } from '../../lib/devMode';

export const useInsertOrderSubscription = () => {
   const queryClient = useQueryClient();

   useEffect(() => {
      if (isMockBackendEnabled()) return;

      const ordersSubscription = supabase
         .channel('custom-insert-channel')
         .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'orders' },
            (payload) => {
               console.log('Change received!', payload);
               queryClient.invalidateQueries({ queryKey: ['orders'] });
            }
         )
         .subscribe();

      return () => {
         ordersSubscription.unsubscribe();
      };
   }, [queryClient]);
};

export const useUpdateOrderSubscription = (id: number) => {
   const queryClient = useQueryClient();

   useEffect(() => {
      if (isMockBackendEnabled()) return;

      const orders = supabase
         .channel('custom-filter-channel')
         .on(
            'postgres_changes',
            {
               event: 'UPDATE',
               schema: 'public',
               table: 'orders',
               filter: `id=eq.${id}`,
            },
            (payload) => {
               queryClient.invalidateQueries({ queryKey: ['orders', id] });
            }
         )
         .subscribe();

      return () => {
         orders.unsubscribe();
      };
   }, [queryClient, id]);
};
