import { defaultPizzaImage } from '../../../../src/components/ProductListItem';
import Colors from '../../../../src/constants/Colors';
import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Image, Alert } from 'react-native'
import * as ImagePicker from 'expo-image-picker';
import { Stack, useLocalSearchParams } from 'expo-router';

const CreateProductScreen = () => {
   const [name, setName] = useState('');
   const [price, setPrice] = useState('');
   const [errors, setErrors] = useState<string[]>([]);
   const [image, setImage] = useState(defaultPizzaImage);
   const { id: idString } = useLocalSearchParams();
   const id = parseFloat(typeof idString === 'string' ? idString : idString?.[0]);

   const isUpdating = !!id;
   // const { mutate: updateProduct } = useUpdateProduct();
   // const { data: updatingProduct } = useProduct(id);
   // const { mutate: deleteProduct } = useDeleteProduct(id);
   // const { mutate: insertProduct } = useMutation(updateProduct, {
   //    onSuccess: () => {
   //       resetFields();
   //    },
   //    onError: (error) => {
   //       console.error(error);
   //    },
   // });
   // const router = useRouter();
   // useEffect(() => {
   //    if (updatingProduct) {
   //       setName(updatingProduct?.name || ''); setPrice(updatingProduct?.price.toString() || '');
   //       setImage(updatingProduct?.image || defaultPizzaImage);
   //    }
   // }, [updatingProduct]);
   // const resetFields = () => {
   //    setName(''); setPrice('');
   // }
   const validateInput = () => {
      const errors: string[] = []; setErrors(errors);

      if (!name || !price) {
         alert('Please fill in all fields');
         return false;
      }
      if (isNaN(parseFloat(price))) {
         alert('Price must be a number');
         return false;
      }
      return true;
   }

   const onSubmit = () => {
      if (isUpdating) {
         onCreate();
      } else {
         // onCreate();
      }
   }

   const onCreate = () => {
      if (!validateInput()) {
         return;
      }
      console.warn('Updating product', name)
      // updateProduct({ id, name, price: parseFloat(price), image }, { onSuccess: () => { resetFields(); router.back(); }
      // resetFields();
   }

   // const onCreate = () => {
   //    if (!validateInput()) {
   //       return;
   //    }
   //    console.warn('Creating product', name)
   // insertProduct({ name, price:parseFloat(price), image }, { onSuccess: () => {resetFields();router.back();} });
   // resetFields();
   // }
   const pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
         mediaTypes: ['images'],
         allowsEditing: true,
         quality: 1,
      });

      if (!result.canceled) {
         setImage(result.assets[0].uri);
      } else {
         alert('You did not select any image.');
      }
   };
   const onDelete = () => {
      // deleteProduct(id, { onSuccess: () => { resetFields(); router.replace('/(admin)); } });
      setName(''); setPrice('');
      console.warn('Deleting product');
   }
   const confirmDelete = () => {
      Alert.alert(
         'Delete Product',
         'Are you sure you want to delete this product?',
         [
            { text: 'Delete', onPress: onDelete, style: 'destructive' },
            { text: 'Cancel', style: 'cancel' },
         ]
      )
   }
   return (
      <View style={styles.container}>
         <Stack.Screen name="CreateProduct" options={{ title: isUpdating ? 'Update Product' : 'Create Product' }} />
         <Image source={{ uri: image || defaultPizzaImage }} style={styles.image} resizeMode="contain" />
         <Text onPress={pickImage} style={styles.textButton}>Select Image</Text>

         <Text style={styles.label}>Create</Text>
         <TextInput value={name} onChangeText={setName} placeholder="Name" style={styles.input} />
         <Text style={styles.label}>Price ($)</Text>
         <TextInput onChangeText={setPrice} placeholder="9.99" style={styles.input}
            keyboardType="numeric" />
         <Text style={{ color: 'red' }}>{errors}</Text>
         <Button onPress={onSubmit} title={isUpdating ? 'Update' : 'Create'} />
         {isUpdating &&
            (<Text onPress={confirmDelete} style={{ height: 10, fontSize: 16, fontWeight: 'bold', color: Colors.light.tint }} />)}
      </View>
   )
}
const styles = StyleSheet.create({
   container: {
      flex: 1,
      justifyContent: 'center',
      padding: 20,
   },
   label: {
      color: 'black',
      fontSize: 16,
      fontWeight: 'bold',
   },
   input: {
      fontSize: 20,
      padding: 10,
      borderColor: 'black',
      borderWidth: 1,
      marginVertical: 10,
      borderRadius: 5,
   },
   image: {
      width: '50%',
      aspectRatio: 1,
      alignSelf: 'center',
   },
   textButton: {
      color: Colors.light.tint,
      alignSelf: 'center',
      fontSize: 16,
      marginVertical: 10,
      textDecorationLine: 'underline',
      fontWeight: 'bold',
   },
})

export default CreateProductScreen