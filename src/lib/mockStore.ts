import fallbackProducts from '../../assets/data/products';
import { OrderStatus, PizzaSize, Tables } from '../types';
import { canTransitionStatus, recordStatusTransition } from './orderStatus';

type Product = Tables<'products'>;
type Order = Tables<'orders'>;
type OrderItem = Tables<'order_items'> & { products: Product };

type CreateOrderItemInput = {
   order_id: number;
   product_id: number;
   quantity: number;
   size: PizzaSize;
};

let products: Product[] = [...fallbackProducts];
let orders: Order[] = [
   {
      id: 1,
      created_at: new Date().toISOString(),
      status: 'New',
      total: 32.97,
      user_id: 'desktop-admin',
   },
];
let orderItems: OrderItem[] = [
   {
      id: 1,
      created_at: new Date().toISOString(),
      order_id: 1,
      product_id: products[0]?.id ?? 1,
      quantity: 2,
      size: 'M',
      products: products[0] ?? fallbackProducts[0],
   },
];

const nextId = (list: { id: number }[]) =>
   (list.length ? Math.max(...list.map((x) => x.id)) : 0) + 1;

export const mockStore = {
   getProducts() {
      return [...products];
   },
   getProduct(id: number) {
      return products.find((p) => p.id === id) ?? null;
   },
   insertProduct(input: Pick<Product, 'name' | 'image' | 'price'>) {
      const product: Product = {
         id: nextId(products),
         created_at: new Date().toISOString(),
         name: input.name,
         image: input.image ?? null,
         price: input.price,
      };
      products = [product, ...products];
      return product;
   },
   updateProduct(id: number, input: Partial<Pick<Product, 'name' | 'image' | 'price'>>) {
      products = products.map((p) => (p.id === id ? { ...p, ...input } : p));
      return products.find((p) => p.id === id) ?? null;
   },
   deleteProduct(id: number) {
      products = products.filter((p) => p.id !== id);
      orderItems = orderItems.filter((oi) => oi.product_id !== id);
   },
   getOrdersForAdmin(archived: boolean) {
      const statuses = archived ? ['Delivered'] : ['New', 'Cooking', 'Delivering'];
      return orders
         .filter((o) => statuses.includes(o.status))
         .sort((a, b) => b.created_at.localeCompare(a.created_at));
   },
   getOrdersForUser(userId: string) {
      return orders
         .filter((o) => o.user_id === userId)
         .sort((a, b) => b.created_at.localeCompare(a.created_at));
   },
   getOrderDetails(id: number) {
      const order = orders.find((o) => o.id === id);
      if (!order) return null;
      const items = orderItems.filter((oi) => oi.order_id === id);
      return { ...order, order_items: items };
   },
   createOrder(input: { total: number; user_id: string }) {
      const order: Order = {
         id: nextId(orders),
         created_at: new Date().toISOString(),
         status: 'New',
         total: input.total,
         user_id: input.user_id,
      };
      orders = [order, ...orders];
      recordStatusTransition(order.id, order.status, order.created_at);
      return order;
   },
   createOrderItems(items: CreateOrderItemInput[]) {
      let runningId = nextId(orderItems);
      const created: OrderItem[] = items.map((item) => {
         const product = products.find((p) => p.id === item.product_id) ?? fallbackProducts[0];
         return {
            id: runningId++,
            created_at: new Date().toISOString(),
            order_id: item.order_id,
            product_id: item.product_id,
            quantity: item.quantity,
            size: item.size,
            products: product,
         };
      });
      orderItems = [...created, ...orderItems];
      return created;
   },
   updateOrderStatus(id: number, status: OrderStatus) {
      const current = orders.find((o) => o.id === id);
      if (!current) return null;
      if (!canTransitionStatus(current.status, status)) {
         throw new Error(`Invalid status transition: ${current.status} -> ${status}`);
      }
      orders = orders.map((o) => (o.id === id ? { ...o, status } : o));
      const updated = orders.find((o) => o.id === id) ?? null;
      if (updated) {
         recordStatusTransition(updated.id, updated.status);
      }
      return updated;
   },
};
