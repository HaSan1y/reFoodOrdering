import { StyleSheet, Text, View } from 'react-native';
import { OrderStatus } from '../types';

type Props = {
   status: string;
};

const stylesByStatus: Record<OrderStatus, { bg: string; fg: string }> = {
   New: { bg: '#dbeafe', fg: '#1d4ed8' },
   Cooking: { bg: '#fef3c7', fg: '#b45309' },
   Delivering: { bg: '#dcfce7', fg: '#166534' },
   Delivered: { bg: '#e5e7eb', fg: '#374151' },
};

export default function OrderStatusBadge({ status }: Props) {
   const knownStatus = (['New', 'Cooking', 'Delivering', 'Delivered'] as string[]).includes(status)
      ? (status as OrderStatus)
      : 'New';
   const color = stylesByStatus[knownStatus];

   return (
      <View style={[styles.badge, { backgroundColor: color.bg }]}>
         <Text style={[styles.text, { color: color.fg }]}>{status}</Text>
      </View>
   );
}

const styles = StyleSheet.create({
   badge: {
      borderRadius: 999,
      paddingHorizontal: 10,
      paddingVertical: 5,
   },
   text: {
      fontWeight: '700',
      fontSize: 12,
   },
});
