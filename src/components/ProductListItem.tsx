import { Href, Link, useSegments } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Colors from '../constants/Colors';
import { Tables } from '../types';
import RemoteImage from './RemoteImage';
export const defaultPizzaImage =
   'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/default.png';

type ProductListItemProps = {
   product: Tables<'products'>;
};

const ProductListItem = ({ product }: ProductListItemProps) => {
   const segments = useSegments();
   return (
      <Link href={`/${segments[0]}/menu/${product.id}` as Href} asChild>
         <Pressable style={styles.container}>
            <View style={styles.imageWrapper}>
               <RemoteImage
                  path={product.image}
                  fallback={defaultPizzaImage}
                  style={styles.image}
                  resizeMode="cover"
               />
            </View>
            <Text style={styles.title} numberOfLines={1}>
               {product.name}
            </Text>
            <View style={styles.footerRow}>
               <Text style={styles.price}>${product.price.toFixed(2)}</Text>
               <Text style={styles.tag}>Popular</Text>
            </View>
         </Pressable>
      </Link>
   );
};

export default ProductListItem;
const styles = StyleSheet.create({
   container: {
      backgroundColor: 'white',
      padding: 10,
      borderRadius: 18,
      maxWidth: '50%',
      flex: 1,
      borderWidth: 1,
      borderColor: '#eef2ff',
      boxShadow: '0 7px 10px rgba(31, 41, 55, 0.08)',
      elevation: 2,
   },
   imageWrapper: {
      backgroundColor: '#eef2ff',
      borderRadius: 12,
      overflow: 'hidden',
   },
   title: {
      fontSize: 16,
      fontWeight: '700',
      marginVertical: 10,
   },
   footerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 'auto',
   },
   price: {
      color: Colors.light.tint,
      fontWeight: '800',
      fontSize: 16,
   },
   image: {
      aspectRatio: 1,
      width: '100%',
   },
   tag: {
      backgroundColor: '#dbeafe',
      color: '#1d4ed8',
      fontSize: 11,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 999,
      fontWeight: '600',
   },
});
