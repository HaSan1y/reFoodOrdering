// import { FlatList } from 'react-native'; //@ means from basepath instead ../../../
// import products from '../../../../assets/data/products';
// import ProductListItem from '../../../../src/components/ProductListItem';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import ProductListItem from '../../../components/ProductListItem';
import { useProductList } from '../../../api/products';

export default function MenuScreen() {
  const { data: products, error, isLoading } = useProductList();

  if (isLoading) return <ActivityIndicator style={{ marginTop: 30 }} size="large" />;

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>Couldn&apos;t load menu.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={products || []}
      renderItem={({ item }) => <ProductListItem product={item} />}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      contentContainerStyle={styles.content}
      columnWrapperStyle={styles.row}
    />
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  error: { color: '#b91c1c', fontWeight: '700' },
  content: { gap: 16, padding: 16, backgroundColor: '#f8fafc' },
  row: { gap: 14 },
});
