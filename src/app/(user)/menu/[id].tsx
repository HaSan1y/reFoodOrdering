import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
   ActivityIndicator,
   Pressable,
   SafeAreaView,
   StyleSheet,
   Text,
   View,
} from 'react-native';
import { useProduct } from '../../../api/products';
import Button from '../../../components/Button';
import { defaultPizzaImage } from '../../../components/ProductListItem';
import RemoteImage from '../../../components/RemoteImage';
import Colors from '../../../constants/Colors';
import { useCart } from '../../../providers/CartProvider';
import { PizzaSize } from '../../../types';
const sizes: PizzaSize[] = ['S', 'M', 'L', 'XL'];
const ProductDetailsScreen = () => {
   const { id: idString } = useLocalSearchParams();
   // const id = parseFloat(typeof idString === 'string' ? idString : idString[0]);
   const idParam = Array.isArray(idString) ? idString[0] : idString;
   const id = Number(idParam);
   const hasValidId = Number.isFinite(id);
   const { data: product, error, isLoading } = useProduct(id);
   const { addItem } = useCart();
   const router = useRouter();
   const [selectedSize, setSelectedSize] = useState<PizzaSize>('M');
   const sizeMultiplier = useMemo(() => {
      const table: Record<PizzaSize, number> = { S: 0.9, M: 1, L: 1.15, XL: 1.3 };
      return table[selectedSize];
   }, [selectedSize]);
   if (isLoading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;
   if (error) return <Text style={{ padding: 20 }}>{error.message}</Text>;
   if (!product) return <Text style={{ padding: 20 }}>Product not found</Text>;
   if (!hasValidId) return <Text style={{ padding: 20 }}>Invalid product id</Text>;

   const addToCart = () => {
      addItem(product, selectedSize);
      router.push('/cart');
   };

   const dynamicPrice = product.price * sizeMultiplier;

   return (
      <SafeAreaView style={styles.page}>
         <Stack.Screen options={{ title: product.name }} />
         <View style={styles.card}>
            <RemoteImage
               path={product.image}
               fallback={defaultPizzaImage}
               style={styles.image}
               resizeMode="cover"
            />

            <Text style={styles.title}>{product.name}</Text>
            <Text style={styles.helper}>Pick a size and add to your cart.</Text>

            <Text style={styles.section}>Size</Text>
            <View style={styles.sizes}>
               {sizes.map((size) => (
                  <Pressable
                     onPress={() => setSelectedSize(size)}
                     style={[
                        styles.size,
                        selectedSize === size && {
                           backgroundColor: Colors.light.tint,
                           borderColor: Colors.light.tint,
                        },
                     ]}
                     key={size}
                  >
                     <Text
                        style={[
                           styles.sizeText,
                           { color: selectedSize === size ? 'white' : '#4b5563' },
                        ]}
                     >
                        {size}
                     </Text>
                  </Pressable>
               ))}
            </View>

            <View style={styles.priceRow}>
               <Text style={styles.priceLabel}>Total</Text>
               <Text style={styles.price}>${dynamicPrice.toFixed(2)}</Text>
            </View>

            <Button onPress={addToCart} text="Add to cart" />
         </View>
      </SafeAreaView>
   );
};

export default ProductDetailsScreen;

const styles = StyleSheet.create({
   page: {
      flex: 1,
      backgroundColor: '#f8fafc',
      padding: 16,
   },
   card: {
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 16,
      flex: 1,
      boxShadow: '0 8px 12px rgba(15, 23, 42, 0.08)',
      elevation: 3,
   },
   title: {
      fontSize: 24,
      fontWeight: '800',
      marginTop: 14,
   },
   helper: {
      color: '#6b7280',
      marginTop: 4,
      marginBottom: 14,
   },
   section: {
      fontSize: 16,
      fontWeight: '700',
      marginBottom: 8,
   },
   image: {
      width: '100%',
      height: 220,
      borderRadius: 14,
   },
   priceRow: {
      marginTop: 'auto',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 6,
   },
   priceLabel: {
      color: '#6b7280',
      fontWeight: '600',
   },
   price: {
      fontSize: 26,
      fontWeight: '800',
      color: Colors.light.tint,
   },
   size: {
      width: 54,
      height: 54,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: '#d1d5db',
      alignItems: 'center',
      justifyContent: 'center',
   },
   sizeText: {
      fontSize: 18,
      fontWeight: '700',
   },
   sizes: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
   },
});
