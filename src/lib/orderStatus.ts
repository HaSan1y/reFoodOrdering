import { OrderStatus } from '../types';

export const ORDER_FLOW: OrderStatus[] = ['New', 'Cooking', 'Delivering', 'Delivered'];

export const canTransitionStatus = (from: string, to: OrderStatus) => {
   const fromIndex = ORDER_FLOW.indexOf(from as OrderStatus);
   const toIndex = ORDER_FLOW.indexOf(to);
   if (fromIndex === -1 || toIndex === -1) return false;
   return toIndex >= fromIndex && toIndex - fromIndex <= 1;
};

type StatusTimelineEntry = {
   status: string;
   at: string;
};

const timelineStore = new Map<number, StatusTimelineEntry[]>();

export const recordStatusTransition = (orderId: number, status: string, at?: string) => {
   const entries = timelineStore.get(orderId) ?? [];
   const timestamp = at ?? new Date().toISOString();
   const existing = entries.find((e) => e.status === status);
   if (existing) return;
   timelineStore.set(orderId, [...entries, { status, at: timestamp }]);
};

export const getStatusTimeline = (orderId: number, createdAt: string, currentStatus: string) => {
   const entries = timelineStore.get(orderId) ?? [];
   if (!entries.find((e) => e.status === 'New')) {
      entries.unshift({ status: 'New', at: createdAt });
   }
   if (!entries.find((e) => e.status === currentStatus)) {
      entries.push({ status: currentStatus, at: new Date().toISOString() });
   }
   const sorted = [...entries].sort((a, b) => a.at.localeCompare(b.at));
   timelineStore.set(orderId, sorted);
   return sorted;
};

