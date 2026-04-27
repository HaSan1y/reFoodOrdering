import { Link, Stack, useLocalSearchParams } from 'expo-router';
import { Text, View, Image, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
// import products from '../../../../assets/data/products';
import { defaultPizzaImage } from '../../../components/ProductListItem';
import { useState } from 'react';
// import { useCart } from '../../../providers/CartProvider';
import { PizzaSize } from '../../../../src/types';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '../../../../src/constants/Colors';
import { useProduct } from '../../../../src/api/products';


const sizes: PizzaSize[] = ['S', 'M', 'L', 'XL'];
// [id].tsx represents dynamic route to navigate to a specific product !!defined
const ProductDetailsScreen = () => {
   const { id: idString } = useLocalSearchParams();
   // const id = parseFloat(typeof idString === 'string' ? idString : idString?.[0]);
   const idParam = Array.isArray(idString) ? idString[0] : idString;
   const id = Number(idParam);
   const hasValidId = Number.isFinite(id);
   const { data: product, error, isLoading } = useProduct(id);
   // const router = useRouter();
   // const { addItem } = useCart();

   const [selectedSize, setSelectedSize] = useState<PizzaSize>('M');
   // const isUpdating = !!id ? true : false;

   if (isLoading) return <ActivityIndicator />;
   if (!hasValidId) return <Text>Invalid product id</Text>;
   if (error) return <Text>{error.message}</Text>;
   // const product = products.find((product) => product.id.toString() === id);

   // const addToCart = () => {
   //    // console.warn('Add to cart, product:', id, 'size:', selectedSize);
   //    if (!product) return;
   //    addItem(product, selectedSize);
   //    router.push('/cart');
   // }

   // product?.name if no product is found it will return not found
   // if (!product) return <Text>Product not found</Text>;
   return (
      <View style={styles.container}>
         <Stack.Screen options={{
            title: 'Menu', headerRight: () => (
               <Link href={`/(admin)/menu/create?id=${id}`} asChild>
                  <Pressable>
                     {({ pressed }) => (
                        <FontAwesome
                           name="pencil"
                           size={25}
                           color={Colors.light.tint}
                           style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                        />
                     )}
                  </Pressable>
               </Link>
            ),
         }} />
         {product && <Stack.Screen options={{ title: product.name }} />}


         {product && <Image source={{ uri: product.image || defaultPizzaImage }} style={styles.image} />}
         <Text >Select Size</Text>
         <View style={styles.sizes}>
            {sizes.map((size) => (
               <Pressable onPress={() => setSelectedSize(size)} style={[styles.size, { backgroundColor: selectedSize === size ? 'gainsboro' : 'white' }]} key={size}>

                  <Text style={[styles.sizeText, { color: selectedSize === size ? 'black' : 'gray' }]}>{size}</Text>
               </Pressable>
            ))}
         </View>
         {product && <Text style={[styles.title]}>${product.name}</Text>}
         {product && <Text style={[styles.price]}>${product.price}</Text>}
         {/* <Button onPress={addToCart} text="Add to Cart" /> */}
      </View>
   )

}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: 'white',
      padding: 20,
      // height: '50%',
   },
   title: {
      fontSize: 20,
      fontWeight: 'bold',
   },
   image: {
      width: '100%',
      aspectRatio: 3 / 1,
   },
   price: {
      fontSize: 18,
      fontWeight: 'bold',
      marginTop: 'auto',
   },
   description: {
      fontSize: 20,
      fontWeight: 'bold',
   },
   scrollView: {
      marginVertical: 20,
   },
   size: {
      backgroundColor: 'gainsboro',
      aspectRatio: 1,
      width: 50,
      borderRadius: 25,
      alignItems: 'center',
      justifyContent: 'center',
   },
   sizeText: {
      fontSize: 20,
      fontWeight: '500',
   },
   sizes: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginVertical: 10,
   }
})

export default ProductDetailsScreen;
