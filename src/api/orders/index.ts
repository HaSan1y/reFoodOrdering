import { supabase } from '../../lib/supabase';
import { useAuth } from '../../providers/AuthProvider';
import { InsertTables, OrderStatus, UpdateTables } from '../../types';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { isMockBackendEnabled } from '../../lib/devMode';
import { mockStore } from '../../lib/mockStore';

export const useAdminOrderList = ({ archived = false }) => {
   const statuses = archived ? ['Delivered'] : ['New', 'Cooking', 'Delivering'];

   return useQuery({
      queryKey: ['orders', { archived }],
      queryFn: async () => {
         if (isMockBackendEnabled()) {
            return mockStore.getOrdersForAdmin(archived);
         }

         const { data, error } = await supabase
            .from('orders')
            .select('*')
            .in('status', statuses)
            .order('created_at', { ascending: false });
         if (error) {
            throw new Error(error.message);
         }
         return data;
      },
   });
};

export const useMyOrderList = () => {
   const { session } = useAuth();
   const id = session?.user.id;

   return useQuery({
      queryKey: ['orders', { userId: id }],
      queryFn: async () => {
         if (!id) return null;
         if (isMockBackendEnabled()) {
            return mockStore.getOrdersForUser(id);
         }

         const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('user_id', id)
            .order('created_at', { ascending: false });
         if (error) {
            throw new Error(error.message);
         }
         return data;
      },
   });
};

export const useOrderDetails = (id: number) => {
   return useQuery({
      queryKey: ['orders', id],
      queryFn: async () => {
         if (isMockBackendEnabled()) {
            const data = mockStore.getOrderDetails(id);
            if (!data) {
               throw new Error('Order not found');
            }
            return data;
         }

         const { data, error } = await supabase
            .from('orders')
            .select('*, order_items(*, products(*))')
            .eq('id', id)
            .single();

         if (error) {
            throw new Error(error.message);
         }
         return data;
      },
   });
};

export const useInsertOrder = () => {
   const queryClient = useQueryClient();
   const { session } = useAuth();
   const userId = session?.user.id;

   return useMutation({
      async mutationFn(data: InsertTables<'orders'>) {
         if (!userId) {
            throw new Error('You must be signed in to create an order.');
         }

         if (isMockBackendEnabled()) {
            return mockStore.createOrder({ total: data.total ?? 0, user_id: userId });
         }

         const { error, data: newProduct } = await supabase
            .from('orders')
            .insert({ ...data, user_id: userId })
            .select()
            .single();

         if (error) {
            throw new Error(error.message);
         }
         return newProduct;
      },
      async onSuccess() {
         await queryClient.invalidateQueries({ queryKey: ['orders'] });
      },
      retry: 1,
   });
};

export const useUpdateOrder = () => {
   const queryClient = useQueryClient();

   return useMutation({
      async mutationFn({
         id,
         updatedFields,
      }: {
         id: number;
         updatedFields: UpdateTables<'orders'>;
      }) {
         if (isMockBackendEnabled()) {
            const status = (updatedFields.status ?? 'New') as OrderStatus;
            const next = mockStore.updateOrderStatus(id, status);
            if (!next) {
               throw new Error('Order not found');
            }
            return next;
         }

         const { error, data: updatedOrder } = await supabase
            .from('orders')
            .update(updatedFields)
            .eq('id', id)
            .select()
            .single();

         if (error) {
            throw new Error(error.message);
         }
         return updatedOrder;
      },
      async onSuccess(_, { id }) {
         await queryClient.invalidateQueries({ queryKey: ['orders'] });
         await queryClient.invalidateQueries({ queryKey: ['orders', id] });
      },
      retry: 1,
   });
};
